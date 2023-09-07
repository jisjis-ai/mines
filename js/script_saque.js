var enviarPedidoBtn = document.getElementById("enviarPedidoBtn");

var quantiaInput = document.getElementById("quantia");
var debounceTimeout;
var valorQuantia = ""; // Variável para armazenar o valor não formatado

quantiaInput.addEventListener("input", function(event) {
  clearTimeout(debounceTimeout); // Limpa o timeout anterior

  // Atualiza o valor não formatado
  valorQuantia = event.target.value;

  // Inicia um novo timeout para aguardar 500ms após a última entrada do usuário
  debounceTimeout = setTimeout(function() {
    var inputValue = event.target.value;

    // Remove todos os caracteres não numéricos
    var numericValue = inputValue.replace(/\D/g, '');

    // Converte o valor numérico para formato de dinheiro
    var formattedValue = formatarDinheiro(numericValue);

    // Atualiza o valor do campo com a formatação de dinheiro
    event.target.value = formattedValue;
  }, 500); // Aguarda 500ms após a última entrada do usuário
});

function formatarDinheiro(valor) {
  // Verifica se o valor é vazio ou não numérico
  if (!valor || isNaN(valor)) {
    return '';
  }

  // Converte para número e formata como dinheiro
  var numero = parseFloat(valor);
  var formato = {
    style: 'currency',
    currency: 'BRL'
  };

  // Retorna o valor formatado
  return numero.toLocaleString('pt-BR', formato);
}

// Exemplo de uso do valor não formatado
enviarPedidoBtn.addEventListener("click", function(event) {
  event.preventDefault();

  // Use a variável valorQuantia para obter o valor não formatado
  console.log("Valor não formatado:", valorQuantia);
});


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // O usuário está logado
    const uid = user.uid;

    // Adiciona um evento de clique ao botão
    enviarPedidoBtn.addEventListener("click", function(event) {
      event.preventDefault(); // Impede o envio do formulário

      // Obtém o valor selecionado no campo de seleção de tipo PIX
      var tipoPix = document.getElementById("tipoPix").value;

      // Verifica se nenhuma opção foi selecionada
      if (tipoPix === "") {
        alert("Por favor, selecione o tipo de chave PIX."); // Exibe um alerta
        return; // Encerra a função para impedir o envio do formulário
      }

      // Se uma opção foi selecionada, continua com o processamento do formulário
      var nome = document.getElementById("nome").value;
      var chavePix = document.getElementById("chavePix").value;
      var quantia = valorQuantia; // Use a variável valorQuantia como o valor não formatado

      const apostasRef = firebase.database().ref('users/' + uid);

      // Obtém o valor da chave "saldo_saque" do banco de dados
      apostasRef.child('saldo_saque').once('value').then(function(snapshot) {
        var saldoSaque = snapshot.val();

        // Verifica se o saldo_saque é maior ou igual a 15
        if (saldoSaque >= 15) {
          if (quantia <= saldoSaque) {
            // Cria um novo nó no banco de dados para salvar as informações do saque
            const saquesRef = firebase.database().ref('saques');
            
            // Define os dados a serem salvos
            var dadosSaque = {
              nome: nome,
              tipoPix: tipoPix,
              chavePix: chavePix,
              quantia: quantia,
              refId: uid,
              timestamp: firebase.database.ServerValue.TIMESTAMP
            };

            // Salva os dados do saque no Firebase
            saquesRef.push(dadosSaque, function(error) {
              if (error) {
                console.log(error); // Manipule o erro, se ocorrer
              } else {
                alert("Pedido de saque realizado com sucesso!");
                // Atualiza o valor de saldo_saque no Firebase
                apostasRef.update({ saldo_saque: saldoSaque - quantia });
                setTimeout(function() {
                  window.location.href = "index.html";
                }, 5000); // 5000 milissegundos = 5 segundos
              }
            });
          } else {
            alert("Não é possível prosseguir com o pedido. O valor que deseja retirar não está disponível ou inexistente.");
          }
        } else {
          alert("Saldo de saque abaixo de R$ 15,00. Não é possível prosseguir com o pedido.");
        }
      }).catch(function(error) {
        console.log(error); // Manipule o erro, se ocorrer
      });
    });
  } else {
    // O usuário não está logado, faça o que for necessário nesse caso
    // Por exemplo, redirecione-o para a página de login
    window.location.href = "login.html";
  }
});
