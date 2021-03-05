import {
    SlotBuilder
} from '../../src/domain/slot';

import {
    Calendar,
} from '../../src/domain/calendar';

describe("Calendar", () => {
    let fstFreeSlot = SlotBuilder.FreeWith("none").at("10-10-2021 12:00").span(15).build()
    let sndFreeSlot = SlotBuilder.FreeWith("none").at("10-10-2021 12:15").span(15).build()
    let trdTakenSlot = SlotBuilder.TakenBy("none").at("10-10-2021 12:30").span(15).willChatWith("none").build();

    it("Then it should start with some slots", async () => {
        let calendar = new Calendar([fstFreeSlot, sndFreeSlot]);
        expect(calendar.slots().length).toBe(2);
    });

    it("Then it should accept unique free slots", async () => {
        let calendar = new Calendar([fstFreeSlot]);
        var res = calendar.add([sndFreeSlot]);
        expect(res.ok.slots().length).toBe(2);
        expect(res.error.length).toBe(0)
    });

    it("Then it should be immutable", async () => {
        let calendar = new Calendar([fstFreeSlot]);
        var immutable = calendar.add([sndFreeSlot]);
        expect(calendar.slots().length).toBe(1);        
        expect(immutable.ok.slots().length).toBe(2);        
    });

    it("Then it should deny repeted free slots", async () => {
        let calendar = new Calendar([fstFreeSlot]);
        var res = calendar.add([fstFreeSlot]);
        expect(calendar.slots().length).toBe(1);
        expect(res.error.length).toBe(1)
    });

    it("Then it should be sorted by time", async () => {
        let calendar = new Calendar([sndFreeSlot, trdTakenSlot]);
        let res = calendar.add([fstFreeSlot]).ok.slots();
        let exp = [fstFreeSlot, sndFreeSlot, trdTakenSlot];
        expect(res).toStrictEqual(exp);
    })
})