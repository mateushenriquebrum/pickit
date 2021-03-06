import express from 'express';
const bodyParser = require('body-parser');

import * as Sequelize from 'sequelize';

import { InterviewerLogin, MockUserRepository } from "../domain/user/authentication"
import { FetchInterviwerCalendar, SetFreeSlotOnIntervierCalendar, InviteInterviwerByEmail, UUIDTokenGenerator } from "../domain/calendar/interviewer"
import { FetchIntervieweeCalendarByToken, PickFreeSlotByToken } from "../domain/calendar/interviewee"
import { Free } from "../domain/calendar/slot"
import { SeqInterviewerRepository, SeqIntervieweeRepository } from "../infrastructure/repositories"
import { VariableCacheDataModelFactory } from "../infrastructure/model"
import moment from 'moment';
const app = express();
app.use(bodyParser.json())
const PORT = 8000;
let interviewerRepository: SeqInterviewerRepository;
let intervieweeRepository: SeqIntervieweeRepository;

app.post('/auth', async (req, res) => {
  const { email, secret } = req.body
  //should have some factory by env (dev, test, prod)
  const usecase = new InterviewerLogin(new MockUserRepository())
  const result = await usecase.execute({ email, secret });
  if (result.error.length) {
    res.status(404).send(result.error[0]);
  } else {
    res.json({ token: result.ok });
  }

});

app.get('/interviewer/:email/calendar', async (req, res) => {
  const { email } = req.params
  const usecase = new FetchInterviwerCalendar(interviewerRepository)
  const slots = await usecase.execute(email);
  res.json(slots);
});

app.post('/interviewer/:email/calendar/free', async (req, res) => {
  type DTO = {id: string, from: string, to: string};
  const { free } = req.body
  const { email } = req.params
  
  const _free: Array<Free> = free.map((d:DTO) => new Free(d.id, moment(d.from), moment(d.to), email))

  const usecase = new SetFreeSlotOnIntervierCalendar(interviewerRepository);
  const slots = await usecase.execute(email, _free);

  res.json(slots.ok);
});

app.post('/interviewer/:email/calendar/invite', async (req, res) => {
  const { ids, interviewee } = req.body
  const { email } = req.params
  
  const usecase = new InviteInterviwerByEmail(new UUIDTokenGenerator(), interviewerRepository);
  const slots = await usecase.execute(email, interviewee, ids)

  res.json(slots.ok);
});

app.get('/interviewee/:token/calendar', async (req, res) => {
  const { token } = req.params
  const usecase = new FetchIntervieweeCalendarByToken(intervieweeRepository);
  const result = await usecase.execute(token)
  if(result.error.length) {
    res.status(404).send(result.error[0]);
  } else {
    res.json(result.ok);
  }
});

app.post('/interviewee/:token/calendar/pick', async (req, res) => {
  const { token } = req.params
  const { id } = req.body
  const usecase = new PickFreeSlotByToken(intervieweeRepository);  
  const result = await usecase.execute(token, id)
  if(result.error.length) {
    res.status(404).send(result.error[0]);
  } else {
    res.json(result.ok);
  }
});

app.listen(PORT, async () => {
  const seq = new Sequelize.Sequelize('pickit', 'pickit', 'pickit', { 
    logging: true, 
    dialect: "sqlite",
    storage: "pickit.sqlite"
   })
  const fac = new VariableCacheDataModelFactory(seq)
  interviewerRepository = new SeqInterviewerRepository(fac)
  intervieweeRepository = new SeqIntervieweeRepository(fac)
  fac.Slot();
  await seq.sync({ force: true });  
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});


/**
 * Basic API
 * as interviewer
 * [] authentitate with a interviweer email
 * [] get token
 * [] add a bench of free slots
 * [] invite an email
 * as interviewer
 * [] list slots
 * [] with token pick a slot
 * as interviewer
 * [] list taken slots
 */