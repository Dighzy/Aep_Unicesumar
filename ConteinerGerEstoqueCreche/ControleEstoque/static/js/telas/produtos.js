import {
  Modal,
  TableSorter,
  Solicitacoes,
} from "../componentes/classes.js";

let sorter = new TableSorter("CE_Produto");
let solicitacoes = new Solicitacoes();
let categoriaSelecionadaId = null;
let subcategoriaSelecionadaId = null;
let unidadeSelecionado = null;
let pesoSelecionado = null;

sorter.setupSorting();

document.addEventListener("DOMContentLoaded", () => {
  const categoriaSelect = document.getElementById("categoria");
  categoriaSelect.addEventListener("change", () => {
      categoriaSelecionadaId = categoriaSelect.value;
  });

  
  const subcategoriaSelect = document.getElementById("subcategoria");
  subcategoriaSelect.addEventListener("change", () => {
      subcategoriaSelecionadaId = subcategoriaSelect.value;
  });

  const unidadeSelect = document.getElementById("unidadeSelect");
  unidadeSelect.addEventListener("change", () => {

      unidadeSelecionado = unidadeSelect.value;
  });

  const pesoSelect = document.getElementById("pesoSelect");
  pesoSelect.addEventListener("change", () => {
      pesoSelecionado = pesoSelect.value;
  });
});

document.getElementById("salvar").addEventListener("click", () => {
  const codigo = document.getElementById('codigo').value;
  const descricao = document.getElementById('descricao').value;
  const categoria_id = document.getElementById('categoria').value; 
  const subcategoria_id = document.getElementById('subcategoria').value;
  const unidade = document.getElementById('unidade').value;
;


  if (categoria_id === "") {
      alert("Selecione uma categoria");
      return;
  }

  if (subcategoria_id === "") {
      alert("Selecione uma subcategoria");
      return; 
  }

  const data = {
      codigo: codigo,
      descricao: descricao,
      categoria_id: categoria_id,
      sub_categoria_id: subcategoria_id,
      peso: peso,
      peso_select: pesoSelecionado,
      unidade: unidade,
      unidade_select: unidadeSelecionado,
  };

  solicitacoes.postProduto(data)
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
  