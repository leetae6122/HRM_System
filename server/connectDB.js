import Sequelize from "sequelize";

const sequelize = new Sequelize(
    process.env.SEQUELIZE_DATABASE,
    process.env.SEQUELIZE_USERNAME,
    process.env.SEQUELIZE_PASSWORD,
    {
        host: process.env.SEQUELIZE_HOST,
        dialect: process.env.SEQUELIZE_DIALECT,
        port: process.env.SEQUELIZE_PORT,
        logging: false,
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
    },
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB;