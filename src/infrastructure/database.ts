import * as Sequelize from "sequelize";

export async function createDatabase(seq: Sequelize.Sequelize) {
    const Slots = seq.define('slots', {
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

    //WARNING: this code should never go to production env
    await seq.sync({ force: true });
}

//WARNING: this code should never go to production env
export async function dropDatabase(seq: Sequelize.Sequelize) {
    const Slots = seq.model("slots")
    await Slots.drop();
}