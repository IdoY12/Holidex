import { Sequelize } from "sequelize-typescript";
import config from 'config'
import User from "../models/User";
import Like from "../models/Like";
import Vacation from "../models/Vacation";

const sequelize = new Sequelize({
    ...config.get('db'),
    dialect: 'mysql',
    models: [User, Like, Vacation],
    logging: console.log
})

export default sequelize