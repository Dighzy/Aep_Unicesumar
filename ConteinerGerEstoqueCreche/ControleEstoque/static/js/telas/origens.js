import { Modal, TableSorter, Solicitacoes, FormValidator } from "../componentes/classes.js";

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
    const resposta = await solicitacoes.fazerSolicitacao(`/origens/${dataId}/`, {}, "DELETE");
    console.log(resposta);

    removerLinhaCategoria(dataId);
    window.history.replaceState({}, "", window.location.pathname); // Remove todos os parâmetros de consulta
    document.querySelector(".custom-col-height").classList.add("d-none");
    modal.fechar();
    appendAlert('Origem excluída com sucesso!', 'success');
  } catch (erro) {
    console.error("Erro ao excluir origem:", erro);
    modal.fechar();
    appendAlert('Erro ao excluir origem: ' + erro.message, 'danger');
  }
});

let formValidator = new FormValidator("formularioOrigens");
const limparCampos = ["codigo", "descricao"];

const removerLinhaCategoria = (dataId) => {
  const linha = document.getElementById(dataId);
  if (linha) {
    linha.remove();
  }
};

document.getElementById("cancelar").addEventListener("click", () => {
  formValidator.removeInvalidClass(limparCampos);
  window.history.replaceState({}, "", window.location.pathname); // Remove todos os parâmetros de consulta
  document.querySelector(".custom-col-height").classList.add("d-none");
});

document.querySelectorAll(".excluirCategoriaMovimentacao").forEach((botao) => {
  let dataId = botao.getAttribute("data-id");
  botao.addEventListener("click", () => {
    modal.parametrizar(
      "Confirmação",
      "Tem certeza que deseja excluir essa origem?",
      "Cancelar",
      "Confirmar"
    );
    modal.abrir(dataId);
  });
  botao.addEventListener("click", () => formValidator.removeInvalidClass(limparCampos));
});

document.querySelectorAll("table tbody tr").forEach((linha) => {
  linha.addEventListener("click", (event) => {
    formValidator.removeInvalidClass(limparCampos);
    const dataId = event.currentTarget.getAttribute("id"); // Pegando o id da linha da tabela
    if (dataId) {
      var params = new URLSearchParams(window.location.search);
      params.set("origem_id", dataId);
      window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
      
      // Preencher o formulário com os dados da linha
      const codigo = linha.cells[0].textContent.trim();
      const descricao = linha.cells[1].textContent.trim();
      const tipoMovimento = linha.cells[2].textContent.trim();

      document.getElementById('codigo').value = codigo;
      document.getElementById('descricao').value = descricao;
      document.querySelector(`input[name="tipo_movimento"][value="${tipoMovimento}"]`).checked = true;
      
      // Mostrar o formulário
      document.querySelector(".custom-col-height").classList.remove("d-none");
    } else {
      console.error('data-id not found on the clicked row');
    }
  });
});

document.getElementById("nova").addEventListener("click", () => {
  formValidator.removeInvalidClass(limparCampos);
  document.getElementById('formularioOrigens').classList.remove("d-none");
  limparCampos.forEach((id) => document.getElementById(id).value = "");
  document.querySelectorAll('input[name="tipo_movimento"]').forEach((radio) => {
    radio.checked = false;
  });
  window.history.replaceState({}, "", window.location.pathname); // Remove todos os parâmetros de consulta
});

let sorter = new TableSorter("origensLancamento");
sorter.setupSorting();

const idsToRevalidate = ["codigo", "descricao"];

idsToRevalidate.forEach((id) => {
  const field = document.getElementById(id);
  field.addEventListener("input", () => formValidator.revalidarCampo(id));
});

document.querySelectorAll('input[name="tipo_movimento"]').forEach((radio) => {
  radio.addEventListener("change", () => formValidator.validateRadioButtons('tipo_movimento'));
});

document.getElementById("salvar").addEventListener("click", async () => {
  const idsToValidate = ["codigo", "descricao"];
  const origemId = new URLSearchParams(window.location.search).get("origem_id");
  const isEditing = !!origemId;

  const hasInvalidClass = () => {
      const allFields = [...document.querySelectorAll('input')];
      return allFields.some(field => field.classList.contains('is-invalid'));
  };

  console.log('Validando campos:', idsToValidate);
  const fieldsValid = formValidator.validateFieldsById(idsToValidate);
  const radiosValid = formValidator.validateRadioButtons('tipo_movimento');
  console.log('Campos válidos:', fieldsValid);
  console.log('Radios válidos:', radiosValid);

  if (!hasInvalidClass()) {
      const radioChecked = document.querySelector('input[name="tipo_movimento"]:checked');
      const dadosOrigem = {
          codigo: document.getElementById("codigo").value,
          descricao: document.getElementById("descricao").value,
          tipo_de_movimento: radioChecked ? radioChecked.value : null
      };

      if (!radioChecked) {
          console.log('Validation failed: No radio button checked');
          appendAlert('Erro: Selecione um tipo de movimento.', 'danger');
          return;
      }

      try {
          let resposta;
          if (isEditing) {
              console.log('Enviando solicitação PATCH para atualizar a origem com ID:', origemId);
              console.log('Dados enviados:', JSON.stringify(dadosOrigem));
              resposta = await solicitacoes.fazerSolicitacao(`/origens/${origemId}/`, dadosOrigem, "PATCH");

              if (resposta.status === 'error') {
                  appendAlert(resposta.message, 'danger');
                  return;
              }

              sessionStorage.setItem('alertMessage', 'Origem editada com sucesso!');
              sessionStorage.setItem('alertType', 'success');
              
              // Atualizar o valor do parâmetro de consulta com o novo valor de código
              const params = new URLSearchParams(window.location.search);
              params.set('origem_id', dadosOrigem.codigo);
              window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
          } else {
              console.log('Enviando solicitação POST para criar nova origem');
              resposta = await solicitacoes.fazerSolicitacao("/origens/", dadosOrigem, "POST");

              if (resposta.status === 'error') {
                  appendAlert(resposta.message, 'danger');
                  return;
              }

              sessionStorage.setItem('alertMessage', 'Origem incluída com sucesso!');
              sessionStorage.setItem('alertType', 'success');
          }

          console.log(resposta);
          window.location.reload();
      } catch (erro) {
          console.error('Erro ao salvar origem:', erro);
          appendAlert('Erro ao salvar origem: ' + erro.message, 'danger');
      }
  } else {
      console.log('Validation failed');
      appendAlert('Erro: Verifique os campos e tente novamente.', 'danger');
  }
});





