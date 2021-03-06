import * as Sequelize from 'sequelize';
import { DataModelFactory, VariableCacheDataModelFactory } from "./model"

/**
 * Create Sequelize by environment
 */
export class EnvDataModelFactory {
    //TODO: Should read a config file or env then create the database connection
    new(): DataModelFactory {
        const seq = new Sequelize.Sequelize('pickit', 'pickit', 'pickit', {
            logging: true,
            dialect: "sqlite",
            storage: "pickit.sqlite"
        })
        return new VariableCacheDataModelFactory(seq)
    }
}

