import {
    Free,
} from '../src/slot';

describe("Slot", () => {
    let zero = new Date(0);
    let fifteen = new Date(1000 * 60 * 15) // 15 min
    let thirty = new Date(1000 * 60 * 30) // 30 min
    let someFreeSlot = new Free(zero, fifteen)
    let anotherFreeSlot = new Free(fifteen, thirty);
    
    it("Then it should not", () => {
        expect(someFreeSlot.intersect(anotherFreeSlot)).toBeFalsy
    })

    it("Then it should", () => {
        expect(someFreeSlot.intersect(someFreeSlot)).toBeFalsy
    })
})