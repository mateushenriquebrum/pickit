
export abstract class Slot {
    constructor(readonly isFree: Boolean, readonly from: Date, readonly to: Date) {}

    intersect(another: Slot): Boolean {
        return this.from == another.from;
    }
}

export class Taken extends Slot {
    constructor(readonly from: Date, readonly to: Date) {
        super(false, from, to)
    }
}

export class Free extends Slot {
    constructor(readonly from: Date, readonly to: Date) {
        super(true, from, to)
    }
}