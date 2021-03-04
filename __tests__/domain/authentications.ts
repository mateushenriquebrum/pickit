import { Authentication } from '../../src/domain/authentication';

test("Should get a JWT token", async () => {    
    const token = new Authentication().tokenFor({interviewer: "mateushenriquebrum@gmail.com"});
    expect(token).not.toBeNull();
})

test("Should be a valid tokey", async () => {    
    const token = await new Authentication().tokenFor({interviewer: "mateushenriquebrum@gmail.com"});
    const payload = await new Authentication().verify(token);
    expect(payload).toBe(true)
})

test("Should not be a valid tokey", async () => {        
    const payload = await new Authentication().verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
    expect(payload).toBe(false);
})