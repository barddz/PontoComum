/* CADASTRO DE EVENTOS (cadastro.html)
========================================== */


   const formEvento = document.getElementById("form-evento");

   if (formEvento) {
     formEvento.addEventListener("submit", (e) => {
       e.preventDefault();
   
       // Recupera eventos já existentes
       const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
   
       // Monta o objeto do novo evento
       const novoEvento = {
         id: Date.now(), // ID único baseado em quando foi criado
         titulo: document.getElementById("titulo").value,
         data: document.getElementById("data").value,
         hora: document.getElementById("hora").value,
         local: document.getElementById("local").value,
         descricao: document.getElementById("descricao").value
       };
   
       // Adiciona ao array na memória
       eventos.push(novoEvento);
   
       // Salva no localStorage
       localStorage.setItem("eventos", JSON.stringify(eventos));
   
       alert("Evento cadastrado com sucesso!");
   
       // Redireciona para a lista de eventos
       window.location.href = "eventos.html";
     });
   }
   
   
   
   /* LISTAGEM DE EVENTOS (eventos.html)
   ======================================= */
   
   const containerEventos = document.getElementById("container-eventos");
   
   if (containerEventos) {
     const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
   
     if (eventos.length === 0) {
       containerEventos.innerHTML = "<p>Nenhum evento cadastrado.</p>";
     } else {
       eventos.forEach((e) => {
         const cardHTML = `
           <div class="card-evento">
             <h3>${e.titulo}</h3>
             <p>${e.data} às ${e.hora}</p>
             <p>${e.local}</p>  
             <a href="detalhes.html?id=${e.id}" class="btn-secundario">Ver detalhes</a>
           </div>
         `;
   
         containerEventos.innerHTML += cardHTML;
       });
     }
   }
   