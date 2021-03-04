import { Model, ModelCtor } from 'sequelize';
import { IntervieweeRepository } from '../domain/interviewee';
import { InterviewerRepository } from '../domain/interviewer';
import { Token, Email } from "../domain/shared";
import { Taken, Free, Slot } from "../domain/slot";
import {DataModelFactory} from "../infrastructure/model";

export class SeqIntervieweeRepository implements IntervieweeRepository {

    constructor(private modelFactory: DataModelFactory) {}

    async fetchFreeSlotsByToken(token: Token): Promise<Array<Free>> {
        const query = await this.modelFactory.Slot().cache("fetchFreeSlotsByToken").findAll({where:{interviewee: null}})
        const slots = query.map((ds: Model) => {            
            const free: Free = ds.get({plain: true})
            return free
        })
        return slots;
    }
    async saveTakenSlotByToken(taken: Taken): Promise<Taken> {
        const ds = await this.modelFactory.Slot().cache().create(taken);
        const t: Taken = ds.get({plain: true})
        return Promise.resolve(t);
    }
}

export class SeqInterviewerRepository implements InterviewerRepository {
    
    constructor(private modelFactory: DataModelFactory) {}

    async fetchAllSlotsFrom(interviewer: Email): Promise<Slot[]> {
        const slots = await this.modelFactory.Slot().cache("fetchAllSlotsFrom").findAll({where:{interviewer: interviewer.toString()}});
        return slots.map((ds: Model) => {            
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
            const ds = await this.modelFactory.Slot().cache().create(slot);
            const t: Free = ds.get({plain: true})
            return t;
        });

        return Promise.all(fs);
    }
}