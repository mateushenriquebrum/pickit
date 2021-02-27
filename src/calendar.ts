import { Slot, Free, Taken } from "../src/slot";
import { Result, Ok, Error } from "../src/interviewer";

export class Calendar {
    constructor(private all: Array<Slot>) {
        // this is a safe set of slots, it is intend to come from a repository
        // TODO: raise exception when not, you are using it wrongly
    }

    add(set: Array<Free>): Result<Array<Slot>> {
       
        const _unique = this.all
            .map(mine => set.some( other => !other.intersect(mine)))
            .every(u => u)
            
        if(_unique) {
            this.all.push(...set)
            return new Ok(this.all);
        } else {
            return new Error(["Slot already set"]);
        }       
    }

    slots(): Array<Slot> {
        return this.all
    }
}