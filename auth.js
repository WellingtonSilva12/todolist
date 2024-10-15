import { auth } from './firebase_config.js';  
import {createUserWithEmailAndPassword ,signInWithEmailAndPassword, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (user) {
        // Se o usuário estiver autenticado, redireciona para a página principal
        window.location.href = 'index.html';
    }
 });


// Funcao de criação de usuário - Não será ativa 

function  CreateUser () { 
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email,password)

    if (!email || !password) {
        alert('Por favor, preencha o email e a senha.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um email válido.');
        return;
    }
 
    createUserWithEmailAndPassword(auth,email,password).then((userCredintial)=>{
        console.log(userCredintial.user.uid);
       
        document.getElementById('email').value='';
        document.getElementById('password').value='';
    })
 
}

const signUp = document.getElementById('signup')
  
// signUp.addEventListener('click',CreateUser)


// Funcao de login no sistema 
function  SingInUser () { 
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Por favor, preencha o email e a senha.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um email válido.');
        return;
    }

 
    signInWithEmailAndPassword(auth,email,password).then((userCredential)=>{
        const user = userCredential.user;
        console.log(user.uid);
        console.log('Login realizado com sucesso:', user);

        window.location.href = 'index.html';

    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Erro ao fazer login:", errorCode, errorMessage);

        // Verifica o código de erro e exibe uma mensagem amigável
        switch (errorCode) {
            case 'auth/wrong-password':
                alert('Senha incorreta.');
                break;
            case 'auth/user-not-found':
                alert('Usuário não encontrado. Verifique se você se cadastrou.');
                break;
            case 'auth/invalid-email':
                alert('Email ou Senha incorreta.');
                break;
            case 'auth/invalid-credential':
                alert('Email ou Senha incorreta.');
                break;
            default:
                alert('Erro ao fazer login: ' + errorMessage);
        }
    });
 
}


   const signIn = document.getElementById('sign_in')
   signIn.addEventListener('click',SingInUser)