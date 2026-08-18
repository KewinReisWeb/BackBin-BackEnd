const knex = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "ndskvbjksdvnlkjsdbvljk";

module.exports = {

   // Cadastro // 

async create(req, res) {

    try {

        const { nome, email, password } = req.body;

        if (!nome || !email || !password) {
            return res.status(400).json({
                erro: "Preencha todos os campos."
            });
        }

        const clienteExiste = await knex("clientes")
            .where({ email })
            .first();

        if (clienteExiste) {
            return res.status(400).json({
                erro: "Este e-mail já está cadastrado."
            });
        }

        const senha = await bcrypt.hash(password, 10);

       const [novoCliente] = await knex("clientes").insert({
        nome,
        email,
        senha
        }).returning("id");

        const clienteId = novoCliente.id;

        const token = jwt.sign(
            {
                idUser: clienteId,
                nome,
                email
            },
            SECRET_KEY,
            {
                expiresIn: "1h"
            }
        );

        return res.status(201).json({

            mensagem: "Cadastro realizado com sucesso.",

            token,

            cliente: {

                id: clienteId,
                nome,
                email

            }

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            erro: "Erro interno do servidor."
        });

    }

},

    // Login //

    async login(req, res) {

        try {

            const { email, password } = req.body;

            const cliente = await knex("clientes")
                .where({ email })
                .first();

            if (!cliente) {

                return res.status(404).json({
                    erro: "Cliente não encontrado."
                });

            }

            const senhaValida = await bcrypt.compare(password, cliente.senha);

            if (!senhaValida) {

                return res.status(401).json({
                    erro: "Senha inválida."
                });

            }

            const token = jwt.sign({

                    idUser: cliente.id,
                    nome: cliente.nome,
                    email: cliente.email

                },

                SECRET_KEY,

                {
                    expiresIn: "1h"
                }

            );

            return res.status(200).json({

                mensagem: "Login realizado com sucesso.",

                token,

                cliente: {

                    id: cliente.id,
                    nome: cliente.nome,
                    email: cliente.email

                }

            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({

                erro: "Erro interno."

            });

        }

    },

    // Listar Clientes//
    
    async searchUsersAll(req, res) {

        try {

            const clientes = await knex("clientes")
                .select("id", "nome", "email");

            return res.status(200).json(clientes);

        } catch (error) {

            return res.status(500).json({
                erro: "Erro ao listar clientes."
            });

        }

    },


    // Buscar por email//

    async getByEmail(req, res) {

        try {

            const { email } = req.params;

            const cliente = await knex("clientes")
                .where({ email })
                .first();

            if (!cliente) {

                return res.status(404).json({
                    erro: "Cliente não encontrado."
                });

            }

            return res.status(200).json({

                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email

            });

        } catch (error) {

            return res.status(500).json({
                erro: "Erro interno."
            });

        }

    },


    // Perfil //

    async profile(req, res) {

        try {

            const cliente = await knex("clientes")
                .where({
                    id: req.userId
                })
                .first();

            if (!cliente) {

                return res.status(404).json({
                    erro: "Cliente não encontrado."
                });

            }

            return res.status(200).json({

                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email

            });

        } catch (error) {

            return res.status(500).json({
                erro: "Erro interno."
            });

        }

    },


    // Atualizar perfil//

    async updateProfile(req, res) {

        try {

            const { nome, email, password } = req.body;

            const dados = {};

            if (nome) dados.nome = nome;

            if (email) dados.email = email;

            if (password) {

                dados.senha = await bcrypt.hash(password, 10);

            }

            await knex("clientes")
                .where({
                    id: req.userId
                })
                .update(dados);

            return res.status(200).json({

                mensagem: "Perfil atualizado com sucesso."

            });

        } catch (error) {

            return res.status(500).json({
                erro: "Erro ao atualizar perfil."
            });

        }

    },


    // Excluir conta //

    async deleteAccount(req, res) {

        try {

            await knex("receitas")
                .where({
                    cliente_id: req.userId
                })
                .del();

            await knex("clientes")
                .where({
                    id: req.userId
                })
                .del();

            return res.status(200).json({

                mensagem: "Conta excluída com sucesso."

            });

        } catch (error) {

            return res.status(500).json({
                erro: "Erro ao excluir conta."
            });

        }

    }

};