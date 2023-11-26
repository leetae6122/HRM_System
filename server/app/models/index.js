'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const createError = require('http-errors');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '../config/configDb.js'))[env];
const db = {};

const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};

// const hook = {
//   beforeUpdate: (record) => {
//     record.dataValues.updatedAt = Sequelize.fn('statement_timestamp');
//   }
// }

let sequelize;
if (config.url) {
  sequelize = new Sequelize(config.url, { operatorsAliases, ...config });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password,
    { operatorsAliases, ...config }
  );
}
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize.query = async function () {
  return Sequelize.prototype.query.apply(this, arguments).catch(function (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new createError(400, error.errors[0].message)
    }
    if (error.name === "SequelizeForeignKeyConstraintError") {
      throw new createError(400, `This ${error.table} cannot be deleted`);
    }
  });
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
