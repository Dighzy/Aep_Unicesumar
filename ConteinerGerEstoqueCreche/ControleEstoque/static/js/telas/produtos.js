import { Modal, TableSorter, Solicitacoes } from "../componentes/classes.js";

let sorter = new TableSorter("CE_Produto");
sorter.setupSorting();

document.addEventListener("DOMContentLoaded", function() {
    const solicitacoes = new Solicitacoes();
    const formularioProduto = document.getElementById("formularioProduto");
    const btnCancelar = document.querySelector(".btn-cancelar");
    const btnNovoProduto = document.querySelector(".custom-button-2");
    const produtoRows = document.querySelectorAll(".produto-row");
    const btnSalvar = document.getElementById("salvar");
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
    const inputCodigo = document.getElementById("codigo");
    const inputDescricao = document.getElementById("descricao");
    const inputPeso = document.getElementById("valor-peso");
    const inputUnidade = document.getElementById("valor-unidade-embalagem");
    const tipoContainer = document.getElementById("tipos-container");
    const categoriaContainer = document.getElementById("categorias-container");
    const subcategoriaContainer = document.getElementById("subcategorias-container");
    const embalagemContainer = document.getElementById("embalagens-container");
    const pesoContainer = document.getElementById("pesos-container");

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
            // Se o campo for o de Peso, pule a validação
            if (campo.id === 'valor-peso') {
                return;
            }

            if (campo.value.trim() === "") {
                campo.classList.add("is-invalid");
                camposValidos = false;
            } else {
                campo.classList.remove("is-invalid");
            }
        });

        // Validação de dropdowns
        dropdowns.forEach((dropdown) => {
            // Se o dropdown for o de Tipo de Peso, pule a validação
            if (dropdown.id === 'tipo-peso-options') {
                return;
            }

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

    // Função para remover is-invalid de todos os campos
    function removerInvalidClass() {
        const camposInvalidos = formularioProduto.querySelectorAll(".is-invalid");
        camposInvalidos.forEach((campo) => {
            campo.classList.remove("is-invalid");
        });
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

    // Função para atualizar o parâmetro de consulta na URL
    function updateQueryStringParameter(key, value) {
        let url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.pushState({}, '', url);
    }

    // Função para remover um parâmetro de consulta da URL
    function removeQueryStringParameter(key) {
        let url = new URL(window.location);
        url.searchParams.delete(key);
        window.history.pushState({}, '', url);
    }

    // Função para preencher o formulário com os dados do produto
    function preencherFormulario(produto) {
        inputCodigo.value = produto.codigo;
        inputDescricao.value = produto.descricao;
        inputPeso.value = produto.peso.replace(',', '.'); // Converter vírgula para ponto
        inputUnidade.value = produto.unidade;
    }

    // Função para mover e marcar o tipo correspondente no dropdown
    function atualizarDropdown(container, id) {
        const itens = Array.from(container.children);
        const itemSelecionado = itens.find(item => item.querySelector(`input[value="${id}"]`));

        if (itemSelecionado) {
            // Move o item selecionado para o topo da lista
            container.prepend(itemSelecionado);

            // Marca o botão de rádio correspondente
            itemSelecionado.querySelector('input[type="radio"]').checked = true;
        }
    }

    // Função para marcar o tipo de peso correspondente no dropdown
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
        const itemSelecionado = itens.find(item => item.querySelector(`input[value="${valorPeso}"]`));

        if (itemSelecionado) {
            // Marca o botão de rádio correspondente
            itemSelecionado.querySelector('input[type="radio"]').checked = true;
        }
    }

    // Função para garantir que o campo de unidade aceite apenas inteiros positivos
    inputUnidade.addEventListener("input", function(e) {
        const valor = e.target.value;
        e.target.value = valor.replace(/[^0-9]/g, ''); // Remove caracteres que não são dígitos
    });

    // Evento de clique para o botão de cancelar
    if (btnCancelar) {
        btnCancelar.addEventListener("click", function() {
            esconderFormulario();
            removerInvalidClass(); // Remover a classe is-invalid ao cancelar
            removeQueryStringParameter('produto_id'); // Remover o parâmetro da URL
        });
    }

    // Evento de clique para o botão de novo produto
    if (btnNovoProduto) {
        btnNovoProduto.addEventListener("click", function() {
            exibirFormulario();
            removerInvalidClass(); // Remover a classe is-invalid ao abrir novo produto
            removeQueryStringParameter('produto_id'); // Remover o parâmetro da URL
            // Limpar os campos do formulário ao abrir novo produto
            inputCodigo.value = "";
            inputDescricao.value = "";
            inputPeso.value = "";
            inputUnidade.value = "";
            tipoContainer.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.checked = false;
            });
            categoriaContainer.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.checked = false;
            });
            subcategoriaContainer.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.checked = false;
            });
            embalagemContainer.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.checked = false;
            });
            pesoContainer.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.checked = false;
            });
        });
    }

    // Evento de clique para as rows da tabela de produtos
    if (produtoRows) {
        produtoRows.forEach(function(row) {
            row.addEventListener("click", function() {
                const produtoId = row.getAttribute('data-codigo');
                updateQueryStringParameter('produto_id', produtoId);
                removerInvalidClass(); // Remover a classe is-invalid ao clicar em uma linha de produto
                exibirFormulario();

                // Obter os dados do produto a partir dos atributos da linha
                const produto = {
                    codigo: row.getAttribute('data-codigo'),
                    descricao: row.getAttribute('data-descricao'),
                    peso: row.getAttribute('data-peso'),
                    unidade: row.getAttribute('data-unidade'),
                    tipo: row.getAttribute('data-tipo'),
                    categoria: row.getAttribute('data-categoria'),
                    subCategoria: row.getAttribute('data-sub-categoria'),
                    embalagem: row.getAttribute('data-embalagem'),
                    tipoPeso: row.getAttribute('data-tipo-peso')
                };

                preencherFormulario(produto);
                atualizarDropdown(tipoContainer, produto.tipo);
                atualizarDropdown(categoriaContainer, produto.categoria);
                atualizarDropdown(subcategoriaContainer, produto.subCategoria);
                atualizarDropdown(embalagemContainer, produto.embalagem);
                atualizarTipoPeso(produto.tipoPeso);
            });
        });
    }

    // Evento de clique para o botão de salvar
    if (btnSalvar) {
        btnSalvar.addEventListener("click", async function() {
            if (validarCampos()) {
                let peso = inputPeso.value.trim();
                if (peso === "") {
                    peso = null; // Set null if peso is empty
                } else {
                    peso = parseFloat(peso.replace(',', '.')); // Convert to float
                }

                const dadosProduto = {
                    codigo: inputCodigo.value,
                    descricao: inputDescricao.value,
                    categoria_id: document.querySelector("input[name='categoria']:checked").value,
                    sub_categoria_id: document.querySelector("input[name='subcategoria']:checked").value,
                    peso: peso,
                    unidade: parseInt(inputUnidade.value),
                    tipo_id: document.querySelector("input[name='tipo']:checked").value,
                    embalagem_id: document.querySelector("input[name='embalagem']:checked") ? document.querySelector("input[name='embalagem']:checked").value : null,
                    tipo_peso: document.querySelector("input[name='peso']:checked").value === "KILO" ? "KG" : "LT"
                };

                try {
                    const resposta = await solicitacoes.fazerSolicitacao("/produtos/", dadosProduto);
                    console.log("Produto salvo com sucesso:", resposta);
                    appendAlert('Produto salvo com sucesso!', 'success');
                    // Atualizar a tabela ou fazer qualquer outra ação necessária
                } catch (erro) {
                    console.error("Erro ao salvar o produto:", erro);
                    appendAlert(`Erro ao salvar o produto: ${erro.error || 'Erro desconhecido'}`, 'danger');
                }
            } else {
                console.log("Há campos inválidos.");
                appendAlert('Erro: Verifique os campos e tente novamente.', 'danger');
            }
        });
    }
});
