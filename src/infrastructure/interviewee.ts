import { FetchIntervieweeCalendarByToken, PickFreeSlotByToken } from "../domain/calendar/interviewee"
import express from 'express';
import * as Sequelize from 'sequelize';
import { SeqIntervieweeRepository } from "./repositories"
import { VariableCacheDataModelFactory } from "./model"

var router = express.Router()

let intervieweeRepository: SeqIntervieweeRepository;

const seq = new Sequelize.Sequelize('pickit', 'pickit', 'pickit', {
    logging: true,
    dialect: "sqlite",
    storage: "pickit.sqlite"
})
const fac = new VariableCacheDataModelFactory(seq)
intervieweeRepository = new SeqIntervieweeRepository(fac)

router.get('/:token/calendar', async (req, res) => {
    const { token } = req.params
    const usecase = new FetchIntervieweeCalendarByToken(intervieweeRepository);
    const result = await usecase.execute(token)
    if (result.error.length) {
        res.status(404).send(result.error[0]);
    } else {
        res.json(result.ok);
    }
});

router.post('/:token/calendar/pick', async (req, res) => {
    const { token } = req.params
    const { id } = req.body
    const usecase = new PickFreeSlotByToken(intervieweeRepository);
    const result = await usecase.execute(token, id)
    if (result.error.length) {
        res.status(404).send(result.error[0]);
    } else {
        res.json(result.ok);
    }
});

module.exports = router