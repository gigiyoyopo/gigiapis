import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// ================= NAVBAR SCROLL + CIERRE OFFCANVAS =================
document.querySelectorAll(".nav-scroll").forEach(link=>{
  link.addEventListener("click", function(e){
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    target?.scrollIntoView({behavior:"smooth"});

    const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasNavbar'));
    offcanvas?.hide();
  });
});

// ================= TOGGLE DESCRIPCIONES APIs =================
window.toggleDescription = function(index){
  const desc = document.getElementById('desc'+index);
  desc.classList.toggle('d-none');
}

// ================= TEMA =================
const toggleThemeBtn = document.getElementById("toggleTheme");
toggleThemeBtn?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// ================= REFRESH LOGO =================
document.getElementById("refreshPage")?.addEventListener("click", (e)=>{
  e.preventDefault();
  location.reload();
});

// ================= GEOLOCALIZACIÓN + CLIMA =================
const status = document.getElementById("status");
const loader = document.getElementById("loader");
const locationDiv = document.getElementById("location");
const weatherDiv = document.getElementById("weather");

loader.innerHTML = "<div class='spinner-border text-dark' role='status'></div>";

if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(success,error);
}

async function success(pos){
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  const geoKey = "4e7c51f2c46042caad60314486a9f31e";
  const geoRes = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${geoKey}`);
  const geoData = await geoRes.json();
  const c = geoData.results[0].components;

  locationDiv.innerHTML = `<strong>${c.city||c.town||c.county}, ${c.state}, ${c.country}</strong>`;
  status.textContent = "Ubicación detectada:";

  const weatherKey = "a8298c551d4cf6e0334e10a8953e6187";
  const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric&lang=es`);
  const w = await weatherRes.json();

  weatherDiv.innerHTML = `
    <img src="http://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png" width="50">
    <strong>${w.main.temp}°C • ${w.weather[0].description}</strong>
  `;

  loader.innerHTML = "";
}

function error(){
  status.textContent = "Permiso de ubicación denegado.";
  loader.innerHTML = "";
}

// ================= MOSTRAR USUARIO (SOLO VISUAL, auth.js maneja login) =================
onAuthStateChanged(auth, user => {
  if(user){
    document.getElementById("userPhoto").src = user.photoURL;
    document.getElementById("userName").textContent = user.displayName;
    document.getElementById("userEmail").textContent = user.email;
  }
});
