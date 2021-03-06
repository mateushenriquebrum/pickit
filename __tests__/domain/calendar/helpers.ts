
const moment = require('moment');
import { Moment } from "moment";
import { Email } from "../../../src/domain/shared";
import { Taken, Free } from "../../../src/domain/calendar/slot";
/**
 * Builder helper for testing
 */
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

test("It is just a helper", () => {})