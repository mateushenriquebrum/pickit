import { IntervieweeRepository } from '../domain/interviewee';
import { InterviewerRepository } from '../domain/interviewer';
import { Token, InterviewerId, Email } from "../domain/shared";
import { Taken, Free, Slot } from "../domain/slot";
import * as Sequelize from 'sequelize';

export class SeqIntervieweeRepository implements IntervieweeRepository {

    constructor(private seq: Sequelize.Sequelize) {}

    async fetchFreeSlotsByToken(token: Token): Promise<Array<Free>> {
        const DbSlot = this.seq.model("slots");
        const query = await DbSlot.findAll({where:{interviewee: null}})
        const slots = query.map(ds => {
            const free: Free = ds.get({plain: true})
            return free
        })
        return slots;
    }
    async saveTakenSlotByToken(taken: Taken): Promise<Taken> {
        const ds = await this.seq.model("slots").create(taken);
        const t: Taken = ds.get({plain: true})
        return Promise.resolve(t);
    }
}

export class SeqInterviewerRepository implements InterviewerRepository {
    
    constructor(private seq: Sequelize.Sequelize) {}

    async fetchAllSlotsFrom(interviewer: Email): Promise<Slot[]> {
        const DbSlot = this.seq.model("slots");        
        const slots = await DbSlot.findAll({where:{interviewer: interviewer.toString()}});
        return slots.map(ds => {            
            if(ds.get("interviewee")) {
                const taken: Taken = ds.get({plain: true})
                return taken
            } else {
                const free: Free = ds.get({plain: true})
                return free
            }
        });
    }
    async saveFreeSlotTo(slots: Free[]): Promise<Array<Free>> {
        const fs = slots.map(async slot => {
            const ds = await this.seq.model("slots").create(slot);
            const t: Free = ds.get({plain: true})
            return t;
        });

        return Promise.all(fs);
    }
}