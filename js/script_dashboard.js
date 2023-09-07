const header = document.querySelector("[data-header]");
const navToggleBtn = document.querySelector("[data-menu-toggle-btn]");
const menuBtn = document.querySelectorAll("[data-menu-btn]");
const loadMoreBtn = document.querySelector("[data-load-more]");
const imgElement = document.querySelector('img');
const profileTitleElement = document.querySelector('.profile-title');
const cardTitleElement = document.querySelector('.card-title');
const textElement = document.querySelector('.text');
const articleTitleElement = document.querySelector('.h2.article-title');
const articleSubtitleElement = document.querySelector('.article-subtitle');
const profileSubtitleElement = document.querySelector('.profile-subtitle');
const cardSubtitleElement = document.querySelector('.card-subtitle');
const imgPerfilUnico = document.getElementById('perfilunico');
const cardPriceElement = document.querySelector('.card-price');
const inputImagem = document.getElementById("inputImagem");
const apostasRef = firebase.database().ref('notificacoes');
var notificationDiv = document.querySelector(".notification");
var popupOverlay = document.getElementById("popupOverlay");
var popupTitle = document.getElementById("popupTitle");
var popupMessages = document.getElementById("popupMessages");
var closeButton = document.getElementById("closeButton");
const statusRef = firebase.database().ref('bloqueioAposta');

statusRef.on('value', (snapshot) => {
  const status = snapshot.val().ativo;

  if (status === true) {
    document.getElementById('li-aposta-btn').style.display = 'none';
  } else {
    document.getElementById('li-aposta-btn').style.display = 'block';
  }
});

navToggleBtn.addEventListener("click", function() {
  header.classList.toggle("active");
});

for (let i = 0; i < menuBtn.length; i++) {
  menuBtn[i].addEventListener("click", function() {
    this.nextElementSibling.classList.toggle("active");
  });
}

loadMoreBtn.addEventListener("click", function() {
  this.classList.toggle("active");
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    const uid = user.uid;
    const usuarioRef = firebase.database().ref('users/' + uid);

    usuarioRef.once('value').then(function(snapshot) {
      const imagemPerfil = snapshot.val().imagemPerfil;
      const email = snapshot.val().email;
      const nome = snapshot.val().nome;
      const saldo = snapshot.val().saldo;
      const cidade = snapshot.val().cidade;
      const saldo_retirada = snapshot.val().saldo_saque;

      window.addEventListener('load', function() {
        document.body.style.display = 'block';
      });

      imgElement.src = imagemPerfil;
      imgElement.alt = nome;

      profileTitleElement.textContent = nome;
      cardTitleElement.textContent = nome;
      textElement.textContent = email;

      articleTitleElement.textContent = 'Olá ' + nome;
      articleSubtitleElement.textContent = 'Bem-vinda ao Painel!';

      profileSubtitleElement.textContent = 'Jogador';

      const saldoFormatado = 'R$ ' + saldo.toLocaleString('pt-BR');
      cardSubtitleElement.textContent = saldoFormatado;

      imgPerfilUnico.src = imagemPerfil;

      cardPriceElement.textContent = 'R$ ' + saldo_retirada.toLocaleString('pt-BR');

      inputImagem.addEventListener("change", function(event) {
        const arquivo = event.target.files[0];
        const leitor = new FileReader();
        leitor.onload = function(e) {
          const imagemDataUrl = e.target.result;

          const storageRef = firebase.storage().ref();
          const nomeArquivo = arquivo.name;
          const imagemRef = storageRef.child(nomeArquivo);
          const uploadTask = imagemRef.putString(imagemDataUrl, 'data_url');

          uploadTask.then(function(snapshot) {
            return snapshot.ref.getDownloadURL();
          }).then(function(downloadURL) {
            console.log("URL da imagem:", downloadURL);

            const usuarioRef = firebase.database().ref('users/' + uid);
            usuarioRef.update({
              imagemPerfil: downloadURL
            }).then(function() {
              console.log("Imagem de perfil atualizada no banco de dados.");
            }).catch(function(error) {
              console.error("Erro ao atualizar a imagem de perfil:", error);
            });
          }).catch(function(error) {
            alert("Erro ao enviar a imagem: " + error);
          });
        };
        leitor.readAsDataURL(arquivo);
      });

      imgPerfilUnico.addEventListener("click", function() {
        inputImagem.click();
      });

      document.body.style.display = 'block';

      apostasRef.once('value', function(snapshot) {
        const json = snapshot.val();
        var jsonData = json;

        if (jsonData && Object.keys(jsonData).length > 0) { // Verificar se o objeto não é vazio
          var listaFiltrada = Object.values(jsonData).filter(function(jogo) {
            return jogo.id === uid || jogo.id === "x";
          });

          console.log("Lista filtrada:", listaFiltrada);

          if (listaFiltrada.length !== 0) {
            console.log("O resultado é diferente de zero. Exibindo mensagem...");
            var spanElement = document.getElementsByClassName("notification-badge")[0];
            spanElement.innerHTML = listaFiltrada.length;
            var messages = listaFiltrada;

            notificationDiv.addEventListener("click", function() {
              popupTitle.textContent = "Mensagens";
              popupMessages.innerHTML = "";

              messages.forEach(function(message) {
                var messageDiv = document.createElement("div");
                messageDiv.classList.add("message");

                var tipoSpan = document.createElement("span");
                tipoSpan.textContent = message.tipo;
                tipoSpan.style.fontWeight = "bold";

                var mensagemSpan = document.createElement("span");
                mensagemSpan.textContent = message.mensagem;

                messageDiv.appendChild(tipoSpan);
                messageDiv.appendChild(document.createElement("br"));
                messageDiv.appendChild(mensagemSpan);

                popupMessages.appendChild(messageDiv);
              });

              header.classList.toggle("active");
              popupOverlay.style.visibility = "visible";
              popupOverlay.style.opacity = "1";
            });

            closeButton.addEventListener("click", function(event) {
              event.stopPropagation();
              closePopup();
            });

            popupOverlay.addEventListener("click", function(event) {
              if (event.target === popupOverlay) {
                closePopup();
              }
            });

            function closePopup() {
              popupOverlay.style.visibility = "hidden";
              popupOverlay.style.opacity = "0";
            }
          } else {
            console.log("O resultado é igual a zero. Exibindo outra mensagem...");
          }
        } else {
          console.log("O objeto jsonData está vazio ou undefined/null.");
        }
      });
    }).catch(function(error) {
      // Tratamento de erros, se necessário
    });
  } else {
    window.location.href = "login.html";
  }
});
