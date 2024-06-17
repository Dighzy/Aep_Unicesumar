import { TableSorter, Solicitacoes } from "../componentes/classes.js";

let sorter = new TableSorter("CE_Estoque");
sorter.setupSorting();

document.addEventListener('DOMContentLoaded', function () {
    function filtrarUsuarios() {
        const input = document.getElementById('pesquisarProduto');
        const filtro = input.value.toLowerCase();
        const tabela = document.getElementById('CE_Estoque');
        const linhas = tabela.getElementsByTagName('tr');

        for (let i = 1; i < linhas.length; i++) {
            const colunas = linhas[i].getElementsByTagName('td');
            let encontrou = false;

            for (let j = 0; j < colunas.length; j++) {
                const valor = colunas[j].textContent || colunas[j].innerText;
                if (valor.toLowerCase().indexOf(filtro) > -1) {
                    encontrou = true;
                    break;
                }
            }

            if (encontrou) {
                linhas[i].style.display = '';
            } else {
                linhas[i].style.display = 'none';
            }
        }
    }

    const inputPesquisar = document.getElementById('pesquisarProduto');
    inputPesquisar.addEventListener('input', filtrarUsuarios);

    const table = document.getElementById('CE_Estoque');
    table.addEventListener('click', function(event) {
        let target = event.target;
        while (target && target.nodeName !== 'TR') {
            target = target.parentElement;
        }
        if (target) {
            const produtoId = target.getAttribute('data-id');
            if (produtoId) {
                fetchLancamentos(produtoId);
            }
        }
    });

    async function fetchLancamentos(produtoId) {
        const solicitacoes = new Solicitacoes();
        try {
            const data = await solicitacoes.fazerSolicitacao(`/lancamentos_produto/${produtoId}/`, {}, 'GET');
            const lancamentosTable = document.getElementById('CE_Lancamentos');
            const tbody = lancamentosTable.querySelector('tbody');
            tbody.innerHTML = '';

            data.lancamentos.forEach(lancamento => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="text-secondary">${lancamento.id}</td>
                    <td class="text-secondary">${lancamento.tipo}</td>
                    <td class="text-secondary">${lancamento.categoria}</td>
                    <td class="text-secondary">${lancamento.total}</td>
                    <td class="text-secondary">${lancamento.data}</td>
                    <td class="text-end"><img src="/static/img/registro-2.svg" alt="" /></td>
                `;
                tbody.appendChild(tr);
            });

            if (data.lancamentos.length > 0) {
                const primeiroMovimento = data.lancamentos[0];
                const ultimoMovimento = data.lancamentos[data.lancamentos.length - 1];

                // Preenchendo os dados do primeiro movimento
                document.getElementById('primeiro-movimento').innerText = primeiroMovimento.data;
                document.getElementById('tipo-primeiro-movimento').innerText = primeiroMovimento.tipo;
                document.getElementById('quantidade-primeiro-movimento').innerText = primeiroMovimento.total;
                document.getElementById('categoria-primeiro-movimento').innerText = primeiroMovimento.categoria;

                // Preenchendo os dados do último movimento
                document.getElementById('ultimo-movimento').innerText = ultimoMovimento.data;
                document.getElementById('tipo-ultimo-movimento').innerText = ultimoMovimento.tipo;
                document.getElementById('quantidade-ultimo-movimento').innerText = ultimoMovimento.total;
                document.getElementById('categoria-ultimo-movimento').innerText = ultimoMovimento.categoria;
            }
        } catch (error) {
            console.error('Erro ao buscar lançamentos:', error);
        }
    }
});
