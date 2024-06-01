import {
    Modal,
    TableSorter,
    Solicitacoes,
  } from "../componentes/classes.js";

let sorter = new TableSorter("CE_SubCategoria");
let solicitacoes = new Solicitacoes();
let categoriaSelecionadaId = null;

sorter.setupSorting();


document.querySelectorAll('.dropdown-menu .form-check-input').forEach(item => {
    item.addEventListener('click', () => {
        categoriaSelecionadaId = item.value;
    });
});
document.getElementById("salvar").addEventListener("click", () => {
    const codigo = document.getElementById('codigo').value;
    const descricao = document.getElementById('descricao').value;

    if (categoriaSelecionadaId === null) {
        alert("Selecione uma categoria");
        return;
    }

    const data = {
        codigo: codigo,
        descricao: descricao,
        categoria_id: categoriaSelecionadaId 
    };

    solicitacoes.postSubCategoria(data)
    .then(() => {
      // Após a postagem bem-sucedida, esperar 1 segundo antes de recarregar a página
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    })
    .catch(error => {
      console.error('Erro ao postar subcategoria:', error);
    });
});

