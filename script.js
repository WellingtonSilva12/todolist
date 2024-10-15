import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase,set,ref,push,get,remove } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";


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
    
    set(newTaskRef, { task: task })
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
            html = '<tr><td colspan="2">Nenhuma tarefa encontrada.</td></tr>';
        } else {
            for (const key in data) {
                const { task } = data[key];
                console.log(key);
                  
                html += `
                    <tr>
                        <td>${task}</td>
                        <td><button class="del" onclick="deleteData('${key}')">Apagar</button></td>
                    </tr>
                `;
            }
        }
        table.innerHTML = html;
    }).catch((error) => {
        console.error("Erro ao ler tarefas: ", error);
        showNotification("Erro ao carregar as tarefas.");
    });
}
ReadTask();

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
