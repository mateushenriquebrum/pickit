import {Slot, Taken, Free} from '../src/slot';
import {Calendar} from '../src/calendar';
import { Result, Ok, Error, Email } from "../src/shared";

export type InterviewerId = String

export interface InterviewerRepository {
    slotsOf(id: InterviewerId): Promise<Array<Slot>>
    setSlotsTo(id: InterviewerId, slot: Array<Free>): Taken
}

export interface TokenGenerator {
    inviteToken(id: InterviewerId, email: Email): Promise<String>
}

export class FetchInterviwerCalendar { 
    constructor(private rep: InterviewerRepository) {}
    public execute(id: InterviewerId): Promise<Array<Slot>> {
        return this.rep.slotsOf(id);
    }
}

export class SetFreeSlotOnIntervierCalendar {
    constructor(private rep: InterviewerRepository) {}   
    public async execute(id: InterviewerId, set: Array<Free>): Promise<Result<Array<Slot>>> {
        let slots = await this.rep.slotsOf(id);
        let calendar = new Calendar(slots).add(set);
        if(calendar.error.length) {
            return new Error(calendar.error);
        } else {
            this.rep.setSlotsTo(id, set);
            const result = await this.rep.slotsOf(id);        
            return  new Ok(result);
        }
    }
}

export class InviteInterviwerByEmail {
    constructor(private gen: TokenGenerator){}
    public async execute(id: InterviewerId, email: Email): Promise<Result<String>> {
        return  new Ok(await this.gen.inviteToken(id, email));
    }
}