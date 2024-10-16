import { db } from './firebase_config.js';  
import { auth } from './firebase_config.js';
import { set, ref, push, get, remove, update } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import {signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


const add_task = document.getElementById('add_task');
const notification = document.getElementById('notification');
const taskInput = document.getElementById('task');
const taskTable = document.querySelector('table');
const toast = document.querySelector('.toast');

document.addEventListener('DOMContentLoaded', await ReadTask());
 

onAuthStateChanged(auth, (user) => {

    document.getElementById('userDisplayName').innerText = user.displayName;
    console.log(user)
    console.log(user.displayName)
    
    if (!user) {
        // Exibe o nome do usuário
    
        window.location.href = 'login.html';

    } else {
        // Se o usuário não estiver autenticado, redireciona para a página de login
        document.getElementById('userDisplayName').innerText = user.displayName;

        ReadTask(); 
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

// Função para enviar tarefa ao apertar "Enter"
taskInput.addEventListener('keydown', function(event) {
    // Verifica se a tecla pressionada foi "Enter" (key code 13)
    if (event.key === 'Enter') {
        AddTask();  // Chama a função para adicionar a tarefa
    }
});


// Validação simples para entrada de tarefa
function validateTaskInput(task) {
    return task && task.trim().length > 0;
}

// Função assíncrona para adicionar tarefa
async function AddTask() {
    const task = taskInput.value.trim();

    
    if (!validateTaskInput(task)) {
        showNotification("Por favor, insira uma tarefa válida.");
        toast.classList.add("active");
        return;
    }

    try {
        const user = auth.currentUser;
        if (!user) {
            console.error('Usuário não autenticado.');
            return;
        }

        const userUid = user.uid; 
        const dbRef = ref(db, `tasks/${userUid}`); 
        const newTaskRef = push(dbRef); 

        await set(newTaskRef, {
            task,
            completed: false 
        });
        showNotification("Tarefa criada com sucesso!");
        await ReadTask(); 
        taskInput.value = "";
        toast.classList.add("active");
    } catch (error) {
        console.error("Erro ao adicionar tarefa: ", error);
        showNotification("Erro ao criar a tarefa. Tente novamente.");
        toast.classList.add("active");
    }
}

add_task.addEventListener('click', AddTask);

// Função assíncrona para ler as tarefas do banco de dados
async function ReadTask() {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.error('Usuário não autenticado.');

            return;
        }

        const userUid = user.uid; // Obtém o UID do usuário
        const userRef = ref(db, `tasks/${userUid}`); // Referência para as tarefas do usuário
        const snapshot = await get(userRef);
        const data = snapshot.val();
        let html = '';

        const taskCountElement = document.getElementById('task-count');
        if (!taskCountElement) {
            console.error("Elemento 'task-count' não encontrado no DOM.");
            return;
        }

        const taskCount = data ? Object.keys(data).length : 0;
        taskCountElement.innerText = taskCount;

        if (!data) {
            // Nenhuma tarefa encontrada
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
        toast.classList.add("active");
    }
}

// Função assíncrona para alternar o estado de conclusão da tarefa
async function toggleTaskCompletion(event) {
    const checkbox = event.target;
    const taskKey = checkbox.getAttribute('data-key');
    const taskText = document.getElementById(`task-${taskKey}`);
    const isCompleted = checkbox.checked;

    try {
        const user = auth.currentUser;
        if (!user) {
            console.error('Usuário não autenticado.');
            return;
        }

        const userUid = user.uid;
        const taskRef = ref(db, `tasks/${userUid}/${taskKey}`);
        await update(taskRef, { completed: isCompleted });

        // Atualiza o estilo da tarefa (riscado ou não)
        taskText.style.textDecoration = isCompleted ? "line-through" : "none";
    } catch (error) {
        console.error("Erro ao atualizar tarefa: ", error);
        showNotification("Erro ao atualizar a tarefa.");
    }
}


// Função assíncrona para deletar tarefa
async function deleteData(key) {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.error('Usuário não autenticado.');
            return;
        }

        const userUid = user.uid;
        const taskRef = ref(db, `tasks/${userUid}/${key}`); // Referência para a tarefa específica do usuário

        await remove(taskRef);
        showNotification("Tarefa apagada com sucesso!");
        toast.classList.add("active");
        await ReadTask(); 
    } catch (error) {
        console.error("Erro ao apagar tarefa: ", error);
        toast.classList.add("active");
        showNotification("Erro ao apagar a tarefa.");
    }
}

window.deleteData = deleteData


function LogoutUser() {
    signOut(auth)
        .then(() => {
            showNotification('Logout realizado com sucesso');
            toast.classList.add("active");
            
            // Redirecionar para a página de login ou qualquer outra página
            window.location.href = 'login.html'; // Redireciona para a página de login
        })
        .catch((error) => {
            console.error("Erro ao fazer logout:", error);
            // alert('Erro ao fazer logout.');
        });
}

// Adicionando o evento de clique no botão de logout
const logoutButton = document.getElementById('logout_button');
logoutButton.addEventListener('click', LogoutUser);

