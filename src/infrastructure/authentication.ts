import express from 'express';
var router = express.Router()

import { InterviewerLogin, MockUserRepository } from "../domain/user/authentication"

router.post('/', async (req, res) => {
    const { email, secret } = req.body
    const usecase = new InterviewerLogin(new MockUserRepository())
    const result = await usecase.execute({ email, secret });
    if (result.error.length) {
        res.status(404).send(result.error[0]);
    } else {
        res.json({ token: result.ok });
    }
});

module.exports = router