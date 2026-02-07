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

  // -------- IMPLEMENTACIÓN DE NUEVAS APIS --------

  const btnSocial = document.getElementById("btnSocial");
  const btnStreaming = document.getElementById("btnStreaming");

  // 🔑 CLAVES DE API (¡Reemplázalas con las tuyas!)
  // Consigue tu Key gratis en: https://developers.giphy.com/dashboard/
  const GIPHY_API_KEY = "ENllyIMcpq7qJk0IuxUxS8nSDYD4JeVA"; 
  
  // Consigue tu Key gratis en: https://www.themoviedb.org/settings/api
  const TMDB_API_KEY = "4d3f5c3b125118aab5652f8c7269d49b"; 

  // Función para abrir el modal con contenido
  const showModal = (title, contentHTML) => {
    const modalTitle = document.getElementById("apiModalLabel");
    const modalBody = document.getElementById("apiModalBody");
    const modalElement = document.getElementById('apiModal');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHTML;

    // Usamos window.bootstrap para asegurar que accedemos a la librería cargada en el HTML
    if (window.bootstrap) {
      const myModal = new bootstrap.Modal(modalElement);
      myModal.show();
    } else {
      console.error("Bootstrap no está cargado");
      alert("Error: La librería Bootstrap no se ha cargado correctamente.");
    }
  };

  // 1. API REDES SOCIALES (GIPHY - Requiere Key)
  btnSocial.addEventListener("click", async () => {
    if (GIPHY_API_KEY === "TU_API_KEY_GIPHY_AQUI") {
      alert("⚠️ Debes poner tu API Key de Giphy en el archivo app.js línea 117");
      return;
    }

    showModal("Tendencias en Redes (Giphy)", "<div class='text-center py-3'><div class='spinner-border text-primary'></div><p class='mt-2'>Cargando feed...</p></div>");

    try {
      // Endpoint: Trending GIFs
      const res = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=9&rating=g`);
      
      if (!res.ok) throw new Error("Error de autorización o red");
      
      const data = await res.json();
      const posts = data.data;

      let html = '<div class="row g-2">';
      posts.forEach(post => {
        html += `
          <div class="col-4">
            <div class="card h-100 border-0">
              <img src="${post.images.fixed_height_small.url}" class="card-img-top rounded" style="object-fit: cover; height: 120px;" alt="${post.title}">
            </div>
          </div>
        `;
      });
      html += '</div>';
      
      document.getElementById("apiModalBody").innerHTML = html;
    } catch (error) {
      document.getElementById("apiModalBody").innerHTML = "<p class='text-danger text-center'>Error: Verifica tu API Key de Giphy.</p>";
    }
  });

  // 2. API STREAMING (TMDB - Requiere Key)
  btnStreaming.addEventListener("click", async () => {
    if (TMDB_API_KEY === "TU_API_KEY_TMDB_AQUI") {
      alert("⚠️ Debes poner tu API Key de TMDB en el archivo app.js línea 120");
      return;
    }

    showModal("Catálogo Streaming (TMDB)", "<div class='text-center py-3'><div class='spinner-border text-danger'></div><p class='mt-2'>Conectando con TMDB...</p></div>");

    try {
      // Endpoint: Trending TV Shows
      const res = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}&language=es-ES`);
      
      if (!res.ok) throw new Error("Error de autorización o red");

      const data = await res.json();
      const shows = data.results.slice(0, 6);

      let html = '<div class="row g-3">';
      shows.forEach(show => {
        const imgUrl = show.poster_path 
          ? `https://image.tmdb.org/t/p/w500${show.poster_path}` 
          : 'https://via.placeholder.com/500x750?text=No+Image';

        html += `
          <div class="col-6 col-md-4">
            <div class="card h-100 border-0 shadow-sm">
              <img src="${imgUrl}" class="card-img-top rounded" alt="${show.name}" style="height: 160px; object-fit: cover;">
              <div class="card-body p-2 text-center">
                <h6 class="card-title text-truncate small mb-1">${show.name}</h6>
                <span class="badge bg-warning text-dark">★ ${show.vote_average ? show.vote_average.toFixed(1) : '-'}</span>
              </div>
            </div>
          </div>
        `;
      });
      html += '</div>';

      document.getElementById("apiModalBody").innerHTML = html;
    } catch (error) {
      document.getElementById("apiModalBody").innerHTML = "<p class='text-danger text-center'>Error: Verifica tu API Key de TMDB.</p>";
    }
  });

});
