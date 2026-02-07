document.addEventListener("DOMContentLoaded", () => {

  const apiKey = "4e7c51f2c46042caad60314486a9f31e";
  const status = document.getElementById("status");
  const locationDiv = document.getElementById("location");

  if (!navigator.geolocation) {
    status.textContent = "Tu navegador no soporta geolocalización.";
    return;
  }

  status.textContent = "Solicitando ubicación GPS precisa...";

  navigator.geolocation.getCurrentPosition(
    async (position) => {

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const precision = position.coords.accuracy;

      status.innerHTML = `GPS detectado con precisión de <b>${precision.toFixed(0)} metros</b>`;

      // OpenCage SOLO para convertir a dirección
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      const place = data.results[0].formatted;

      locationDiv.innerHTML = `
        <strong>Latitud:</strong> ${lat} <br>
        <strong>Longitud:</strong> ${lon} <br><br>
        <strong>Dirección exacta:</strong><br>${place}
      `;
    },
    (error) => {
      status.textContent = "No se pudo obtener el GPS. Activa la ubicación EXACTA en tu celular.";
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }
  );

});
