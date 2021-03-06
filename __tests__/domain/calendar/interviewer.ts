import {
    InterviewerRepository,
    FetchInterviwerCalendar,
    SetFreeSlotOnIntervierCalendar,
    InviteInterviwerByEmail,
    TokenGenerator
} from '../../../src/domain/calendar/interviewer';
import {
    SlotBuilder
} from './helpers';
import {
    instance,
    mock,
    when,
    verify,
    anyString,
    anyOfClass,
    anything
} from 'ts-mockito';
import { Email } from "../../../src/domain/shared";

let repMock: InterviewerRepository = mock<InterviewerRepository>();
let genMock: TokenGenerator = mock<TokenGenerator>();

describe("Interviewer fetches its calendar", () => {

    const interviewer: Email = "some@some.ie";
    const at: string = "12-12-2012 00:00";

    it("Then it shows every slot", async () => {
        const free = SlotBuilder.FreeWith(interviewer).at(at).spans(15).build();
        when(repMock.fetchAllSlotsFrom(interviewer)).thenResolve([free])
        const fetch = new FetchInterviwerCalendar(instance(repMock));
        const calendar = await fetch.execute(interviewer);
        expect(calendar.length).toBe(1);
        verify(repMock.fetchAllSlotsFrom(interviewer)).once()
    });

    it("Then it sets some slots as free", async () => {
        const taken = SlotBuilder.TakenBy("cand@some.ie").at(at).spans(15).willChatWith(interviewer).build();
        const free = SlotBuilder.FreeWith(interviewer).at("12-12-2012 15:00").spans(15).build();
        when(repMock.fetchAllSlotsFrom(interviewer))
            .thenResolve([taken])
            .thenResolve([free, taken])
        const set = new SetFreeSlotOnIntervierCalendar(instance(repMock));
        const calendar = (await set.execute(interviewer, [free])).ok
        expect(calendar.length).toBe(2);
        verify(repMock.saveFreeSlotTo(anyOfClass(Array))).once()
    });

    it("Then it cannot sets some existents slot as free", async () => {
        const free = SlotBuilder.FreeWith(interviewer).at(at).spans(15).build();
        const taken = SlotBuilder.TakenBy("cand@some.ie").at(at).spans(15).willChatWith(interviewer).build();
        when(repMock.fetchAllSlotsFrom(interviewer))
            .thenResolve([taken])
        const set = new SetFreeSlotOnIntervierCalendar(instance(repMock));
        const [validation] = (await set.execute(interviewer, [free])).error;
        expect(validation).toBe("Slot already set");
    });

    it("Then it generate distinct token for every interviwer", async () => {
        when(genMock.invitationToken(interviewer, anyString()))
            .thenResolve("mateushenriquebrum@gmail.com")
            .thenResolve("iagobrum@gmail.com");
        when(repMock.fetchFreeSlotsByIds(anything()))
            .thenResolve([SlotBuilder.FreeWith(interviewer).at("12-12-2012 12:00").spans(15).build()])        
            .thenResolve([SlotBuilder.FreeWith(interviewer).at("12-12-2012 13:00").spans(15).build()]);
            
        const invite = new InviteInterviwerByEmail(instance(genMock), instance(repMock));
        const first = (await invite.execute(interviewer, "mateushenriquebrum@gmail.com", ["a"])).ok;
        const second = (await invite.execute(interviewer, "iagobrum@gmail.com", ["b"])).ok;
        expect(first).not.toBeNull()
        expect(second).not.toBeNull()
        expect(second).not.toBe(first);
    })
})