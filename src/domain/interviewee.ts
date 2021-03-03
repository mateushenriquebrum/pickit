import { Free, Slot, Taken } from "./slot";
import { Result, Ok, Error, Email, Token } from './shared'

export interface IntervieweeRepository {
    fetchFreeSlotsByToken(token: Token): Promise<Array<Free>>
    saveTakenSlotByToken(taken: Taken): Promise<Taken>
}

export class FetchIntervieweeCalendarByToken {
    constructor(private rep: IntervieweeRepository) { }

    async execute(token: Token): Promise<Result<Array<Slot>>> {
        // verify if token has been used
        const slots = (await this.rep.fetchFreeSlotsByToken(token))
        return new Ok(slots);
    }
}

export class PickFreeSlotByToken {
    constructor(private rep: IntervieweeRepository) { }

    async execute(token: Token, slot: Free): Promise<Result<Confirmation>> {
        // verify if token has been used
        // verify authenticity of slot, maybe it should be a SlotId
        const taken = slot.takenBy(token);
        await this.rep.saveTakenSlotByToken(taken);
        return new Ok(taken)
    }
}


export class Confirmation {
    constructor(public from: Date, public to: Date, interviewer: Email) { }
}