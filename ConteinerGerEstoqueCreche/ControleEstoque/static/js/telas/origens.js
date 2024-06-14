import { Modal, TableSorter, Solicitacoes, FormValidator } from "../componentes/classes.js";

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

let solicitacoes = new Solicitacoes();
let formValidator = new FormValidator("formularioOrigens");
let modal = new Modal();
modal.eventoFechar();

modal.eventoBotao1((dataId) => {
  modal.fechar();
});

modal.eventoBotao2(async (dataId) => {
  modal.fechar(); // Fechar a modal imediatamente após clicar no botão de confirmação
  try {
    await solicitacoes.fazerSolicitacao(`/origens/gerenciar/?origem_id=${dataId}`, {}, "DELETE");
    sessionStorage.setItem('alertMessage', 'Origem excluída com sucesso!');
    sessionStorage.setItem('alertType', 'success');
    const url = new URL(window.location);
    url.searchParams.delete('origem_id');
    window.history.pushState({}, '', url);
    setTimeout(() => {
      window.location.reload();
    }, 700);
  } catch (erro) {
    console.error("Erro ao excluir origem:", erro);
    appendAlert('Erro ao excluir origem: ' + erro.message, 'danger');
  }
});

document.getElementById("salvar").addEventListener("click", async () => {
  const codigo = document.getElementById('codigo').value;
  const descricao = document.getElementById('descricao').value;
  const tipo = document.querySelector('input[name="tipo_movimento"]:checked');

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

  if (!tipo) {
    document.querySelectorAll('input[name="tipo_movimento"]').forEach((radio) => {
      radio.classList.add('is-invalid');
    });
    isValid = false;
  } else {
    document.querySelectorAll('input[name="tipo_movimento"]').forEach((radio) => {
      radio.classList.remove('is-invalid');
    });
  }

  if (!isValid) {
    appendAlert('Erro: Verifique os campos e tente novamente.', 'danger');
    return;
  }

  const data = {
    codigo: codigo,
    descricao: descricao,
    tipo: tipo.value
  };

  try {
    const origemId = new URLSearchParams(window.location.search).get('origem_id');
    const url = new URL(window.location);
    if (origemId) {
      await solicitacoes.fazerSolicitacao(`/origens/gerenciar/?origem_id=${origemId}`, data, "PUT");
      sessionStorage.setItem('alertMessage', 'Origem editada com sucesso!');
      sessionStorage.setItem('alertType', 'success');
    } else {
      await solicitacoes.fazerSolicitacao('/origens/', data, "POST");
      sessionStorage.setItem('alertMessage', 'Origem incluída com sucesso!');
      sessionStorage.setItem('alertType', 'success');
    }
    url.searchParams.delete('origem_id');
    window.history.pushState({}, '', url);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  } catch (error) {
    console.error('Erro ao salvar origem:', error);
    appendAlert('Erro ao salvar origem: ' + error.message, 'danger');
  }
});

let botoesExcluirOrigem = document.querySelectorAll(".excluirCategoriaMovimentacao");
botoesExcluirOrigem.forEach((botao) => {
  let dataId = botao.getAttribute("data-codigo");
  botao.addEventListener("click", () => {
    modal.parametrizar(
      "Confirmação",
      "Tem certeza que deseja excluir essa origem?",
      "Cancelar",
      "Confirmar"
    );
    modal.abrir(dataId);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const origemRows = document.querySelectorAll('.origem-row');
  const novaOrigemButton = document.getElementById('nova');
  const cancelarButton = document.getElementById('cancelar');
  const codigoInput = document.getElementById('codigo');
  const descricaoInput = document.getElementById('descricao');

  origemRows.forEach(row => {
    row.addEventListener('click', function() {
      const codigo = this.querySelector('td:nth-child(1)').textContent.trim();
      const descricao = this.querySelector('td:nth-child(2)').textContent.trim();
      const tipo = this.querySelector('td:nth-child(3)').textContent.trim();

      codigoInput.value = codigo;
      descricaoInput.value = descricao;

      document.querySelector(`input[name="tipo_movimento"][value="${tipo}"]`).checked = true;

      const origemId = this.getAttribute('id');
      const url = new URL(window.location);
      url.searchParams.set('origem_id', origemId);
      window.history.pushState({}, '', url);

      codigoInput.classList.remove('is-invalid');
      descricaoInput.classList.remove('is-invalid');
      document.querySelectorAll('input[name="tipo_movimento"]').forEach((radio) => {
        radio.classList.remove('is-invalid');
      });

      document.getElementById('formularioOrigens').classList.remove('d-none');
    });
  });

  novaOrigemButton.addEventListener('click', function() {
    codigoInput.value = '';
    descricaoInput.value = '';
    document.querySelectorAll('input[name="tipo_movimento"]').forEach((radio) => {
      radio.checked = false;
      radio.classList.remove('is-invalid');
    });

    document.getElementById('formularioOrigens').classList.remove('d-none');

    const url = new URL(window.location);
    url.searchParams.delete('origem_id');
    window.history.pushState({}, '', url);
  });

  cancelarButton.addEventListener('click', function() {
    document.getElementById('formularioOrigens').classList.add('d-none');
    codigoInput.classList.remove('is-invalid');
    descricaoInput.classList.remove('is-invalid');
    document.querySelectorAll('input[name="tipo_movimento"]').forEach((radio) => {
      radio.classList.remove('is-invalid');
    });

    const url = new URL(window.location);
    url.searchParams.delete('origem_id');
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

  document.querySelectorAll('input[name="tipo_movimento"]').forEach((radio) => {
    radio.addEventListener('change', function() {
      document.querySelectorAll('input[name="tipo_movimento"]').forEach((radio) => {
        radio.classList.remove('is-invalid');
      });
    });
  });
});
