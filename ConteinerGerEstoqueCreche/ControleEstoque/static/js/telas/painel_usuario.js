import { Solicitacoes, Modal } from "../componentes/classes.js";

const alertPlaceholder = document.getElementById('liveAlertPlaceholder');

const appendAlert = (message, type, timeout = 4000) => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('');

  alertPlaceholder.append(wrapper);

  setTimeout(() => {
    if (wrapper) {
      wrapper.remove();
    }
  }, timeout);
};

const solicitacoes = new Solicitacoes();
const modal = new Modal();
modal.eventoFechar();

modal.eventoBotao1(() => {
  modal.fechar();
});

modal.eventoBotao2(async () => {
  try {
    const response = await solicitacoes.fazerSolicitacao("{% url 'reset_password' %}", {
      email: '{{ user.email }}'
    }, "POST");
    console.log(response);
    modal.fechar();
    appendAlert('Link de redefinição de senha enviado para o seu email.', 'success');
  } catch (error) {
    console.error('Erro ao enviar link de redefinição de senha:', error);
    appendAlert('Erro ao enviar link de redefinição de senha.', 'danger');
  }
});

document.getElementById('resetPasswordButton').addEventListener('click', () => {
  modal.parametrizar(
    "Confirmação",
    "Tem certeza que deseja enviar o link de redefinição de senha?",
    "Cancelar",
    "Confirmar"
  );
  modal.abrir();
});
