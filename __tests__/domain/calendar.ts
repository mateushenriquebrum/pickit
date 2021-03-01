import {
    Free,
    Taken,
    Slot
} from '../../src/domain/slot';

import {
    Calendar,
} from '../../src/domain/calendar';

describe("Calendar", () => {
    let zero = new Date(0);
    let fifteen = new Date(1000*60*15) // 15 min
    let thirty = new Date(1000*60*30) // 30 min
    let someFreeSlot = new Free(zero, fifteen, "")    
    let anotherFreeSlot = new Free(fifteen, thirty, "");
    
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
})