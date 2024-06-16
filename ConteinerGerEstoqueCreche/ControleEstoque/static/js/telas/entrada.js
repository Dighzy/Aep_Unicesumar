import { TableSorter, Solicitacoes } from "../componentes/classes.js";  // Ajuste o caminho conforme necessário

document.addEventListener("DOMContentLoaded", function () {
    let sorter = new TableSorter("CE_Entrada");
    sorter.setupSorting();

    const alertPlaceholder = document.getElementById('liveAlertPlaceholder');

    const appendAlert = (message, type, timeout = 4000) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');

        alertPlaceholder.append(wrapper);

        setTimeout(() => {
            if (wrapper) {
                wrapper.remove();
            }
        }, timeout);
    };

    const displayAlertFromSession = () => {
        const message = sessionStorage.getItem('alertMessage');
        const type = sessionStorage.getItem('alertType');
        if (message && type) {
            appendAlert(message, type);
            sessionStorage.removeItem('alertMessage');
            sessionStorage.removeItem('alertType');
        }
    };

    window.onload = displayAlertFromSession;

    const entradaTable = document.querySelector("#CE_Entrada"); // Tabela da esquerda
    const produtoTable = document.querySelector("#CE_Produto"); // Tabela da direita
    const totalGeralElement = document.querySelector("#totalValue");
    const finalizarButton = document.querySelector("#finalizarButton");  // Botão Finalizar

    function addRowToEntradaTable(row) {
        const newRow = document.createElement("tr");

        const id = row.getAttribute("data-id");
        const codigo = row.getAttribute("data-codigo");
        const descricao = row.getAttribute("data-descricao");
        const unidadeEmbalagem = parseInt(row.getAttribute("data-unidade")) || 1;
        const total = "1"; // Valor fictício inicial para a coluna 'Total'
        const totalReal = unidadeEmbalagem * total; // Valor inicial de 'Total Real'

        newRow.setAttribute("data-id", id);
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
                const checkbox = produtoTable.querySelector(`tr[data-id="${id}"] .produto-checkbox`);
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
                const unidadeEmbalagem = parseInt(row.getAttribute("data-unidade")) || 1;
                const initialQuantidadeValue = parseInt(quantidadeInput.getAttribute("data-initial-value")) || 1;

                if (quantidadeValue > initialQuantidadeValue) {
                    quantidadeInput.value = quantidadeValue - 1;
                    totalRealCell.innerText = (quantidadeValue - 1) * unidadeEmbalagem;
                    updateTotalGeral();
                }
            });

            plusButton.addEventListener("click", function () {
                let quantidadeValue = parseInt(quantidadeInput.value) || 0;
                const unidadeEmbalagem = parseInt(row.getAttribute("data-unidade")) || 1;

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
                const id = row.getAttribute("data-id");
                const entradaRows = entradaTable.querySelectorAll("tbody tr");
                entradaRows.forEach((entradaRow) => {
                    if (entradaRow.getAttribute("data-id") === id) {
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

    // Nova função para coletar dados e enviar ao servidor
    async function finalizarEntrada() {
        const origemSelect = document.getElementById("origensSelect");
        const origemId = origemSelect.value;
        
        const produtos = [];
        entradaTable.querySelectorAll("tbody tr").forEach((row) => {
            const produtoId = row.getAttribute("data-id");
            const totalReal = row.querySelector(".total-real").innerText;
            const total = row.querySelector(".input-group input").value;
            produtos.push({
                id: produtoId,
                total_real: totalReal,
                total: total
            });
        });

        if (!origemId || produtos.length === 0) {
            console.error('Todos os campos são obrigatórios.');
            appendAlert('Todos os campos são obrigatórios.', 'danger');
            return;
        }

        const dados = {
            origem: origemId,
            produtos: produtos
        };

        const solicitacoes = new Solicitacoes();
        try {
            const resposta = await solicitacoes.fazerSolicitacao('/entradas/', dados);
            console.log('Entrada registrada com sucesso:', resposta);
            sessionStorage.setItem('alertMessage', 'Entrada registrada com sucesso!');
            sessionStorage.setItem('alertType', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 300);
        } catch (erro) {
            console.error('Erro ao registrar entrada:', erro);
            appendAlert('Erro ao registrar entrada: ' + erro.error, 'danger');
        }
    }

    finalizarButton.addEventListener("click", finalizarEntrada);
});
