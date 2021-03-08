# pickit
Calendar sharing for Colaborators.

## Architecture
It uses Clean Architecture and some concepts of DDD, like aggregation, entity, domain services, etc.

## How to run
### Development Env
npm run start

### Production Env
TODO

## API Doc
### Authenticate Interviewer
http://localhost:8000/authentication
{
    "email": "mateushenriquebrum@gmail.com",
    "secret": "1234"
}

### Authenticate Interviewer
http://localhost:8000/authentication
{
    "email": "mateushenriquebrum@gmail.com",
    "secret": "1234"
}

### Set Free slots in Calendar
http://localhost:8000/interviewer/mateushenriquebrum@gmail.com/calendar/free

{
    "free": [
        {"at": "01-01-2020 12:00", "spans": 30},
        {"at": "01-01-2020 12:30", "spans": 30},
        {"at": "01-01-2020 13:00", "spans": 30}
    ]
}

### Fetch Interviewer Calendar
http://localhost:8000/interviewer/mateushenriquebrum@gmail.com/calendar
Authorization: Bearer <jwt>

### Invete an Interviewee by email
https://localhost:8000/interviewer/mateushenriquebrum@gmail.com/calendar/invite

{
    "ids": [<slot_id>],
    "interviewee": "candidate@gmail.com"
}


### Fetch Interviewer Calendar
http://localhost:8000/interviewee/<interviewee_token>/calendar

### Pick an Interviewer Free Slot
http://localhost:8000/interviewee/<interviewee_token>/calendar/pick

{
    "id": <slot_id>
}
