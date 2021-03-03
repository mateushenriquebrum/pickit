import { Email, Token } from "./shared";

export abstract class Slot {
    constructor(readonly from: Date, readonly to: Date, readonly isFree: Boolean = false) { }

    intersect(another: Slot): Boolean {
        const inter = this.from == another.from
        return inter;
    }
}

export class Taken extends Slot {
    constructor(readonly from: Date, readonly to: Date, readonly interviewer: Email, readonly interviewee: Token) {
        super(from, to, false)
    }
}

export class Free extends Slot {
    constructor(readonly from: Date, readonly to: Date, readonly interviewer: Email) {
        super(from, to, false)
    }
    takenBy(token: Token): Taken {
        return new Taken(this.from, this.to, this.interviewer, token)
    }
}