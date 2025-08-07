const db = require('../db/db');

async function findAll() {
    return await db('agentes').select('*');
}

async function findById(id) {
    return await db('agentes').where({ id }).first();
}

async function create(agente) {
    const { id: _, ...dados } = agente;
    
    const [novoAgente] = await db('agentes')
        .insert(dados)
        .returning('*');
    
    return novoAgente;
}

async function update(id, agenteAtualizado) {
    const { id: _, ...dadosSemId } = agenteAtualizado;
    
    const [agenteAtualizadoDb] = await db('agentes')
        .where({ id })
        .update(dadosSemId)
        .returning('*');
    
    return agenteAtualizadoDb || null;
}

async function remove(id) {
    await db('agentes').where({ id }).del();
}

async function findByCargo(cargo) {
    return await db('agentes').where('cargo', 'ilike', cargo);
}

async function sortByIncorporacao(order = 'asc') {
    return await db('agentes')
        .select('*')
        .orderBy('dataDeIncorporacao', order === 'asc' ? 'asc' : 'desc');
}

async function getCasosByAgenteId(agenteId) {
    return await db('casos').where({ agente_id: agenteId });
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
    findByCargo,
    sortByIncorporacao,
    getCasosByAgenteId
};