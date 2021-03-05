import { Free, Slot, Taken } from "./slot";
import { Result, Ok, Email, Token } from './shared'

export interface IntervieweeRepository {
    fetchFreeSlotsByToken(token: Token): Promise<Array<Free>>
    saveTakenSlotByToken(taken: Taken): Promise<Taken>
    fetchIntervieweeSlotByToken(token: Token): Promise<Email>
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

    async execute(token: Token, free: Free): Promise<Result<Taken>> {
        // verify if token has been used
        // verify authenticity of slot
        const interviewee = await this.rep.fetchIntervieweeSlotByToken(token);
        const taken = free.takenBy(interviewee);
        await this.rep.saveTakenSlotByToken(taken);
        return new Ok(taken)
    }
}