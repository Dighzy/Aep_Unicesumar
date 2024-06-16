import { TableSorter } from "../componentes/classes.js";

let sorter = new TableSorter("CE_Estoque");
sorter.setupSorting();

document.addEventListener("DOMContentLoaded", () => {
    const table = document.getElementById("CE_Estoque");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) { // Começa de 1 para pular o cabeçalho
        rows[i].addEventListener("click", () => {
            const primeiroMovimento = rows[i].getAttribute("data-primeiro-movimento");
            const ultimoMovimento = rows[i].getAttribute("data-ultimo-movimento");
            const tipo = rows[i].getAttribute("data-tipo");
            const quantidade = rows[i].getAttribute("data-quantidade");
            const categoria = rows[i].getAttribute("data-categoria");

            document.getElementById("primeiro-movimento").innerText = primeiroMovimento;
            document.getElementById("ultimo-movimento").innerText = ultimoMovimento;
            document.getElementById("tipo-movimento").innerText = tipo;
            document.getElementById("quantidade-movimento").innerText = quantidade;
            document.getElementById("categoria-movimento").innerText = categoria;
        });
    }
});
