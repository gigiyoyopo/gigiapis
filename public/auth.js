import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Botones
const loginGoogleBtn = document.getElementById("googleLogin");
const loginFacebookBtn = document.getElementById("facebookLogin");
const logoutBtn = document.getElementById("logoutBtn");

// LOGIN GOOGLE
loginGoogleBtn?.addEventListener("click", async () => {
  await signInWithPopup(auth, googleProvider);
});

// LOGIN FACEBOOK
loginFacebookBtn?.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, facebookProvider);
  } catch (err) {
    console.error("Error login con Facebook:", err);
  }
});

// LOGOUT
logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
});

// Manejo del estado del usuario
onAuthStateChanged(auth, user => {
  const loginPanel = document.getElementById("loginPanel");
  const userPanel = document.getElementById("userPanel");

  if(user){
    loginPanel.classList.add("d-none");
    userPanel.classList.remove("d-none");

    document.getElementById("userPhoto").src = user.photoURL || "";
    document.getElementById("userName").textContent = user.displayName || "Usuario";
    document.getElementById("userEmail").textContent = user.email || "";
  } else {
    loginPanel.classList.remove("d-none");
    userPanel.classList.add("d-none");
  }
});

