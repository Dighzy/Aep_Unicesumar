import { Modal, Usuarios, TableSorter } from "../componentes/classes.js";


let usuarios = new Usuarios();
usuarios.inicializar();

let modal = new Modal();
modal.eventoFechar();
modal.eventoBotao1(() => {
  console.log('Botão 1 clicado');
  modal.fechar();
});
modal.eventoBotao2(() => console.log('Botão 2 clicado'));
modal.parametrizar('Confirmação', 'Tem certeza que deseja excluir esse usuário?', 'Cancelar', 'Confirmar');

let botoesExcluirUsuario = document.querySelectorAll('.excluirUsuario');
botoesExcluirUsuario.forEach(botao => {
  botao.addEventListener('click', () => {
    modal.abrir();
  });
});


let sorter = new TableSorter('tabelaUsuarios');
sorter.setupSorting();
