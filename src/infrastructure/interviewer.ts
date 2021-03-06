import { FetchInterviwerCalendar, SetFreeSlotOnIntervierCalendar, InviteInterviwerByEmail, UUIDTokenGenerator } from "../domain/calendar/interviewer"
import { Free } from "../domain/calendar/slot"
const moment = require("moment");
import express from 'express';
import * as Sequelize from 'sequelize';
import { SeqInterviewerRepository, SeqIntervieweeRepository } from "./repositories"
import { VariableCacheDataModelFactory } from "./model"

var router = express.Router()

let interviewerRepository: SeqInterviewerRepository;

const seq = new Sequelize.Sequelize('pickit', 'pickit', 'pickit', {
    logging: true,
    dialect: "sqlite",
    storage: "pickit.sqlite"
})
const fac = new VariableCacheDataModelFactory(seq)
interviewerRepository = new SeqInterviewerRepository(fac)

router.get('/:email/calendar', async (req, res) => {
    const { email } = req.params
    const usecase = new FetchInterviwerCalendar(interviewerRepository)
    const slots = await usecase.execute(email);
    res.json(slots);
});

router.post('/:email/calendar/free', async (req, res) => {
    type DTO = { id: string, from: string, to: string };
    const { free } = req.body
    const { email } = req.params

    const _free: Array<Free> = free.map((d: DTO) => new Free(d.id, moment(d.from), moment(d.to), email))

    const usecase = new SetFreeSlotOnIntervierCalendar(interviewerRepository);
    const slots = await usecase.execute(email, _free);

    res.json(slots.ok);
});

router.post('/:email/calendar/invite', async (req, res) => {
    const { ids, interviewee } = req.body
    const { email } = req.params

    const usecase = new InviteInterviwerByEmail(new UUIDTokenGenerator(), interviewerRepository);
    const slots = await usecase.execute(email, interviewee, ids)

    res.json(slots.ok);
});

module.exports = router