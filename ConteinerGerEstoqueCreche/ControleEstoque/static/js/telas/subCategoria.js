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
      setTimeout(() => {
        window.location.reload();
      }, 300);
    })
    .catch(error => {
      console.error('Erro ao postar subcategoria:', error);
    });
});

let modalSubcategoria = new Modal();

modalSubcategoria.botaoFechar.addEventListener("click", () => {
  modalSubcategoria.modal.hide();
});

modalSubcategoria.botao1.addEventListener("click", () => {
  console.log("Botão 1 (Cancelar) clicado, data-id:", modalSubcategoria.dataId);
  modalSubcategoria.modal.hide();
});

modalSubcategoria.botao2.addEventListener("click", async () => {
  modalSubcategoria.spinner.style.display = 'block'; 

  try {
    console.log("Botão 2 (Confirmar) clicado, data-id:", modalSubcategoria.dataId);

    const resposta = await solicitacoes.deleteSubCategoria(modalSubcategoria.dataId);
    console.log(resposta);
    // Se a exclusão for bem-sucedida, recarregar a página após 700ms
    setTimeout(() => {
      window.location.reload();
    }, 700);

    setTimeout(() => {
      modalSubcategoria.spinner.style.display = 'none';
      modalSubcategoria.modal.hide(); 
    }, 200);
  } catch (error) {
    console.error('Erro ao excluir subcategoria:', error);
  }
});

let botoesExcluirSubcategoria = document.querySelectorAll(".excluirSubcategoria");
botoesExcluirSubcategoria.forEach((botao) => {
  let dataId = botao.getAttribute("data-id");
  botao.addEventListener("click", () => {

    modalSubcategoria.titulo.innerText = "Confirmação";
    modalSubcategoria.mensagem.innerText = "Tem certeza que deseja excluir essa subcategoria?";
    modalSubcategoria.botao1.innerText = "Cancelar";
    modalSubcategoria.botao2.innerText = "Confirmar";
    modalSubcategoria.dataId = dataId;
    modalSubcategoria.modal.show(); 
  });
});


