import { DataTypes } from 'sequelize'

export default (sequelize) => {
  const Match = sequelize.define(
    "Match", {
      username: DataTypes.STRING,
      difficulty: DataTypes.INTEGER,
      start_time: DataTypes.INTEGER,
      socket_id: DataTypes.STRING,
    }, {
      freezeTable: true
    }
  )
  return Match
}
