var jwt = require('jsonwebtoken');
import { exception } from 'console';
import { Email } from './shared';
type JWT = string; // should be nice to be able to define constraints here like .*{12}.*{12}.*{12}, because the type here is not only a string but a well know formated string.
export class Authentication {
    // Some repository where you can find the user by user and pass
    // That is trivial, not implemented here by the sake of time
    private secret;
    constructor() {
        this.secret = "some_private_key";
    }

    async tokenFor(payload: Object): Promise<JWT> {
        return jwt.sign(payload, this.secret);
    }

    async verify(token: JWT): Promise<Boolean> {
        try{
            const result = jwt.verify(token, this.secret)
            return true
        } catch (e) {
            console.log("verify", e)
            return false
        }
    }
}