import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAHuzrL6esocKWo5ZULM4bZoR4hlt5TtZE",
    authDomain: "todolist-97b05.firebaseapp.com",
    databaseURL: "https://todolist-97b05-default-rtdb.firebaseio.com",
    projectId: "todolist-97b05",
    storageBucket: "todolist-97b05.appspot.com",
    messagingSenderId: "181231929719",
    appId: "1:181231929719:web:cbd0d5abe87e3484fa3972"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o banco de dados para ser usado em outros arquivos
const db = getDatabase(app);

export { db };
