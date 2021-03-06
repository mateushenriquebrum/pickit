import express from 'express';
const bodyParser = require('body-parser');
import * as Sequelize from 'sequelize';
import { VariableCacheDataModelFactory } from "./model"
const app = express();
app.use(bodyParser.json())
const PORT = 8000;

var authentication = require('./authentication')
var interviewee = require('./interviewee')
var interviewer = require('./interviewer')

app.use('/authentication', authentication);
app.use('/interviewee', interviewee);
app.use('/interviewer', interviewer);

app.listen(PORT, async () => {
  const seq = new Sequelize.Sequelize('pickit', 'pickit', 'pickit', { 
    logging: true, 
    dialect: "sqlite",
    storage: "pickit.sqlite"
   })
  const fac = new VariableCacheDataModelFactory(seq)
  fac.Slot();
  await seq.sync({ force: true });  
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});