import { Model } from 'sequelize';
import { IntervieweeRepository } from '../domain/interviewee';
import { InterviewerRepository } from '../domain/interviewer';
import { Token, Email } from "../domain/shared";
import { Taken, Free, Offered } from "../domain/slot";
import { DataModelFactory } from "../infrastructure/model";

export class SeqIntervieweeRepository implements IntervieweeRepository {

    constructor(private modelFactory: DataModelFactory) { }

    async fetchIntervieweeSlotByToken(token: String): Promise<Email> {
        const query = await this.modelFactory.Slot().findOne({ where: { token } })
        const slot: Offered = query.get({ plain: true });
        return slot.token;
    }

    async fetchOfferedSlotsByToken(token: Token): Promise<Array<Offered>> {
        const query: Array<Model> = await this.modelFactory.Slot().findAll({ where: { token } })
        const slots = query.map(ds => {
            const data = ds.get({ plain: true })
            return new Offered(data.id, data.from, data.to, data.interviwer, data.Interviewee, data.token);
        })
        return slots;
    }
    async updateTakenSlotByToken(taken: Taken): Promise<Taken> {
        const _slot = await this.modelFactory.Slot().findOne({where: {id: taken.id}});
        _slot.interviwee = taken.interviewee;
        await _slot.save();
        return taken;
    }
}

export class SeqInterviewerRepository implements InterviewerRepository {

    constructor(private modelFactory: DataModelFactory) { }

    async updateOfferedSlots(slots: Array<Offered>): Promise<Array<Offered>> {
        const fs = slots
            .map(async slot => {
                const _slot = await this.modelFactory.Slot().findOne({where: {id: slot.id}});
                _slot.token = slot.token;                
                await _slot.save();
                return slot;
            });
        return Promise.all(fs);
    }

    async fetchFreeSlotsByIds(ids: Array<string>): Promise<Array<Free>> {
        const slots:Array<Model> = await this.modelFactory.Slot().findAll({ where: { id: ids } });
        const free: Array<Free> = slots.map(ds => {            
            const data = ds.get({ plain: true });
            return new Free(data.id, data.from, data.to, data.interviewer);
        });
        return free;
    }

    async fetchAllSlotsFrom(interviewer: Email): Promise<Array<Offered>> {
        const slots = await this.modelFactory.Slot().findAll({ where: { interviewer } });
        return slots.map((ds: Model) => {
            const data = ds.get({ plain: true });
            return new Offered(data.id, data.from, data.to, data.interviewer, data.interviewee, data.token);
                
        });
    }
    async saveFreeSlotTo(slots: Free[]): Promise<Array<Free>> {
        const fs = slots
            .map(async slot => (await this.modelFactory.Slot().create(slot)).get({ plain: true }));
        return await Promise.all(fs);
    }
}

// export class ProductionSeqIntervieweeRepositoryFactory {
//     new(): SeqIntervieweeRepository {
//         return new SeqIntervieweeRepository(new RedisCacheDataModelFactory());
//     }
// }

// export class ProductionSeqInterviewerRepositoryFactory {
//     new(): SeqInterviewerRepository {
//         return new SeqInterviewerRepository(new RedisCacheDataModelFactory());
//     }
// }