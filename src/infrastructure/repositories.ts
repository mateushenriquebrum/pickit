import { IntervieweeRepository } from '../domain/interviewee';
import { InterviewerRepository } from '../domain/interviewer';
import { Token, InterviewerId } from "../domain/shared";
import { Taken, Free, Slot } from "../domain/slot";
import * as Sequelize from 'sequelize';

export class SeqIntervieweeRepository implements IntervieweeRepository {

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

export class SeqInterviewerRepository implements InterviewerRepository {
    
    constructor(private seq: Sequelize.Sequelize) {}

    fetchAllSlotsFrom(id: InterviewerId): Promise<Slot[]> {
        const DbSlot = this.seq.model("slots");
        return null
        //return DbSlot.findAll({where:{interviwee: null}})
    }
    saveFreeSlotTo(id: InterviewerId, slot: Free[]): Taken {
        throw new Error('Method not implemented.');
    }
}