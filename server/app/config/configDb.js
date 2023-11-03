require('dotenv').config();

module.exports = {
    development: {
        username: process.env.SEQUELIZE_USERNAME,
        password: process.env.SEQUELIZE_PASSWORD,
        database: process.env.SEQUELIZE_DATABASE,
        host: process.env.SEQUELIZE_HOST,
        port: process.env.SEQUELIZE_PORT,
        dialect: process.env.SEQUELIZE_DIALECT,
        logging: false,
        timezone: "+07:00",
        define: {
            freezeTableName: true,
            charset: "utf8",
            collate: "utf8_general_ci"
        }
    },
    test: {
        username: "root",
        password: null,
        database: "database_test",
        host: "127.0.0.1",
        dialect: "mysql"
    },
    production: {
        username: "root",
        password: null,
        database: "database_production",
        host: "127.0.0.1",
        dialect: "mysql"
    }
}