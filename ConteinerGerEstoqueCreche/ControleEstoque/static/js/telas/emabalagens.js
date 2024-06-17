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

let sorter = new TableSorter("CE_Embalagem");
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
    const embalagemId = new URLSearchParams(window.location.search).get('embalagem_id');
    const url = new URL(window.location);
    if (embalagemId) {
      await solicitacoes.fazerSolicitacao(`/embalagens/${embalagemId}/`, data, "PUT");
      sessionStorage.setItem('alertMessage', 'Embalagem editada com sucesso!');
      sessionStorage.setItem('alertType', 'success');
    } else {
      await solicitacoes.fazerSolicitacao('/embalagens/', data, "POST");
      sessionStorage.setItem('alertMessage', 'Embalagem incluída com sucesso!');
      sessionStorage.setItem('alertType', 'success');
    }
    url.searchParams.delete('embalagem_id');
    window.history.pushState({}, '', url);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  } catch (error) {
    console.error('Erro ao salvar embalagem:', error);
    appendAlert('Erro ao salvar embalagem: ' + error.message, 'danger');
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
    await solicitacoes.fazerSolicitacao(`/embalagens/${dataId}/`, {}, "DELETE");
    sessionStorage.setItem('alertMessage', 'Embalagem excluída com sucesso!');
    sessionStorage.setItem('alertType', 'success');
    const url = new URL(window.location);
    url.searchParams.delete('embalagem_id');
    window.history.pushState({}, '', url);
    setTimeout(() => {
      window.location.reload();
    }, 700);
  } catch (erro) {
    console.error("Erro ao excluir embalagem:", erro);
    appendAlert('Erro ao excluir embalagem: ' + erro.message, 'danger');
  }
});

let botoesExcluirEmbalagem = document.querySelectorAll(".excluirEmbalagem");
botoesExcluirEmbalagem.forEach((botao) => {
  let dataId = botao.getAttribute("data-id");
  botao.addEventListener("click", () => {
    modal.parametrizar(
      "Confirmação",
      "Tem certeza que deseja excluir essa embalagem?",
      "Cancelar",
      "Confirmar"
    );
    modal.abrir(dataId);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const embalagemRows = document.querySelectorAll('.embalagem-row');
  const novaEmbalagemButton = document.querySelector('.custom-button-2');
  const cancelarButton = document.getElementById('cancelar');
  const codigoInput = document.getElementById('codigo');
  const descricaoInput = document.getElementById('descricao');

  embalagemRows.forEach(row => {
    row.addEventListener('click', function() {
      const codigo = this.querySelector('td:nth-child(1)').textContent.trim();
      const descricao = this.querySelector('td:nth-child(2)').textContent.trim();
      
      codigoInput.value = codigo;
      descricaoInput.value = descricao;

      const embalagemId = this.getAttribute('data-codigo');
      const url = new URL(window.location);
      url.searchParams.set('embalagem_id', embalagemId);
      window.history.pushState({}, '', url);

      codigoInput.classList.remove('is-invalid');
      descricaoInput.classList.remove('is-invalid');

      document.getElementById('formularioEmbalagem').classList.remove('d-none');
    });
  });

  novaEmbalagemButton.addEventListener('click', function() {
    codigoInput.value = '';
    descricaoInput.value = '';

    document.getElementById('formularioEmbalagem').classList.remove('d-none');

    const url = new URL(window.location);
    url.searchParams.delete('embalagem_id');
    window.history.pushState({}, '', url);
  });

  cancelarButton.addEventListener('click', function() {
    document.getElementById('formularioEmbalagem').classList.add('d-none');
    codigoInput.classList.remove('is-invalid');
    descricaoInput.classList.remove('is-invalid');

    const url = new URL(window.location);
    url.searchParams.delete('embalagem_id');
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

document.addEventListener('DOMContentLoaded', function () {
  function filtrarUsuarios() {
      const input = document.getElementById('pesquisarEmbalagem');
      const filtro = input.value.toLowerCase();
      const tabela = document.getElementById('CE_Lancamento');
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

  const inputPesquisar = document.getElementById('pesquisarEmbalagem');
  inputPesquisar.addEventListener('input', filtrarUsuarios);
});