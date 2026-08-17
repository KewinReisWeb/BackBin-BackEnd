const express = require("express");

const clienteController = require("./controller/clienteController");
const receitaController = require("./controller/receitaController");

const authorization = require("./middleware/authorization");

const routes = express.Router();


// ==========================
// Cliente
// ==========================

// Cadastro
routes.post("/cliente", clienteController.create);

// Login
routes.post("/cliente/login", clienteController.login);

// Listar clientes
routes.get("/cliente", authorization, clienteController.searchUsersAll);

// Perfil
routes.get("/cliente/profile", authorization, clienteController.profile);  

// Buscar cliente por e-mail
routes.get("/cliente/:email", authorization, clienteController.getByEmail);

// Atualizar perfil
routes.put("/cliente/profile", authorization, clienteController.updateProfile);

// Excluir conta
routes.delete("/cliente/profile", authorization, clienteController.deleteAccount);


// ==========================
// Receitas e Despesas
// ==========================

// Criar movimentação
routes.post("/receita", authorization, receitaController.create);

// Listar movimentações
routes.get("/receita", authorization, receitaController.list);

// Buscar por ID
routes.get("/receita/:id", authorization, receitaController.show);

// Atualizar movimentação
routes.put("/receita/:id", authorization, receitaController.update);

// Excluir movimentação
routes.delete("/receita/:id", authorization, receitaController.delete);

// Dashboard Financeiro
routes.get("/dashboard", authorization, receitaController.dashboard);

module.exports = routes;