import * as Sequelize from "sequelize";
import { CacheStrategy } from "./cache";

class NullCacheStrategy implements CacheStrategy {
    create(instance: any) { }
    update(instance: any) { }
}

export async function createDatabase(seq: Sequelize.Sequelize, cache: CacheStrategy = new NullCacheStrategy()) {
    const Slots = seq.define('slots', {
        id: {
            type: Sequelize.DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        from: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false
        },
        to: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false
        },
        interviewer: {
            type: Sequelize.DataTypes.CHAR,
            allowNull: false
        },
        interviewee: {
            type: Sequelize.DataTypes.CHAR,
            allowNull: true
        },
        token: {
            type: Sequelize.DataTypes.CHAR,
            allowNull: true
        }
    }
        , {
            hooks: {
                afterCreate: cache.create,
                afterUpdate: cache.update,
            }
        }
    );

    //WARNING: this code should never go to production env
    await seq.sync({ force: true });
}

//WARNING: this code should never go to production env
export async function dropDatabase(seq: Sequelize.Sequelize) {
    const Slots = seq.model("slots")
    await Slots.drop();
}