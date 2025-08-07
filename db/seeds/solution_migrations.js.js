exports.seed = async function(knex) {
  await knex('casos').del();
  await knex('agentes').del();

  await knex('agentes').insert([
    { nome: 'João Silva', dataDeIncorporacao: '2020-01-15', cargo: 'Investigador' },
    { nome: 'Maria Oliveira', dataDeIncorporacao: '2018-06-10', cargo: 'Delegada' }
  ]);

  await knex('casos').insert([
    { titulo: 'Roubo no banco', descricao: 'Investigação em andamento', status: 'aberto', agente_id: 1 },
    { titulo: 'Homicídio no parque', descricao: 'Caso solucionado', status: 'solucionado', agente_id: 2 }
  ]);
};
