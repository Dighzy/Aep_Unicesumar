import {
    Modal,
    TableSorter,
    Solicitacoes,
  } from "../componentes/classes.js";

let sorter = new TableSorter("CE_Categoria");
let solicitacoes = new Solicitacoes();
sorter.setupSorting();

document.getElementById("salvar").addEventListener("click", () => {
    const codigo = document.getElementById('codigo').value;
    const descricao = document.getElementById('descricao').value;
  
    const data = {
      codigo: codigo,
      descricao: descricao
    };

    solicitacoes.postCategoria(data)
    .then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 300);
    })
    .catch(error => {
      console.error('Erro ao postar categoria:', error);
    });
});

let modal = new Modal();

modal.botaoFechar.addEventListener("click", () => {
  modal.modal.hide();
});

modal.botao1.addEventListener("click", () => {
  console.log("Botão 1 clicado, data-id:", modal.dataId);
  modal.modal.hide();
});

modal.botao2.addEventListener("click", async () => {
  modal.spinner.style.display = 'block'; 
  try {
    console.log("Botão 2 clicado, data-id:", modal.dataId);
    const resposta = await solicitacoes.deleteCategoria(modal.dataId);
    
     // Se a exclusão for bem-sucedida, recarregar a página após 700ms
    setTimeout(() => {
      window.location.reload();
    }, 700);
    console.log(resposta);
    
    setTimeout(() => {
      modal.spinner.style.display = 'none';
      modal.modal.hide(); 
    }, 200);
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
  }
});


// Event listeners para os botões de exclusão
let botoesExcluirCategoria = document.querySelectorAll(".excluirCategoria");
botoesExcluirCategoria.forEach((botao) => {
  let dataId = botao.getAttribute("data-id");
  botao.addEventListener("click", () => {
    modal.titulo.innerText = "Confirmação";
    modal.mensagem.innerText = "Tem certeza que deseja excluir essa categoria?";
    modal.botao1.innerText = "Cancelar";
    modal.botao2.innerText = "Confirmar";
    modal.dataId = dataId;
    modal.modal.show();
  });
});
