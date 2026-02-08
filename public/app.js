// auth.js
import { auth, db } from "./firebase.js";
import { 
  GoogleAuthProvider, 
  TwitterAuthProvider,
  signInWithPopup, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// Providers
const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();

// Botones
const googleBtn = document.getElementById("googleLogin");
const twitterBtn = document.getElementById("twitterLogin");
const logoutBtn = document.getElementById("logoutBtn");

// ---- LOGIN GOOGLE ----
googleBtn?.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (err) {
    console.error("Error login con Google:", err);
  }
});

// ---- LOGIN TWITTER ----
twitterBtn?.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, twitterProvider);
  } catch (err) {
    console.error("Error login con Twitter:", err);
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
    loginPanel.classList.add("d-none");
    userPanel.classList.remove("d-none");

    document.getElementById("userPhoto").src = user.photoURL || "default.png";
    document.getElementById("userName").textContent = user.displayName || "Usuario";
    document.getElementById("userEmail").textContent = user.email || "Sin email";
  } else {
    loginPanel.classList.remove("d-none");
    userPanel.classList.add("d-none");
  }
});
