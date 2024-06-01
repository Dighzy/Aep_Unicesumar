// produtos.js

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
      filterSubcategories(); // Chama a função ao mudar a categoria
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
  const peso = document.getElementById('peso').value;

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

window.filterSubcategories = function() {
  var categoriaSelect = document.getElementById("categoria");
  var subcategoriaSelect = document.getElementById("subcategoria");
  var selectedCategoriaId = categoriaSelect.value;
  console.log("entrou filter");
  console.log(selectedCategoriaId);

  // Verifica se a categoria selecionada é a mesma que já estava selecionada anteriormente
  if (selectedCategoriaId === subcategoriaSelect.getAttribute("data-selected-categoria-id")) {
      // Limpa a seleção da subcategoria
      subcategoriaSelect.value = "";
  }

  // Armazena o ID da categoria selecionada para uso futuro
  subcategoriaSelect.setAttribute("data-selected-categoria-id", selectedCategoriaId);

  // Esconde todas as subcategorias
  var subcategoriaOptions = subcategoriaSelect.options;
  for (var i = 0; i < subcategoriaOptions.length; i++) {
      var option = subcategoriaOptions[i];
      var categoriaId = option.getAttribute("data-categoria-id");

      if (categoriaId === selectedCategoriaId || !categoriaId) {
          option.style.display = "block";
      } else {
          option.style.display = "none";
      }
  }
}




let modalProduto = new Modal();

modalProduto.botaoFechar.addEventListener("click", () => {
  modalProduto.modal.hide();
});

modalProduto.botao1.addEventListener("click", () => {
  console.log("Botão 1 (Cancelar) clicado, data-id:", modalProduto.dataId);
  modalProduto.modal.hide();
});

modalProduto.botao2.addEventListener("click", async () => {
  modalProduto.spinner.style.display = 'block';

  try {
    console.log("Botão 2 (Confirmar) clicado, data-id:", modalProduto.dataId);

    const resposta = await solicitacoes.deleteProduto(modalProduto.dataId);

    // Se a exclusão for bem-sucedida, recarregar a página após 700ms
    setTimeout(() => {
      window.location.reload();
    }, 700);

    setTimeout(() => {
      modalProduto.spinner.style.display = 'none';
      modalProduto.modal.hide(); 
    }, 200);
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
  }
});

// Event listeners para os botões de exclusão
let botoesExcluirProduto = document.querySelectorAll(".excluirProduto");
botoesExcluirProduto.forEach((botao) => {
  let dataId = botao.getAttribute("data-id");
  botao.addEventListener("click", () => {

    modalProduto.titulo.innerText = "Confirmação";
    modalProduto.mensagem.innerText = "Tem certeza que deseja exclusão desse produto?";
    modalProduto.botao1.innerText = "Cancelar";
    modalProduto.botao2.innerText = "Confirmar";
    modalProduto.dataId = dataId;
    modalProduto.modal.show(); 
    });
    });

