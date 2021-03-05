const moment = require('moment');
import { Moment } from "moment";
import { Email, Token } from "./shared";

export abstract class Slot {
    constructor(readonly from: Moment, readonly to: Moment) { }

    intersect(another: Slot): Boolean {
        return moment(this.from).isSame(moment(another.from));
    }
}

export class Taken extends Slot {
    constructor(readonly from: Moment, readonly to: Moment, readonly interviewer: Email, readonly interviewee: Token) {
        super(from, to)
    }
}

export class Free extends Slot {
    constructor(readonly from: Moment, readonly to: Moment, readonly interviewer: Email) {
        super(from, to)
    }
    offeredTo(interviwee: Email, token: Token): Offered {
        return new Offered(this.from, this.to, this.interviewer, interviwee, token)
    }
}

export class Offered extends Slot {
    constructor(readonly from: Moment, readonly to: Moment, readonly interviewer: Email, interviwee: Email, readonly token: Token) {
        super(from, to)
    }
    takenBy(interviwee: Email): Taken {
        return new Taken(this.from, this.to, this.interviewer, interviwee)
    }
}

class TakenBuilder {
    private from: Moment;
    private to: Moment;
    private interviewer: String;

    constructor(private interviewee: String) {}

    at(dateAndTime: String) {
        this.from = moment(dateAndTime);
        return this;
    }
    span(minutes: Number) {
        this.to = moment(this.from).add(minutes, "minutes");
        return this;
    }
    willChatWith(interviewer: String) {
        this.interviewer = interviewer;
        return this;
    }

    build(): Taken {
        return new Taken(this.from, this.to, this.interviewer, this.interviewee);
    }

}

class FreeBuilder {
    private from: Moment;
    private to: Moment;    

    constructor(private interviewer: String) {}

    at(dateAndTime: String): FreeBuilder {
        this.from = moment(dateAndTime);
        return this;
    }
    span(minutes: Number): FreeBuilder {
        this.to = moment(this.from).add(minutes, "minutes");
        return this;
    }
    
    build(): Free {
        return new Free(this.from, this.to, this.interviewer)
    }

}


export class SlotBuilder {
    
    static TakenBy(interviewee: String) {
        return new TakenBuilder(interviewee);
    }

    static FreeWith(interviewer: String) {
        return new FreeBuilder(interviewer);
    }
}