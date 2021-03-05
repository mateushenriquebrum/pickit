import express from 'express';
const bodyParser = require('body-parser')

import { InterviewerLogin, MockUserRepository } from "../domain/authentication"
const app = express();
app.use(bodyParser.json())
const PORT = 8000;

app.post('/auth', async (req, res) => {
  console.log(req)
  const { email, secret } = req.body
  //should have some factory by env (dev, test, prod)
  const usecase = new InterviewerLogin(new MockUserRepository())
  const result = await usecase.execute({email, secret});
  if (result.error.length) {
    res.status(404).send(result.error[0].toString());
  } else {
    res.json({ token: result.ok });
  }

});
app.listen(PORT, () => {
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