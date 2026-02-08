import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// -------------------- Botones --------------------
const googleBtn = document.getElementById("googleLogin");
const logoutBtn = document.getElementById("logoutBtn");
const toggleThemeBtn = document.getElementById("toggleTheme");

// --- Login Google ---
const googleProvider = new GoogleAuthProvider();
googleBtn?.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch(err){
    console.error("Error login con Google", err);
  }
});

// --- Logout ---
logoutBtn?.addEventListener("click", async () => {
  try { await signOut(auth); } 
  catch(err){ console.error(err); }
});

// --- Cambiar tema ---
toggleThemeBtn?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// --- Refrescar página al dar click en "Prueba de APIs" ---
refreshPageBtn?.addEventListener("click", () => location.reload());

// --- Detectar usuario ---
onAuthStateChanged(auth, user => {
  const loginPanel = document.getElementById("loginPanel");
  const userPanel = document.getElementById("userPanel");
  if(user){
    loginPanel.classList.add("d-none");
    userPanel.classList.remove("d-none");
    document.getElementById("userPhoto").src = user.photoURL || "images/default.png";
    document.getElementById("userName").textContent = user.displayName || "Usuario";
    document.getElementById("userEmail").textContent = user.email || "Sin email";

    if(document.body.classList.contains("dark")){
      document.getElementById("userEmail").style.color = "white";
    }
  }else{
    loginPanel.classList.remove("d-none");
    userPanel.classList.add("d-none");
  }
});

// --- Toggle descripción APIs ---
window.toggleDescription = function(index){
  const desc = document.getElementById('desc'+index);
  desc.classList.toggle('d-none');
}

// -------------------- Geolocalización + Clima --------------------
const status = document.getElementById("status");
const loader = document.getElementById("loader");
const locationDiv = document.getElementById("location");
const weatherDiv = document.getElementById("weather");

loader.innerHTML = "<div class='spinner-border text-dark' role='status'><span class='visually-hidden'>Loading...</span></div>";

if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(success,error);
}else{
  status.textContent = "Tu navegador no soporta geolocalización";
  loader.innerHTML = "";
}

async function success(pos){
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  try {
    // Reverse geocoding (OpenCage)
    const geoKey = "4e7c51f2c46042caad60314486a9f31e";
    const geoRes = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${geoKey}`);
    const geoData = await geoRes.json();
    const components = geoData.results[0].components;

    const municipio = components.city || components.town || components.village || components.county || "Municipio desconocido";
    const estado = components.state || "Estado desconocido";
    const pais = components.country || "País desconocido";

    locationDiv.innerHTML = `
      <strong>${municipio}, ${estado}, ${pais}</strong>
    `;
    status.textContent = "Ubicación detectada:";

  } catch(e){
    console.error(e);
    locationDiv.textContent = "No se pudo obtener la ubicación textual";
    status.textContent = "";
  }

  try {
    // Clima (OpenWeather)
    const weatherKey = "a8298c551d4cf6e0334e10a8953e6187";
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric&lang=es`);
    const weatherData = await weatherRes.json();

    const temp = weatherData.main.temp;
    const desc = weatherData.weather[0].description;
    const iconCode = weatherData.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherDiv.innerHTML = `
      <img src="${iconUrl}" alt="clima" style="width:50px; height:50px; vertical-align:middle;">
      <span style="font-weight:600; margin-left:5px;">${temp}°C • ${desc}</span>
    `;
  } catch(e){
    console.error(e);
    weatherDiv.textContent = "No se pudo obtener el clima.";
  }

  loader.innerHTML = "";
}

function error(err){
  console.error(err);
  status.textContent = "Permiso de ubicación denegado o error al obtener coordenadas.";
  loader.innerHTML = "";
  locationDiv.textContent = "";
  weatherDiv.textContent = "";
}
