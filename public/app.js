import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// Botones
const googleBtn = document.getElementById("googleLogin");
const logoutBtn = document.getElementById("logoutBtn");
const toggleThemeBtn = document.getElementById("toggleTheme");

// Login Google
const googleProvider = new GoogleAuthProvider();
googleBtn?.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch(err){
    console.error("Error login con Google", err);
  }
});

// Logout
logoutBtn?.addEventListener("click", async () => {
  try { await signOut(auth); } 
  catch(err){ console.error(err); }
});

// Cambiar tema
toggleThemeBtn?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Detectar usuario
onAuthStateChanged(auth, user => {
  const loginPanel = document.getElementById("loginPanel");
  const userPanel = document.getElementById("userPanel");
  if(user){
    loginPanel.classList.add("d-none");
    userPanel.classList.remove("d-none");
    document.getElementById("userPhoto").src = user.photoURL || "images/default.png";
    document.getElementById("userName").textContent = user.displayName || "Usuario";
    document.getElementById("userEmail").textContent = user.email || "Sin email";
  }else{
    loginPanel.classList.remove("d-none");
    userPanel.classList.add("d-none");
  }
});

// Toggle descripción APIs
window.toggleDescription = function(index){
  const desc = document.getElementById('desc'+index);
  desc.classList.toggle('d-none');
}

// Geolocalización + Clima
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

function success(pos){
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;
  locationDiv.textContent = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
  
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
    .then(res=>res.json())
    .then(data=>{
      weatherDiv.textContent = `Clima: ${data.current_weather.temperature}°C, Viento: ${data.current_weather.windspeed} km/h`;
      loader.innerHTML = "";
      status.textContent = "Ubicación encontrada ✅";
    })
    .catch(e=>{
      status.textContent = "No se pudo obtener el clima";
      loader.innerHTML = "";
    });
}

function error(err){
  status.textContent = "No se pudo obtener la ubicación";
  loader.innerHTML = "";
}
