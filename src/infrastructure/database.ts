import * as Sequelize from "sequelize";
import {TestDataModelFactory} from "../infrastructure/model";

export async function createDatabase(seq: Sequelize.Sequelize) {
    const factory = new TestDataModelFactory(seq);
    factory.Slot();
    //"WARNING: this code should never go to production env"
    await seq.sync({ force: true });
}