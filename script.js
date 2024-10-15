import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase,set,ref,push,get,remove,update } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";


  const firebaseConfig = {
    apiKey: "AIzaSyAHuzrL6esocKWo5ZULM4bZoR4hlt5TtZE",
    authDomain: "todolist-97b05.firebaseapp.com",
    databaseURL: "https://todolist-97b05-default-rtdb.firebaseio.com",
    projectId: "todolist-97b05",
    storageBucket: "todolist-97b05.appspot.com",
    messagingSenderId: "181231929719",
    appId: "1:181231929719:web:cbd0d5abe87e3484fa3972"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const add_task = document.getElementById('add_task');
const notification = document.getElementById('notification');

ReadTask(); 

// Função para exibir notificações temporárias
function showNotification(message, timeout = 3000) {
    notification.innerText = message;
    setTimeout(() => {
        notification.innerText = "";
    }, timeout);
}

// Função para adicionar tarefa no banco de dados 
function AddTask() {
    const task = document.getElementById('task').value;
    
    if (task === "") {
        showNotification("Por favor, insira uma tarefa.");
        return;
    }

    const dbRef = ref(db, 'tasks/');
    const newTaskRef = push(dbRef);
    
    set(newTaskRef, {
        task: task,
        completed: false // Adiciona a tarefa como não concluída
    })
    .then(() => {
        showNotification("Tarefa criada com sucesso!");
        document.getElementById('task').value = "";
        console.log(task);
        ReadTask(); 
    })
    .catch((error) => {
        console.error("Erro ao adicionar tarefa: ", error);
        showNotification("Erro ao criar a tarefa. Tente novamente.");
    });
}

// Adiciona evento de clique no botão "Adicionar Tarefa"
add_task.addEventListener('click', AddTask);

// Função que lê as tarefas do banco de dados 
function ReadTask() {
    const userRef = ref(db, 'tasks/');
    
    get(userRef).then((snapshot) => {
        const data = snapshot.val();
        const table = document.querySelector('table');
        let html = '';

        if (!data) {
            html = '<tr><td colspan="3">Nenhuma tarefa encontrada.</td></tr>';
        } else {
            for (const key in data) {
                const { task, completed } = data[key];
                console.log(key);
                  
                html += `
                    <tr>
                        <td>
                            <input type="checkbox" class="task-checkbox" data-key="${key}" ${completed ? 'checked' : ''}/>
                        </td>
                        <td class="task-text" id="task-${key}" style="text-decoration: ${completed ? 'line-through' : 'none'}">${task}</td>
                        <td><button class="del" onclick="deleteData('${key}')">Apagar</button></td>
                    </tr>
                `;
            }
        }
        table.innerHTML = html;

        // Adiciona o evento de clique para todos os checkboxes
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', toggleTaskCompletion);
        });
    }).catch((error) => {
        console.error("Erro ao ler tarefas: ", error);
        showNotification("Erro ao carregar as tarefas.");
    });
}

// Função que alterna o estilo de riscado da tarefa e atualiza o banco de dados
function toggleTaskCompletion(event) {
    const checkbox = event.target;
    const taskKey = checkbox.getAttribute('data-key');
    const taskText = document.getElementById(`task-${taskKey}`);
    const isCompleted = checkbox.checked;

    // Atualiza o estilo da tarefa (riscado ou não)
    taskText.style.textDecoration = isCompleted ? "line-through" : "none";

    // Atualiza o status da tarefa no Firebase
    const taskRef = ref(db, `tasks/${taskKey}`);
    update(taskRef, { completed: isCompleted })
    .then(() => {
        showNotification("Status da tarefa atualizado!");
    })
    .catch((error) => {
        console.error("Erro ao atualizar tarefa: ", error);
        showNotification("Erro ao atualizar a tarefa.");
    });
}

// Função para deletar tarefa
window.deleteData = function(key) {
    const userRef = ref(db, `tasks/${key}`);
    
    remove(userRef).then(() => {
        showNotification("Tarefa apagada com sucesso!");
        ReadTask(); 
    }).catch((error) => {
        console.error("Erro ao apagar tarefa: ", error);
        showNotification("Erro ao apagar a tarefa.");
    });
}
