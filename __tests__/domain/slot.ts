import {
    SlotBuilder,
} from '../../src/domain/slot';

describe("Slot", () => {
    
    it("Should not intersect", () => {
        const frsSlot = SlotBuilder.FreeWith("none").at("10-10-2021 12:00").spans(15).build()
        const sndSlot = SlotBuilder.FreeWith("none").at("10-10-2021 13:00").spans(15).build()
        expect(frsSlot.intersect(sndSlot)).toBeFalsy()
    })

    it("Should intersect", () => {
        const frsSlot = SlotBuilder.FreeWith("none").at("10-10-2021 12:00").spans(15).build()
        const sndSlot = SlotBuilder.FreeWith("none").at("10-10-2021 12:00").spans(15).build()
        expect(frsSlot.intersect(sndSlot)).toBeTruthy()
    })

})