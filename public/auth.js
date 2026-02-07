// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// ---- TU CONFIGURACIÓN DE FIREBASE ----
const firebaseConfig = {
  apiKey: "AIzaSyBvJj376-_UV-LuViL-oblKU8q1Js0ZFtY",
  authDomain: "gigiapis-136ab.firebaseapp.com",
  projectId: "gigiapis-136ab",
  storageBucket: "gigiapis-136ab.firebasestorage.app",
  messagingSenderId: "649541712103",
  appId: "1:649541712103:web:d55c3d3c305999ef814a42",
  measurementId: "G-EBTFHKT1VW"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Botones
const loginGoogleBtn = document.getElementById("googleLogin");
const loginFacebookBtn = document.getElementById("facebookLogin");
const logoutBtn = document.getElementById("logoutBtn");

// ---- LOGIN GOOGLE ----
loginGoogleBtn?.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (err) {
    console.error("Error login con Google:", err);
  }
});

// ---- LOGIN FACEBOOK ----
loginFacebookBtn?.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, facebookProvider);
  } catch (err) {
    console.error("Error login con Facebook:", err);
  }
});

// ---- LOGOUT ----
logoutBtn?.addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("Error cerrando sesión:", err);
  }
});

// ---- DETECTAR CAMBIO DE USUARIO ----
onAuthStateChanged(auth, user => {
  const loginPanel = document.getElementById("loginPanel");
  const userPanel = document.getElementById("userPanel");

  if(user){
    // Ocultar login y mostrar panel de usuario
    loginPanel.classList.add("d-none");
    userPanel.classList.remove("d-none");

    // Mostrar datos del usuario
    document.getElementById("userPhoto").src = user.photoURL || "";
    document.getElementById("userName").textContent = user.displayName || "Usuario";
    document.getElementById("userEmail").textContent = user.email || "";
  } else {
    // Mostrar login y ocultar panel de usuario
    loginPanel.classList.remove("d-none");
    userPanel.classList.add("d-none");
  }
});

