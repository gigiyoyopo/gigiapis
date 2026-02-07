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

  // Función para abrir el modal con contenido
  const showModal = (title, contentHTML) => {
    const modalTitle = document.getElementById("apiModalLabel");
    const modalBody = document.getElementById("apiModalBody");
    
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHTML;

    // Usamos la instancia global de Bootstrap cargada en el HTML
    const myModal = new bootstrap.Modal(document.getElementById('apiModal'));
    myModal.show();
  };

  // 1. API REDES SOCIALES (Simulación con JSONPlaceholder)
  btnSocial.addEventListener("click", async () => {
    showModal("Feed Social", "<div class='text-center py-3'><div class='spinner-border text-primary'></div><p class='mt-2'>Cargando publicaciones...</p></div>");

    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
      const posts = await res.json();

      let html = '<div class="list-group list-group-flush">';
      posts.forEach(post => {
        html += `
          <div class="list-group-item px-0 py-3">
            <div class="d-flex w-100 justify-content-between align-items-center mb-1">
              <h6 class="mb-0 fw-bold text-primary">@usuario_${post.userId}</h6>
              <small class="text-muted">Hace un momento</small>
            </div>
            <p class="mb-1 text-dark">${post.title}</p>
            <small class="text-muted">${post.body.substring(0, 60)}...</small>
          </div>
        `;
      });
      html += '</div>';
      
      document.getElementById("apiModalBody").innerHTML = html;
    } catch (error) {
      document.getElementById("apiModalBody").innerHTML = "<p class='text-danger'>Error cargando el feed social.</p>";
    }
  });

  // 2. API STREAMING (TVMaze - Series Reales)
  btnStreaming.addEventListener("click", async () => {
    showModal("Tendencias Streaming", "<div class='text-center py-3'><div class='spinner-border text-danger'></div><p class='mt-2'>Buscando series...</p></div>");

    try {
      const res = await fetch("https://api.tvmaze.com/shows");
      const data = await res.json();
      const shows = data.slice(0, 6); // Tomamos las primeras 6

      let html = '<div class="row g-3">';
      shows.forEach(show => {
        html += `
          <div class="col-6 col-md-4">
            <div class="card h-100 border-0 shadow-sm">
              <img src="${show.image?.medium}" class="card-img-top rounded" alt="${show.name}" style="height: 160px; object-fit: cover;">
              <div class="card-body p-2 text-center">
                <h6 class="card-title text-truncate small mb-1">${show.name}</h6>
                <span class="badge bg-warning text-dark">★ ${show.rating?.average || '-'}</span>
              </div>
            </div>
          </div>
        `;
      });
      html += '</div>';

      document.getElementById("apiModalBody").innerHTML = html;
    } catch (error) {
      document.getElementById("apiModalBody").innerHTML = "<p class='text-danger'>Error cargando catálogo.</p>";
    }
  });

});
