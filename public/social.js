// Para que el buscador del GitHub busque JAJAJ
window.searchDevs = async function () {
  const query = document.getElementById("devSearch").value.trim();
  const resultsContainer = document.getElementById("devResults");

  if (!query) {
    resultsContainer.innerHTML = `
      <div class="text-center text-danger fw-bold">
        Escribe algo para buscar desarrolladores
      </div>`;
    return;
  }

  resultsContainer.innerHTML = `<div class="text-center">Buscando desarrolladores...</div>`;

  try {
    const response = await fetch(`https://api.github.com/search/users?q=${query}+in:bio&per_page=12`);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      resultsContainer.innerHTML = `
        <div class="text-center text-warning fw-bold">
          No se encontraron desarrolladores
        </div>`;
      return;
    }

    resultsContainer.innerHTML = "";

    for (const user of data.items) {
      const card = document.createElement("div");
      card.className = "col-12 col-md-6 col-lg-3";

      card.innerHTML = `
        <div class="card shadow-sm h-100">
          <img src="${user.avatar_url}" class="card-img-top" height="180" style="object-fit:cover;">
          <div class="card-body text-center">
            <h5 class="card-title">${user.login}</h5>
            <a href="${user.html_url}" target="_blank" class="btn btn-dark mt-2">
              Ver perfil
            </a>
          </div>
        </div>
      `;

      resultsContainer.appendChild(card);
    }

  } catch (error) {
    resultsContainer.innerHTML = `
      <div class="text-center text-danger fw-bold">
        Error al consultar GitHub API
      </div>`;
    console.error(error);
  }
};
