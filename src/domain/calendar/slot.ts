const moment = require('moment');
import { Moment } from "moment";
import { Email, Token } from "../shared";

export type SlotId = string;

export class Slot {
    // lack of abstraction, as you need id to serialize objects, e.g, DTO, Database, but it is the dabase that provide it.
    // TODO: some experiments with URN urn:slot:<interviewer>:<from>:<to>, as it is a natural identifier in domain
    constructor(readonly id: SlotId, readonly from: Moment, readonly to: Moment, readonly interviewer: Email) { }

    intersect(another: Slot): Boolean {
        return moment(this.from).isSame(moment(another.from));
    }
}

export class Taken extends Slot {
    constructor(readonly id: SlotId, readonly from: Moment, readonly to: Moment, readonly interviewer: Email, readonly interviewee: Token) {
        super(id, from, to, interviewer)
    }
}

export class Free extends Slot {
    constructor(readonly id: SlotId, readonly from: Moment, readonly to: Moment, readonly interviewer: Email) {
        super(id, from, to, interviewer)
    }
    offeredTo(interviwee: Email, token: Token): Offered {
        return new Offered(this.id, this.from, this.to, this.interviewer, interviwee, token)
    }
}

export class Offered extends Slot {
    constructor(readonly id: SlotId, readonly from: Moment, readonly to: Moment, readonly interviewer: Email, interviwee: Email, readonly token: Token) {
        super(id, from, to, interviewer)
    }
    takenBy(interviwee: Email): Taken {
        return new Taken(this.id, this.from, this.to, this.interviewer, interviwee)
    }
}

export class TakenBuilder {
    private from: Moment;
    private to: Moment;
    private interviewer: Email;

    constructor(private interviewee: Email) {}

    at(dateAndTime: Email) {
        this.from = moment(dateAndTime);
        return this;
    }
    spans(minutes: Number) {
        this.to = moment(this.from).add(minutes, "minutes");
        return this;
    }
    willChatWith(interviewer: Email) {
        this.interviewer = interviewer;
        return this;
    }

    build(): Taken {
        return new Taken("from_builder", this.from, this.to, this.interviewer, this.interviewee);
    }

}

export class FreeBuilder {
    private from: Moment;
    private to: Moment;    

    constructor(private interviewer: Email) {}

    at(dateAndTime: string): FreeBuilder {
        this.from = moment(dateAndTime);
        return this;
    }
    spans(minutes: Number): FreeBuilder {
        this.to = moment(this.from).add(minutes, "minutes");
        return this;
    }
    
    build(): Free {
        return new Free("from_builder", this.from, this.to, this.interviewer)
    }

}

export class SlotBuilder {
    
    static TakenBy(interviewee: Email) {
        return new TakenBuilder(interviewee);
    }

    static FreeWith(interviewer: Email) {
        return new FreeBuilder(interviewer);
    }
}