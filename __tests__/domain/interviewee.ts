import { FetchIntervieweeCalendarByToken, IntervieweeRepository, PickFreeSlotByToken } from '../../src/domain/interviewee';
import { instance, mock, when, verify, anyOfClass } from 'ts-mockito';
import { Free, Taken, SlotBuilder } from '../../src/domain/slot';

let mockRep = mock<IntervieweeRepository>()

describe("Interviewee fetch a calendar by token", () => {

    const freeSlot = SlotBuilder.FreeWith("interviewer@company.ie").at("05-03-2021 16:27").span(15).build();
    const takenSlot = SlotBuilder.TakenBy("interviewee@company.ie").willChatWith("interviewer@company.ie").at("05-03-2021 16:27").span(15).build();
    const token = "any_token";

    it("Then interviewee fetch it all", async () => {
        when(mockRep.fetchFreeSlotsByToken(token)).thenResolve([freeSlot])
        const fetch = new FetchIntervieweeCalendarByToken(instance(mockRep))
        const slots = (await fetch.execute(token)).ok
        expect(slots).not.toBeNull()
        expect(slots.length).toBe(1);        
        verify(mockRep.saveTakenSlotByToken(anyOfClass(Taken))).never()
    });

    it("Then interviewee pick a free slot", async () => {
        when(mockRep.fetchIntervieweeSlotByToken(token)).thenResolve("interviewee@company.ie")        
        const pick = new PickFreeSlotByToken(instance(mockRep))
        const confirm = (await pick.execute(token, freeSlot)).ok
        expect(confirm).toStrictEqual(takenSlot);        
        verify(mockRep.saveTakenSlotByToken(anyOfClass(Taken))).once()
    });

    it("Then interviewee pick a taken slot", async () => {

    });

    it("Then interviewee try to pick another slot with the same token", async () => {

    });

    it("Then interviewee try to pick a slot taken by another interviwee", async () => {

    });
});