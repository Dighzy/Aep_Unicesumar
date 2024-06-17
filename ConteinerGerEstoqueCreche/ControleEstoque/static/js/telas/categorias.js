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

let sorter = new TableSorter("CE_Categoria");
let solicitacoes = new Solicitacoes();
sorter.setupSorting();

document.getElementById("salvar").addEventListener("click", async () => {
  const codigo = document.getElementById('codigo').value;
  const descricao = document.getElementById('descricao').value;
  const tipoChecked = document.querySelector('input[name="tipo"]:checked');

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

  if (!tipoChecked) {
    document.getElementById('tipo-options').classList.add('is-invalid');
    isValid = false;
  } else {
    document.getElementById('tipo-options').classList.remove('is-invalid');
  }

  if (!isValid) {
    appendAlert('Erro: Verifique os campos e tente novamente.', 'danger');
    return;
  }

  const tipo = tipoChecked.value;

  const data = {
    codigo: codigo,
    descricao: descricao,
    tipo_id: tipo
  };

  try {
    const categoriaId = new URLSearchParams(window.location.search).get('categoria_id');
    const url = new URL(window.location);
    if (categoriaId) {
      await solicitacoes.fazerSolicitacao(`/categorias/${categoriaId}/`, data, "PUT");
      sessionStorage.setItem('alertMessage', 'Categoria editada com sucesso!');
      sessionStorage.setItem('alertType', 'success');
    } else {
      await solicitacoes.fazerSolicitacao('/categorias/', data, "POST");
      sessionStorage.setItem('alertMessage', 'Categoria incluída com sucesso!');
      sessionStorage.setItem('alertType', 'success');
    }
    url.searchParams.delete('categoria_id');
    window.history.pushState({}, '', url);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  } catch (error) {
    console.error('Erro ao salvar categoria:', error);
    appendAlert('Erro ao salvar categoria: ' + error.message, 'danger');
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
    await solicitacoes.fazerSolicitacao(`/categorias/${dataId}/`, {}, "DELETE");
    sessionStorage.setItem('alertMessage', 'Categoria excluída com sucesso!');
    sessionStorage.setItem('alertType', 'success');
    const url = new URL(window.location);
    url.searchParams.delete('categoria_id');
    window.history.pushState({}, '', url);
    setTimeout(() => {
      window.location.reload();
    }, 700);
  } catch (erro) {
    console.error("Erro ao excluir categoria:", erro);
    appendAlert('Erro ao excluir categoria: ' + erro.message, 'danger');
  }
});

let botoesExcluirCategoria = document.querySelectorAll(".excluirCategoria");
botoesExcluirCategoria.forEach((botao) => {
  let dataId = botao.getAttribute("data-id");
  botao.addEventListener("click", () => {
    modal.parametrizar(
      "Confirmação",
      "Tem certeza que deseja excluir essa categoria?",
      "Cancelar",
      "Confirmar"
    );
    modal.abrir(dataId);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const categoriaRows = document.querySelectorAll('.categoria-row');
  const novoCategoriaButton = document.querySelector('.custom-button-2');
  const cancelarButton = document.getElementById('cancelar');
  const codigoInput = document.getElementById('codigo');
  const descricaoInput = document.getElementById('descricao');
  const tipoOptionsButton = document.getElementById('tipo-options');
  let allTipos = [];

  const tipoElements = document.querySelectorAll('#tipos-container li');
  tipoElements.forEach(element => {
    allTipos.push({
      codigo: element.getAttribute('data-tipo-codigo'),
      descricao: element.querySelector('label').textContent
    });
  });

  categoriaRows.forEach(row => {
    row.addEventListener('click', function() {
      const codigo = this.querySelector('td:nth-child(1)').textContent.trim();
      const descricao = this.querySelector('td:nth-child(2)').textContent.trim();
      const tipoCodigo = this.getAttribute('data-tipo-codigo');
      
      codigoInput.value = codigo;
      descricaoInput.value = descricao;
      updateTipos(tipoCodigo);

      const categoriaId = this.getAttribute('data-codigo');
      const url = new URL(window.location);
      url.searchParams.set('categoria_id', categoriaId);
      window.history.pushState({}, '', url);

      codigoInput.classList.remove('is-invalid');
      descricaoInput.classList.remove('is-invalid');
      tipoOptionsButton.classList.remove('is-invalid');

      document.getElementById('formularioCategoria').classList.remove('d-none');
    });
  });

  novoCategoriaButton.addEventListener('click', function() {
    codigoInput.value = '';
    descricaoInput.value = '';
    updateTipos('');

    document.getElementById('formularioCategoria').classList.remove('d-none');

    const url = new URL(window.location);
    url.searchParams.delete('categoria_id');
    window.history.pushState({}, '', url);
  });

  cancelarButton.addEventListener('click', function() {
    document.getElementById('formularioCategoria').classList.add('d-none');
    codigoInput.classList.remove('is-invalid');
    descricaoInput.classList.remove('is-invalid');
    tipoOptionsButton.classList.remove('is-invalid');

    const url = new URL(window.location);
    url.searchParams.delete('categoria_id');
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

  tipoOptionsButton.addEventListener('click', function() {
    const tipoChecked = document.querySelector('input[name="tipo"]:checked');
    if (tipoChecked) {
      tipoOptionsButton.classList.remove('is-invalid');
    }
  });

  function updateTipos(tipoCodigo) {
    const container = document.getElementById('tipos-container');
    container.innerHTML = '';

    let matchedItem = null;
    allTipos.forEach(tipo => {
      const item = document.createElement('li');
      item.className = 'd-flex user-select-none';

      const radioId = `tipoCheck${tipo.codigo}`;
      const radio = document.createElement('input');
      radio.className = 'form-check-input me-2';
      radio.type = 'radio';
      radio.name = 'tipo';
      radio.id = radioId;
      radio.value = tipo.codigo;
      radio.checked = tipo.codigo == tipoCodigo;

      const label = document.createElement('label');
      label.className = 'form-check-label w-100';
      label.setAttribute('for', radioId);
      label.textContent = tipo.descricao;

      item.appendChild(radio);
      item.appendChild(label);

      if (radio.checked) {
        matchedItem = item;
      } else {
        container.appendChild(item);
      }

      radio.addEventListener('change', function() {
        if (radio.checked) {
          tipoOptionsButton.classList.remove('is-invalid');
        }
      });
    });

    if (matchedItem) {
      container.prepend(matchedItem);
      matchedItem.querySelector('input').checked = true;
    }
  }
});

document.addEventListener('DOMContentLoaded', function () {
  function filtrarUsuarios() {
      const input = document.getElementById('pesquisarCategoria');
      const filtro = input.value.toLowerCase();
      const tabela = document.getElementById('CE_Categoria');
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

  const inputPesquisar = document.getElementById('pesquisarCategoria');
  inputPesquisar.addEventListener('input', filtrarUsuarios);
});
