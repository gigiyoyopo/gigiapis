document.addEventListener("DOMContentLoaded", () => {

  const apiKey = "4e7c51f2c46042caad60314486a9f31e";

  fetch("https://ipapi.co/json/")
    .then(res => res.json())
    .then(async data => {

      const lat = data.latitude;
      const lon = data.longitude;

      const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

      const response = await fetch(url);
      const geo = await response.json();

      const place = geo.results[0].formatted;

      document.getElementById("location").innerHTML = `
        <strong>Lat:</strong> ${lat}<br>
        <strong>Lng:</strong> ${lon}<br>
        <strong>Ubicación detectada:</strong><br>${place}
      `;
    });

});