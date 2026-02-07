import { auth, provider, db } from "./firebase.js";
import {
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

    // API REDES SOCIALES
  const pageURL = window.location.href;
  const text = "Mira esta app que detecta tu ubicación en tiempo real 😎";

  document.getElementById("shareFb").href =
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageURL)}`;

  document.getElementById("shareTw").href =
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageURL)}&text=${encodeURIComponent(text)}`;

  document.getElementById("shareWa").href =
    `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + pageURL)}`;


  const openCageKey = "4e7c51f2c46042caad60314486a9f31e";
  const weatherKey = "a8298c551d4cf6e0334e10a8953e6187";

  const status = document.getElementById("status");
  const locationDiv = document.getElementById("location");
  const weatherDiv = document.getElementById("weather");

  // -------- GEOLOCALIZACIÓN --------
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // 1️⃣ Mostrar ubicación textual (OpenCage)
      try {
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${openCageKey}`;
        const response = await fetch(url);
        const data = await response.json();
        const components = data.results[0].components;

        const municipio =
          components.city ||
          components.town ||
          components.village ||
          components.county ||
          "Municipio desconocido";

        const estado = components.state || "Estado desconocido";
        const pais = components.country || "País desconocido";

        locationDiv.innerHTML = `
          <strong>Ubicación detectada:</strong><br>
          ${municipio}, ${estado}, ${pais}
        `;

        status.style.display = "none";

        // Guardar en Firestore SIN romper nada si falla
        try {
          await addDoc(collection(db, "ubicaciones"), {
            municipio,
            estado,
            pais,
            fecha: new Date()
          });
        } catch (e) {
          console.warn("No se pudo guardar en Firestore");
        }

      } catch (e) {
        locationDiv.textContent = "No se pudo obtener la ubicación textual.";
        status.style.display = "none";
      }

      // 2️⃣ Obtener clima (OpenWeather) — independiente
      obtenerClima(lat, lon);
    },

    (error) => {
      status.textContent = "Permiso de ubicación denegado.";
    }
  );

  // -------- FUNCIÓN CLIMA (NO AFECTA GEO) --------
  async function obtenerClima(lat, lon) {
    try {
      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric&lang=es`;

      const weatherResponse = await fetch(weatherURL);
      const weatherData = await weatherResponse.json();

      const temp = weatherData.main.temp;
      const desc = weatherData.weather[0].description;

      weatherDiv.innerHTML = `
        🌤 <strong>Clima actual en tu zona:</strong><br>
        ${temp}°C • ${desc}
      `;
    } catch (e) {
      console.warn("El clima falló pero la ubicación ya se mostró");
    }
  }

  // -------- AUTENTICACIÓN GOOGLE --------
  const googleBtn = document.getElementById("googleLogin");

  googleBtn.addEventListener("click", async () => {
    await signInWithPopup(auth, provider);
  });

  onAuthStateChanged(auth, user => {
    if (user) {
      console.log("Usuario logeado:", user.email);
    }
  });

});
