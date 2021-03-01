import { freemem, type } from 'os';
import * as Sequelize from 'sequelize';
import { SeqIntervieweeCalenderRepository } from "../../src/infrastructure/repositories";
import * as DB from "../../src/infrastructure/database";

let seq = new Sequelize.Sequelize('sqlite::memory:?cache=shared')

beforeEach(async() => {
    await DB.createDatabase(seq);
    const DbSlot = seq.model("slots");
    await DbSlot.create({from: new Date(), to: new Date(), token: "token", interviwer: "interviwer@company.ie"})
    await DbSlot.create({from: new Date(), to: new Date(), token: "token", interviwer: "interviwer@company.ie", interviwee: "candidate@gmail.com"})
})

afterEach(async () => {
    await DB.dropDatabase(seq);
})

test("Sould fetch only free slot by token", async () => {    
    const freeSlots = await new SeqIntervieweeCalenderRepository(seq).fetchFreeSlotsByToken("token");
    expect(freeSlots.length).toBe(1);
})