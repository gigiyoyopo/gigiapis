import { auth, provider, db } from "./firebase.js";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  const apiKey = "4e7c51f2c46042caad60314486a9f31e";
  const status = document.getElementById("status");
  const locationDiv = document.getElementById("location");

  // DETECTAR UBICACIÓN Y GUARDAR EN FIRESTORE (API BASE DE GEOLOCALIZACIÓN + API BASE DE DATOS)
  navigator.geolocation.getCurrentPosition(async (position) => {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

      // OBTENER CLIMA ACTUAL (API PLATAFORMAS ONLINE)
  const weatherDiv = document.getElementById("weather");

  const API_KEY = "a8298c551d4cf6e0334e10a8953e6187";

  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;

  const weatherResponse = await fetch(weatherURL);
  const weatherData = await weatherResponse.json();

  const temp = weatherData.main.temp;
  const desc = weatherData.weather[0].description;

  weatherDiv.innerHTML = `
    🌤 <strong>Clima actual en tu zona:</strong><br>
    ${temp}°C • ${desc}
  `;


    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;
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


    // GUARDAR EN FIRESTORE (API BASE DE DATOS)
    await addDoc(collection(db, "ubicaciones"), {
      municipio,
      estado,
      pais,
      fecha: new Date()
    });

  });

  // AUTENTICACIÓN CON GOOGLE (API BASE DE AUTENTICACIÓN)
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