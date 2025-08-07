const db = require('../db/db');

async function findAll() {
    return await db('casos').select('*');
}

async function findById(id) {
    return await db('casos').where({ id }).first();
}

async function create(caso) {
    // Remove o id se existir no payload (o PostgreSQL gerará automaticamente)
    const { id: _, ...dados } = caso;
    
    const [novoCaso] = await db('casos')
        .insert(dados)
        .returning('*');
    
    return novoCaso;
}

async function update(id, casoAtualizado) {
    // Remove o id se existir no payload para evitar atualização do ID
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

async function findByAgenteId(agente_id) {
    return await db('casos').where({ agente_id });
}

async function findByStatus(status) {
    return await db('casos').where('status', 'ilike', status);
}

async function searchByText(query) {
    return await db('casos')
        .where(function() {
            this.where('titulo', 'ilike', `%${query}%`)
                .orWhere('descricao', 'ilike', `%${query}%`);
        });
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
    findByAgenteId,
    findByStatus,
    searchByText
};