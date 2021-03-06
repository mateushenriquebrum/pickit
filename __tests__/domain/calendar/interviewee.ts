import { FetchIntervieweeCalendarByToken, IntervieweeRepository, PickFreeSlotByToken } from '../../../src/domain/calendar/interviewee';
import { instance, mock, when, verify, anyOfClass } from 'ts-mockito';
import { Free, Taken, SlotBuilder } from '../../../src/domain/calendar/slot';

let mockRep = mock<IntervieweeRepository>()

describe("Interviewee fetch a calendar by token", () => {
    
    const token = "any_token";
    const freeSlot = SlotBuilder.FreeWith("interviewer@company.ie").at("05-03-2021 16:27").spans(15).build();    
    const takenSlot = SlotBuilder.TakenBy("interviewee@company.ie").willChatWith("interviewer@company.ie").at("05-03-2021 16:27").spans(15).build();
    const offeredSlot = freeSlot.offeredTo("interviewee@company.ie", token); //TODO: create builder

    it("Then interviewee fetch it all", async () => {
        when(mockRep.fetchOfferedSlotsByToken(token)).thenResolve([offeredSlot])
        const fetch = new FetchIntervieweeCalendarByToken(instance(mockRep))
        const slots = (await fetch.execute(token)).ok
        expect(slots).not.toBeNull()
        expect(slots.length).toBe(1);        
        verify(mockRep.updateTakenSlotByToken(anyOfClass(Taken))).never()
    });

    it("Then interviewee pick a offered slot", async () => {
        when(mockRep.fetchIntervieweeSlotByToken(token)).thenResolve("interviewee@company.ie")        
        when(mockRep.fetchOfferedSlotsByToken(token)).thenResolve([offeredSlot])        
        const pick = new PickFreeSlotByToken(instance(mockRep));
        const confirm = (await pick.execute(token, offeredSlot.id)).ok
        expect(confirm).toStrictEqual(takenSlot);        
        verify(mockRep.updateTakenSlotByToken(anyOfClass(Taken))).once()
    });

    it("Then interviewee pick a taken slot", async () => {

    });

    it("Then interviewee try to pick another slot with the same token", async () => {

    });

    it("Then interviewee try to pick a slot taken by another interviwee", async () => {

    });
});