import { IntervieweeCalenderRepository } from '../domain/interviewee';
import { Token } from "../domain/shared";
import { Taken, Free } from "../domain/slot";
import * as Sequelize from 'sequelize';

export class SeqIntervieweeCalenderRepository implements IntervieweeCalenderRepository {

    constructor(private seq: Sequelize.Sequelize) {}

    async fetchFreeSlotsByToken(token: Token): Promise<Array<Free>> {
        const DbSlot = this.seq.model("slots");
        const query = await DbSlot.findAll({where:{interviwee: null}})
        const slots = query.map(ds => {
            const f = new Date(ds.get("from").toString());
            const t = new Date(ds.get("to").toString());
            const i = ds.get("interviwer").toString();
            return new Free(f, t, i)
        })
        return slots;
    }
    saveTakenSlotByToken(taken: Taken): Promise<Taken> {
        return Promise.resolve(null);
    }
}