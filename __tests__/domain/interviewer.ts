import {
    InterviewerRepository,
    FetchInterviwerCalendar,
    SetFreeSlotOnIntervierCalendar,
    InviteInterviwerByEmail,
    TokenGenerator
} from '../../src/domain/interviewer';
import {
    SlotBuilder
} from '../../src/domain/slot';
import {
    instance,
    mock,
    when,
    verify,
    anyString,
    anyOfClass
} from 'ts-mockito';
import { Email } from "../../src/domain/shared";
let repMock: InterviewerRepository;
let genMock: TokenGenerator;

beforeEach(() => {
    repMock = mock<InterviewerRepository>();
    genMock = mock<TokenGenerator>();
});

describe("Interviewer fetches its calendar", () => {

    const interviewer: Email = "some@some.ie";
    const at: String = "12-12-2012 00:00";

    it("Then it shows every slot", async () => {
        const free = SlotBuilder.FreeWith(interviewer).at(at).span(15).build();
        when(repMock.fetchAllSlotsFrom(interviewer)).thenResolve([free])
        const fetch = new FetchInterviwerCalendar(instance(repMock));
        const calendar = await fetch.execute(interviewer);
        expect(calendar.length).toBe(1);
        verify(repMock.fetchAllSlotsFrom(interviewer)).once()
    });

    it("Then it sets some slots as free", async () => {
        const taken = SlotBuilder.TakenBy("cand@some.ie").at(at).span(15).willChatWith(interviewer).build();
        const free = SlotBuilder.FreeWith(interviewer).at("12-12-2012 15:00").span(15).build();
        when(repMock.fetchAllSlotsFrom(interviewer))
            .thenResolve([taken])
        const set = new SetFreeSlotOnIntervierCalendar(instance(repMock));
        const calendar = (await set.execute(interviewer, [free])).ok
        expect(calendar.length).toBe(2);
        verify(repMock.saveFreeSlotTo(anyOfClass(Array))).once()
    });

    it("Then it cannot sets some existents slot as free", async () => {
        const free = SlotBuilder.FreeWith(interviewer).at(at).span(15).build();
        const taken = SlotBuilder.TakenBy("cand@some.ie").at(at).span(15).willChatWith(interviewer).build();
        when(repMock.fetchAllSlotsFrom(interviewer))
            .thenResolve([taken])
        const set = new SetFreeSlotOnIntervierCalendar(instance(repMock));
        const [validation] = (await set.execute(interviewer, [free])).error;
        expect(validation).toBe("Slot already set");
    });

    it("Then it generate distinct token for every interviwer", async () => {
        when(genMock.inviteToken(interviewer, anyString()))
            .thenResolve("mateushenriquebrum@gmail.com")
            .thenResolve("iagobrum@gmail.com")
        const invite = new InviteInterviwerByEmail(genMock);
        const first = (await invite.execute(interviewer, "mateushenriquebrum@gmail.com")).ok;
        const second = (await invite.execute(interviewer, "iagobrum@gmail.com")).ok;
        expect(first).not.toBeNull()
        expect(second).not.toBeNull()
        expect(second).not.toBe(first);
    })
})