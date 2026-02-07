import { auth, provider, db } from "./firebase.js";
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  // --- Botones de compartir (ya funciona) ---
  const shareFb = document.getElementById("shareFb");
  const shareTw = document.getElementById("shareTw");
  const shareWa = document.getElementById("shareWa");
  const pageURL = window.location.href;
  const text = "Mira esta app que detecta tu ubicación en tiempo real 😎";

  shareFb.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageURL)}`;
  shareTw.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageURL)}&text=${encodeURIComponent(text)}`;
  shareWa.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + pageURL)}`;

  // --- LOGIN GOOGLE ---
  const googleBtn = document.getElementById("googleLogin");
  const userPanel = document.getElementById("userPanel");
  const loginPanel = document.getElementById("loginPanel");
  const logoutBtn = document.getElementById("logoutBtn");

  googleBtn.addEventListener("click", () => signInWithPopup(auth, provider));
  logoutBtn.addEventListener("click", () => signOut(auth));

  onAuthStateChanged(auth, user => {
    if (user) {
      userPanel.classList.remove("d-none");
      loginPanel.classList.add("d-none");

      userPhoto.src = user.photoURL || "default-avatar.png";
      userName.textContent = user.displayName || user.email;
      userEmail.textContent = user.email;
    } else {
      userPanel.classList.add("d-none");
      loginPanel.classList.remove("d-none");
    }
  });

  // --- LOGIN / REGISTRO CON CORREO ---
  const emailForm = document.getElementById("emailForm");

  emailForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registrado correctamente");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        // Si ya existe, intentar login
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (loginErr) {
          alert("Error al iniciar sesión: " + loginErr.message);
        }
      } else {
        alert("Error: " + err.message);
      }
    }
  });


  // ---------- GEO + OPENCAGE + FIRESTORE ----------
  const openCageKey = "4e7c51f2c46042caad60314486a9f31e";
  const weatherKey = "a8298c551d4cf6e0334e10a8953e6187";

  const status = document.getElementById("status");
  const locationDiv = document.getElementById("location");
  const weatherDiv = document.getElementById("weather");

  navigator.geolocation.getCurrentPosition(async (position) => {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    try {
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${openCageKey}`;
      const res = await fetch(url);
      const data = await res.json();
      const c = data.results[0].components;

      const municipio = c.city || c.town || c.village || c.county;
      const estado = c.state;
      const pais = c.country;

      locationDiv.innerHTML = `
        <strong>Ubicación detectada:</strong><br>
        ${municipio}, ${estado}, ${pais}
      `;
      status.style.display = "none";

      await addDoc(collection(db, "ubicaciones"), {
        municipio, estado, pais, fecha: new Date()
      });

    } catch {
      locationDiv.textContent = "No se pudo obtener ubicación textual";
    }

    obtenerClima(lat, lon);

  }, () => {
    status.textContent = "Permiso de ubicación denegado.";
  });

  // ---------- CLIMA ----------
  async function obtenerClima(lat, lon) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric&lang=es`;
      const res = await fetch(url);
      const data = await res.json();

      weatherDiv.innerHTML = `
        🌤 <strong>Clima actual:</strong><br>
        ${data.main.temp}°C • ${data.weather[0].description}
      `;
    } catch {}
  }

});
