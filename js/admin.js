firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // O usuário está conectado
    const uid = user.uid;

    // Obtendo referências para os elementos do DOM na seção "Notificação Global"
    const globalTituloInput = document.getElementById('global-titulo-input');
    const globalMensagemInput = document.getElementById('global-mensagem-input');
    const globalEnviarButton = document.getElementById('global-enviar-button');

    // Adicionando evento de clique ao botão na seção "Notificação Global"
    globalEnviarButton.addEventListener('click', function () {
      // Obtendo os valores dos inputs na seção "Notificação Global"
      const globalTitulo = globalTituloInput.value;
      const globalMensagem = globalMensagemInput.value;

      var notificationRef = firebase.database().ref(`notificacoes`);

      // Salva as informações da notificação no banco de dados
      var notification = {
        id: "x",
        mensagem: globalMensagem,
        tipo: globalTitulo
      };

      var saveNotificationPromise = notificationRef.push(notification);
      alert("Notificação enviada com sucesso!");


      // Limpar os inputs da seção "Notificação Global" após a ação
      globalTituloInput.value = '';
      globalMensagemInput.value = '';
    });

    // Obtendo referências para os elementos do DOM na seção "Notificação para Usuário Específico"
    const especificoTituloInput = document.getElementById('especifico-titulo-input');
    const especificoMensagemInput = document.getElementById('especifico-mensagem-input');
    const especificoRefIdInput = document.getElementById('especifico-refid-input');
    const especificoEnviarButton = document.getElementById('especifico-enviar-button');

    // Adicionando evento de clique ao botão na seção "Notificação para Usuário Específico"
    especificoEnviarButton.addEventListener('click', function () {
      // Obtendo os valores dos inputs na seção "Notificação para Usuário Específico"
      const especificoTitulo = especificoTituloInput.value;
      const especificoMensagem = especificoMensagemInput.value;
      const especificoRefId = especificoRefIdInput.value;

      var notificationRef = firebase.database().ref(`notificacoes`);

      // Salva as informações da notificação no banco de dados
      var notification = {
        id: especificoRefId,
        mensagem: especificoMensagem,
        tipo: especificoTitulo
      };

      var saveNotificationPromise = notificationRef.push(notification);
      alert("Notificação enviada com sucesso!");

      // Limpar os inputs da seção "Notificação para Usuário Específico" após a ação
      especificoTituloInput.value = '';
      especificoMensagemInput.value = '';
      especificoRefIdInput.value = '';
    });
    /*  */

  } else {
    // O usuário não está conectado
    // Redirecionar para a página de login
    window.location.href = 'login.html';
  }
});


document.addEventListener('DOMContentLoaded', function () {
  // Selecione o botão
  var button = document.querySelector('.draw-button');

  // Adicione um evento de clique ao botão
  button.addEventListener('click', function () {
    // Exibir o alerta

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is logged in
        const uid = user.uid;
        const apostasRef = firebase.database().ref('apostas');
        const animaisRef = firebase.database().ref('animais');

        animaisRef.once('value')
          .then(snapshot => {
            const animais = snapshot.val();

            // Listen for changes in data
            apostasRef.on('value', function (snapshot) {
              const valorApostas = snapshot.val();
              const animals = valorApostas;

              const resultados = [];

              snapshot.forEach(function (childSnapshot) {
                const apostaKey = childSnapshot.key;
                const apostaData = childSnapshot.val();
                const animal = apostaData.animal;
                const dezena = apostaData.dezena;
                const id = apostaData.id;
                const jogador = apostaData.jogador;

                const apostaJson = {
                  animal: animal,
                  dezena: dezena,
                  id: id,
                  jogador: jogador
                };

                resultados.push(apostaJson);
              });

              // Process the resultados array
              console.log(resultados);
              console.log(animais);

              // Função para realizar o sorteio
              function sortearAnimalENumero() {
                // Obter uma lista de todas as chaves do objeto de animais
                var chavesAnimais = Object.keys(animais);

                // Selecionar aleatoriamente um animal
                var animalSorteado = chavesAnimais[Math.floor(Math.random() * chavesAnimais.length)];

                // Obter a lista de números correspondentes ao animal sorteado
                var numeros = animais[animalSorteado]["Números"];

                // Selecionar aleatoriamente um número
                var numeroSorteado = numeros[Math.floor(Math.random() * numeros.length)];

                // Retornar o animal e o número sorteado
                return {
                  "animal": animalSorteado,
                  "número": numeroSorteado
                };
              }

              // Exemplo de uso
              var resultadoSorteio = sortearAnimalENumero();
              console.log("Animalsorteado: " + resultadoSorteio.animal);
              console.log("Número sorteado: " + resultadoSorteio.número);

              var listaApostas = resultados;

              var animalSorteado = resultadoSorteio.animal;
              var numeroSorteado = resultadoSorteio.número;

              var valorGanho = 100; // Substitua 100 pelo valor correto que o jogador ganhou

              var jogadoresAcertaram = [];
              var jogadoresErraram = [];

              for (var i = 0; i < listaApostas.length; i++) {
                var aposta = listaApostas[i];
                if (aposta.animal === animalSorteado && aposta.dezena === numeroSorteado) {
                  jogadoresAcertaram.push(aposta);
                } else {
                  jogadoresErraram.push(aposta);
                }
              }

              console.log("Jogadores que acertaram:");
              console.log(JSON.stringify(jogadoresAcertaram, null, 2));

              console.log("Jogadores que erraram:");
              console.log(JSON.stringify(jogadoresErraram, null, 2));

              var mensagemPerdaAposta = "Lamentamos informar que você perdeu uma aposta. Infelizmente, nem sempre podemos obter os resultados desejados em nossas apostas. Entendemos que isso possa ser decepcionante, mas faz parte do jogo.\n\n" +
                "Lembre-se de que apostas e jogos de azar sempre envolvem riscos, e nem sempre podemos sair vitoriosos. É importante manter uma mentalidade equilibrada e responsável ao participar de apostas.\n\n" +
                "Não se desanime! A sorte pode mudar a qualquer momento, e novas oportunidades surgirão. Continue se divertindo, aprendendo com cada experiência e tomando decisões conscientes em suas próximas apostas.\n\n" +
                "Se você precisar de mais informações ou tiver alguma dúvida, não hesite em entrar em contato conosco. Estamos aqui para ajudar.\n\n" +
                "Obrigado pela sua compreensão.\n\n" +
                "Atenciosamente,\n" +
                "midsetpro";

              var mensagemAcertoAposta = "Parabéns! Você acertou uma aposta. É ótimo ver sua sorte em ação e esperamos que você continue aproveitando nossos jogos e apostas.\n\n" +
                "Lembre-se de manter uma mentalidade responsável e equilibrada ao jogar. Aproveite seus ganhos e divirta-se, mas sempre jogue com responsabilidade.\n\n" +
                "Se tiver alguma dúvida ou precisar de suporte adicional, fique à vontade para entrar em contato conosco.\n\n" +
                "Mais uma vez, parabéns!\n\n" +
                "Atenciosamente,\n" +
                "midsetpro";

              var notificationRef = firebase.database().ref('notificacoes');
              var usersRef = firebase.database().ref('users');

              jogadoresErraram.forEach(function (item) {
                var notification = {
                  id: item.id,
                  mensagem: mensagemPerdaAposta,
                  tipo: "aviso de aposta"
                };

                notificationRef.push(notification);
              });

              jogadoresAcertaram.forEach(function (item) {
                var notification = {
                  id: item.id,
                  mensagem: mensagemAcertoAposta,
                  tipo: "aviso de aposta"
                };

                notificationRef.push(notification);

                // Atualizar saldo_saque para o usuário
                usersRef.child(item.id).once('value', function (snapshot) {
                  var user = snapshot.val();
                  if (user && user.saldo_saque) {
                    var saldoAtual = parseFloat(user.saldo_saque);
                    var novoSaldo = saldoAtual + valorGanho;

                    usersRef.child(item.id).update({ saldo_saque: novoSaldo });
                  }
                });
              });

              alert('Sorteio realizado!');
            });
          });
      } else {
        // User is not logged in, redirect to login page
        window.location.href = 'login.html';
      }
    });
  });
});