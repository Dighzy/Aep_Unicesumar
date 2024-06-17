import {
  Modal,
  Usuarios,
  TableSorter,
  Solicitacoes,
  FormValidator,
} from "../componentes/classes.js";

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
  modal.fechar();
});

modal.eventoBotao2(async (dataId) => {
  try {
    const resposta = await solicitacoes.fazerSolicitacao(`/usuarios/${dataId}/`, {}, "DELETE");
    usuarios.removerLinhaUsuario(dataId);
    usuarios.limparUrl();
    usuarios.ocultarFormulario();
    modal.fechar();
    appendAlert('Usuário excluído com sucesso!', 'success');
  } catch (erro) {
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
  "username",
  "administrador",
];

usuarios.botaoCancelar.addEventListener("click", () =>
  formValidator.removeInvalidClass(limparCampos)
);

let botoesExcluirUsuario = document.querySelectorAll(".excluirRegistro");
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

const idsToRevalidate = ["nome", "sobrenome", "email", "senha", "username"];

idsToRevalidate.forEach((id) => {
  const field = document.getElementById(id);
  field.addEventListener("input", () => formValidator.revalidarCampo(id));
});

["usuario", "administrador"].forEach((id) => {
  const radio = document.getElementById(id);
  radio.addEventListener("change", () => formValidator.validateRadioButtons('flexRadioDefault'));
});

document.getElementById("salvar").addEventListener("click", async () => {
  const idsToValidate = ["nome", "sobrenome", "email", "username"];
  const isEditing = !!new URLSearchParams(window.location.search).get("usuario_id");

  if (!isEditing) {
    idsToValidate.push("senha");
  }

  const fieldsValid = formValidator.validateFieldsById(idsToValidate);
  const radiosValid = formValidator.validateRadioButtons('flexRadioDefault');

  if (fieldsValid && radiosValid) {
    const dadosUsuario = {
      username: document.getElementById("username").value,
      first_name: document.getElementById("nome").value,
      last_name: document.getElementById("sobrenome").value,
      email: document.getElementById("email").value,
      password: document.getElementById("senha").value,
      is_superuser: document.getElementById("administrador").checked,
    };

    if (isEditing) {
      if (!dadosUsuario.password) {
        delete dadosUsuario.password;  // Remove a senha se estiver vazia durante a edição
      }
    }

    const userId = new URLSearchParams(window.location.search).get("usuario_id");

    try {
      let resposta;
      if (userId) {
        resposta = await solicitacoes.fazerSolicitacao(`/usuarios/${userId}/`, dadosUsuario, "PATCH");
        sessionStorage.setItem('alertMessage', 'Usuário editado com sucesso!');
        sessionStorage.setItem('alertType', 'success');
      } else {
        resposta = await solicitacoes.fazerSolicitacao("/usuarios/", dadosUsuario, "POST");
        sessionStorage.setItem('alertMessage', 'Usuário incluído com sucesso!');
        sessionStorage.setItem('alertType', 'success');
      }

      window.location.reload();
    } catch (erro) {
      appendAlert('Erro ao salvar usuário: ' + erro.message, 'danger');
    }
  } else {
    appendAlert('Erro: Verifique os campos e tente novamente.', 'danger');
  }
  
});

document.addEventListener('DOMContentLoaded', function () {
  function filtrarUsuarios() {
      const input = document.getElementById('pesquisarUsuario');
      const filtro = input.value.toLowerCase();
      const tabela = document.getElementById('tabelaUsuarios');
      const linhas = tabela.getElementsByTagName('tr');

      for (let i = 1; i < linhas.length; i++) {
          const colunas = linhas[i].getElementsByTagName('td');
          let encontrou = false;
          
          for (let j = 0; j < colunas.length; j++) {
              const valor = colunas[j].textContent || colunas[j].innerText;
              if (valor.toLowerCase().indexOf(filtro) > -1) {
                  encontrou = true;
                  break;
              }
          }

          if (encontrou) {
              linhas[i].style.display = '';
          } else {
              linhas[i].style.display = 'none';
          }
      }
  }

  const inputPesquisar = document.getElementById('pesquisarUsuario');
  inputPesquisar.addEventListener('input', filtrarUsuarios);
});
