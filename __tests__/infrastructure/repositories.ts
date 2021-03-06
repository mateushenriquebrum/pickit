import * as Sequelize from 'sequelize';
import { SeqIntervieweeRepository, SeqInterviewerRepository } from "../../src/infrastructure/repositories";
import * as DB from "../../src/infrastructure/database";
import { SlotBuilder } from '../domain/calendar/helpers';
import { VariableCacheDataModelFactory } from '../../src/infrastructure/model';

let seq = new Sequelize.Sequelize('sqlite::memory:?cache=shared', { logging: false })
let fac = new VariableCacheDataModelFactory(seq);

beforeEach(async () => {
    await DB.createTestDatabase(seq);
    const DbSlot = seq.model("slots");
    await DbSlot.create({ from: new Date(), to: new Date(), interviewer: "interviwer@company.ie" }) // free
    await DbSlot.create({ from: new Date(), to: new Date(), interviewer: "interviwer@company.ie", interviewee: "candidate@gmail.com" }) //taken
    await DbSlot.create({ from: new Date(), to: new Date(), token: "token", interviewer: "interviwer@company.ie" }) // offered
})

test("Should fetch only free slot by token", async () => {
    const freeSlots = await new SeqIntervieweeRepository(fac).fetchOfferedSlotsByToken("token");
    expect(freeSlots.length).toBe(1);
})

test("Should return the saved taken slot", async () => {
    const savedTaken = await new SeqInterviewerRepository(fac).fetchAllSlotsFrom("interviwer@company.ie")
    expect(savedTaken.length).toBe(3)
})

test("Should return the saved free as taken", async () => {
    const taken = SlotBuilder.FreeWith("interviwer@company.ie").at("01-01-2021 12:00").spans(15).build();
    const savedFree = await new SeqInterviewerRepository(fac).saveFreeSlotTo([taken])
    expect(savedFree.length).toBe(1)
})