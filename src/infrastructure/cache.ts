import { Sequelize } from "sequelize/types";

export interface CacheStrategy {
    create(instance: any): any
    update(instance: any): any
}
