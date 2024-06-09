import {
    Modal,
    TableSorter,
    Solicitacoes,
  } from "../componentes/classes.js";

let sorter = new TableSorter("CE_Categorias_Movimento");
let solicitacoes = new Solicitacoes();
sorter.setupSorting();

document.getElementById("salvar").addEventListener("click", () => {
  const codigo = document.getElementById("codigo").value;
  const descricao = document.getElementById("descricao").value;
  const tipo_movimento = document.querySelector('input[name="tipo_movimento"]:checked').value;

  const data = {
    codigo: codigo,
    descricao: descricao,
    tipo_de_movimento: tipo_movimento
  };

  solicitacoes.postCategoriaMovimento(data)
  .then(() => {
    // Após a postagem bem-sucedida, esperar 1 segundo antes de recarregar a página
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  })
  .catch(error => {
    console.error('Erro ao postar Categoria Movimentações:', error);
  });
});

let modalCategoriaMovimentacao = new Modal();

modalCategoriaMovimentacao.botaoFechar.addEventListener("click", () => {
  modalCategoriaMovimentacao.modal.hide();
});

modalCategoriaMovimentacao.botao1.addEventListener("click", () => {
  console.log("Botão 1 (Cancelar) clicado, data-id:", modalCategoriaMovimentacao.dataId);
  modalCategoriaMovimentacao.modal.hide();
});

modalCategoriaMovimentacao.botao2.addEventListener("click", async () => {
  modalCategoriaMovimentacao.spinner.style.display = 'block';

  try {
    console.log("Botão 2 (Confirmar) clicado, data-id:", modalCategoriaMovimentacao.dataId);

    const resposta = await solicitacoes.deleteCategoriaMovimento(modalCategoriaMovimentacao.dataId);

    // Se a exclusão for bem-sucedida, recarregar a página após 700ms
    setTimeout(() => {
      window.location.reload();
    }, 700);

    setTimeout(() => {
      modalCategoriaMovimentacao.spinner.style.display = 'none';
      modalCategoriaMovimentacao.modal.hide(); 
    }, 200);
  } catch (error) {
    console.error('Erro ao excluir categoria de movimentação:', error);
  }
});

// Event listeners para os botões de exclusão
let botoesExcluirCategoriaMovimentacao = document.querySelectorAll(".excluirCategoriaMovimentacao");
botoesExcluirCategoriaMovimentacao.forEach((botao) => {
  let dataId = botao.getAttribute("data-id");
  botao.addEventListener("click", () => {

    modalCategoriaMovimentacao.titulo.innerText = "Confirmação";
    modalCategoriaMovimentacao.mensagem.innerText = "Tem certeza que deseja excluir essa categoria de movimentação?";
    modalCategoriaMovimentacao.botao1.innerText = "Cancelar";
    modalCategoriaMovimentacao.botao2.innerText = "Confirmar";
    modalCategoriaMovimentacao.dataId = dataId;
    modalCategoriaMovimentacao.modal.show(); 
  });
});

