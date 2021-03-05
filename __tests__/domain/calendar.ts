import {
    SlotBuilder
} from '../../src/domain/slot';

import {
    Calendar,
} from '../../src/domain/calendar';

describe("Calendar", () => {
    const fstFreeSlot = SlotBuilder.FreeWith("none").at("10-10-2021 12:00").span(15).build()
    const sndFreeSlot = SlotBuilder.FreeWith("none").at("10-10-2021 12:15").span(15).build()
    const trdTakenSlot = SlotBuilder.TakenBy("none").at("10-10-2021 12:30").span(15).willChatWith("none").build();

    it("Then it should start with some slots", async () => {
        const calendar = new Calendar([fstFreeSlot, sndFreeSlot]);
        expect(calendar.slots().length).toBe(2);
    });

    it("Then it should accept unique free slots", async () => {
        const calendar = new Calendar([fstFreeSlot]);
        const res = calendar.add([sndFreeSlot]);
        expect(res.ok.slots().length).toBe(2);
        expect(res.error.length).toBe(0)
    });

    it("Then it should be immutable", async () => {
        const calendar = new Calendar([fstFreeSlot]);
        const immutable = calendar.add([sndFreeSlot]);
        expect(calendar.slots().length).toBe(1);        
        expect(immutable.ok.slots().length).toBe(2);        
    });

    it("Then it should deny repeted free slots", async () => {
        const calendar = new Calendar([fstFreeSlot]);
        const res = calendar.add([fstFreeSlot]);
        expect(calendar.slots().length).toBe(1);
        expect(res.error.length).toBe(1)
    });

    it("Then it should be sorted by time", async () => {
        const calendar = new Calendar([sndFreeSlot, trdTakenSlot]);
        const res = calendar.add([fstFreeSlot]).ok.slots();
        const exp = [fstFreeSlot, sndFreeSlot, trdTakenSlot];
        expect(res).toStrictEqual(exp);
    })

    it("Then it should create offered slots", async () => {
        const calendar = new Calendar([fstFreeSlot, sndFreeSlot]);
        const offered = calendar.invite([sndFreeSlot], "interviewee", "token").ok
        expect(offered.length).toBe(1);
    })
})