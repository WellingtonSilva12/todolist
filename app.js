import { db } from './firebase_config.js';  
import { auth } from './firebase_config.js';
import { set, ref, push, get, remove, update } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import {signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


const add_task = document.getElementById('add_task');
const notification = document.getElementById('notification');
const taskInput = document.getElementById('task');
const taskTable = document.querySelector('table');
const toast = document.querySelector('.toast');


document.addEventListener('DOMContentLoaded', ReadTask); 

onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Se o usuário estiver autenticado, redireciona para a página principal
        window.location.href = 'login.html';
    }
});

// Função para exibir notificações temporárias
function showNotification(message, timeout = 3000) {
    notification.innerText = message;
    setTimeout(() => {
        notification.innerText = "";
        toast.classList.remove("active")

    }, timeout);
}



// Validação simples para entrada de tarefa
function validateTaskInput(task) {
    return task && task.trim().length > 0;
}

// Função assíncrona para adicionar tarefa
async function AddTask() {
    const task = taskInput.value.trim();
    
    if (!validateTaskInput(task)) {
        showNotification("Por favor, insira uma tarefa válida.");
        toast.classList.add("active")

        return;
    }

    try {
        const dbRef = ref(db, 'tasks/');
        const newTaskRef = push(dbRef);
        await set(newTaskRef, {
            task,
            completed: false 
        });
        showNotification("Tarefa criada com sucesso!");
        taskInput.value = ""; 
        await ReadTask(); 
    } catch (error) {
        console.error("Erro ao adicionar tarefa: ", error);
        showNotification("Erro ao criar a tarefa. Tente novamente.");
    }
}

// Adiciona evento de clique no botão "Adicionar Tarefa"
add_task.addEventListener('click', AddTask);

// Função assíncrona para ler as tarefas do banco de dados
async function ReadTask() {
    try {
        const userRef = ref(db, 'tasks/');
        const snapshot = await get(userRef);
        const data = snapshot.val();
        let html = '';

        const taskCount = Object.keys(data).length;
        // console.log(`Total de tarefas: ${taskCount}`);

        document.getElementById('task-count').innerText = taskCount;

        if (!data) {
            // html = '<tr><td colspan="3">Nenhuma tarefa encontrada.</td></tr>';
        } else {
            Object.keys(data).forEach(key => {

                const { task, completed } = data[key];
                html += `
                    <tr class="task-content">
                        <td>
                            <input type="checkbox" class="task-checkbox" data-key="${key}" ${completed ? 'checked' : ''}/>
                        </td>
                        <td class="task-text" id="task-${key}" style="text-decoration: ${completed ? 'line-through' : 'none'}">${task}</td>
                        <td><a class="del" onclick="deleteData('${key}')"><i class='bx bxs-trash'></i></a></td>
                    </tr>
                `;
            });
        }
        taskTable.innerHTML = html;

        // Adiciona o evento de clique para todos os checkboxes
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', toggleTaskCompletion);
        });
    } catch (error) {
        console.error("Erro ao ler tarefas: ", error);
        showNotification("Erro ao carregar as tarefas.");
    }
}

// Função assíncrona para alternar o estado de conclusão da tarefa
async function toggleTaskCompletion(event) {
    const checkbox = event.target;
    const taskKey = checkbox.getAttribute('data-key');
    const taskText = document.getElementById(`task-${taskKey}`);
    const isCompleted = checkbox.checked;

    try {
        const taskRef = ref(db, `tasks/${taskKey}`);
        await update(taskRef, { completed: isCompleted });

        // Atualiza o estilo da tarefa (riscado ou não)
        taskText.style.textDecoration = isCompleted ? "line-through" : "none";
        // showNotification("Status da tarefa atualizado!");
    } catch (error) {
        console.error("Erro ao atualizar tarefa: ", error);
        showNotification("Erro ao atualizar a tarefa.");
    }
}

// Função assíncrona para deletar tarefa
async function deleteData(key) {
    try {
        const taskRef = ref(db, `tasks/${key}`);
        await remove(taskRef);
        showNotification("Tarefa apagada com sucesso!");
        await ReadTask(); 
    } catch (error) {
        console.error("Erro ao apagar tarefa: ", error);
        showNotification("Erro ao apagar a tarefa.");
    }
}

window.deleteData = deleteData


function LogoutUser() {
    signOut(auth)
        .then(() => {
            console.log('Logout realizado com sucesso');
            alert('Logout realizado com sucesso!');
            
            // Redirecionar para a página de login ou qualquer outra página
            window.location.href = 'login.html'; // Redireciona para a página de login
        })
        .catch((error) => {
            console.error("Erro ao fazer logout:", error);
            alert('Erro ao fazer logout.');
        });
}

// Adicionando o evento de clique no botão de logout
const logoutButton = document.getElementById('logout_button');
logoutButton.addEventListener('click', LogoutUser);

