import {
    Free,
} from '../../src/domain/slot';

describe("Slot", () => {
    let zero = new Date(0);
    let ten = new Date(1000 * 60 * 10) // 10 min
    let tweenty = new Date(1000 * 60 * 20) // 20 min
    let fifteen = new Date(1000 * 60 * 15) // 15 min
    let thirty = new Date(1000 * 60 * 30) // 30 min
    let someFreeSlot = new Free(zero, fifteen, "")
    let anotherFreeSlot = new Free(fifteen, thirty, "");

    it("Then it should not", () => {
        expect(someFreeSlot.intersect(anotherFreeSlot)).toBeFalsy()
    })

    it("Then it should", () => {
        expect(someFreeSlot.intersect(someFreeSlot)).toBeTruthy()
    })

})