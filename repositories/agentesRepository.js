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
  const deletedCount = await db('agentes').where({ id }).del();
  return deletedCount > 0;
}

async function findByCargo(cargo) {
  return await db('agentes').where('cargo', 'ilike', cargo);
}

async function sortByIncorporacao(order = 'asc') {
  return await db('agentes')
    .select('*')
    .orderBy('dataDeIncorporacao', order === 'asc' ? 'asc' : 'desc');
}

async function findFiltered({ cargo, sort } = {}) {
  const qb = db('agentes');

  if (cargo) {
    qb.where('cargo', 'ilike', cargo);
  }

  if (sort) {
    const order = sort.startsWith('-') ? 'desc' : 'asc';
    qb.orderBy('dataDeIncorporacao', order);
  }

  return await qb.select('*');
}

function queryAll() {
  return db('agentes');
}

function queryByCargo(cargo) {
  return db('agentes').where('cargo', 'ilike', cargo);
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
  findFiltered,     
  queryAll,
  queryByCargo,
  getCasosByAgenteId
};
