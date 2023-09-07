const nomeInput = document.getElementById('nomeInput');
const emailInput = document.getElementById('emailInput');
const senhaInput = document.getElementById('senhaInput');
const cadastrarBtn = document.getElementById('cadastrarBtn');

cadastrarBtn.addEventListener('click', function() {
  const nome = nomeInput.value;
  const email = emailInput.value;
  const senha = senhaInput.value;
  const bannerPerfil = "https://firebasestorage.googleapis.com/v0/b/jogo-do-bixo-ec257.appspot.com/o/stars-in-space-wallpaper-2560x1920_27.jpg?alt=media&token=24f2a590-847c-4deb-b8d1-7900f017bc8c";
  
  const saldo = 2; // Defina o saldo inicial aqui
  const imagemPerfil = "https://www.pngplay.com/wp-content/uploads/12/Anime-Profile-Pictures-Transparent-Images.png";

  // Cria o usuário com email e senha
  firebase.auth().createUserWithEmailAndPassword(email, senha)
    .then((userCredential) => {
      // Quando o usuário for criado com sucesso, salva as informações do usuário e a notificação no banco de dados
      const user = userCredential.user;
      const userId = user.uid;
    
      var userRef = firebase.database().ref(`users/${userId}`);

      // Salva as informações do usuário no banco de dados
      var saveUserPromise = userRef.set({
        nome: nome,
        email: email,
        senha: senha,
        id: userId,
        bannerPerfil: bannerPerfil,
        chavePix: "",
        cidade: "",
        estado: "",
        imagemPerfil: imagemPerfil,
        saldo: saldo,
        saldo_saque: "0"        
      });

      var notificationRef = firebase.database().ref(`notificacoes`);

      // Salva as informações da notificação no banco de dados
      var notification = {
        id: userId,
        mensagem: "Parabéns! Seu registro foi concluído com sucesso. A partir de agora, você faz parte da nossa comunidade. Aproveite todos os recursos e benefícios disponíveis. Bem-vindo!",
        tipo: "registro"
      };

      var saveNotificationPromise = notificationRef.push(notification);

      // Aguarda a conclusão de ambos os envios de dados
      return Promise.all([saveUserPromise, saveNotificationPromise]);
    })
    .then(function() {
      // Quando os dados forem salvos com sucesso, redireciona o usuário para index.html
      window.location = "index.html";
    })
    .catch((error) => {
      // Se ocorrer um erro ao criar o usuário, exibe uma mensagem de erro
      const errorCode = error.code;
      const errorMessage = error.message;
      alert('Erro ao criar usuário. Código do erro: ' + errorCode + '. Mensagem do erro: ' + errorMessage);
    });
});
