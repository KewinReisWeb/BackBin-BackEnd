const jwt = require("jsonwebtoken");

// Chave secreta (vinda do .env)
const SECRET_KEY = process.env.JWT_SECRET || "ndskvbjksdvnlkjsdbvljk";

module.exports = (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                erro: "Token não informado."
            });
        }

        const parts = authHeader.split(" ");

        if (parts.length !== 2) {
            return res.status(401).json({
                erro: "Formato do token inválido."
            });
        }

        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({
                erro: "Token deve seguir o padrão Bearer."
            });
        }

        const decoded = jwt.verify(token, SECRET_KEY);

        // Disponibiliza o ID do usuário para os controllers//
        req.userId = decoded.idUser;

        next();

    } catch (error) {

        return res.status(401).json({
            erro: "Token inválido ou expirado."
        });

    }
};