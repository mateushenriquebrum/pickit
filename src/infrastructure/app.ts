import express from 'express';
const app = express();
const PORT = 8000;
app.get('/', (req, res) => res.send('Express + TypeScript Server'));
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