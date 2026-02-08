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

// API Geolocalización + P Online (Clima)
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

// Muestra datos de usuario en navbar si está logueado
onAuthStateChanged(auth, user => {
  if(user){
    document.getElementById("userPhoto").src = user.photoURL;
    document.getElementById("userName").textContent = user.displayName;
    document.getElementById("userEmail").textContent = user.email;
  }
});

// API Streaming (YOUTUBE): muestra videos relacionados con APIs y JavaScript 
const YT_KEY = "AQUI_TU_API_KEY";

async function cargarVideosYouTube(){
  const container = document.getElementById("youtubeVideos");

  try{
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=APIs%20JavaScript&type=video&maxResults=6&key=${YT_KEY}`);
    const data = await res.json();

    container.innerHTML = "";

    data.items.forEach(video=>{
      const vid = video.id.videoId;
      const title = video.snippet.title;
      const thumb = video.snippet.thumbnails.medium.url;

      container.innerHTML += `
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card api-card h-100">
            <img src="${thumb}" class="card-img-top">
            <div class="card-body text-center">
              <h6 class="card-title">${title}</h6>
              <a href="https://www.youtube.com/watch?v=${vid}" target="_blank" class="btn btn-dark mt-2">
                Ver video
              </a>
            </div>
          </div>
        </div>
      `;
    });

  }catch(e){
    container.innerHTML = "No se pudieron cargar los videos.";
    console.error(e);
  }
}

cargarVideosYouTube();
