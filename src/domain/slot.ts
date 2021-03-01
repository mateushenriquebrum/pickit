import { Token } from "./interviewee";
import { Email } from "./shared";

export abstract class Slot {
    constructor(readonly isFree: Boolean, readonly from: Date, readonly to: Date) { }

    intersect(another: Slot): Boolean {
        const inter = this.from == another.from
        return inter;
    }
}

export class Taken extends Slot {
    constructor(readonly from: Date, readonly to: Date, readonly interviwer: Email, readonly interviewee: Token) {
        super(false, from, to)
    }
}

export class Free extends Slot {
    constructor(readonly from: Date, readonly to: Date, readonly interviewer: Email) {
        super(true, from, to)
    }
    takenBy(token: Token): Taken {
        return new Taken(this.from, this.to, this.interviewer, token)
    }
}