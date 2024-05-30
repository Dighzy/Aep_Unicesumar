export class Modal {
  constructor() {
    this.modal = document.getElementById("modalGenerica");
    this.titulo = document.getElementById("titulo");
    this.mensagem = document.getElementById("msg");
    this.botao1 = document.getElementById("botao1");
    this.botao2 = document.getElementById("botao2");
    this.botaoFechar = document.getElementById("fechar");
  }

  parametrizar(titulo, mensagem, botao1, botao2) {
    this.titulo.textContent = titulo;
    this.mensagem.textContent = mensagem;
    this.botao1.textContent = botao1;
    this.botao2.textContent = botao2;
  }

  abrir() {
    this.modal.style.display = "block";
  }

  fechar() {
    this.modal.style.display = "none";
  }

  eventoFechar() {
    this.botaoFechar.addEventListener("click", () => this.fechar());
  }

  eventoBotao1(callback) {
    this.botao1.addEventListener("click", callback);
  }

  eventoBotao2(callback) {
    this.botao2.addEventListener("click", callback);
  }

  adicionarBotaoAcionador(id) {
    let botaoAcionador = document.getElementById(id);
    botaoAcionador.addEventListener("click", () => {
      this.parametrizar(
        "Confirmação",
        "Tem certeza que deseja excluir esse usuário?",
        "Cancelar",
        "Confirmar"
      );
      this.abrir();
    });
  }
}

export class Usuarios {
  constructor() {
    this.formularioUsuario = document.getElementById("formularioUsuario");
    this.nome = document.getElementById("nome");
    this.sobrenome = document.getElementById("sobrenome");
    this.email = document.getElementById("email");
    this.administrador = document.getElementById("administrador");
    this.usuario = document.getElementById("usuario");
    this.novoUsuario = document.getElementById("novoUsuario");
    this.botaoCancelar = document.getElementById("cancelar");
    this.botaoSalvar = document.getElementById("salvar");
  }

  inicializar() {
    this.configurarTabela();
    this.configurarNovoUsuario();
    this.configurarBotoes();
  }

  configurarTabela() {
    document.querySelectorAll("table tbody tr").forEach((row) => {
      row.addEventListener("click", () => {
        this.formularioUsuario.classList.remove("d-none");

        this.nome.value = row.querySelector("td:nth-child(2)").textContent;
        this.sobrenome.value = row.querySelector("td:nth-child(3)").textContent;
        this.email.value = row.querySelector("td:nth-child(5)").textContent;

        var userType = row.querySelector("td:nth-child(4)").textContent;
        if (userType.trim() === "Administrador") {
          this.administrador.checked = true;
        } else {
          this.usuario.checked = true;
        }

        var userId = row.id;

        var params = new URLSearchParams(window.location.search);
        params.set("usuario_id", userId);

        window.history.replaceState({}, "", "/usuarios/?" + params.toString());
      });
    });
  }

  configurarNovoUsuario() {
    this.novoUsuario.addEventListener("click", () => {
      this.formularioUsuario.classList.remove("d-none");

      this.nome.value = "";
      this.sobrenome.value = "";
      this.email.value = "";
      this.usuario.checked = false;
      this.administrador.checked = false;

      var params = new URLSearchParams(window.location.search);
      params.delete("usuario_id");

      window.history.replaceState({}, "", "/usuarios/");
    });
  }

  configurarBotoes() {
    this.botaoCancelar.addEventListener("click", () => {
      this.formularioUsuario.classList.add("d-none");
      console.log("cancelar");
      // Outras ações de cancelamento, se necessário
    });

    this.botaoSalvar.addEventListener("click", () => {
      console.log("salvar");
      // Outras ações de salvamento, se necessário
    });
  }
}

export class TableSorter {
  constructor(tableId) {
    this.table = document.getElementById(tableId);
  }

  sort(n) {
    var rows,
      switching,
      i,
      x,
      y,
      shouldSwitch,
      dir,
      switchcount = 0;
    switching = true;
    dir = "asc";
    while (switching) {
      switching = false;
      rows = this.table.rows;
      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        var xVal = isNaN(parseFloat(x.innerHTML))
          ? x.innerHTML.toLowerCase()
          : parseFloat(x.innerHTML);
        var yVal = isNaN(parseFloat(y.innerHTML))
          ? y.innerHTML.toLowerCase()
          : parseFloat(y.innerHTML);
        if (dir == "asc") {
          if (xVal > yVal) {
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (xVal < yVal) {
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount++;
      } else {
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

  setupSorting() {
    this.table.querySelectorAll("thead th").forEach((cell, index) => {
      cell.onclick = () => this.sort(index);
    });
  }
}

export class Solicitacoes {
  constructor(formId) {
    this.form = formId ? document.getElementById(formId) : null;
    this.baseURLTeste = 'http://localhost:8000';
    this.baseURLProducao = 'https://seusite.com';
  }

  obterCookie(nome) {
    let valorCookie = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, nome.length + 1) === nome + "=") {
          valorCookie = decodeURIComponent(cookie.substring(nome.length + 1));
          break;
        }
      }
    }
    return valorCookie;
  }

  async fazerSolicitacao(endpoint, dados = {}, metodo = "POST") {
    try {
      const tokenCsrf = this.obterCookie("csrftoken");

      const opcoes = {
        method: metodo,
        headers: {
          "X-CSRFToken": tokenCsrf,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

      if (metodo !== "GET" && metodo !== "HEAD" && metodo !== "DELETE") {
        opcoes.body = JSON.stringify(dados);
      }

      const urlBase = window.location.hostname === "127.0.0.1" ? this.baseURLTeste : this.baseURLProducao;
      const url = `${urlBase}${endpoint}`;
      const resposta = await fetch(url, opcoes);

      if (!resposta.ok) {
        const erro = await resposta.json();
        throw { error: erro.error, status: resposta.status };
      }

      return await resposta.json();
    } catch (erro) {
      throw erro;
    }
  }

  async login(form) {
    if (!form) {
      throw new Error('Formulário não especificado.');
    }

    const formData = new FormData(form);

    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        "X-CSRFToken": form.querySelector("input[name=csrfmiddlewaretoken]").value,
      },
      credentials: "same-origin",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error);
    }

    return response.text();
  }

  acessarEstoque() {
    window.location.href = "/estoque/";
  }
  
}

export class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.email = this.form.querySelector("#email");
    this.emailVazio = this.form.querySelector("#emailVazio");
    this.emailInvalido = this.form.querySelector("#emailInvalido");
    this.password = this.form.querySelector("#password");
    this.senhaVazia = this.form.querySelector("#senhaVazia");
    this.loginInvalidoAlert = document.querySelector("#loginInvalidoAlert");
    this.loginButton = document.querySelector("#login");
    this.formSubmitted = false;
  }

  validateEmail() {
    var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    this.email.classList.remove("is-valid");
    this.email.classList.remove("is-invalid");

    if (this.email.value === "") {
      this.email.classList.add("is-invalid");
      this.emailVazio.style.display = "block";
      this.emailInvalido.style.display = "none";
    } else if (!emailRegex.test(this.email.value)) {
      this.email.classList.add("is-invalid");
      this.emailVazio.style.display = "none";
      this.emailInvalido.style.display = "block";
    } else {
      this.email.classList.add("is-valid");
      this.emailVazio.style.display = "none";
      this.emailInvalido.style.display = "none";
    }
  }

  validatePassword() {
    if (this.password.value === "") {
      this.password.classList.remove("is-valid");
      this.password.classList.add("is-invalid");
      this.senhaVazia.style.display = "block";
    } else {
      this.password.classList.remove("is-invalid");
      this.password.classList.add("is-valid");
      this.senhaVazia.style.display = "none";
    }
  }

  shakeButton() {
    this.loginButton.classList.add("shake");
    setTimeout(() => {
      this.loginButton.classList.remove("shake");
    }, 1000);
  }

  showInvalidLoginAlert() {
    this.loginInvalidoAlert.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show text-center m-0 w-100" role="alert">
        Conta inexistente ou credenciais inválidas.
      </div>
    `;
    this.loginInvalidoAlert.style.visibility = "visible";
  }

  setupValidation(onValidSubmit) {
    this.form.addEventListener("submit", async (event) => {
      this.formSubmitted = true;

      this.form.classList.remove("was-validated");

      this.validateEmail();
      this.validatePassword();

      if (!this.form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        this.form.classList.add("was-validated");

        event.preventDefault();

        document.querySelector(".spinner-border").style.display = "block";

        await onValidSubmit();

        document.querySelector(".spinner-border").style.display = "none";
      }
    });

    this.email.addEventListener("input", () => {
      if (this.formSubmitted) {
        this.validateEmail();
      }
    });

    this.password.addEventListener("input", () => {
      if (this.formSubmitted) {
        this.validatePassword();
      }
    });
  }
}

export class Login {
  constructor(solicitacoes, validator) {
    this.solicitacoes = solicitacoes;
    this.validator = validator;
  }

  async handleLogin() {
    try {
      const text = await this.solicitacoes.login(this.validator.form);
      this.solicitacoes.acessarEstoque();
    } catch (error) {
      this.validator.showInvalidLoginAlert();
      this.validator.shakeButton();
    }
  }

  initialize() {
    this.validator.setupValidation(() => this.handleLogin());
  }
}

