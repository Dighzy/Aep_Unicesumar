import { TableSorter } from "../componentes/classes.js";
document.addEventListener("DOMContentLoaded", function () {
  let sorter = new TableSorter("CE_Entrada");
  sorter.setupSorting();

  const entradaTable = document.querySelector("#CE_Entrada"); // Tabela da esquerda
  const produtoTable = document.querySelector("#CE_Produto"); // Tabela da direita
  const totalGeralElement = document.querySelector("#totalValue");

  function addRowToEntradaTable(row) {
    const newRow = document.createElement("tr");

    const codigo = row.getAttribute("data-codigo");
    const descricao = row.getAttribute("data-descricao");
    const unidadeEmbalagem = parseInt(row.getAttribute("data-unidade")) || 1;
    const total = "1"; // Valor fictício inicial para a coluna 'Total'
    const totalReal = unidadeEmbalagem * total; // Valor inicial de 'Total Real'

    newRow.setAttribute("data-codigo", codigo);
    newRow.setAttribute("data-descricao", descricao);
    newRow.setAttribute("data-unidade", unidadeEmbalagem);

    newRow.innerHTML = `
          <td class="text-secondary align-middle">${codigo}</td>
          <td class="text-secondary align-middle">${descricao}</td>
          <td class="text-secondary align-middle total-real" data-initial-value="${totalReal}">${totalReal}</td>
          <td class="text-secondary align-middle">
              <div class="input-group" style="width: 100px;">
                  <button type="button" class="form-control btn-minus">-</button>
                  <input type="text" class="form-control text-center" value="${total}" data-initial-value="${total}">
                  <button type="button" class="form-control btn-plus">+</button>
              </div>
          </td>
          <td class="text-secondary align-middle">
              <button type="button" class="btn-close" aria-label="Close"></button>
          </td>
      `;

    // Adiciona o evento de clique no botão de fechar da nova linha
    const closeButton = newRow.querySelector(".btn-close");
    if (closeButton) {
      closeButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Evita que o clique no botão feche também mova a linha
        entradaTable.querySelector("tbody").removeChild(newRow);
        // Desmarca o checkbox correspondente
        const checkbox = produtoTable.querySelector(
          `tr[data-codigo="${codigo}"] .produto-checkbox`
        );
        if (checkbox) {
          checkbox.checked = false;
          reorderProdutoTable();
          updateTotalGeral();
        }
      });
    }

    // Adiciona eventos de incremento e decremento aos novos botões
    setupIncrementDecrement(newRow);

    // Adiciona a nova linha à tabela de entrada
    entradaTable.querySelector("tbody").appendChild(newRow);
    updateTotalGeral();
  }

  // Função para incrementar e decrementar os valores
  function setupIncrementDecrement(row) {
    const minusButton = row.querySelector(".btn-minus");
    const plusButton = row.querySelector(".btn-plus");
    const quantidadeInput = row.querySelector(".input-group input");
    const totalRealCell = row.querySelector(".total-real");

    if (minusButton && plusButton && quantidadeInput && totalRealCell) {
      minusButton.addEventListener("click", function () {
        let quantidadeValue = parseInt(quantidadeInput.value) || 0;
        const unidadeEmbalagem =
          parseInt(row.getAttribute("data-unidade")) || 1;
        const initialQuantidadeValue =
          parseInt(quantidadeInput.getAttribute("data-initial-value")) || 1;

        if (quantidadeValue > initialQuantidadeValue) {
          quantidadeInput.value = quantidadeValue - 1;
          totalRealCell.innerText = (quantidadeValue - 1) * unidadeEmbalagem;
          updateTotalGeral();
        }
      });

      plusButton.addEventListener("click", function () {
        let quantidadeValue = parseInt(quantidadeInput.value) || 0;
        const unidadeEmbalagem =
          parseInt(row.getAttribute("data-unidade")) || 1;

        quantidadeInput.value = quantidadeValue + 1;
        totalRealCell.innerText = (quantidadeValue + 1) * unidadeEmbalagem;
        updateTotalGeral();
      });
    }
  }

  // Função para reordenar a tabela de produtos
  function reorderProdutoTable() {
    const tbody = produtoTable.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.sort((a, b) => {
      const aChecked = a.querySelector(".produto-checkbox").checked;
      const bChecked = b.querySelector(".produto-checkbox").checked;
      return bChecked - aChecked;
    });

    // Reanexar as linhas na nova ordem
    rows.forEach((row) => tbody.appendChild(row));
  }

  // Função para atualizar o total geral
  function updateTotalGeral() {
    let totalGeral = 0;
    entradaTable.querySelectorAll(".total-real").forEach((cell) => {
      totalGeral += parseInt(cell.innerText) || 0;
    });
    totalGeralElement.innerText = totalGeral;
  }

  // Adiciona eventos de clique às checkboxes da tabela de produtos
  produtoTable.querySelectorAll(".produto-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const row = checkbox.closest("tr");
      if (checkbox.checked) {
        addRowToEntradaTable(row);
        // Move a linha para o topo da tabela de produtos
        reorderProdutoTable();
      } else {
        // Remove the corresponding row from the entradaTable if unchecked
        const codigo = row.getAttribute("data-codigo");
        const entradaRows = entradaTable.querySelectorAll("tbody tr");
        entradaRows.forEach((entradaRow) => {
          if (entradaRow.getAttribute("data-codigo") === codigo) {
            entradaTable.querySelector("tbody").removeChild(entradaRow);
          }
        });
        reorderProdutoTable();
        updateTotalGeral();
      }
    });
  });
  const showButton = document.getElementById("showRightDivButton");
  const rightDiv = document.getElementById("rightDiv");
  const hideImage = rightDiv.querySelector(".custom-img");

  showButton.addEventListener("click", function () {
    rightDiv.classList.remove("d-none");
  });

  hideImage.addEventListener("click", function () {
    rightDiv.classList.add("d-none");
  });
});
