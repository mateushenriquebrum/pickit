import * as Sequelize from "sequelize";
import {VariableCacheDataModelFactory, RedisCacheDataModelFactory} from "../infrastructure/model";

export async function createTestDatabase(seq: Sequelize.Sequelize) {
    const factory = new VariableCacheDataModelFactory(seq);
    factory.Slot();
    //"WARNING: this code should never go to production env"
    await seq.sync({ force: true });
}