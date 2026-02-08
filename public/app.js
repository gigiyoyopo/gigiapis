const openCageKey = "4e7c51f2c46042caad60314486a9f31e";
const weatherKey = "a8298c551d4cf6e0334e10a8953e6187";

const status = document.getElementById("status");
const locationDiv = document.getElementById("location");
const weatherDiv = document.getElementById("weather");
const loader = document.getElementById("loader");

loader.style.display = "flex"; // mostrar loader al inicio

// -------- GEOLOCALIZACIÓN --------
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      status.textContent = "Ubicación detectada, obteniendo datos...";

      // 1️⃣ Mostrar ubicación textual (OpenCage)
      try {
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${openCageKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.results.length === 0) throw new Error("Sin resultados de ubicación.");

        const components = data.results[0].components;
        const municipio = components.city || components.town || components.village || components.county || "Desconocido";
        const estado = components.state || "Desconocido";
        const pais = components.country || "Desconocido";

        locationDiv.innerHTML = `<strong>Ubicación detectada:</strong><br>${municipio}, ${estado}, ${pais}`;
        status.style.display = "none";
        loader.style.display = "none"; // ocultar loader

      } catch (e) {
        console.error("Error geolocalización:", e);
        locationDiv.textContent = "No se pudo obtener la ubicación.";
        status.style.display = "none";
        loader.style.display = "none";
      }

      // 2️⃣ Obtener clima
      try {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric&lang=es`;
        const weatherResponse = await fetch(weatherURL);
        const weatherData = await weatherResponse.json();

        if (!weatherData.main) throw new Error("No hay datos de clima");

        const temp = weatherData.main.temp;
        const desc = weatherData.weather[0].description;

        weatherDiv.innerHTML = `🌤 <strong>Clima actual en tu zona:</strong><br>${temp}°C • ${desc}`;
      } catch (e) {
        console.error("Error clima:", e);
        weatherDiv.textContent = "No se pudo obtener el clima.";
      }

    },
    (error) => {
      console.error("Error GPS:", error);
      status.textContent = "Permiso de ubicación denegado o GPS no disponible.";
      loader.style.display = "none";
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
} else {
  status.textContent = "Geolocalización no soportada por tu navegador.";
  loader.style.display = "none";
}
