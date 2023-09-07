firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // O usuário está logado
    const uid = user.uid;

    const apostasRef = firebase.database().ref('apostas');

    // Exibir o JSON no console
    apostasRef.once('value', function(snapshot) {
      const json = snapshot.val();
      var jsonData = json
      
      var titulo = document.querySelector('.modal__title');
      var descricao = document.querySelector('.modal__description');
      const modalContainer = document.getElementById('modal-container');

      // Filtrando os elementos do JSON
      var listaFiltrada = Object.values(jsonData).filter(function (jogo) {
        return jogo.id === uid && jogo.status === "completed";
      });

      // Obtendo o número de jogadas ganhas
      var numeroJogadasGanhas = listaFiltrada.length;

      // Exibindo o número de jogadas ganhas para o usuário
      console.log("Número de jogadas ganhas: " + numeroJogadasGanhas);
      
      // Atualizando o texto do modal com o número de jogadas ganhas
      titulo.textContent = "Parabéns!";
      descricao.textContent = "Você ganhou " + numeroJogadasGanhas + " jogada(s). Seu prêmio será adicionado à sua conta de saque em até 24 horas.";

      modalContainer.classList.add('show-modal');

      const closeBtn = document.querySelectorAll('.close-modal');

      function closeModal() {
        modalContainer.classList.remove('show-modal');
      }

      closeBtn.forEach(c => c.addEventListener('click', closeModal));
    });
  } else {
    // O usuário não está logado, faça o que for necessário nesse caso
    // Por exemplo, redirecione-o para a página de login
    window.location.href = "login.html";
  }
});

    function redirecionar() {
    window.location.href = "historicos_aposta.html";
    }
