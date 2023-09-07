function fillTable(data) {
  var tableBody = document.querySelector("#order-table tbody");

  Object.keys(data).forEach(function (key) {
    var order = data[key];
    var row = document.createElement("tr");
    var userCell = document.createElement("td");
    var userImage = document.createElement("img");
    userImage.src = order.imagemPerfil;
    userImage.alt = "User Image";
    var userName = document.createElement("p");
    userName.textContent = order.jogador;
    userCell.appendChild(userImage);
    userCell.appendChild(userName);

    var dateCell = document.createElement("td");
    dateCell.textContent = order.data;

    var animalCell = document.createElement("td");
    animalCell.textContent = order.animal;

    var dezenaCell = document.createElement("td");
    dezenaCell.textContent = order.dezena;

    var statusCell = document.createElement("td");
    var statusSpan = document.createElement("span");
    statusSpan.className = "status " + order.status;
    statusSpan.textContent = order.status;
    statusCell.appendChild(statusSpan);

    row.appendChild(userCell);
    row.appendChild(dateCell);
    row.appendChild(animalCell);
    row.appendChild(dezenaCell);
    row.appendChild(statusCell);

    tableBody.appendChild(row);
  });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // O usuário está logado
    const uid = user.uid;
    let pollingInterval; // Variável para armazenar o intervalo de verificação contínua

    const apostasRef = firebase.database().ref('apostas');
    apostasRef.once('value').then(function(snapshot) {
      const orders = snapshot.val();
      console.log(orders); // Exemplo: Imprime o conteúdo no console            
      fillTable(orders);

      // Exibe o conteúdo da página e oculta a mensagem de carregamento
      document.getElementById("content").style.display = "block";
      document.getElementById("loading").style.display = "none";
    }).catch(function(error) {
      console.log("Erro ao obter dados de apostas:", error);
    });

  } else {
    window.location.href = "login.html";
  }
});
