import MatchModel from './match-model.js'

import { Op, Sequelize } from 'sequelize'

const sequalize = new Sequelize('sqlite::memory:')

const matchModel = await MatchModel(sequalize)
await matchModel.sync({ force: true })

export async function createMatch(params) {
  return matchModel.create(params)
}

export async function listMatch(params) {
  const { difficulty, start_time } = params
  return matchModel.findAll({
    where: {
      difficulty: {
        [Op.eq]: difficulty,
      },
      start_time: {
        [Op.gte]: new Date(start_time - 30000).getTime(),
      },
    },
  });
}
