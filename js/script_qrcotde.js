firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // O usuário está logado
    const uid = user.uid;
    let pollingInterval; // Variável para armazenar o intervalo de verificação contínua

    const usuarioRef = firebase.database().ref('users/' + uid);
    usuarioRef.once('value').then(function(snapshot) {
      saldo = snapshot.val().saldo || 0;
      nome = snapshot.val().nome || "Usuário";
      email = snapshot.val().email;

      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const valor = urlParams.get('valor');

      let valorDaTransacao;

      if (valor === '1') {
        valorDaTransacao = 10;
      } else if (valor === '2') {
        valorDaTransacao = 50;
      } else if (valor === '3') {
        valorDaTransacao = 150;
      } else {
        // Valor inválido ou ausente na URL, redirecionar para outra página
        window.location.href = 'planos.html';
        return; // Encerra a execução da função para evitar que o código continue sendo executado
      }

      const request = new XMLHttpRequest();
      const url = "https://api.mercadopago.com/v1/payments";
      const access_token = "APP_USR-7593122838679417-040217-5818fb9652ed88031d5f8792d5d356d4-453190855";

      const data = JSON.stringify({
        "transaction_amount": valorDaTransacao,
        "description": "adicione dinheiro à sua conta para fazer apostas no jogo do bixo",
        "payment_method_id": "pix",
        "payer": {
          "email": email,
          "first_name": nome
        }
      });

      request.open("POST", url, true);
      request.setRequestHeader("Content-Type", "application/json");
      request.setRequestHeader("Authorization", "Bearer " + access_token);

      request.onreadystatechange = function() {
        if (request.readyState === 4) {
          if (request.status === 201) {
            responseJSON = JSON.parse(request.responseText);
            const base64QRCode = responseJSON.point_of_interaction;
            const bankInfo = base64QRCode.transaction_data;
            const mpr = bankInfo.qr_code;
            const qrCodeBase64 = bankInfo.qr_code_base64;
            const qrCodeText = atob(qrCodeBase64);
            
            // Obtenha o elemento de imagem pelo seu ID
            var minhaImagem = document.getElementById("minha-imagem");

            // Defina o atributo src da imagem com o URL base64
            minhaImagem.src = "data:image/png;base64," + qrCodeBase64;

            if (responseJSON.status === "approved") {
              console.log("Pagamento aprovado!");

              // Obtém a referência do usuário no banco de dados do Firebase
              const usuarioRef = firebase.database().ref('users/' + uid);

              // Obtém o valor atual da chave "saldo"
              usuarioRef.child('saldo').once('value', function(snapshot) {
                const saldoAtual = snapshot.val();

                // Calcula o novo saldo somando o valor da transação
                const novoSaldo = saldoAtual + valorDaTransacao;

                // Atualiza o valor da chave "saldo" usando o método "set"
                usuarioRef.child('saldo').set(novoSaldo, function(error) {
                  if (error) {
                    // Se ocorrer um erro durante a atualização, exibe uma mensagem de erro
                    console.log('Erro ao atualizar saldo:', error);
                  } else {
                    // Se a atualização for concluída com sucesso
                    window.location.href = 'index.html';
                  }
                });
              });

              // Cancela a verificação contínua, pois o pagamento foi aprovado
              clearInterval(pollingInterval);

            } else {
              console.log("Pagamento não aprovado.");

              // Inicia a verificação contínua do status de pagamento
              startPaymentStatusPolling(responseJSON.id);
            }
          } else {
            console.log("Erro ao processar pagamento. Status: " + request.status);
          }
        }
      };

      request.send(data);
    });
  } else {
    // O usuário não está logado, redirecionar para a página de login
    window.location.href = "login.html";
  }
});

function startPaymentStatusPolling(paymentId) {
  const pollInterval = 5000; // Intervalo de tempo entre as consultas (5 segundos neste exemplo)
  pollingInterval = setInterval(function() {
    const checkPaymentStatusRequest = new XMLHttpRequest();
    const checkPaymentStatusUrl = "https://api.mercadopago.com/v1/payments/" + paymentId;
    const access_token = "TEST-7593122838679417-040217-aa215724c4a8bec134db8936549b2498-453190855";

    checkPaymentStatusRequest.open("GET", checkPaymentStatusUrl, true);
    checkPaymentStatusRequest.setRequestHeader("Content-Type", "application/json");
    checkPaymentStatusRequest.setRequestHeader("Authorization", "Bearer " + access_token);

    checkPaymentStatusRequest.onreadystatechange = function() {
      if (checkPaymentStatusRequest.readyState === 4) {
        if (checkPaymentStatusRequest.status === 200) {
          const paymentStatusResponse = JSON.parse(checkPaymentStatusRequest.responseText);
          if (paymentStatusResponse.status === "approved") {
            console.log("Pagamento aprovado!");

            // Obtém a referência do usuário no banco de dados do Firebase
            const uid = firebase.auth().currentUser.uid;
            const usuarioRef = firebase.database().ref('users/' + uid);

            // Obtém o valor atual da chave "saldo"
            usuarioRef.child('saldo').once('value', function(snapshot) {
              const saldoAtual = snapshot.val();

              // Calcula o novo saldo somando o valor da transação
              const novoSaldo = saldoAtual + valorDaTransacao;

              // Atualiza o valor da chave "saldo" usando o método "set"
              usuarioRef.child('saldo').set(novoSaldo, function(error) {
                if (error) {
                  // Se ocorrer um erro durante a atualização, exibe uma mensagem de erro
                  console.log('Erro ao atualizar saldo:', error);
                } else {
                  // Se a atualização for concluída com sucesso, redireciona o usuário para outra URL
                  window.location.href = 'index.html';
                }
              });
            });

            // Cancela a verificação contínua, pois o pagamento foi aprovado
            clearInterval(pollingInterval);

          } else if (paymentStatusResponse.status === "pending" || paymentStatusResponse.status === "in_process") {
            console.log("Aguardando aprovação do pagamento...");
            // Continue aguardando a aprovação do pagamento
          } else {
            console.log("Pagamento não aprovado.");

            // Cancela a verificação contínua, pois o pagamento não foi aprovado
            clearInterval(pollingInterval);
          }
        } else {
          console.log("Erro ao verificar o status do pagamento. Status: " + checkPaymentStatusRequest.status);
        }
      }
    };

    checkPaymentStatusRequest.send();
  }, pollInterval);
}
