import {Slot, Taken, Free} from '../src/slot';
import {Calendar} from '../src/calendar';

export type InterviewerId = String
export type Email = String

export abstract class Result<O> {
    public error: Array<String> = [];
    public ok: O    
}

export class Ok<T> extends Result<T>{
    constructor(public ok: T) {
        super();
    }
}

export class Error<T> extends Result<T>{
    constructor(public error: Array<String>) {
        super();
    }
}

export interface InterviewerRepository {
    slotsOf(id: InterviewerId): Promise<Array<Slot>>
    setSlotsTo(id: InterviewerId, slot: Array<Free>): Taken
}

export class FetchCalendarForInterviewer { 
    constructor(private rep: InterviewerRepository) {}
    public execute(id: InterviewerId): Promise<Array<Slot>> {
        return this.rep.slotsOf(id);
    }
}

export class SetCalendarForInterviewer {
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
    constructor(){}
    public async execute(id: InterviewerId, email: Email): Promise<Result<String>> {
        return  new Ok("some_random_and_unique_token");
    }
}