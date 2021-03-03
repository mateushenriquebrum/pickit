import { freemem, type } from 'os';
import * as Sequelize from 'sequelize';
import { SeqIntervieweeRepository, SeqInterviewerRepository } from "../../src/infrastructure/repositories";
import * as DB from "../../src/infrastructure/database";
import { Free, Taken } from '../../src/domain/slot';

let seq = new Sequelize.Sequelize('sqlite::memory:?cache=shared')

beforeEach(async() => {
    await DB.createDatabase(seq);
    const DbSlot = seq.model("slots");
    await DbSlot.create({from: new Date(), to: new Date(), token: "token", interviewer: "interviwer@company.ie"})
    await DbSlot.create({from: new Date(), to: new Date(), token: "token", interviewer: "interviwer@company.ie", interviewee: "candidate@gmail.com"})
})

afterEach(async () => {
    await DB.dropDatabase(seq);
})

test("Should fetch only free slot by token", async () => {    
    const freeSlots = await new SeqIntervieweeRepository(seq).fetchFreeSlotsByToken("token");
    expect(freeSlots.length).toBe(1);
})

test("Should return the saved taken slot", async () => {    
    const taken = new Taken(new Date(0), new Date(0),  "interviwer@company.ie", "candidate@gmail.com")
    const savedTaken = await new SeqIntervieweeRepository(seq).saveTakenSlotByToken(taken)
    expect(savedTaken).not.toBeNull()
})

test("Should return the saved taken slot", async () => {    
    const savedTaken = await new SeqInterviewerRepository(seq).fetchAllSlotsFrom("interviwer@company.ie")    
    expect(savedTaken.length).toBe(2)
})

test("Should return the saved free as taken", async () => {    
    const savedFree = await new SeqInterviewerRepository(seq).saveFreeSlotTo([new Free(new Date(0), new Date(0), "interviwer@company.ie")])
    expect(savedFree.length).toBe(1)
})