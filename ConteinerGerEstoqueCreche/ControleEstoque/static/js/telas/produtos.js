import { Modal, TableSorter, Solicitacoes } from "../componentes/classes.js";

let sorter = new TableSorter("CE_Produto");
sorter.setupSorting();

document.addEventListener("DOMContentLoaded", function() {
    const formularioProduto = document.getElementById("formularioProduto");
    const btnCancelar = document.querySelector(".btn-cancelar");
    const btnNovoProduto = document.querySelector(".custom-button-2");
    const produtoRows = document.querySelectorAll(".produto-row");
    const btnSalvar = document.getElementById("salvar");
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder');

    // Função para esconder o formulário de produtos
    function esconderFormulario() {
        formularioProduto.classList.add("d-none");
    }

    // Função para exibir o formulário de produtos
    function exibirFormulario() {
        formularioProduto.classList.remove("d-none");
    }

    // Função para validar campos
    function validarCampos() {
        const camposTexto = formularioProduto.querySelectorAll("input[type='text'], input[type='number']");
        const dropdowns = formularioProduto.querySelectorAll(".form-select");
        const radios = formularioProduto.querySelectorAll("input[type='radio']");
        let camposValidos = true;

        // Validação de campos de texto e números
        camposTexto.forEach((campo) => {
            if (campo.value.trim() === "") {
                campo.classList.add("is-invalid");
                camposValidos = false;
            } else {
                campo.classList.remove("is-invalid");
            }
        });

        // Validação de dropdowns
        dropdowns.forEach((dropdown) => {
            const selectedOption = dropdown.parentElement.querySelector("input[type='radio']:checked");
            if (!selectedOption) {
                dropdown.classList.add("is-invalid");
                camposValidos = false;
            } else {
                dropdown.classList.remove("is-invalid");
            }
        });

        // Adiciona event listeners para remover a classe is-invalid quando o campo é preenchido
        formularioProduto.querySelectorAll("input, .form-select").forEach((campo) => {
            campo.addEventListener("input", () => {
                if (campo.value.trim() !== "") {
                    campo.classList.remove("is-invalid");
                }
            });
            if (campo.type === "radio") {
                campo.addEventListener("change", () => {
                    campo.classList.remove("is-invalid");
                    campo.closest(".dropdown").querySelector("button").classList.remove("is-invalid");
                });
            }
        });

        return camposValidos;
    }

    // Função para exibir alertas
    function appendAlert(message, type) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');

        alertPlaceholder.append(wrapper);
    }

    // Evento de clique para o botão de cancelar
    if (btnCancelar) {
        btnCancelar.addEventListener("click", function() {
            esconderFormulario();
        });
    }

    // Evento de clique para o botão de novo produto
    if (btnNovoProduto) {
        btnNovoProduto.addEventListener("click", function() {
            exibirFormulario();
        });
    }

    // Evento de clique para as rows da tabela de produtos
    if (produtoRows) {
        produtoRows.forEach(function(row) {
            row.addEventListener("click", function() {
                exibirFormulario();
            });
        });
    }

    // Evento de clique para o botão de salvar
    if (btnSalvar) {
        btnSalvar.addEventListener("click", function() {
            if (validarCampos()) {
                // Aqui você pode adicionar a lógica para salvar o produto se todos os campos forem válidos
                console.log("Todos os campos são válidos. Salvar produto...");
            } else {
                console.log("Há campos inválidos.");
                appendAlert('Erro: Verifique os campos e tente novamente.', 'danger');
            }
        });
    }
});
