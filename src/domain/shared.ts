export abstract class Result<O> {
    public error: Array<String> = [];
    public ok: O
}

export class Ok<T> extends Result<T>{
    constructor(public ok: T) {
        super();
    }
}

export class Error<T> extends Result<T>{
    constructor(public error: Array<String>) {
        super();
    }
}

export type Email = string

export type Token = string

export type InterviewerId = string