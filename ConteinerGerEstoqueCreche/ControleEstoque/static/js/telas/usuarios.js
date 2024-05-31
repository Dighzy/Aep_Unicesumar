import {
  Modal,
  Usuarios,
  TableSorter,
  Solicitacoes,
  FormValidator,
} from "../componentes/classes.js";

let usuarios = new Usuarios();
usuarios.inicializar();

let solicitacoes = new Solicitacoes();

let modal = new Modal();
modal.eventoFechar();

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


let formValidator = new FormValidator("formularioUsuario");
const limparCampos = [
  "nome",
  "sobrenome",
  "email",
  "senha",
  "usuario",
  "administrador",
];

usuarios.botaoCancelar.addEventListener("click", () =>
  formValidator.removeInvalidClass(limparCampos)
);

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


usuarios.linhasTabela.forEach((linha) => {
  linha.addEventListener("click", () => {
    formValidator.removeInvalidClass(limparCampos);
  });
});

usuarios.novoUsuario.addEventListener("click", () =>
  formValidator.removeInvalidClass(limparCampos)
);

let sorter = new TableSorter("tabelaUsuarios");
sorter.setupSorting();

const idsToRevalidate = ["nome", "sobrenome", "email", "senha"];

idsToRevalidate.forEach((id) => {
  const field = document.getElementById(id);
  field.addEventListener("input", () => formValidator.revalidarCampo(id));
});

["usuario", "administrador"].forEach((id) => {
  const radio = document.getElementById(id);
  radio.addEventListener("change", () => formValidator.validateUserType());
});

document.getElementById("salvar").addEventListener("click", () => {
  const idsToValidate = ["nome", "sobrenome", "email", "senha"];
  formValidator.validateFieldsById(idsToValidate);
  formValidator.validateUserType();
});
