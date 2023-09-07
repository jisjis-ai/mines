const emailInput = document.getElementById('mail');
const senhaInput = document.getElementById('pass');
const cadastrarBtn = document.getElementById('cadastrarBtn');

cadastrarBtn.addEventListener('click', function() {
  const email = emailInput.value;
  const senha = senhaInput.value;
  
  // Fazer login no Firebase Authentication
  firebase.auth().signInWithEmailAndPassword(email, senha)
    .then(function(userCredential) {
      // Login bem-sucedido
      const user = userCredential.user;
      console.log('Usuário logado:', user);

      // Redirecionar o usuário para index.html
      window.location.href = "index.html";
    })
    .catch(function(error) {
      // Ocorreu um erro durante o login
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Erro ao fazer login:', errorCode, errorMessage);
    });
});
