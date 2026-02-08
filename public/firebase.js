import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

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

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
