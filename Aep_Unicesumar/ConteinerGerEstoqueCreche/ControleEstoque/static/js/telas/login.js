import { Solicitacoes, FormValidatorLogin, Login } from "../componentes/classes.js";

document.addEventListener('DOMContentLoaded', () => {
  const solicitacoes = new Solicitacoes();
  const validator = new FormValidatorLogin('loginForm');
  const login = new Login(solicitacoes, validator);

  login.initialize();
});
