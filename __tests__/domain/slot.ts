import {
    SlotBuilder,
} from '../../src/domain/slot';

describe("Slot", () => {
    let zero = new Date(0);
    let ten = new Date(1000 * 60 * 10) // 10 min
    let tweenty = new Date(1000 * 60 * 20) // 20 min
    let fifteen = new Date(1000 * 60 * 15) // 15 min
    let thirty = new Date(1000 * 60 * 30) // 30 min
    //let someFreeSlot = new Free(zero, fifteen, "")
    //let anotherFreeSlot = new Free(fifteen, thirty, "");

    it("Should not intersect", () => {
        const frsSlot = SlotBuilder.FreeWith("none").at("10-10-2021 12:00").span(15).build()
        const sndSlot = SlotBuilder.FreeWith("none").at("10-10-2021 13:00").span(15).build()
        expect(frsSlot.intersect(sndSlot)).toBeFalsy()
    })

    it("Should intersect", () => {
        const frsSlot = SlotBuilder.FreeWith("none").at("10-10-2021 12:00").span(15).build()
        const sndSlot = SlotBuilder.FreeWith("none").at("10-10-2021 12:00").span(15).build()
        expect(frsSlot.intersect(sndSlot)).toBeTruthy()
    })

})