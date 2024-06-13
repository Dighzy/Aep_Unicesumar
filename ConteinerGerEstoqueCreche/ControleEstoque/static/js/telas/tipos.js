import { Modal, TableSorter, Solicitacoes } from "../componentes/classes.js";

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

let sorter = new TableSorter("CE_Tipo");
let solicitacoes = new Solicitacoes();
sorter.setupSorting();

document.getElementById("salvar").addEventListener("click", async () => {
  const codigo = document.getElementById('codigo').value;
  const descricao = document.getElementById('descricao').value;

  let isValid = true;

  if (!codigo.trim()) {
    document.getElementById('codigo').classList.add('is-invalid');
    isValid = false;
  } else {
    document.getElementById('codigo').classList.remove('is-invalid');
  }

  if (!descricao.trim()) {
    document.getElementById('descricao').classList.add('is-invalid');
    isValid = false;
  } else {
    document.getElementById('descricao').classList.remove('is-invalid');
  }

  if (!isValid) {
    appendAlert('Erro: Verifique os campos e tente novamente.', 'danger');
    return;
  }

  const data = {
    codigo: codigo,
    descricao: descricao
  };

  try {
    const tipoId = new URLSearchParams(window.location.search).get('tipo_id');
    const url = new URL(window.location);
    if (tipoId) {
      await solicitacoes.fazerSolicitacao(`/tipos/${tipoId}/`, data, "PUT");
      sessionStorage.setItem('alertMessage', 'Tipo editado com sucesso!');
      sessionStorage.setItem('alertType', 'success');
    } else {
      await solicitacoes.fazerSolicitacao('/tipos/', data, "POST");
      sessionStorage.setItem('alertMessage', 'Tipo incluído com sucesso!');
      sessionStorage.setItem('alertType', 'success');
    }
    url.searchParams.delete('tipo_id');
    window.history.pushState({}, '', url);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  } catch (error) {
    console.error('Erro ao salvar tipo:', error);
    appendAlert('Erro ao salvar tipo: ' + error.message, 'danger');
  }
});

let modal = new Modal();
modal.eventoFechar();

modal.eventoBotao1((dataId) => {
  modal.fechar();
});

modal.eventoBotao2(async (dataId) => {
  modal.fechar(); // Fechar a modal imediatamente após clicar no botão de confirmação
  try {
    await solicitacoes.fazerSolicitacao(`/tipos/${dataId}/`, {}, "DELETE");
    sessionStorage.setItem('alertMessage', 'Tipo excluído com sucesso!');
    sessionStorage.setItem('alertType', 'success');
    const url = new URL(window.location);
    url.searchParams.delete('tipo_id');
    window.history.pushState({}, '', url);
    setTimeout(() => {
      window.location.reload();
    }, 700);
  } catch (erro) {
    console.error("Erro ao excluir tipo:", erro);
    appendAlert('Erro ao excluir tipo: ' + erro.message, 'danger');
  }
});

let botoesExcluirTipo = document.querySelectorAll(".excluirTipo");
botoesExcluirTipo.forEach((botao) => {
  let dataId = botao.getAttribute("data-id");
  botao.addEventListener("click", () => {
    modal.parametrizar(
      "Confirmação",
      "Tem certeza que deseja excluir esse tipo?",
      "Cancelar",
      "Confirmar"
    );
    modal.abrir(dataId);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const tipoRows = document.querySelectorAll('.tipo-row');
  const novoTipoButton = document.querySelector('.custom-button-2');
  const cancelarButton = document.getElementById('cancelar');
  const codigoInput = document.getElementById('codigo');
  const descricaoInput = document.getElementById('descricao');

  tipoRows.forEach(row => {
    row.addEventListener('click', function() {
      const codigo = this.querySelector('td:nth-child(1)').textContent.trim();
      const descricao = this.querySelector('td:nth-child(2)').textContent.trim();
      
      codigoInput.value = codigo;
      descricaoInput.value = descricao;

      const tipoId = this.getAttribute('data-codigo');
      const url = new URL(window.location);
      url.searchParams.set('tipo_id', tipoId);
      window.history.pushState({}, '', url);

      codigoInput.classList.remove('is-invalid');
      descricaoInput.classList.remove('is-invalid');

      document.getElementById('formularioTipo').classList.remove('d-none');
    });
  });

  novoTipoButton.addEventListener('click', function() {
    codigoInput.value = '';
    descricaoInput.value = '';

    document.getElementById('formularioTipo').classList.remove('d-none');

    const url = new URL(window.location);
    url.searchParams.delete('tipo_id');
    window.history.pushState({}, '', url);
  });

  cancelarButton.addEventListener('click', function() {
    document.getElementById('formularioTipo').classList.add('d-none');
    codigoInput.classList.remove('is-invalid');
    descricaoInput.classList.remove('is-invalid');

    const url = new URL(window.location);
    url.searchParams.delete('tipo_id');
    window.history.pushState({}, '', url);
  });

  codigoInput.addEventListener('input', function() {
    if (codigoInput.value.trim()) {
      codigoInput.classList.remove('is-invalid');
    }
  });

  descricaoInput.addEventListener('input', function() {
    if (descricaoInput.value.trim()) {
      descricaoInput.classList.remove('is-invalid');
    }
  });
});
