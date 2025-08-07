exports.seed = async function(knex) {
    await knex('casos').del();
    return knex('casos').insert([
      {
        titulo: "Homicídio no Centro",
        descricao: "Vítima encontrada com sinais de arma branca",
        status: "aberto",
        agente_id: 1
      },
      {
        titulo: "Roubo a Banco",
        descricao: "Assalto à agência central durante o dia",
        status: "solucionado",
        agente_id: 2
      }
    ]);
  };