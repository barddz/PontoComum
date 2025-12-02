// JWT FIXO
const TOKEN_JWT=
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJuYW1lIjoiRW5nLiBDb21wdXRhXHUwMGU3XHUwMGUzbyIsInJvbGUiOiJKV1QiLCJpYXQiOjE3NTk5ODEzMTcsImV4cCI6MTc1OTk4NDkxN30.b1KfcSFInRwYnvRA0Ae5jYuL59KZmCsufPgISNGq0X0";

// CRIAR CONTA

const formCriarConta = document.getElementById("form-criar-conta");

if (formCriarConta) {
  formCriarConta.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verifica se já existe
    const jaExiste = usuarios.some(user => user.email === email);
    if (jaExiste) {
      alert("Este email já está cadastrado.");
      return;
    }

    // Salva
    usuarios.push({ nome, email, senha });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Conta criada com sucesso!");
    window.location.href = "login.html";
  });
}

// LOGIN com JWT fixo

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

    // Salva o token JWT
    sessionStorage.setItem("token", TOKEN_JWT);
    sessionStorage.setItem("usuarioLogado", JSON.stringify(user));

    alert("Login realizado com sucesso!");
    window.location.href = "index.html";
  });
}


// Área Restrita — cadastro de eventos exige login

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

// CADASTRO DE EVENTOS

const formEvento = document.getElementById("form-evento");

if (formEvento) {
  formEvento.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;
    const localTexto = document.getElementById("local").value;
    const descricao = document.getElementById("descricao").value;

    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(localTexto)}`;
    const resposta = await fetch(url);
    const dados = await resposta.json();

    const lat = Number(dados[0].lat);
    const lng = Number(dados[0].lon);

    const eventos = JSON.parse(localStorage.getItem("eventos")) || [];

    eventos.push({
      id: Date.now(),
      titulo,
      data,
      hora,
      local: localTexto,
      descricao,
      lat,
      lng
    });

    localStorage.setItem("eventos", JSON.stringify(eventos));

    alert("Evento cadastrado com sucesso!");
    window.location.href = "eventos.html";
  });
}

// LISTA DE EVENTOS

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

// DETALHES DO EVENTO

if (window.location.pathname.includes("detalhes.html")) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
  const evento = eventos.find(ev => ev.id == id);

  if (!evento) {
    alert("Evento não encontrado.");
  } else {
    document.getElementById("evento-titulo").textContent = evento.titulo;
    document.getElementById("evento-data").textContent = evento.data;
    document.getElementById("evento-hora").textContent = evento.hora;
    document.getElementById("evento-local").textContent = evento.local;
    document.getElementById("evento-descricao").textContent = evento.descricao;

    const mapa = L.map("mapa").setView([evento.lat, evento.lng], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(mapa);

    L.marker([evento.lat, evento.lng])
      .addTo(mapa)
      .bindPopup(evento.local)
      .openPopup();
  }
}
