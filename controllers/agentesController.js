const agentesRepository = require("../repositories/agentesRepository");

function validateAgente(agente, isUpdate = false) {
    const errors = [];
    
    if (!isUpdate) {
        if (!agente.nome) {
            errors.push({ field: 'nome', message: "O campo 'nome' é obrigatório" });
        } else if (typeof agente.nome !== "string") {
            errors.push({ field: 'nome', message: "O campo 'nome' deve ser uma string" });
        }
        
        if (!agente.dataDeIncorporacao) {
            errors.push({ field: 'dataDeIncorporacao', message: "O campo 'dataDeIncorporacao' é obrigatório" });
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(agente.dataDeIncorporacao)) {
            errors.push({ field: 'dataDeIncorporacao', message: "O campo 'dataDeIncorporacao' deve seguir o formato 'YYYY-MM-DD'" });
        } else {
            const data = new Date(agente.dataDeIncorporacao);
            const hoje = new Date();
            hoje.setHours(0,0,0,0);
            if (data > hoje) {
                errors.push({ field: 'dataDeIncorporacao', message: "A data de incorporação não pode ser futura" });
            }
        }
        
        if (!agente.cargo) {
            errors.push({ field: 'cargo', message: "O campo 'cargo' é obrigatório" });
        } else if (!['delegado', 'inspetor', 'detetive'].includes(agente.cargo.toLowerCase())) {
            errors.push({ field: 'cargo', message: "O campo 'cargo' deve ser 'delegado', 'inspetor' ou 'detetive'" });
        }
    }

    return errors;
}

function validateAgentePartial(agente) {
    const errors = [];

    if (Object.keys(agente).length === 0) {
        errors.push("Payload não pode estar vazio");
        return errors;
    }

    if (agente.dataDeIncorporacao) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(agente.dataDeIncorporacao)) {
            errors.push("Campo 'dataDeIncorporacao' deve seguir o formato 'YYYY-MM-DD'");
        } else {
            const data = new Date(agente.dataDeIncorporacao);
            const hoje = new Date();
            hoje.setHours(0,0,0,0);
            if (data > hoje) {
                errors.push("O campo 'dataDeIncorporacao' não pode ser uma data futura");
            }
        }
    }

    if (agente.nome && typeof agente.nome !== "string") {
        errors.push("Campo 'nome' deve ser uma string");
    }

    if (agente.cargo && !['delegado', 'inspetor', 'detetive'].includes(agente.cargo.toLowerCase())) {
        errors.push("Campo 'cargo' deve ser 'delegado', 'inspetor' ou 'detetive'");
    }

    return errors;
}

async function getAllAgentes(req, res) {
    try {
        const { cargo, sort } = req.query;
        
        if (sort && !['dataDeIncorporacao', '-dataDeIncorporacao'].includes(sort)) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors: ["O parâmetro 'sort' deve ser 'dataDeIncorporacao' ou '-dataDeIncorporacao'"]
            });
        }

        if (cargo && !['delegado', 'inspetor', 'detetive'].includes(cargo.toLowerCase())) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors: ["O parâmetro 'cargo' deve ser um dos valores: 'delegado', 'inspetor', 'detetive'"]
            });
        }

        let agentes;
        
        if (cargo) {
            agentes = await agentesRepository.findByCargo(cargo);
            if (agentes.length === 0) {
                return res.status(404).json({
                    status: 404,
                    message: "Nenhum agente encontrado para o cargo especificado"
                });
            }
        } else {
            agentes = await agentesRepository.findAll();
        }
        
        if (sort) {
            const order = sort.startsWith('-') ? 'desc' : 'asc';
            agentes = await agentesRepository.sortByIncorporacao(order);
        }

        res.json(agentes);
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            message: "Erro interno no servidor",
            error: error.message 
        });
    }
}

async function getAgenteById(req, res) {
    try {
        const agente = await agentesRepository.findById(req.params.id);
        if (agente) {
            res.json(agente);
        } else {
            res.status(404).json({ 
                status: 404,
                message: "Agente não encontrado" 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            message: "Erro interno no servidor",
            error: error.message 
        });
    }
}

async function createAgente(req, res) {
    try {
        const errors = validateAgente(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ 
                status: 400,
                message: "Parâmetros inválidos",
                errors
            });
        }

        const novoAgente = await agentesRepository.create(req.body);
        res.status(201).json(novoAgente);
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            message: "Erro interno no servidor",
            error: error.message 
        });
    }
}

async function updateAgente(req, res) {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: 400,
                message: "Payload não pode estar vazio",
                errors: ["É necessário enviar os dados para atualização"]
            });
        }

        const agenteExistente = await agentesRepository.findById(req.params.id);
        if (!agenteExistente) {
            return res.status(404).json({ 
                status: 404,
                message: "Recurso não encontrado",
                errors: ["Agente não encontrado para o ID especificado"]
            });
        }

        const errors = validateAgente(req.body, true);
        if (errors.length > 0) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors
            });
        }

        const agenteAtualizado = await agentesRepository.update(req.params.id, req.body);
        res.json(agenteAtualizado);
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            message: "Erro interno no servidor",
            error: error.message 
        });
    }
}

async function patchAgente(req, res) {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: 400,
                message: "Payload não pode estar vazio",
                errors: ["É necessário enviar os dados para atualização"]
            });
        }

        const agenteExistente = await agentesRepository.findById(req.params.id);
        if (!agenteExistente) {
            return res.status(404).json({ 
                status: 404,
                message: "Recurso não encontrado",
                errors: ["Agente não encontrado para o ID especificado"]
            });
        }

        const errors = validateAgentePartial(req.body);
        if (errors.length > 0) {
            return res.status(400).json({
                status: 400,
                message: "Parâmetros inválidos",
                errors
            });
        }

        const agenteAtualizado = await agentesRepository.update(req.params.id, req.body);
        res.json(agenteAtualizado);
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            message: "Erro interno no servidor",
            error: error.message 
        });
    }
}

async function deleteAgente(req, res) {
    try {
        const agenteExistente = await agentesRepository.findById(req.params.id);
        if (!agenteExistente) {
            return res.status(404).json({ 
                status: 404,
                message: "Agente não encontrado" 
            });
        }

        await agentesRepository.remove(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            message: "Erro interno no servidor",
            error: error.message 
        });
    }
}

async function getCasosByAgenteId(req, res) {
    try {
        const agente = await agentesRepository.findById(req.params.id);
        if (!agente) {
            return res.status(404).json({
                status: 404,
                message: "Agente não encontrado"
            });
        }

        const casos = await agentesRepository.getCasosByAgenteId(req.params.id);
        res.json(casos);
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Erro ao buscar casos do agente",
            error: error.message
        });
    }
}

module.exports = {
    getAllAgentes,
    getAgenteById,
    createAgente,
    updateAgente,
    patchAgente,
    deleteAgente,
    getCasosByAgenteId
};