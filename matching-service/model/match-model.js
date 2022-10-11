import { DataTypes } from "sequelize";

export default (sequelize) => {
  const MatchEntry = sequelize.define(
    "MatchEntry",
    {
      username: DataTypes.STRING,
      difficulty: DataTypes.INTEGER,
      start_time: DataTypes.INTEGER,
      socket_id: DataTypes.STRING,
    },
    { freezeTableName: true }
  );
  return MatchEntry;
};
