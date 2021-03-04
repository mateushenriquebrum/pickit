import { Slot, Taken, Free } from './slot';
import { Calendar } from './calendar';
import { Result, Ok, Error, Email } from "./shared";

export interface InterviewerRepository {
    fetchAllSlotsFrom(interviewer: Email): Promise<Array<Slot>>
    saveFreeSlotTo(slots: Array<Free>): Promise<Array<Free>>
}

export interface TokenGenerator {
    inviteToken(interviewer: Email, interviewee: Email): Promise<String>
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
    constructor(private gen: TokenGenerator) { }
    public async execute(interviewer: Email, email: Email): Promise<Result<String>> {
        return new Ok(await this.gen.inviteToken(interviewer, email));
    }
}