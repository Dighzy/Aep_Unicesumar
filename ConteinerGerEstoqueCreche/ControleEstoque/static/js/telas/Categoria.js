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
      // Após a postagem bem-sucedida, esperar 1 segundo antes de recarregar a página
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    })
    .catch(error => {
      console.error('Erro ao postar categoria:', error);
    });
});


usuarios.botaoCancelar.addEventListener("click", () =>
  formValidator.removeInvalidClass(limparCampos)
);

modal.eventoBotao1((dataId) => {
    console.log("Botão 1 clicado, data-id:", dataId);
    modal.fechar();
  });
  
  modal.eventoBotao2(async (dataId) => {
    modal.mostrarSpinner(); 
    try {
      console.log("Botão 2 clicado, data-id:", dataId);
      const resposta = await solicitacoes.deleteUsuario(dataId);
      console.log(resposta);
     
      setTimeout(() => {
        usuarios.removerLinhaUsuario(dataId);
        usuarios.limparUrl();
        usuarios.ocultarFormulario();
        modal.esconderSpinner(); 
        modal.fechar(); 
      }, 200);
    } catch (erro) {
      console.error("Erro ao excluir usuário:", erro);
     
      setTimeout(() => {
        modal.esconderSpinner();
        modal.fechar(); 
      }, 200);
    }
  });

let botoesExcluirUsuario = document.querySelectorAll(".excluirUsuario");
botoesExcluirUsuario.forEach((botao) => {
  let dataId = botao.getAttribute("data-id");
  botao.addEventListener("click", () => {
    modal.parametrizar(
      "Confirmação",
      "Tem certeza que deseja excluir esse usuário?",
      "Cancelar",
      "Confirmar"
    );
    modal.abrir(dataId);
  });
  botao.addEventListener("click", () =>
    formValidator.removeInvalidClass(limparCampos)
  );
});