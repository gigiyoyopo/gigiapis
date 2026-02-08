import { auth, db } from "./firebase.js";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  const openCageKey = "4e7c51f2c46042caad60314486a9f31e";
  const weatherKey = "a8298c551d4cf6e0334e10a8953e6187";

  const status = document.getElementById("status");
  const locationDiv = document.getElementById("location");
  const weatherDiv = document.getElementById("weather");
  const loader = document.getElementById("loader");

  loader.style.display = "flex";

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Ubicación textual
      try{
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${openCageKey}`;
        const response = await fetch(url);
        const data = await response.json();
        const components = data.results[0].components;

        const municipio = components.city||components.town||components.village||components.county||"Desconocido";
        const estado = components.state||"Desconocido";
        const pais = components.country||"Desconocido";

        locationDiv.innerHTML = `<strong>Ubicación:</strong> ${municipio}, ${estado}, ${pais}`;
        status.style.display = "none";

        try{ await addDoc(collection(db,"ubicaciones"), {municipio,estado,pais,fecha:new Date()}); }
        catch(e){ console.warn("No se pudo guardar en Firestore"); }
      }catch(e){
        locationDiv.textContent = "No se pudo obtener la ubicación textual.";
        status.style.display = "none";
      }

      // Clima
      try{
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric&lang=es`;
        const weatherResponse = await fetch(weatherURL);
        const weatherData = await weatherResponse.json();

        const temp = weatherData.main.temp;
        const desc = weatherData.weather[0].description;

        weatherDiv.innerHTML = `🌤 <strong>Clima actual:</strong> ${temp}°C • ${desc}`;
      }catch(e){
        weatherDiv.textContent = "No se pudo obtener el clima.";
      }

      loader.style.display = "none";

    }, 
    (error)=>{
      status.textContent = "Permiso de ubicación denegado.";
      loader.style.display = "none";
    }
  );

  // Modo claro/oscuro
  const toggleTheme = document.getElementById("toggleTheme");
  toggleTheme.addEventListener("click", ()=>{ document.body.classList.toggle("dark"); });

});
