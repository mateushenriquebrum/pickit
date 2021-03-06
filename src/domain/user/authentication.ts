import { Email, Ok, Result, Error, Token } from "../shared";

var jwt = require('jsonwebtoken');
type JWT = string; // should be nice to be able to define constraints here like .*{12}.*{12}.*{12}, because the type here is not only a string but a well know formated string.
export class Tokens {
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
            return false
        }
    }
}

export interface UserRepository {
    findUserByEmailAndSecret(user: User): User
}

export class MockUserRepository implements UserRepository {
    findUserByEmailAndSecret(user: User): User {
        return user;
    }
}
type User = {email: Email, secret: string};
export class InterviewerLogin {
    // Some repository where you can find the user by user and pass
    // That is trivial, not implemented here by the sake of time    
    constructor(private rep: UserRepository) {}

    async execute(user: User): Promise<Result<Token>> {
        const found = this.rep.findUserByEmailAndSecret(user);
        if(found) {
            const token = await new Tokens().tokenFor(user.email)
            return new Ok(token);
        }else{
            return new Error(["User not found"]);
        }
    }
}