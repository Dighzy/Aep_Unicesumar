import {
  Modal,
  Usuarios,
  TableSorter,
  Solicitacoes,
  FormValidator,
} from "../componentes/classes.js";

const alertPlaceholder = document.getElementById('liveAlertPlaceholder');

const appendAlert = (message, type, timeout = 4000) => {
  console.log(`Appending alert with message: "${message}" of type: "${type}" for ${timeout} milliseconds.`);
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
      console.log(`Removing alert with message: "${message}"`);
      wrapper.remove();
    }
  }, timeout);
};

const displayAlertFromSession = () => {
  const message = sessionStorage.getItem('alertMessage');
  const type = sessionStorage.getItem('alertType');
  if (message && type) {
    appendAlert(message, type);
    sessionStorage.removeItem('alertMessage');
    sessionStorage.removeItem('alertType');
  }
};

window.onload = displayAlertFromSession;

let usuarios = new Usuarios();
usuarios.inicializar();

let solicitacoes = new Solicitacoes();

let modal = new Modal();
modal.eventoFechar();

modal.eventoBotao1((dataId) => {
  console.log("Botão 1 clicado, data-id:", dataId);
  modal.fechar();
});

modal.eventoBotao2(async (dataId) => {
  try {
    console.log("Botão 2 clicado, data-id:", dataId);
    const resposta = await solicitacoes.deleteUsuario(dataId);
    console.log(resposta);

    usuarios.removerLinhaUsuario(dataId);
    usuarios.limparUrl();
    usuarios.ocultarFormulario();
    modal.fechar();
    appendAlert('Usuário excluído com sucesso!', 'success');
  } catch (erro) {
    console.error("Erro ao excluir usuário:", erro);
    modal.fechar();
    appendAlert('Erro ao excluir usuário: ' + erro.message, 'danger');
  }
});

let formValidator = new FormValidator("formularioUsuario");
const limparCampos = [
  "nome",
  "sobrenome",
  "email",
  "senha",
  "username", // Adicionado
  "administrador",
];

usuarios.botaoCancelar.addEventListener("click", () =>
  formValidator.removeInvalidClass(limparCampos)
);

let botoesExcluirUsuario = document.querySelectorAll(".excluirUsuario");
botoesExcluirUsuario.forEach((botao) => {
  let dataId = botao.getAttribute("data-id");
  botao.addEventListener("click", () => {
    modal.parametrizar(
      "Confirmação",
      "Tem certeza que deseja excluir esse usuário?",
      "Cancelar",
      "Confirmar"
    );
    modal.abrir(dataId);
  });
  botao.addEventListener("click", () =>
    formValidator.removeInvalidClass(limparCampos)
  );
});

usuarios.linhasTabela.forEach((linha) => {
  linha.addEventListener("click", () => {
    formValidator.removeInvalidClass(limparCampos);
  });
});

usuarios.novoUsuario.addEventListener("click", () =>
  formValidator.removeInvalidClass(limparCampos)
);

let sorter = new TableSorter("tabelaUsuarios");
sorter.setupSorting();

const idsToRevalidate = ["nome", "sobrenome", "email", "senha", "username"]; // Adicionado

idsToRevalidate.forEach((id) => {
  const field = document.getElementById(id);
  field.addEventListener("input", () => formValidator.revalidarCampo(id));
});

["usuario", "administrador"].forEach((id) => {
  const radio = document.getElementById(id);
  radio.addEventListener("change", () => formValidator.validateUserType());
});

document.getElementById("salvar").addEventListener("click", async () => {
  const idsToValidate = ["nome", "sobrenome", "email", "username"]; // Adicionado
  const isEditing = !!new URLSearchParams(window.location.search).get("usuario_id");

  if (!isEditing) {
    idsToValidate.push("senha");
  }

  if (formValidator.validateFieldsById(idsToValidate) && formValidator.validateUserType()) {
    const dadosUsuario = {
      username: document.getElementById("username").value, // Adicionado
      first_name: document.getElementById("nome").value,
      last_name: document.getElementById("sobrenome").value,
      email: document.getElementById("email").value,
      password: document.getElementById("senha").value,
      is_superuser: document.getElementById("administrador").checked,
    };

    if (isEditing) {
      delete dadosUsuario.password; // Remover a senha se estiver em edição e não for fornecida
    }

    const userId = new URLSearchParams(window.location.search).get("usuario_id");

    try {
      let resposta;
      if (userId) {
        resposta = await solicitacoes.patchUsuario(userId, dadosUsuario);
        sessionStorage.setItem('alertMessage', 'Usuário editado com sucesso!');
        sessionStorage.setItem('alertType', 'success');
        usuarios.preencherFormulario(dadosUsuario); // Manter valores no formulário após edição
      } else {
        resposta = await solicitacoes.postUsuario(dadosUsuario);
        sessionStorage.setItem('alertMessage', 'Usuário incluído com sucesso!');
        sessionStorage.setItem('alertType', 'success');
        usuarios.preencherFormulario(dadosUsuario); // Manter valores no formulário após inclusão
      }
      console.log(resposta);

      window.location.reload();
    } catch (erro) {
      console.error("Erro ao salvar usuário:", erro);
      appendAlert('Erro ao salvar usuário: ' + erro.message, 'danger');
    }
  }
});
