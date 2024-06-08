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

  removeInvalidClass(ids) {
    ids.forEach(id => {
      const field = document.getElementById(id);
      if (field && field.classList.contains('is-invalid')) {
        field.classList.remove('is-invalid');
      }

      if (id === 'email') {
        const emailVazio = document.getElementById('vazio');
        const emailInvalido = document.getElementById('invalido');
        if (emailVazio) {
          emailVazio.style.display = 'none';
        }
        if (emailInvalido) {
          emailInvalido.style.display = 'none';
        }
      }
    });

    // Remover a classe is-invalid dos radios
    const usuarioRadio = document.getElementById("usuario");
    const administradorRadio = document.getElementById("administrador");
    usuarioRadio.classList.remove("is-invalid");
    administradorRadio.classList.remove("is-invalid");
  }

  validateFieldsById(ids) {
    let isValid = true;
    ids.forEach(id => {
      const field = document.getElementById(id);
      if (id === 'email') {
        this.email = field;
        this.emailVazio = document.getElementById('vazio');
        this.emailInvalido = document.getElementById('invalido');
        isValid = this.validateEmail() && isValid;
      } else {
        if (!field.value.trim()) {
          field.classList.add("is-invalid");
          isValid = false;
        } else {
          field.classList.remove("is-invalid");
        }
      }
    });

    // Validar os radios
    isValid = this.validateUserType() && isValid;

    return isValid;
  }

  validateEmail() {
    var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
      this.emailVazio.style.display = "none";
      this.emailInvalido.style.display = "none";
    }
    return !this.email.classList.contains("is-invalid");
  }

  validatePassword() {
    if (this.password.value === "") {
      this.password.classList.add("is-invalid");
      this.senhaVazia.style.display = "block";
    } else {
      this.password.classList.remove("is-invalid");
      this.senhaVazia.style.display = "none";
    }
  }

  validateUserType() {
    const usuarioRadio = document.getElementById("usuario");
    const administradorRadio = document.getElementById("administrador");

    usuarioRadio.classList.remove("is-invalid");
    administradorRadio.classList.remove("is-invalid");

    if (!usuarioRadio.checked && !administradorRadio.checked) {
      usuarioRadio.classList.add("is-invalid");
      administradorRadio.classList.add("is-invalid");
      return false;
    } else {
      return true;
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

        try {
          await onValidSubmit(this.email.value, this.password.value);
        } catch (error) {
          this.showInvalidLoginAlert();
          this.shakeButton();
        }

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

  revalidarCampo(id) {
    const field = document.getElementById(id);
    if (id === "email") {
      this.email = field;
      this.emailVazio = document.getElementById("vazio");
      this.emailInvalido = document.getElementById("invalido");
      this.validateEmail();
    } else {
      if (!field.value.trim()) {
        field.classList.add("is-invalid");
      } else {
        field.classList.remove("is-invalid");
      }
    }
  }
}


export class Login {
  constructor(solicitacoes, validator) {
    this.solicitacoes = solicitacoes;
    this.validator = validator;
  }

  async handleLogin(email, password) {
    try {
      const data = await this.solicitacoes.login(email, password);
      if (data.status === "ok") {
        this.solicitacoes.acessarEstoque();
      } else {
        this.validator.showInvalidLoginAlert();
        this.validator.shakeButton();
      }
    } catch (error) {
      console.log(error);
      this.validator.showInvalidLoginAlert();
      this.validator.shakeButton();
    }
  }

  initialize() {
    this.validator.setupValidation(this.handleLogin.bind(this));
  }
}

export class Solicitacoes {
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

  async fazerSolicitacao(endpoint, dados = {}, metodo = "POST", formId = null) {
    const form = formId ? document.getElementById(formId) : null;
    try {
      const tokenCsrf = this.obterCookie("csrftoken");

      const opcoes = {
        method: metodo,
        headers: {
          "X-CSRFToken": tokenCsrf,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      };

      if (metodo !== "GET" && metodo !== "HEAD" && metodo !== "DELETE") {
        opcoes.body = JSON.stringify(dados);
      }

      const url = `http://127.0.0.1:8000${endpoint}`;
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

  async login(email, password, formId) {
    const dados = { email, password };
    return await this.fazerSolicitacao("/", dados, "POST", formId);
  }

  acessarEstoque() {
    window.location.href = "/estoque/";
  }
  async getUsuario() {
    return await this.fazerSolicitacao("/usuarios/", {}, "GET");
  }

  async postUsuario(dadosUsuario) {
    return await this.fazerSolicitacao("/usuarios/", dadosUsuario, "POST");
  }

  async postProduto(dadosProdutos) {
    return await this.fazerSolicitacao("/produtos/", dadosProdutos, "POST");
  }

  async postCategoria(Categoria) {
    return await this.fazerSolicitacao(
      "/categorias_produto/",
      Categoria,
      "POST",
      null
    );
  }

  async postSubCategoria(SubCategoria) {
    return await this.fazerSolicitacao(
      "/subcategorias_produto/",
      SubCategoria,
      "POST",
      null
    );
  }

  async postCategoriaMovimento(CategoriaMovimento) {
    console.log("CategoriaMovimento", CategoriaMovimento);
    return await this.fazerSolicitacao(
      "/categorias_movimento/",
      CategoriaMovimento,
      "POST",
      null
    );
  }

  async patchUsuario(userId, dadosAtualizacao) {
    return await this.fazerSolicitacao(
      `/usuarios/${userId}/`,
      dadosAtualizacao,
      "PATCH"
    );
  }

  async putUsuario(userId, dadosAtualizacao) {
    return await this.fazerSolicitacao(
      `/usuarios/${userId}/`,
      dadosAtualizacao,
      "PUT"
    );
  }

  async deleteUsuario(userId) {
    return await this.fazerSolicitacao(`/usuarios/${userId}/`, {}, "DELETE");
  }

  async deleteProduto(ProdutoId) {
    return await this.fazerSolicitacao(`/produtos/${ProdutoId}/`, {}, "DELETE");
  }

  async deleteCategoria(CategoriaId) {
    return await this.fazerSolicitacao(
      `/categorias_produto/${CategoriaId}/`,
      {},
      "DELETE"
    );
  }

  async deleteSubCategoria(SubCategoriaId) {
    return await this.fazerSolicitacao(
      `/subcategorias_produto/${SubCategoriaId}/`,
      {},
      "DELETE"
    );
  }
  async deleteCategoriaMovimento(CategoriaMovimentoId) {
    return await this.fazerSolicitacao(
      `/categorias_movimento/${CategoriaMovimentoId}/`,
      {},
      "DELETE"
    );
  }
}
export class Modal {
  constructor() {
    this.modalElement = document.getElementById("modalGenerica");
    this.modal = new bootstrap.Modal(this.modalElement);
    this.titulo = document.getElementById("titulo");
    this.mensagem = document.getElementById("msg");
    this.botao1 = document.getElementById("botao1");
    this.botao2 = document.getElementById("botao2");
    this.botaoFechar = document.getElementById("fechar");
    this.dataId = null;
  }

  parametrizar(titulo, mensagem, botao1Texto, botao2Texto) {
    this.titulo.textContent = titulo;
    this.mensagem.textContent = mensagem;
    this.botao1.textContent = botao1Texto;
    this.atualizarTextoBotao(this.botao2, botao2Texto);
  }

  atualizarTextoBotao(botao, texto) {
    botao.textContent = texto;
  }

  abrir(dataId) {
    this.dataId = dataId;
    this.modal.show();
  }

  fechar() {
    this.modal.hide();
  }

  eventoFechar() {
    this.botaoFechar.addEventListener("click", () => this.fechar());
  }

  eventoBotao1(callback) {
    this.botao1.addEventListener("click", () => {
      callback(this.dataId);
    });
  }

  eventoBotao2(callback) {
    this.botao2.addEventListener("click", () => {
      callback(this.dataId);
    });
  }

  configurarBotaoAcionador(botaoAcionador, dataId) {
    botaoAcionador.addEventListener("click", () => {
      this.parametrizar(
        "Confirmação",
        "Tem certeza que deseja excluir esse usuário?",
        "Cancelar",
        "Confirmar"
      );
      this.abrir(dataId);
    });
  }
}

export class Usuarios {
  constructor() {
    this.inicializarElementos();
    this.inicializar();
  }

  inicializarElementos() {
    this.formularioUsuario = this.getElemento('formularioUsuario');
    this.nome = this.getElemento('nome');
    this.sobrenome = this.getElemento('sobrenome');
    this.email = this.getElemento('email');
    this.administrador = this.getElemento('administrador');
    this.usuario = this.getElemento('usuario');
    this.username = this.getElemento('username'); // Adicionado
    this.novoUsuario = this.getElemento('novoUsuario');
    this.botaoCancelar = this.getElemento('cancelar');
    this.botaoSalvar = this.getElemento('salvar');
    this.linhasTabela = this.getLinhasTabela();
  }

  getElemento(id) {
    return document.getElementById(id);
  }

  getLinhasTabela() {
    return document.querySelectorAll("table tbody tr");
  }

  inicializar() {
    this.configurarTabela();
    this.configurarNovoUsuario();
    this.configurarBotoes();
  }

  configurarTabela() {
    this.linhasTabela.forEach((row, index) => {
      this[`linha${index}`] = row; // Cria um atributo dinâmico para cada linha
      row.addEventListener("click", () => {
        this.formularioUsuario.classList.remove("d-none");

        this.nome.value = row.querySelector("td:nth-child(2)").textContent;
        this.sobrenome.value = row.querySelector("td:nth-child(3)").textContent;
        this.email.value = row.querySelector("td:nth-child(5)").textContent;
        this.username.value = row.querySelector("td:nth-child(1)").textContent; // Adicionado

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

  removerLinhaUsuario(userId) {
    const linha = document.getElementById(userId);
    if (linha) {
      linha.remove();
    }
  }

  configurarNovoUsuario() {
    this.novoUsuario.addEventListener("click", () => {
      this.exibirFormulario();
      this.limparCampos();
      this.limparUrl();
    });
  }

  exibirFormulario() {
    this.formularioUsuario.classList.remove("d-none");
  }

  ocultarFormulario() {
    this.formularioUsuario.classList.add("d-none");
  }

  limparCampos() {
    this.nome.value = "";
    this.sobrenome.value = "";
    this.email.value = "";
    this.username.value = ""; // Adicionado
    this.usuario.checked = false;
    this.administrador.checked = false;
  }

  limparUrl() {
    var params = new URLSearchParams(window.location.search);
    params.delete("usuario_id");
    window.history.replaceState({}, "", "/usuarios/");
  }

  preencherFormulario(dadosUsuario) { // Adicionado
    this.nome.value = dadosUsuario.first_name;
    this.sobrenome.value = dadosUsuario.last_name;
    this.email.value = dadosUsuario.email;
    this.username.value = dadosUsuario.username;
    if (dadosUsuario.is_superuser) {
      this.administrador.checked = true;
    } else {
      this.usuario.checked = true;
    }
  }

  configurarBotoes() {
    this.botaoCancelar.addEventListener("click", () => {
      this.ocultarFormulario();
      console.log("cancelar");
    });

    this.botaoSalvar.addEventListener("click", () => {
      console.log("salvar");
    });
  }
}

