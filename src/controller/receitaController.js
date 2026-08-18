const knex = require("../database");

module.exports = {

    
    // Criar Receita ou Despesa//

    async create(req, res) {

        try {

            const userId = req.userId;

            if (!userId) {
                return res.status(401).json({
                    erro: "Usuário não autenticado."
                });
            }

            const {
                descricao,
                valor,
                tipo,
                categoria,
                data
            } = req.body;

            if (!descricao || !valor || !tipo || !categoria || !data) {
                return res.status(400).json({
                    erro: "Preencha todos os campos."
                });
            }

            if (tipo !== "receita" && tipo !== "despesa") {
                return res.status(400).json({
                    erro: "Tipo deve ser 'receita' ou 'despesa'."
                });
            }

     const [novaReceita] = await knex("receitas")
    .insert({ cliente_id: userId, descricao, valor, tipo, categoria, data })
    .returning("id");  // Retorno pro Postgres// 

return res.status(201).json({
    mensagem: "Movimentação cadastrada com sucesso.",
    id: novaReceita.id
});} catch (error) {

            console.error(error);

            return res.status(500).json({
                erro: "Erro interno do servidor."
            });

        }

    },

    
    // Listar movimentações //

    async list(req, res) {

        try {

            const movimentacoes = await knex("receitas")
                .where({
                    cliente_id: req.userId
                })
                .orderBy("data", "desc");

            return res.status(200).json(movimentacoes);

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                erro: "Erro ao listar movimentações."
            });

        }

    },

    
    // Buscar movimentação//
    
    async show(req, res) {

        try {

            const { id } = req.params;

            const movimentacao = await knex("receitas")
                .where({
                    id,
                    cliente_id: req.userId
                })
                .first();

            if (!movimentacao) {

                return res.status(404).json({
                    erro: "Movimentação não encontrada."
                });

            }

            return res.status(200).json(movimentacao);

        } catch (error) {

            return res.status(500).json({
                erro: "Erro interno."
            });

        }

    },

    
    // Atualizar movimentação//

    async update(req, res) {

        try {

            const { id } = req.params;

            const {
                descricao,
                valor,
                tipo,
                categoria,
                data
            } = req.body;

            await knex("receitas")
                .where({
                    id,
                    cliente_id: req.userId
                })
                .update({
                    descricao,
                    valor,
                    tipo,
                    categoria,
                    data
                });

            return res.status(200).json({

                mensagem: "Movimentação atualizada com sucesso."

            });

        } catch (error) {

            return res.status(500).json({
                erro: "Erro ao atualizar movimentação."
            });

        }

    },

    
    // Excluir movimentação//
    
    async delete(req, res) {

        try {

            const { id } = req.params;

            const deleted = await knex("receitas")
                .where({
                    id,
                    cliente_id: req.userId
                })
                .del();

            if (!deleted) {

                return res.status(404).json({
                    erro: "Movimentação não encontrada."
                });

            }

            return res.status(200).json({

                mensagem: "Movimentação removida com sucesso."

            });

        } catch (error) {

            return res.status(500).json({
                erro: "Erro ao excluir movimentação."
            });

        }

    },

    
    // Dashboard Financeiro //
    
    async dashboard(req, res) {

        try {

            const receitas = await knex("receitas")
                .where({
                    cliente_id: req.userId,
                    tipo: "receita"
                })
                .sum("valor as total")
                .first();

            const despesas = await knex("receitas")
                .where({
                    cliente_id: req.userId,
                    tipo: "despesa"
                })
                .sum("valor as total")
                .first();

            const totalReceitas = Number(receitas.total) || 0;
            const totalDespesas = Number(despesas.total) || 0;

            const quantidade = await knex("receitas")
                .where({
                    cliente_id: req.userId
                })
                .count("id as total")
                .first();

            return res.status(200).json({

                receitas: totalReceitas,

                despesas: totalDespesas,

                saldo: totalReceitas - totalDespesas,

                quantidadeTransacoes: Number(quantidade.total)

            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({

                erro: "Erro ao gerar dashboard."

            });

        }

    }

};