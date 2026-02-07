const socialApiKey = "dee15798c3b2aa9b3aad72d76739665159a65e5bcd3ba0bdd20f444feb229b9d"; 

async function obtenerDatosPagina(urlPagina) {
  try {
    const endpoint = `https://api.socialapis.io/v1/facebook/pages/details?link=${encodeURIComponent(urlPagina)}`;

    const resp = await fetch(endpoint, {
      method: "GET",
      headers: {
        "x-api-token": socialApiKey,
        "Accept": "application/json"
      }
    });

    const data = await resp.json();

    if (data.success) {
      return data.data; // objetos con información pública
    } else {
      console.warn("Error en API Social:", data);
      return null;
    }
  } catch (err) {
    console.error("Error fetch SocialAPI:", err);
    return null;
  }
}
document.getElementById("fetchSocial")?.addEventListener("click", async () => {
  const url = document.getElementById("socialUrl").value.trim();
  const resultDiv = document.getElementById("socialResult");

  if (!url) {
    resultDiv.textContent = "Por favor ingresa una URL válida.";
    return;
  }

  const info = await obtenerDatosPagina(url);

  if (info) {
    resultDiv.innerHTML = `
      <strong>Nombre:</strong> ${info.name || "N/A"}<br>
      <strong>Seguidores:</strong> ${info.followersCount || "N/D"}
    `;
  } else {
    resultDiv.textContent = "No se pudo obtener información.";
  }
});
