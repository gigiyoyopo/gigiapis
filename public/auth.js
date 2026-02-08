// auth.js
import { auth } from "./firebase.js";
import { 
  GoogleAuthProvider, 
  TwitterAuthProvider,
  signInWithPopup, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// --- Providers ---
const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();

// --- Botones ---
const googleBtn = document.getElementById("googleLogin");
const twitterBtn = document.getElementById("twitterLogin");
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

// --- LOGIN TWITTER ---
twitterBtn?.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, twitterProvider);
  } catch (err) {
    console.error("Error login con Twitter:", err);
    alert("Error al iniciar sesión con Twitter. Revisa si tu cuenta es tester o si la app está en Live.");
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
