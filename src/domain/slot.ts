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
    takenBy(token: Token): Taken {
        return new Taken(this.from, this.to, this.interviewer, token)
    }
}

class TakenBuilder {
    from: Moment;
    to: Moment;
    interviewer: String;

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
    from: Moment;
    to: Moment;    

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