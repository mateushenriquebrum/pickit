import { Slot, Free, SlotId, Offered } from './slot';
import { Calendar } from './calendar';
import { Result, Ok, Error, Email } from "./shared";

export interface InterviewerRepository {
    fetchAllSlotsFrom(interviewer: Email): Promise<Array<Slot>>
    saveFreeSlotTo(slots: Array<Free>): Promise<Array<Free>>
    saveOfferedSlots(slots: Array<Offered>): Promise<Array<Offered>>
    fetchFreeSlotsByIds(ids: Array<SlotId>): Promise<Array<Free>>
}

export interface TokenGenerator {
    invitationToken(interviewer: Email, interviewee: Email): Promise<String>
}

export class FetchInterviwerCalendar {
    constructor(private rep: InterviewerRepository) { }
    public execute(interviewer: Email): Promise<Array<Slot>> {
        return this.rep.fetchAllSlotsFrom(interviewer);
    }
}

export class SetFreeSlotOnIntervierCalendar {
    
    constructor(private rep: InterviewerRepository) { }

    public async execute(interviewer: Email, set: Array<Free>): Promise<Result<Array<Slot>>> {
        let slots = await this.rep.fetchAllSlotsFrom(interviewer);
        let calendar = new Calendar(slots).add(set);
        if (calendar.error.length) {
            return new Error(calendar.error);
        } else {
            await this.rep.saveFreeSlotTo(set);
            const result = await this.rep.fetchAllSlotsFrom(interviewer);
            return new Ok(result);
        }
    }
}

export class InviteInterviwerByEmail {
    constructor(private gen: TokenGenerator, private rep: InterviewerRepository) { }
    public async execute(interviewer: Email, email: Email, ids: Array<SlotId>): Promise<Result<String>> {
        const token = await this.gen.invitationToken(interviewer, email)
        const slots = await this.rep.fetchAllSlotsFrom(interviewer);
        const frees = await this.rep.fetchFreeSlotsByIds(ids);
        const res = new Calendar(slots).invite(frees, email, token);
        if(res.error.length) {
            new Error([`You can not invite this ${email}`]);
        } else {
            this.rep.saveOfferedSlots(res.ok);
            return new Ok(token);
        }
        
    }
}