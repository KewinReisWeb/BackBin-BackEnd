const express = require("express");

const clienteController = require("./controller/clienteController");
const receitaController = require("./controller/receitaController");

const authorization = require("./middleware/authorization");

const routes = express.Router();


//Rotas do Clinete//

routes.post("/cliente", clienteController.create);   //Cadastro//
routes.post("/cliente/login", clienteController.login);   //Login//
routes.get("/cliente", authorization, clienteController.searchUsersAll);   // Listar clientes//
routes.get("/cliente/profile", authorization, clienteController.profile);   // Perfil// 
routes.get("/cliente/:email", authorization, clienteController.getByEmail);   // Buscar cliente por e-mail//
routes.put("/cliente/profile", authorization, clienteController.updateProfile);   // Atualizar perfil//
routes.delete("/cliente/profile", authorization, clienteController.deleteAccount);   // Excluir conta//



// Receitas e Despesas//

routes.post("/receita", authorization, receitaController.create);   // Criar movimentação//
routes.get("/receita", authorization, receitaController.list);    // Listar movimentações//
routes.get("/receita/:id", authorization, receitaController.show);   // Buscar por ID//
routes.put("/receita/:id", authorization, receitaController.update);   // Atualizar movimentação//
routes.delete("/receita/:id", authorization, receitaController.delete);  // Excluir movimentação//
routes.get("/dashboard", authorization, receitaController.dashboard);   // Dashboard Financeiro//

module.exports = routes;