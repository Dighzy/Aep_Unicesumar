import { Solicitacoes, FormValidator, Login } from "../componentes/classes.js";

document.addEventListener('DOMContentLoaded', () => {
  const solicitacoes = new Solicitacoes('loginForm');
  const validator = new FormValidator('loginForm');
  const login = new Login(solicitacoes, validator);

  login.initialize();
});
