import * as Sequelize from 'sequelize';
import { SeqIntervieweeRepository, SeqInterviewerRepository } from "../../src/infrastructure/repositories";
import * as DB from "../../src/infrastructure/database";
import { SlotBuilder } from '../../src/domain/slot';
import {TestDataModelFactory} from '../../src/infrastructure/model';

let seq = new Sequelize.Sequelize('sqlite::memory:?cache=shared')
let fac = new TestDataModelFactory(seq);

beforeEach(async() => {
    await DB.createDatabase(seq);
    const DbSlot = seq.model("slots");
    await DbSlot.create({from: new Date(), to: new Date(), token: "token", interviewer: "interviwer@company.ie"})
    await DbSlot.create({from: new Date(), to: new Date(), token: "token", interviewer: "interviwer@company.ie", interviewee: "candidate@gmail.com"})
})

test("Should fetch only free slot by token", async () => {    
    const freeSlots = await new SeqIntervieweeRepository(fac).fetchFreeSlotsByToken("token");
    expect(freeSlots.length).toBe(1);
})

test("Should return the saved taken slot", async () => {
    const taken = SlotBuilder.TakenBy("candidate@gmail.com").at("01-01-2021 12:00").span(15).willChatWith("interviwer@company.ie").build();    
    const savedTaken = await new SeqIntervieweeRepository(fac).saveTakenSlotByToken(taken)
    expect(savedTaken).not.toBeNull()
})

test("Should return the saved taken slot", async () => {    
    const savedTaken = await new SeqInterviewerRepository(fac).fetchAllSlotsFrom("interviwer@company.ie")    
    expect(savedTaken.length).toBe(2)
})

test("Should return the saved free as taken", async () => {    
    const taken = SlotBuilder.FreeWith("interviwer@company.ie").at("01-01-2021 12:00").span(15).build();    
    const savedFree = await new SeqInterviewerRepository(fac).saveFreeSlotTo([taken])
    expect(savedFree.length).toBe(1)
})