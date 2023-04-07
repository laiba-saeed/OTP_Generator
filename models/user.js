"use strict";
const table = "users";

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    table,
    {
      name: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      otp: DataTypes.STRING,
      otp_expiration_date: DataTypes.DATE,
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {}
  );

  // Users.beforeCreate((user) => {
  //   user.dataValues.createdAt = moment().unix();
  //   user.dataValues.updatedAt = moment().unix();
  // });
  // Users.beforeUpdate((user) => {
  //   user.dataValues.updatedAt = moment().unix();
  // });

  return Users;
};
