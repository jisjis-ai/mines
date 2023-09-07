firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // O usuário está logado
    const uid = user.uid;
    console.log("Usuário logado com o ID: " + uid);
    const copyBtn1 = document.getElementById('link1');
    const copyBtn2 = document.getElementById('link2');
    const copyBtn3 = document.getElementById('link3');

    copyBtn1.addEventListener("click", () => {
      const parametro = "valor=1";
    window.location.href = "pagamento.html?" + parametro;
    });
    copyBtn2.addEventListener("click", () => {
      const parametro = "valor=2";
    window.location.href = "pagamento.html?" + parametro;
    });
    copyBtn3.addEventListener("click", () => {
      const parametro = "valor=3";
      window.location.href = "pagamento.html?" + parametro;
    });
  } else {
    // O usuário não está logado, redirecionar para a página de login
    window.location.href = "login.html";
  }
});
