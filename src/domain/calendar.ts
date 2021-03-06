import { Slot, Free, Taken, Offered } from "./slot";
import { Result, Ok, Error, Email, Token } from "./shared";

export class Calendar {
    constructor(private all: Array<Slot>) {
        // this is a safe set of slots, it is intend to come from a repository
        // TODO: raise exception when not, you are using it wrongly        
    }

    add(set: Array<Free>): Result<Calendar> {

        const _unique = this.all
            .map(mine => set.some(other => !other.intersect(mine)))
            .every(u => u)

        if (_unique) {
            const comp = [...this.all, ...set];
            comp.sort((a, b) => a.from.isBefore(b.from)?-1:1)
            return new Ok(new Calendar(comp));
        } else {
            return new Error(["Slot already set"]);
        }
    }

    invite(set: Array<Free>, interviewee: Email, token: Token): Result<Array<Offered>> {
        // should verify if interviewee was invited already
        // should add this invitation or cancel the previous        
        const offered = set.map((f: Free) => f.offeredTo(interviewee, token))
        return new Ok(offered);
    }

    slots(): Array<Slot> {
        return this.all
    }
}