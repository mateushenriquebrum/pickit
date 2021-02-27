import { FetchCalendarForInterviewer, Free, InterviewerRepository, Taken } from '../src/interviewer';
import { instance, anything, mock, when } from 'ts-mockito';

let repMock:InterviewerRepository;

beforeEach(() => {
    repMock = mock<InterviewerRepository>();
});

describe("Interviewer offer and token to fetch its calendar", () => {
   
    it("Then interviewee fetch it all", async () => {});

    it("Then interviewee pick one free slot", async () => {});

    it("Then interviewee pick one taken slot", async () => {});
});