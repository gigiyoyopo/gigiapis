// auth.js
import { auth } from "./firebase.js";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// --- Provider ---
const googleProvider = new GoogleAuthProvider();

// --- Botones ---
const googleBtn = document.getElementById("googleLogin");
const logoutBtn = document.getElementById("logoutBtn");

// --- LOGIN GOOGLE ---
googleBtn?.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (err) {
    console.error("Error login con Google:", err);
    alert("No se pudo iniciar sesión con Google.");
  }
});

// --- LOGOUT ---
logoutBtn?.addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("Error cerrando sesión:", err);
    alert("No se pudo cerrar sesión.");
  }
});

// --- DETECTAR CAMBIO DE USUARIO ---
onAuthStateChanged(auth, user => {
  const loginPanel = document.getElementById("loginPanel");
  const userPanel = document.getElementById("userPanel");

  if(user){
    // Mostrar panel de usuario
    loginPanel.classList.add("d-none");
    userPanel.classList.remove("d-none");

    document.getElementById("userPhoto").src = user.photoURL || "default.png";
    document.getElementById("userName").textContent = user.displayName || "Usuario";
    document.getElementById("userEmail").textContent = user.email || "Sin email";
  } else {
    // Mostrar panel de login
    loginPanel.classList.remove("d-none");
    userPanel.classList.add("d-none");
  }
});