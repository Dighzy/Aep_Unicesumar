// login.js
import { Solicitacoes, FormValidator, Login } from "../componentes/classes.js";

const solicitacoes = new Solicitacoes('loginForm');
const validator = new FormValidator('loginForm');
const login = new Login(solicitacoes, validator);

login.initialize();
