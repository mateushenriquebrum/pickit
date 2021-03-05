import { Model } from 'sequelize';
import { IntervieweeRepository } from '../domain/interviewee';
import { InterviewerRepository } from '../domain/interviewer';
import { Token, Email } from "../domain/shared";
import { Taken, Free, Slot, Offered } from "../domain/slot";
import { DataModelFactory } from "../infrastructure/model";

export class SeqIntervieweeRepository implements IntervieweeRepository {

    constructor(private modelFactory: DataModelFactory) { }

    async fetchIntervieweeSlotByToken(token: String): Promise<Email> {
        const query = await this.modelFactory.Slot().cache("fetchIntervieweeSlotByToken").findOne({ where: { token } })
        const slot: Offered = query.get({ plain: true });
        return slot.token;
    }

    async fetchOfferedSlotsByToken(token: Token): Promise<Array<Offered>> {
        const query = await this.modelFactory.Slot().cache("fetchOfferedSlotsByToken").findAll({ where: { token } })
        const slots = query.map((ds: Model) => ds.get({ plain: true }))
        return slots;
    }
    async saveTakenSlotByToken(taken: Taken): Promise<Taken> {
        const ds = await this.modelFactory.Slot().cache().create(taken);
        const t: Taken = ds.get({ plain: true })
        return Promise.resolve(t);
    }
}

export class SeqInterviewerRepository implements InterviewerRepository {

    constructor(private modelFactory: DataModelFactory) { }

    async saveOfferedSlots(slots: Offered[]): Promise<Offered[]> {
        const fs = slots
            .map(async slot => (await this.modelFactory.Slot().cache().create(slot)).get({ plain: true }));
        return Promise.all(fs);
    }

    async fetchFreeSlotsByIds(ids: string[]): Promise<Free[]> {
        const slots = await this.modelFactory.Slot().cache("fetchFreeSlotsByIds").findAll({ where: { id: { in: ids } } });
        return slots.map((ds: Model) => ds.get({ plain: true }));
    }

    async fetchAllSlotsFrom(interviewer: Email): Promise<Slot[]> {
        const slots = await this.modelFactory.Slot().cache("fetchAllSlotsFrom").findAll({ where: { interviewer: interviewer.toString() } });
        return slots.map((ds: Model) => {
            if (ds.get("interviewee")) {
                const taken: Taken = ds.get({ plain: true })
                return taken
            } else {
                const free: Free = ds.get({ plain: true })
                return free
            }
        });
    }
    async saveFreeSlotTo(slots: Free[]): Promise<Array<Free>> {
        const fs = slots
            .map(async slot => (await this.modelFactory.Slot().cache().create(slot)).get({ plain: true }));
        return Promise.all(fs);
    }
}