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

      status.innerHTML = `GPS detectado correctamente`;

      // OpenCage SOLO para convertir a dirección
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      // 🔥 Aquí está el cambio clave
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
