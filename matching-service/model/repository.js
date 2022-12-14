import MatchEntryModel from "./match-model.js";

import { Op, Sequelize } from "sequelize";

const sequelize = new Sequelize("sqlite::memory:");

const matchEntryModel = await MatchEntryModel(sequelize);
await matchEntryModel.sync({ force: true });

export async function createMatchEntry(params) {
  return matchEntryModel.create(params);
}

export async function listValidMatchEntriesByDifficulty(params) {
  const { difficulty, start_time, socket_id } = params;
  return matchEntryModel.findAll({
    where: {
      difficulty: {
        [Op.eq]: difficulty,
      },
      start_time: {
        [Op.gte]: new Date(start_time - 30000).getTime(),
      },
      socket_id: {
        [Op.ne]: socket_id,
      }
    },
  });
}

export async function deleteMatchEntry(params) {
  const { socket_id } = params
  return matchEntryModel.destroy({
    where: {
      socket_id: {
        [Op.eq]: socket_id
      },
    },
  })
}
