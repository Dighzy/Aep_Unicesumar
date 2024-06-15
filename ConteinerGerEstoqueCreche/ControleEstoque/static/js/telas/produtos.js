import { Modal, TableSorter, Solicitacoes } from "../componentes/classes.js";

const alertPlaceholder = document.getElementById("liveAlertPlaceholder");

const appendAlert = (message, type, timeout = 4000) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");
  alertPlaceholder.append(wrapper);
  setTimeout(() => {
    if (wrapper) {
      wrapper.remove();
    }
  }, timeout);
};

const displayAlertFromSession = () => {
  const message = sessionStorage.getItem("alertMessage");
  const type = sessionStorage.getItem("alertType");
  if (message && type) {
    appendAlert(message, type);
    sessionStorage.removeItem("alertMessage");
    sessionStorage.removeItem("alertType");
  }
};

window.onload = displayAlertFromSession;

let sorter = new TableSorter("CE_Produto");
let solicitacoes = new Solicitacoes();
sorter.setupSorting();

document.addEventListener("DOMContentLoaded", function () {
  const formularioProduto = document.getElementById("formularioProduto");
  const btnCancelar = document.querySelector(".btn-cancelar");
  const btnNovoProduto = document.querySelector(".custom-button-2");
  const produtoRows = document.querySelectorAll(".produto-row");
  const btnSalvar = document.getElementById("salvar");
  const inputCodigo = document.getElementById("codigo");
  const inputDescricao = document.getElementById("descricao");
  const inputPeso = document.getElementById("valor-peso");
  const inputUnidade = document.getElementById("valor-unidade-embalagem");
  const tipoContainer = document.getElementById("tipos-container");
  const categoriaContainer = document.getElementById("categorias-container");
  const subcategoriaContainer = document.getElementById(
    "subcategorias-container"
  );
  const embalagemContainer = document.getElementById("embalagens-container");
  const pesoContainer = document.getElementById("pesos-container");

  function esconderFormulario() {
    formularioProduto.classList.add("d-none");
  }

  function exibirFormulario() {
    formularioProduto.classList.remove("d-none");
  }

  // Adiciona um evento de input para validar o valor do campo inputUnidade
  inputUnidade.addEventListener("input", function () {
    // Remove qualquer caractere que não seja um dígito e impede valor zero
    this.value = this.value.replace(/[^1-9]/g, "");
  });

  // Adiciona um evento de blur para garantir que o campo não esteja vazio
  inputUnidade.addEventListener("blur", function () {
    if (this.value.trim() === "" || this.value.trim() === "0") {
      this.classList.add("is-invalid");
    } else {
      this.classList.remove("is-invalid");
    }
  });

  function validarCampos() {
    const camposTexto = formularioProduto.querySelectorAll(
      "input[type='text'], input[type='number']"
    );
    const dropdowns = formularioProduto.querySelectorAll(".form-select");
    let camposValidos = true;

    camposTexto.forEach((campo) => {
      if (campo.id === "valor-peso") {
        return;
      }
      if (campo.value.trim() === "") {
        campo.classList.add("is-invalid");
        camposValidos = false;
      } else {
        campo.classList.remove("is-invalid");
      }
    });

    dropdowns.forEach((dropdown) => {
      if (dropdown.id === "tipo-peso-options") {
        return;
      }
      const selectedOption = dropdown.parentElement.querySelector(
        "input[type='radio']:checked"
      );
      if (!selectedOption) {
        dropdown.classList.add("is-invalid");
        camposValidos = false;
      } else {
        dropdown.classList.remove("is-invalid");
      }
    });

    // Validação inversamente proporcional para Peso e Tipo de Peso
    const tipoPesoSelecionado = pesoContainer.querySelector(
      "input[type='radio']:checked"
    );
    const valorPeso = inputPeso.value.trim();
    if (tipoPesoSelecionado && !valorPeso) {
      inputPeso.classList.add("is-invalid");
      camposValidos = false;
    } else {
      inputPeso.classList.remove("is-invalid");
    }
    if (!tipoPesoSelecionado && valorPeso) {
      document.getElementById("tipo-peso-options").classList.add("is-invalid");
      camposValidos = false;
    } else {
      document
        .getElementById("tipo-peso-options")
        .classList.remove("is-invalid");
    }

    formularioProduto
      .querySelectorAll("input, .form-select")
      .forEach((campo) => {
        campo.addEventListener("input", () => {
          if (campo.value.trim() !== "") {
            campo.classList.remove("is-invalid");
          }
        });
        if (campo.type === "radio") {
          campo.addEventListener("change", () => {
            campo.classList.remove("is-invalid");
            campo
              .closest(".dropdown")
              .querySelector("button")
              .classList.remove("is-invalid");
          });
        }
      });

    return camposValidos;
  }

  function removerInvalidClass() {
    const camposInvalidos = formularioProduto.querySelectorAll(".is-invalid");
    camposInvalidos.forEach((campo) => {
      campo.classList.remove("is-invalid");
    });
  }

  function updateQueryStringParameter(key, value) {
    let url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.pushState({}, "", url);
  }

  function removeQueryStringParameter(key) {
    let url = new URL(window.location);
    url.searchParams.delete(key);
    window.history.pushState({}, "", url);
  }

  function preencherFormulario(produto) {
    inputCodigo.value = produto.codigo;
    inputDescricao.value = produto.descricao;
    inputPeso.value = produto.peso.replace(",", ".");
    inputUnidade.value = produto.unidade;
  }

  function atualizarDropdown(container, id) {
    const itens = Array.from(container.children);
    const itemSelecionado = itens.find((item) =>
      item.querySelector(`input[value="${id}"]`)
    );
    if (itemSelecionado) {
      container.prepend(itemSelecionado);
      itemSelecionado.querySelector('input[type="radio"]').checked = true;
    }
  }

  function atualizarTipoPeso(tipoPeso) {
    let valorPeso;
    if (tipoPeso.toUpperCase() === "KG") {
      valorPeso = "KILO";
    } else if (tipoPeso.toUpperCase() === "LT") {
      valorPeso = "LITRO";
    } else {
      valorPeso = tipoPeso.toUpperCase();
    }
    const itens = Array.from(pesoContainer.children);
    const itemSelecionado = itens.find((item) =>
      item.querySelector(`input[value="${valorPeso}"]`)
    );
    if (itemSelecionado) {
      itemSelecionado.querySelector('input[type="radio"]').checked = true;
    }
  }

  function filtrarCategorias(tipoId) {
    const categorias = categoriaContainer.querySelectorAll("li");
    categorias.forEach((categoria) => {
      if (categoria.getAttribute("data-tipo") === tipoId) {
        categoria.classList.remove("d-none");
      } else {
        categoria.classList.add("d-none");
      }
    });
  }

  function filtrarSubcategorias(categoriaId) {
    const subcategorias = subcategoriaContainer.querySelectorAll("li");
    subcategorias.forEach((subcategoria) => {
      if (subcategoria.getAttribute("data-categoria") === categoriaId) {
        subcategoria.classList.remove("d-none");
      } else {
        subcategoria.classList.add("d-none");
      }
    });
  }

  function exibirTodasCategoriasSubcategorias() {
    const categorias = categoriaContainer.querySelectorAll("li");
    categorias.forEach((categoria) => categoria.classList.remove("d-none"));
    const subcategorias = subcategoriaContainer.querySelectorAll("li");
    subcategorias.forEach((subcategoria) =>
      subcategoria.classList.remove("d-none")
    );
  }

  if (btnCancelar) {
    btnCancelar.addEventListener("click", function () {
      esconderFormulario();
      removerInvalidClass();
      removeQueryStringParameter("produto_id");
      exibirTodasCategoriasSubcategorias();
    });
  }

  if (btnNovoProduto) {
    btnNovoProduto.addEventListener("click", function () {
      exibirFormulario();
      removerInvalidClass();
      removeQueryStringParameter("produto_id");
      exibirTodasCategoriasSubcategorias();
      inputCodigo.value = "";
      inputDescricao.value = "";
      inputPeso.value = "";
      inputUnidade.value = "";
      tipoContainer.querySelectorAll('input[type="radio"]').forEach((radio) => {
        radio.checked = false;
      });
      categoriaContainer
        .querySelectorAll('input[type="radio"]')
        .forEach((radio) => {
          radio.checked = false;
        });
      subcategoriaContainer
        .querySelectorAll('input[type="radio"]')
        .forEach((radio) => {
          radio.checked = false;
        });
      embalagemContainer
        .querySelectorAll('input[type="radio"]')
        .forEach((radio) => {
          radio.checked = false;
        });
      pesoContainer.querySelectorAll('input[type="radio"]').forEach((radio) => {
        radio.checked = false;
      });
      inputUnidade.readOnly = false; // Habilitar campo de unidade ao adicionar um novo produto
    });
  }

  if (produtoRows) {
    produtoRows.forEach(function (row) {
      row.addEventListener("click", function () {
        const produtoId = row.getAttribute("data-codigo");
        updateQueryStringParameter("produto_id", produtoId);
        removerInvalidClass();
        exibirFormulario();
        const produto = {
          codigo: row.getAttribute("data-codigo"),
          descricao: row.getAttribute("data-descricao"),
          peso: row.getAttribute("data-peso"),
          unidade: row.getAttribute("data-unidade"),
          tipo: row.getAttribute("data-tipo"),
          categoria: row.getAttribute("data-categoria"),
          subCategoria: row.getAttribute("data-sub-categoria"),
          embalagem: row.getAttribute("data-embalagem"),
          tipoPeso: row.getAttribute("data-tipo-peso"),
        };
        preencherFormulario(produto);
        atualizarDropdown(tipoContainer, produto.tipo);
        filtrarCategorias(produto.tipo);
        atualizarDropdown(categoriaContainer, produto.categoria);
        filtrarSubcategorias(produto.categoria);
        atualizarDropdown(subcategoriaContainer, produto.subCategoria);
        atualizarDropdown(embalagemContainer, produto.embalagem);
        atualizarTipoPeso(produto.tipoPeso);

        // Verifica se a embalagem é "Única" e atualiza o campo de unidade
        const embalagemSelecionada = embalagemContainer.querySelector(
          'input[type="radio"]:checked'
        );
        if (
          embalagemSelecionada &&
          embalagemSelecionada.nextElementSibling.innerText.trim() === "Única"
        ) {
          inputUnidade.value = 1;
          inputUnidade.readOnly = true;
        } else {
          inputUnidade.readOnly = false;
        }
      });
    });
  }

  if (btnSalvar) {
    btnSalvar.addEventListener("click", async function () {
      if (validarCampos()) {
        try {
          let tipoPesoSelecionado = pesoContainer.querySelector(
            "input[type='radio']:checked"
          ).value;
          if (tipoPesoSelecionado === "KILO") {
            tipoPesoSelecionado = "KG";
          } else if (tipoPesoSelecionado === "LITRO") {
            tipoPesoSelecionado = "LT";
          }
          const dadosProduto = {
            codigo: inputCodigo.value,
            descricao: inputDescricao.value,
            categoria_id: categoriaContainer.querySelector(
              "input[type='radio']:checked"
            ).value,
            sub_categoria_id: subcategoriaContainer.querySelector(
              "input[type='radio']:checked"
            ).value,
            peso: inputPeso.value,
            unidade: inputUnidade.value,
            tipo_id: tipoContainer.querySelector("input[type='radio']:checked")
              .value,
            embalagem_id: embalagemContainer.querySelector(
              "input[type='radio']:checked"
            ).value,
            tipo_peso: tipoPesoSelecionado,
          };

          const produtoId = new URLSearchParams(window.location.search).get(
            "produto_id"
          );
          const url = new URL(window.location);
          if (produtoId) {
            await solicitacoes.fazerSolicitacao(
              `/produtos/${produtoId}/`,
              dadosProduto,
              "PUT"
            );
            sessionStorage.setItem(
              "alertMessage",
              "Produto editado com sucesso!"
            );
            sessionStorage.setItem("alertType", "success");
          } else {
            await solicitacoes.fazerSolicitacao(
              "/produtos/",
              dadosProduto,
              "POST"
            );
            sessionStorage.setItem(
              "alertMessage",
              "Produto incluído com sucesso!"
            );
            sessionStorage.setItem("alertType", "success");
          }
          url.searchParams.delete("produto_id");
          window.history.pushState({}, "", url);
          setTimeout(() => {
            window.location.reload();
          }, 300);
        } catch (erro) {
          appendAlert(`Erro ao salvar o produto: ${erro.error}`, "danger");
        }
      } else {
        appendAlert("Erro: Verifique os campos e tente novamente.", "danger");
      }
    });
  }

  const alertMessage = sessionStorage.getItem("alertMessage");
  const alertType = sessionStorage.getItem("alertType");
  if (alertMessage) {
    appendAlert(alertMessage, alertType);
    sessionStorage.removeItem("alertMessage");
    sessionStorage.removeItem("alertType");
  }

  let modal = new Modal();
  modal.eventoFechar();
  modal.eventoBotao1((dataId) => {
    modal.fechar();
  });
  modal.eventoBotao2(async (dataId) => {
    modal.fechar();
    try {
      await solicitacoes.fazerSolicitacao(`/produtos/${dataId}/`, {}, "DELETE");
      sessionStorage.setItem("alertMessage", "Produto excluído com sucesso!");
      sessionStorage.setItem("alertType", "success");
      const url = new URL(window.location);
      url.searchParams.delete("produto_id");
      window.history.pushState({}, "", url);
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (erro) {
      console.error("Erro ao excluir produto:", erro);
      appendAlert("Erro ao excluir produto: " + erro.message, "danger");
    }
  });

  let botoesExcluirProduto = document.querySelectorAll(".excluirProduto");
  botoesExcluirProduto.forEach((botao) => {
    let dataId = botao.getAttribute("data-id");
    botao.addEventListener("click", () => {
      modal.parametrizar(
        "Confirmação",
        "Tem certeza que deseja excluir esse produto?",
        "Cancelar",
        "Confirmar"
      );
      modal.abrir(dataId);
    });
  });

  tipoContainer.addEventListener("change", function () {
    const tipoSelecionado = tipoContainer.querySelector(
      "input[type='radio']:checked"
    ).value;
    filtrarCategorias(tipoSelecionado);
  });

  categoriaContainer.addEventListener("change", function () {
    const categoriaSelecionada = categoriaContainer.querySelector(
      "input[type='radio']:checked"
    ).value;
    filtrarSubcategorias(categoriaSelecionada);
  });

  embalagemContainer.addEventListener("change", function () {
    const embalagemSelecionada = embalagemContainer.querySelector(
      "input[type='radio']:checked"
    );
    if (
      embalagemSelecionada &&
      embalagemSelecionada.nextElementSibling.innerText.trim() === "Única"
    ) {
      inputUnidade.value = 1;
      inputUnidade.readOnly = true;
    } else {
      inputUnidade.readOnly = false;
    }
  });
});
