// Criar conta
const formCriarConta = document.getElementById("form-criar-conta");

if (formCriarConta) {
  formCriarConta.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    // Puxa usuários do LocalStorage
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verifica se já existe
    const jaExiste = usuarios.      some(user => user.email === email);
    if (jaExiste) {
      alert("Este email já está cadastrado.");
      return;
    }

    // Cria e salva
    usuarios.push({ nome, email, senha });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Conta criada com sucesso!");
    window.location.href = "login.html";
  });
}



// Login
const formLogin = document.getElementById("login-form");

if (formLogin) {
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const senha = document.getElementById("login-senha").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const user = usuarios.find(u => u.email === email && u.senha === senha);

    if (!user) {
      alert("Email ou senha incorretos.");
      return;
    }

    // Cria Token
    const token = "token_" + Date.now();

    sessionStorage.setItem("token", token);
    sessionStorage.setItem("usuarioLogado", JSON.stringify(user));

    alert("Login realizado com sucesso!");
    window.location.href = "index.html";
  });
}

// Bloqueia paginas que exigem login
if (window.location.pathname.includes("cadastro.html")) {
  const token = sessionStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado para cadastrar eventos.");
    window.location.href = "login.html";
  }
}

// DESTACAR LINK DA PÁGINA ATUAL NO MENU
const caminhoAtual = window.location.pathname.split("/").pop();
const linksMenu = document.querySelectorAll(".menu-link");

linksMenu.forEach(link => {
  if (link.getAttribute("href") === caminhoAtual) {
    link.classList.add("ativo");
  }
});

   //CADASTRO DE EVENTOS (cadastro.html)

const formEvento = document.getElementById("form-evento");

if (formEvento) {
  formEvento.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;
    const localTexto = document.getElementById("local").value;
    const descricao = document.getElementById("descricao").value;

    // Buscar coordenadas do endereço (Nominatim)
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(localTexto)}`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

    const lat = Number(dados[0].lat);
    const lng = Number(dados[0].lon);

    // Salva o evento
    const eventos = JSON.parse(localStorage.getItem("eventos")) || [];

    const novoEvento = {
      id: Date.now(),
      titulo,
      data,
      hora,
      local: localTexto,
      descricao,
      lat,
      lng
    };

    eventos.push(novoEvento);
    localStorage.setItem("eventos", JSON.stringify(eventos));

    alert("Evento cadastrado com sucesso!");
    window.location.href = "eventos.html";
  });
}

   //LISTAGEM DE EVENTOS (eventos.html)

const containerEventos = document.getElementById("container-eventos");

if (containerEventos) {
  const eventos = JSON.parse(localStorage.getItem("eventos")) || [];

  if (eventos.length === 0) {
    containerEventos.innerHTML = "<p>Nenhum evento cadastrado.</p>";
  } else {
    eventos.forEach((e) => {
      containerEventos.innerHTML += `
        <div class="card-evento">
          <h3>${e.titulo}</h3>
          <p>${e.data} às ${e.hora}</p>
          <p>${e.local}</p>  
          <a href="detalhes.html?id=${e.id}" class="btn-secundario">Ver detalhes</a>
        </div>
      `;
    });
  }
}

// DETALHES DO EVENTO (detalhes.html)

if (window.location.pathname.includes("detalhes.html")) {

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
  const evento = eventos.find(ev => ev.id == id);

  // Preenche os textos
  document.getElementById("evento-titulo").textContent = evento.titulo;
  document.getElementById("evento-data").textContent = evento.data;
  document.getElementById("evento-hora").textContent = evento.hora;
  document.getElementById("evento-local").textContent = evento.local;
  document.getElementById("evento-descricao").textContent = evento.descricao;

  // Cria o mapa
  const mapa = L.map("mapa").setView([evento.lat, evento.lng], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(mapa);

  L.marker([evento.lat, evento.lng])
    .addTo(mapa)
    .bindPopup(evento.local)
    .openPopup();
}
