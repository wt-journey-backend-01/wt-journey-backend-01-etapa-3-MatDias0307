const db = require('../db/db');

async function findById(id) {
    return await db('casos').where({ id }).first();
}

async function create(caso) {
    const { id: _, ...dados } = caso;
    
    const [novoCaso] = await db('casos')
        .insert(dados)
        .returning('*');
    
    return novoCaso;
}

async function update(id, casoAtualizado) {
    const { id: _, ...dadosSemId } = casoAtualizado;
    
    const [casoAtualizadoDb] = await db('casos')
        .where({ id })
        .update(dadosSemId)
        .returning('*');
    
    return casoAtualizadoDb || null;
}

async function remove(id) {
    await db('casos').where({ id }).del();
}

async function searchWithFilters({ agente_id, status, q }) {
    return await db('casos')
        .modify(function(queryBuilder) {
            if (agente_id) {
                queryBuilder.where('agente_id', agente_id);
            }
            if (status) {
                queryBuilder.where('status', status.toLowerCase());
            }
            if (q) {
                queryBuilder.where(function() {
                    this.where('titulo', 'ilike', `%${q}%`)
                        .orWhere('descricao', 'ilike', `%${q}%`);
                });
            }
        });
}

module.exports = {
    findById,
    create,
    update,
    remove,
    searchWithFilters
};