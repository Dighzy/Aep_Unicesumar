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

let sorter = new TableSorter("CE_SubCategoria");
let solicitacoes = new Solicitacoes();
sorter.setupSorting();

document.getElementById("salvar").addEventListener("click", async () => {
  const codigo = document.getElementById('codigo').value;
  const descricao = document.getElementById('descricao').value;
  const categoriaChecked = document.querySelector('input[name="categoria"]:checked');

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

  if (!categoriaChecked) {
    document.getElementById('categoria-options').classList.add('is-invalid');
    isValid = false;
  } else {
    document.getElementById('categoria-options').classList.remove('is-invalid');
  }

  if (!isValid) {
    appendAlert('Erro: Verifique os campos e tente novamente.', 'danger');
    return;
  }

  const categoria = categoriaChecked.value;

  const data = {
    codigo: codigo,
    descricao: descricao,
    categoria_id: categoria
  };

  try {
    const subcategoriaId = new URLSearchParams(window.location.search).get('subcategoria_id');
    const url = new URL(window.location);
    if (subcategoriaId) {
      await solicitacoes.fazerSolicitacao(`/subcategorias/${subcategoriaId}/`, data, "PUT");
      sessionStorage.setItem('alertMessage', 'Subcategoria editada com sucesso!');
      sessionStorage.setItem('alertType', 'success');
    } else {
      await solicitacoes.fazerSolicitacao('/subcategorias/', data, "POST");
      sessionStorage.setItem('alertMessage', 'Subcategoria incluída com sucesso!');
      sessionStorage.setItem('alertType', 'success');
    }
    url.searchParams.delete('subcategoria_id');
    window.history.pushState({}, '', url);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  } catch (error) {
    console.error('Erro ao salvar subcategoria:', error);
    appendAlert('Erro ao salvar subcategoria: ' + error.message, 'danger');
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
    await solicitacoes.fazerSolicitacao(`/subcategorias/${dataId}/`, {}, "DELETE");
    sessionStorage.setItem('alertMessage', 'Subcategoria excluída com sucesso!');
    sessionStorage.setItem('alertType', 'success');
    const url = new URL(window.location);
    url.searchParams.delete('subcategoria_id');
    window.history.pushState({}, '', url);
    setTimeout(() => {
      window.location.reload();
    }, 700);
  } catch (erro) {
    console.error("Erro ao excluir subcategoria:", erro);
    appendAlert('Erro ao excluir subcategoria: ' + erro.message, 'danger');
  }
});

let botoesExcluirSubcategoria = document.querySelectorAll(".excluirSubcategoria");
botoesExcluirSubcategoria.forEach((botao) => {
  let dataId = botao.getAttribute("data-id");
  botao.addEventListener("click", () => {
    modal.parametrizar(
      "Confirmação",
      "Tem certeza que deseja excluir essa subcategoria?",
      "Cancelar",
      "Confirmar"
    );
    modal.abrir(dataId);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const subcategoriaRows = document.querySelectorAll('.subcategoria-row');
  const novoSubcategoriaButton = document.querySelector('.custom-button-2');
  const cancelarButton = document.getElementById('cancelar');
  const codigoInput = document.getElementById('codigo');
  const descricaoInput = document.getElementById('descricao');
  const categoriaOptionsButton = document.getElementById('categoria-options');
  let allCategorias = [];

  const categoriaElements = document.querySelectorAll('#categorias-container li');
  categoriaElements.forEach(element => {
    allCategorias.push({
      codigo: element.getAttribute('data-categoria-codigo'),
      descricao: element.querySelector('label').textContent
    });
  });

  subcategoriaRows.forEach(row => {
    row.addEventListener('click', function() {
      const codigo = this.querySelector('td:nth-child(1)').textContent.trim();
      const descricao = this.querySelector('td:nth-child(2)').textContent.trim();
      const categoriaCodigo = this.getAttribute('data-categoria-codigo');
      
      codigoInput.value = codigo;
      descricaoInput.value = descricao;
      updateCategorias(categoriaCodigo);

      const subcategoriaId = this.getAttribute('data-codigo');
      const url = new URL(window.location);
      url.searchParams.set('subcategoria_id', subcategoriaId);
      window.history.pushState({}, '', url);

      codigoInput.classList.remove('is-invalid');
      descricaoInput.classList.remove('is-invalid');
      categoriaOptionsButton.classList.remove('is-invalid');

      document.getElementById('formularioSubcategoria').classList.remove('d-none');
    });
  });

  novoSubcategoriaButton.addEventListener('click', function() {
    codigoInput.value = '';
    descricaoInput.value = '';
    updateCategorias('');

    document.getElementById('formularioSubcategoria').classList.remove('d-none');

    const url = new URL(window.location);
    url.searchParams.delete('subcategoria_id');
    window.history.pushState({}, '', url);
  });

  cancelarButton.addEventListener('click', function() {
    document.getElementById('formularioSubcategoria').classList.add('d-none');
    codigoInput.classList.remove('is-invalid');
    descricaoInput.classList.remove('is-invalid');
    categoriaOptionsButton.classList.remove('is-invalid');

    const url = new URL(window.location);
    url.searchParams.delete('subcategoria_id');
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

  categoriaOptionsButton.addEventListener('click', function() {
    const categoriaChecked = document.querySelector('input[name="categoria"]:checked');
    if (categoriaChecked) {
      categoriaOptionsButton.classList.remove('is-invalid');
    }
  });

  function updateCategorias(categoriaCodigo) {
    const container = document.getElementById('categorias-container');
    container.innerHTML = '';

    let matchedItem = null;
    allCategorias.forEach(categoria => {
      const item = document.createElement('li');
      item.className = 'd-flex user-select-none';

      const radioId = `categoriaCheck${categoria.codigo}`;
      const radio = document.createElement('input');
      radio.className = 'form-check-input me-2';
      radio.type = 'radio';
      radio.name = 'categoria';
      radio.id = radioId;
      radio.value = categoria.codigo;
      radio.checked = categoria.codigo == categoriaCodigo;

      const label = document.createElement('label');
      label.className = 'form-check-label w-100';
      label.setAttribute('for', radioId);
      label.textContent = categoria.descricao;

      item.appendChild(radio);
      item.appendChild(label);

      if (radio.checked) {
        matchedItem = item;
      } else {
        container.appendChild(item);
      }

      radio.addEventListener('change', function() {
        if (radio.checked) {
          categoriaOptionsButton.classList.remove('is-invalid');
        }
      });
    });

    if (matchedItem) {
      container.prepend(matchedItem);
      matchedItem.querySelector('input').checked = true;
    }
  }
});
