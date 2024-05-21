document.addEventListener('DOMContentLoaded', function() {
  var emailInput = document.getElementById('email');
  var senhaInput = document.getElementById('senha');
  var loginButton = document.getElementById('login-button');
  var emailFeedback = document.querySelector('.invalid-feedback');
  var campoVazioFeedback = document.querySelectorAll('.campoVazio');
  var senhaCurtaFeedback = document.querySelector('.senhaCurta');
  var spinner = document.querySelector('.custom-spinner');

  function validateEmail(email) {
      var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
  }

  function validatePassword(password) {
      return password.length >= 8;
  }

  loginButton.addEventListener('click', function(event) {
      event.preventDefault(); // Previne o envio do formulário padrão
      var email = emailInput.value.trim();
      var senha = senhaInput.value.trim();
      var isEmailValid = validateEmail(email);
      var isSenhaValid = validatePassword(senha);

      if (email === '') {
          emailInput.classList.add('is-invalid');
          campoVazioFeedback[0].style.display = 'block';
          emailFeedback.style.display = 'none';
      } else {
          campoVazioFeedback[0].style.display = 'none';
          if (!isEmailValid) {
              emailInput.classList.remove('is-valid');
              emailInput.classList.add('is-invalid');
              emailFeedback.style.display = 'block';
          } else {
              emailInput.classList.remove('is-invalid');
              emailInput.classList.add('is-valid');
              emailFeedback.style.display = 'none';
          }
      }

      if (senha === '') {
          senhaInput.classList.add('is-invalid');
          campoVazioFeedback[1].style.display = 'block';
          senhaCurtaFeedback.style.display = 'none';
      } else {
          campoVazioFeedback[1].style.display = 'none';
          if (!isSenhaValid) {
              senhaInput.classList.remove('is-valid');
              senhaInput.classList.add('is-invalid');
              senhaCurtaFeedback.style.display = 'block';
          } else {
              senhaInput.classList.remove('is-invalid');
              senhaInput.classList.add('is-valid');
              senhaCurtaFeedback.style.display = 'none';
          }
      }

      if (isEmailValid && isSenhaValid) {
          spinner.style.display = 'block'; // Mostrar spinner
          loginButton.disabled = true; // Desabilitar o botão para evitar múltiplos cliques
          setTimeout(function() {
              window.location.href = '/estoque'; // Redirecionar para a página de estoque
          }, 2000); // Simulando um atraso para mostrar o spinner
      }
  });

  emailInput.addEventListener('input', function() {
      var email = emailInput.value.trim();
      var isValidEmail = validateEmail(email);

      if (email === '') {
          emailInput.classList.add('is-invalid');
          campoVazioFeedback[0].style.display = 'block';
          emailFeedback.style.display = 'none';
      } else {
          campoVazioFeedback[0].style.display = 'none';
          if (isValidEmail) {
              emailInput.classList.add('is-valid');
              emailInput.classList.remove('is-invalid');
              emailFeedback.style.display = 'none';
          } else {
              emailInput.classList.remove('is-valid');
              emailInput.classList.add('is-invalid');
              emailFeedback.style.display = 'block';
          }
      }
  });

  senhaInput.addEventListener('input', function() {
      var senha = senhaInput.value.trim();
      var isValidSenha = validatePassword(senha);

      if (senha === '') {
          senhaInput.classList.add('is-invalid');
          campoVazioFeedback[1].style.display = 'block';
          senhaCurtaFeedback.style.display = 'none';
      } else {
          campoVazioFeedback[1].style.display = 'none';
          if (isValidSenha) {
              senhaInput.classList.add('is-valid');
              senhaInput.classList.remove('is-invalid');
              senhaCurtaFeedback.style.display = 'none';
          } else {
              senhaInput.classList.remove('is-valid');
              senhaInput.classList.add('is-invalid');
              senhaCurtaFeedback.style.display = 'block';
          }
      }
  });
});
