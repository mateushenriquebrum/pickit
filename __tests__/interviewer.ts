import {
    InterviewerRepository,
    FetchInterviwerCalendar,    
    SetFreeSlotOnIntervierCalendar,
    InviteInterviwerByEmail,
    TokenGenerator
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
let genMock: TokenGenerator;

beforeEach(() => {
    repMock = mock<InterviewerRepository>();
    genMock = mock<TokenGenerator>();
});

describe("Interviewer fetches its calendar", () => {
    const zero = new Date(0);
    const fifteen = new Date(1000*60*15) // 15 min
    const thirty = new Date(1000*60*30) // 30 min
    const someFree = new Free(zero, fifteen)    
    const someTaken = new Taken(zero, fifteen);
    const anotherFree = new Free(fifteen, thirty);
    const id = "1234";

    it("Then it shows every slot", async () => {
        when(repMock.slotsOf(id)).thenResolve([someFree])
        const fetch = new FetchInterviwerCalendar(instance(repMock));
        const calendar = await fetch.execute(id);
        expect(calendar.length).toBe(1);
        verify(repMock.slotsOf(id)).once()
    });

    it("Then it sets some slots as free", async () => {
        when(repMock.slotsOf(id))
            .thenResolve([someTaken])
        const set = new SetFreeSlotOnIntervierCalendar(instance(repMock));
        const calendar = (await set.execute(id, [anotherFree])).ok
        expect(calendar.length).toBe(2);
        verify(repMock.setSlotsTo(id, anyOfClass(Array))).once()
    });

    it("Then it cannot sets some existents slot as free", async () => {
        when(repMock.slotsOf(id))
            .thenResolve([someTaken])
        const set = new SetFreeSlotOnIntervierCalendar(instance(repMock));
        const [validation] = (await set.execute(id, [someFree])).error;
        expect(validation).toBe("Slot already set");
    });
    
    it("Then it generate distinct token for every interviwer", async () => {
        when(genMock.inviteToken(id, anyString()))
            .thenResolve("mateushenriquebrum@gmail.com")
            .thenResolve("iagobrum@gmail.com")
        const invite = new InviteInterviwerByEmail(genMock);
        const first = (await invite.execute(id, "mateushenriquebrum@gmail.com")).ok;
        const second = (await invite.execute(id, "iagobrum@gmail.com")).ok;
        expect(first).not.toBeNull()
        expect(second).not.toBeNull()
        expect(second).not.toBe(first);
    })
})