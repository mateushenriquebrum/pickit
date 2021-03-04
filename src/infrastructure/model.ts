/**
 * This is the DATABASE MODEL not the DOMAIN MODEL, it should never mix with you real, smart, well designed, objected oriented domain model.
 * Why? Because they involve in different paces, has different purpose, database is a infra structure detail, that can be replaced. As domain is the core of the company.
 * Usually the boundaries lay on Repository implementation and never beyond
 * I know, every example or basic usage tell you to use as domain, but it is just either illustrative or by the sack of simplicity
 * Unfortunately don't have any package access, so we need those kind of huge disclaime :(
 */

const Redis = require("ioredis");
const RedisAdaptor = require('sequelize-transparent-cache-ioredis')
const VariableAdaptor = require('sequelize-transparent-cache-variable')
const Cache = require('sequelize-transparent-cache')
import * as Sequelize from "sequelize";
import { ModelCtor } from "sequelize";

function Slot(seq: Sequelize.Sequelize) {
    return seq.define('slots', {
        id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,                        
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
    });
}  


/** In real world, you would like to have different cache strategy, like memory for test and redis for productions */
export abstract class DataModelFactory {

    constructor(private seq: Sequelize.Sequelize, private adapter: any) {}

    public Slot(): any {
        const { withCache } = Cache(this.adapter)
        return withCache(Slot(this.seq));
    }
}

export class ProductionDataModelFactory extends DataModelFactory {
    constructor() {
        const seq = new Sequelize.Sequelize('sqlite::memory:?cache=shared')
        const adapter = new RedisAdaptor({
            client: new Redis(),
            namespace: 'cache',
            lifetime: 60 * 60
        })
        super(seq, adapter);
    }
}

export class TestDataModelFactory extends DataModelFactory {
    constructor(seq: Sequelize.Sequelize) {        
        super(seq, new VariableAdaptor());
    }
}
