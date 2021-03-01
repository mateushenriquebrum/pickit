import { Free, Slot } from "./slot";
import {Result, Ok, Error} from './shared'

export type Token = String

export interface IntervieweeCalenderRepository {
    slotsByToken(token: Token): Promise<Array<Free>>
}

export class FetchIntervieweeCalendarByToken {
    constructor(private rep: IntervieweeCalenderRepository) {}

    async execute(token: Token) : Promise<Result<Array<Slot>>> {
        //should verify token and ensure not be used again, something like:
        //if(token.isWellFormat && rep.slotsByToken(token).length == 1)
        const slots = (await this.rep.slotsByToken(token))
        return new Ok(slots);
    }    
}