const moment = require('moment');
import { Moment } from "moment";
import { Email, Token } from "../shared";

export type SlotId = string;

/**
 * Entity
 */
export class Slot {
    // lack of abstraction, as you need id to serialize objects, e.g, DTO, Database, but it is the dabase that provide it.
    // TODO: some experiments with URN urn:slot:<interviewer>:<from>:<to>, as it is a natural identifier in domain
    constructor(readonly id: SlotId, readonly from: Moment, readonly to: Moment, readonly interviewer: Email) { }

    intersect(another: Slot): Boolean {
        return moment(this.from).isSame(moment(another.from));
    }
}

/**
 * Entity
 */
export class Taken extends Slot {
    constructor(readonly id: SlotId, readonly from: Moment, readonly to: Moment, readonly interviewer: Email, readonly interviewee: Token) {
        super(id, from, to, interviewer)
    }
}

/**
 * Entity
 */
export class Free extends Slot {
    constructor(readonly id: SlotId, readonly from: Moment, readonly to: Moment, readonly interviewer: Email) {
        super(id, from, to, interviewer)
    }
    offeredTo(interviwee: Email, token: Token): Offered {
        return new Offered(this.id, this.from, this.to, this.interviewer, interviwee, token)
    }
}

/**
 * Entity
 */
export class Offered extends Slot {
    constructor(readonly id: SlotId, readonly from: Moment, readonly to: Moment, readonly interviewer: Email, interviwee: Email, readonly token: Token) {
        super(id, from, to, interviewer)
    }
    takenBy(interviwee: Email): Taken {
        return new Taken(this.id, this.from, this.to, this.interviewer, interviwee)
    }
}