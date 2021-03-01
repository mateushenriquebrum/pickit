import { FetchIntervieweeCalendarByToken, IntervieweeCalenderRepository, PickFreeSlotByToken, Confirmation } from '../src/interviewee';
import { instance, anything, mock, when, verify, anyOfClass } from 'ts-mockito';
import { Free, Taken } from '../src/slot';

let mockRep = mock<IntervieweeCalenderRepository>()

beforeEach(() => {
    let mockRep = mock<IntervieweeCalenderRepository>()
});

describe("Interviewee fetch a calendar by token", () => {

    const onlyFreeSlot = new Free(new Date(0), new Date(1), "interviewer@company.ie")
    const token = "any_token";
   
    it("Then interviewee fetch it all", async () => {        
        when(mockRep.slotsByToken(token)).thenResolve([onlyFreeSlot])
        const fetch = new FetchIntervieweeCalendarByToken(instance(mockRep))
        const slots = (await fetch.execute(token)).ok
        expect(slots).not.toBeNull()
        expect(slots.length).toBe(1);
        verify(mockRep.slotsByToken(token)).once()
    });

    it("Then interviewee pick a free slot", async () => {
        const pick = new PickFreeSlotByToken(instance(mockRep))
        const confirm = (await pick.execute(token, onlyFreeSlot)).ok
        const result = new Taken(new Date(0), new Date(1), "interviewer@company.ie", token);
        expect(confirm).toStrictEqual(result);
        verify(mockRep.slotsByToken(token)).once()
        verify(mockRep.saveTakenByToken(anyOfClass(Taken))).once()
    });

    it("Then interviewee pick a taken slot", async () => {

    });

    it("Then interviewee try to pick another slot with the same token", async () => {

    });

    it("Then interviewee try to pick a slot taken by another interviwee", async () => {

    });
});