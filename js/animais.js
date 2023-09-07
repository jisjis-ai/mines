const ordem = [
  {
    "avestruz": {
      "Imagem": {
        "Logo": "images/avestruz.jpg"
      },
      "Números": [
        1,
        2,
        3,
        4
      ]
    }
  },
  {
    "aguia": {
      "Imagem": {
        "Logo": "images/aguia.jpg"
      },
      "Números": [
        5,
        6,
        7,
        8
      ]
    }
  },
  {
    "burro": {
      "Imagem": {
        "Logo": "images/burro.jpg"
      },
      "Números": [
        9,
        10,
        11,
        12
      ]
    }
  },
  {
    "borboleta": {
      "Imagem": {
        "Logo": "images/borboleta.jpg"
      },
      "Números": [
        13,
        14,
        15,
        16
      ]
    }
  },
  {
    "cachorro": {
      "Imagem": {
        "Logo": "images/cachorro.jpg"
      },
      "Números": [
        17,
        18,
        19,
        20
      ]
    }
  },
  {
    "cabra": {
      "Imagem": {
        "Logo": "images/cabra.jpg"
      },
      "Números": [
        21,
        22,
        23,
        24
      ]
    }
  },
  {
    "carneiro": {
      "Imagem": {
        "Logo": "images/carneiro.jpg"
      },
      "Números": [
        25,
        26,
        27,
        28
      ]
    }
  },
  {
    "cobra": {
      "Imagem": {
        "Logo": "images/cobra.jpg"
      },
      "Números": [
        33,
        34,
        35,
        36
      ]
    }
  },
  {
    "coelho": {
      "Imagem": {
        "Logo": "images/coelho.jpg"
      },
      "Números": [
        37,
        38,
        39,
        40
      ]
    }
  },
  {
    "cavalo": {
      "Imagem": {
        "Logo": "images/cavalo.jpg"
      },
      "Números": [
        41,
        42,
        43,
        44
      ]
    }
  },
  {
    "elefante": {
      "Imagem": {
        "Logo": "images/elefante.jpg"
      },
      "Números": [
        45,
        46,
        47,
        48
      ]
    }
  },
  {
    "galo": {
      "Imagem": {
        "Logo": "images/galo.jpg"
      },
      "Números": [
        49,
        50,
        51,
        52
      ]
    }
  },
  {
    "gato": {
      "Imagem": {
        "Logo": "images/gato.jpg"
      },
      "Números": [
        53,
        54,
        55,
        56
      ]
    }
  },
  {
    "jacare": {
      "Imagem": {
        "Logo": "images/jacare.jpg"
      },
      "Números": [
        57,
        58,
        59,
        60
      ]
    }
  },
  {
    "leao": {
      "Imagem": {
        "Logo": "images/leao.jpg"
      },
      "Números": [
        61,
        62,
        63,
        64
      ]
    }
  },
  {
    "macaco": {
      "Imagem": {
        "Logo": "images/macaco.jpg"
      },
      "Números": [
        65,
        66,
        67,
        68
      ]
    }
  },
  {
    "porco": {
      "Imagem": {
        "Logo": "images/porco.jpg"
      },
      "Números": [
        69,
        70,
        71,
        72
      ]
    }
  },
  {
    "pavao": {
      "Imagem": {
        "Logo": "images/pavao.jpg"
      },
      "Números": [
        73,
        74,
        75,
        76
      ]
    }
  },
  {
    "peru": {
      "Imagem": {
        "Logo": "images/peru.jpg"
      },
      "Números": [
        77,
        78,
        79,
        80
      ]
    }
  },
  {
    "touro": {
      "Imagem": {
        "Logo": "images/touro.jpg"
      },
      "Números": [
        81,
        82,
        83,
        84
      ]
    }
  },
  {
    "tigre": {
      "Imagem": {
        "Logo": "images/tigre.jpg"
      },
      "Números": [
        85,
        86,
        87,
        88
      ]
    }
  },
  {
    "urso": {
      "Imagem": {
        "Logo": "images/urso.jpg"
      },
      "Números": [
        89,
        90,
        91,
        92
      ]
    }
  },
  {
    "veado": {
      "Imagem": {
        "Logo": "images/veado.jpg"
      },
      "Números": [
        93,
        94,
        95,
        96
      ]
    }
  },
  {
    "vaca": {
      "Imagem": {
        "Logo": "images/vaca.jpg"
      },
      "Números": [
        97,
        98,
        99,
        0
      ]
    }
  }
];


const animalList = document.querySelector('.animal-list');
let selectedAnimal = null;
let selectedNumber = null;

for (const item of ordem) {
  for (const key in item) {
    const animal = item[key];

    const animalItem = document.createElement('div');
    animalItem.className = 'animal-item';

    const animalImage = document.createElement('img');
    animalImage.className = 'animal-image';
    animalImage.src = animal.Imagem.Logo;
    animalItem.appendChild(animalImage);

    const animalName = document.createElement('div');
    animalName.className = 'animal-name';
    animalName.textContent = key;
    animalItem.appendChild(animalName);

    const animalNumbers = document.createElement('div');
    animalNumbers.className = 'animal-numbers';
    animalNumbers.textContent = animal.Números.join(', '); // Separar os números por vírgula
    animalItem.appendChild(animalNumbers);

    animalItem.addEventListener('click', () => {
      if (!selectedAnimal) {
        animalItem.classList.add('selected');
        selectedAnimal = animalItem;

        const popupImage = document.getElementById('popup-image');
        popupImage.src = animal.Imagem.Logo;

        var animalListNumeros = document.querySelector('.animal-list-numeros');
        animalListNumeros.innerHTML = '';

        animal.Números.forEach(function(numero) {
          var numeroButton = document.createElement('button');
          numeroButton.className = 'numero-button';
          numeroButton.textContent = numero;

          numeroButton.addEventListener('click', function() {
            selectedNumber = numero;

            var numeroButtons = document.querySelectorAll('.numero-button');
            numeroButtons.forEach(function(button) {
              button.classList.remove('selected');
            });

            this.classList.add('selected');
          });

          animalListNumeros.appendChild(numeroButton);
        });

        document.getElementById('popup').style.display = 'block';
      }
    });

    animalList.appendChild(animalItem);
  }
}
window.addEventListener('load', function() { 
 var body = document.getElementsByTagName('body')[0]; 
 body.style.visibility = 'visible';
 var body = document.getElementsByTagName('body')[0]; 
 body.style.backgroundColor = '#4B0082'; // Altera a cor de fundo para vermelho
 });
 
 firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // O usuário está logado
    const uid = user.uid;
    const animalList = document.querySelector('.animal-list');
    
    const apostarButton = document.getElementById('apostar-button');
    const closeButton = document.getElementById('close-button');

    apostarButton.addEventListener('click', function() {
      if (selectedAnimal && selectedNumber) {
        console.log('Animal selecionado:', selectedAnimal.querySelector('.animal-name').textContent);
        console.log('Número selecionado:', selectedNumber);
        console.log('Imagem selecionada:', selectedAnimal.querySelector('.animal-image').src);

        const usuarioRef = firebase.database().ref('users/' + uid);

        usuarioRef.once('value').then(function(snapshot) {
          const usuarioData = snapshot.val();
          const imagemPerfil = usuarioData.imagemPerfil;
          const email = usuarioData.email;
          const nome = usuarioData.nome;
          const saldo = usuarioData.saldo;

          if (saldo >= 5) {
            const novoSaldo = saldo - 5;
            usuarioRef.update({ saldo: novoSaldo }).then(function() {
              const userRef = firebase.database().ref('apostas');
              const newUserId = userRef.push().key;

              const apostaRef = firebase.database().ref(`apostas/${newUserId}`);
              
              const currentDate = new Date();
              const currentDateString = currentDate.toLocaleDateString();
              const currentTimeString = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

              apostaRef.set({
                animal: selectedAnimal.querySelector('.animal-name').textContent,
                dezena: selectedNumber,
                id: uid,
                animalImage: selectedAnimal.querySelector('.animal-image').src,
                data: currentDateString,
                hora: currentTimeString,
                jogador: nome,
                imagemPerfil: imagemPerfil,
                status: 'pending',
                valor: '5'
              }).then(function() {
                alert('Aposta realizada com sucesso! Parabéns e boa sorte!');
                window.location.href = 'index.html';
                resetSelections();
              }).catch(function(error) {
                alert('Erro ao salvar a aposta:', error);
              });
            }).catch(function(error) {
              console.log('Erro ao atualizar o saldo do usuário:', error);
            });
          } else {
            alert('Saldo insuficiente. Por favor, recarregue sua conta antes de fazer a aposta.');
          }
        }).catch(function(error) {
          console.log('Erro ao recuperar os dados do usuário:', error);
        });
      } else {
        alert('Por favor, selecione um animal e um número antes de fazer a aposta.');
      }
    });

    closeButton.addEventListener('click', function() {
      resetSelections();
    });

    function resetSelections() {
      selectedAnimal = null;
      selectedNumber = null;

      const animalItems = document.querySelectorAll('.animal-item');
      animalItems.forEach(function(item) {
        item.classList.remove('selected');
      });

      const numeroButtons = document.querySelectorAll('.numero-button');
      numeroButtons.forEach(function(button) {
        button.classList.remove('selected');
      });

      document.getElementById('popup').style.display = 'none';
    }
  } else {
    // O usuário não está logado
    window.location.href = 'login.html';
  }
});
