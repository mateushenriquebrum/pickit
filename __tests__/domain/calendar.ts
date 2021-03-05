import {
    SlotBuilder
} from '../../src/domain/slot';

import {
    Calendar,
} from '../../src/domain/calendar';

describe("Calendar", () => {
    let someFreeSlot = SlotBuilder.FreeWith("none").at("10-10-2021 12:00").span(15).build()
    let anotherFreeSlot = SlotBuilder.FreeWith("none").at("10-10-2021 12:15").span(15).build()

    it("Then it should start with some slots", async () => {
        let calendar = new Calendar([someFreeSlot, anotherFreeSlot]);
        expect(calendar.slots().length).toBe(2);
    });

    it("Then it should accept unique free slots", async () => {
        let calendar = new Calendar([someFreeSlot]);
        var res = calendar.add([anotherFreeSlot]);
        expect(calendar.slots().length).toBe(2);
        expect(res.ok.length).toBe(2);
        expect(res.error.length).toBe(0)
    });

    it("Then it should deny repeted free slots", async () => {
        let calendar = new Calendar([someFreeSlot]);
        var res = calendar.add([someFreeSlot]);
        expect(calendar.slots().length).toBe(1);
        expect(res.error.length).toBe(1)
    });

    it("Then it should be sorted by time", async () => {
        //let calendar = new Calendar([someFreeSlot]);
    })
})