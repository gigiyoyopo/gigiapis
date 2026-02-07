import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// TU CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBvJj376-_UV-LuViL-oblKU8q1Js0ZFtY",
  authDomain: "gigiapis-136ab.firebaseapp.com",
  projectId: "gigiapis-136ab",
  storageBucket: "gigiapis-136ab.firebasestorage.app",
  messagingSenderId: "649541712103",
  appId: "1:649541712103:web:d55c3d3c305999ef814a42",
  measurementId: "G-EBTFHKT1VW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("googleLogin");
const logoutBtn = document.getElementById("logoutBtn");

loginBtn?.addEventListener("click", async () => {
  await signInWithPopup(auth, provider);
});

logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, user => {
  const loginPanel = document.getElementById("loginPanel");
  const userPanel = document.getElementById("userPanel");

  if(user){
    loginPanel.classList.add("d-none");
    userPanel.classList.remove("d-none");

    document.getElementById("userPhoto").src = user.photoURL;
    document.getElementById("userName").textContent = user.displayName;
    document.getElementById("userEmail").textContent = user.email;
  }else{
    loginPanel.classList.remove("d-none");
    userPanel.classList.add("d-none");
  }
});
