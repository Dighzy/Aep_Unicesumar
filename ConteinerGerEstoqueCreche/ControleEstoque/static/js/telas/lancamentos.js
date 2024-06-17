document.addEventListener('DOMContentLoaded', function () {
    function filtrarUsuarios() {
        const input = document.getElementById('pesquisarLancamento');
        const filtro = input.value.toLowerCase();
        const tabela = document.getElementById('CE_Lancamento');
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
  
    const inputPesquisar = document.getElementById('pesquisarLancamento');
    inputPesquisar.addEventListener('input', filtrarUsuarios);
  });