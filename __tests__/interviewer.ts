import {
    InterviewerRepository,
    FetchCalendarForInterviewer,    
    SetCalendarForInterviewer
} from '../src/interviewer';
import {
    Free,
    Taken,    
} from '../src/slot';
import {
    Calendar
} from '../src/calendar';
import {
    instance,
    anything,
    mock,
    when,
    verify,
    anyString,
    anyOfClass
} from 'ts-mockito';

let repMock: InterviewerRepository;

beforeEach(() => {
    repMock = mock<InterviewerRepository>();
});

describe("Interviewer fetching its calendar", () => {
    const zero = new Date(0);
    const fifteen = new Date(1000*60*15) // 15 min
    const thirty = new Date(1000*60*30) // 30 min
    const free = new Free(zero, fifteen)    
    const taken = new Taken(zero, fifteen);
    const id = "1234";

    it("Then it show every slot", async () => {
        when(repMock.slotsOf(id)).thenResolve([free])
        const fetch = new FetchCalendarForInterviewer(instance(repMock));
        const calendar = await fetch.execute(id);
        expect(calendar.length).toBe(1);
        verify(repMock.slotsOf(id)).once()
    });

    it("Then it set some slots as free", async () => {
        when(repMock.slotsOf(id))
            .thenResolve([taken])
        const set = new SetCalendarForInterviewer(instance(repMock));
        const calendar = (await set.execute(id, [new Free(fifteen, thirty)])).ok
        expect(calendar.length).toBe(2);
        verify(repMock.setSlotsTo(id, anyOfClass(Array))).once()
    });

    it("Then it set some existents slot as free", async () => {
        when(repMock.slotsOf(id))
            .thenResolve([taken])
        const set = new SetCalendarForInterviewer(instance(repMock));
        const [validation] = (await set.execute(id, [free])).error;
        expect(validation).toBe("Slot already set");
    });
})