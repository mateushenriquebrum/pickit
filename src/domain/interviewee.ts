import { Free, Slot, Taken } from "./slot";
import {Result, Ok, Error, Email} from './shared'

export type Token = String

export interface IntervieweeCalenderRepository {
    slotsByToken(token: Token): Promise<Array<Free>>
    saveTakenByToken(taken: Taken): Promise<Taken>
}

export class FetchIntervieweeCalendarByToken {
    constructor(private rep: IntervieweeCalenderRepository) {}

    async execute(token: Token) : Promise<Result<Array<Slot>>> {
        // verify if token has been used
        const slots = (await this.rep.slotsByToken(token))
        return new Ok(slots);
    }    
}

export class PickFreeSlotByToken {
    constructor(private rep: IntervieweeCalenderRepository) {}

    async execute(token: Token, slot: Free) : Promise<Result<Confirmation>> {
        // verify if token has been used
        // verify authenticity of slot, maybe it should be a SlotId
        const taken = slot.takenBy(token);
        await this.rep.saveTakenByToken(taken);
        return new Ok(taken)
    }    
}


export class Confirmation {
    constructor(public from: Date, public to: Date, interviewer: Email) {}
}