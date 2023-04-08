# JECNA API DOCUMENTATION

> ## Table of contents
> 1. [Server behaviour](#server-behaviour)
> 2. [/login](#login)
> 3. [/logout](#logout)
> 4. [/school/news](#news)
> 5. [/school/news/archive](#news-archive)
> 6. [/school/moodle](#moodle)
> 7. [/school/food](#food)
> 8. [/school/food/login](#food-login)
> 9. [/school/teachers](#teachers)
> 10. [/school/rooms](#rooms)
> 11. [/school/teacher](#teacher)
> 12. [/school/room](#room)
> 13. [/school/event](#event)
> 14. [/user/profile](#profile)
> 15. [/user/profile/edit](#profile-edit)
> 16. [/user/grades](#grades)
> 17. [/user/record-list](#record-list)
> 18. [/user/absence](#absence)
> 19. [/user/passings](#passings)
> 20. [/user/schedule](#schedule)
> 21. [/user/special-schedule](#special-schedule)

## Server behaviour
The server accepts everything in JSON data, if a payload doesn't have type `application/json` an `payloadException` exception will be thrown;
The server always returns a http code and some JSON data.

If everything is OK, the server returns code `200` and response data.
If an exception happens, the server returns an error http code and some JSON info about the error in this format:
```json
{
  "type": "error type",
  "tree": "error tree",
  "message": "error message"
}
```
There are three types of exceptions: `clientException`, `serverException` and `internalException`.
Client exception returns codes `400`, `401` or `404`. It means, that the client did something wrong.
Server exception returns code `500`, and it means that something bad has happened to the server. Please report these errors to the issues page.
Internal exception also returns code `500`, and it means that something has gone seriously wrong on the server. Please report these errors to the issues page too.

## Root
### Login
> **Url:** `/login` <br>
> **Description:** Logs in and returns a valid session token, that can be used to access the website
> #### Request
> ```json
> {
>   "username": "Your username on the website",
>   "password": "Your password on the website"
> }
> ```
> #### Response
> ```json
> {
>   "token": "Your auth token"
> }
> ```
> #### Throws
> `loginException` When credentials are wrong <br>
> `payloadException` When you haven't provided one or both credentials

### Logout
> **Url:** `/logout` <br>
> **Description:** Performs a logout
> #### Request
> ```json
> {
>   "token": "Your auth token"
> }
> ```
> #### Response
> ```json
> {}
> ```
> #### Throws
> `tokenException` When the token is bad <br>
> `payloadException` When you haven't provided the token

## School

### News
> **Url:** `/school/news` <br>
> **Description:** Returns a list of all news on the main feed
> #### Request
> ```json5
> {
>   "token": "Your auth token" // Optional - if not provided show only public events
> }
> ```
> #### Response
> ```json5
> {
>   "news": [
>     {
>       "title": "The event title",
>       "content": "HTML text of the event including the <p> elements",
>       "author": "The whole name of the author",
>       "date": "Date of posting",
>       "public": true, // true or false if the event is public
>       "attachments": [ // the attachments (files or images) of the event
>         "first url", "second url" // ...
>       ]
>     } // ...
>   ]
> }
> ```
> #### Throws
> `tokenException` When your token is bad

### News archive
> **Url:** `/school/news/archive` <br>
> **Description:** Returns a list of ALL news, including those in archive
> #### Request
> ```json5
> {
>   "token": "Your auth token", // Optional - if not provided show only public events
>   "expand": false, // If it should return only title and code, or the whole event; OPTIONAL; default = false
>   "index": 0, // index to start from; OPTIONAL; default = 0
>   "max": Infinity // the maximum number of events; OPTIONAL; default = Infinity
> }
> ```
> #### Response
> If `expand` is true -> the same as [/school/news](#news) <br>
> Else ->
> ```json5
> {
>   "news": [
>     {
>       "title": "The title of the event",
>       "code": 2604 // the code to the event; can be used in /school/event
>     } // ...
>   ]
> }
> ```
> #### Throws
> `tokenException` When your token is bad <br>
> `payloadException` When `index` or `max` are not numbers <br>
> `payloadException` When `expand` is not boolean

### Moodle
> **Url:** `/school/moodle` <br>
> **Description:** Returns two cookies that can be used to open logged in url of moodle
> #### Request
> ```json5
> {
>   "username": "Your moodle username",
>   "password": "Your moodle password"
> }
> ```
> **Response**
> ```json5
> {
>   "moodleSession": "moodle session id",
>   "moodleId": "moodle user id"
> }
> ```
> #### Throws
> `loginException` When credentials are wrong <br>
> `payloadException` When you haven't provided one or both credentials

### Food
> **Url:** `/school/food` <br>
> **Description:** Returns lunches
> #### Request
> ```json5
> {
>   "list": true // if it provides the whole list of lunches, or just the first one; Optional
> }
> ```
> #### Response
> If `list` is false ->
> ```json5
> {
>   "date": "The full date of the lunch",
>   "dayOfWeek": "The day of the week",
>   "lunch1": {
>     "food": "The food that is served",
>     "allergens": [1, 7] // all allergens that the food has
>   },
>   "lunch2": null // the same as lunch one
> }
> ```
> Else list `lunches` with these objects
> #### Throws
> `payloadException` When `list` is not a boolean

### Food login
> **Url:** `/school/food/login` <br>
> **Description:** Returns the session cookie for getting the logged in food website
> #### Request
> ```json5
> {
>   "username": "Your username",
>   "password": "Your password"
> }
> ```
> #### Response
> ```json5
> {
>   "session": "The logged in session"
> }
> ```
> #### Throws
> `loginException` When credentials are wrong <br>
> `payloadException` When you haven't provided one or both credentials

### Teachers
> **Url:** `/school/teachers` <br>
> **Description:** Returns a list of all teachers on the school. Teachers can then be fetched using `/teacher`
> #### Request
> ```json5
> {}
> ```
> #### Response
> ```json5
> {
>   "teachers": [
>     {
>       "name": "The full name of the teacher",
>       "short": "The shortcut for the teacher"
>     } // ...
>   ]
> }
> ```
> **Throws:** nothing

### Rooms
> **Url:** `/school/rooms` <br>
> **Description:** Returns a list of all rooms, that can be later fetched by their ids with `/school/room`
> #### Request
> ```json5
> {
>   "token": "Your auth token"
> }
> ```
> #### Response
> ```json5
> { 
>   "rooms": [
>     {
>       "short": "Shortcut for the room", // the number id for the room, used for fetching the room
>       "name": "Full name of the room",
>       "class": "The name of the grade, which is there",
>       "admin": "Who manages the room (full name)"
>     } // ...
>   ]
> }
> ```
> #### Throws
> `tokenException` When the token is bad <br>
> `payloadException` When you haven't provided the token

### Teacher
> **Url:** `/school/teacher` <br>
> **Description:** Returns as much information about a specified teacher
> #### Request
> ```json5
> {
>   "token": "Your auth token", // Optional - if not provided the teacher schedule is empty
>   "short": "The shortcut of the teacher",
>   "year": -1, // The year to take the schedule from; Optional - if not provided it takes the current year. It has to be a number.
>   "timeTableId": -1 // The period of the schedule; Optional - if not provided it selects the current period. It has to a number 
> }
> ```
> #### Response
> If some of the values are not available, they return **an empty string**, empty object or empty array
> ```json5
> {
>   "name": "The whole name of the teacher",
>   "username": "The username of the teacher",
>   "email": "The email of the teacher",
>   "private_email": "The private email of the teacher",
>   "phones": {
>     "mobile": "The mobile number of the teacher",
>     "link": "The number of teachers phone link",
>     "private": "Teachers private number"
>   },
>   "cabinet": "The teachers cabinet",
> //  "cabinetShort":  "The teachers cabinet shortcut", // can be then used for fetching (/school/room) TODO decide if it's needed
>   "class_teacher": "The class the teacher teaches",
>   "consultations": "Consultation hours of the teacher",
>   "image": "The url of the teachers image",
>   "schedule": {}, // The teachers schedule object
>   "certificates": [ // The teachers certificate list
>     {
>       "date": "The date of the certificate",
>       "label": "The label of the certificate",
>       "institution": "The institution of the certificate"
>     } // ...
>   ]
> }
> ```
> #### Throws
> `tokenException` When the token is bad <br>
> `payloadException` When you haven't provided the teacher short <br>
> `dataException` When `teacherShort` doesn't exist <br>
> `payloadException` When `year` or `timeTableId` is not a number <br>
> `payloadException` When `year` or `timeTableId` don't exist

### Room
> **Url:** `/school/room` <br>
> **Description:** Returns as much information about a specified room
> #### Request
> ```json5
> {
>   "token": "Your auth token",
>   "short": "The shortcut of the room",
>   "year": -1, // The year to take the schedule from; Optional - if not provided it takes the current year. It has to be a number.
> }
> ```
> #### Response
> ```json5
> {
>   "schedule": {}, // the schedule of the room or empty if none
>   "admin": { // the teacher that manages the room
>     "name": "The full name of the teacher",
>     "short": "The short of the teacher" // is blank if there is no short
>   },
>   "phones": {
>     "mobiles": ["number1", "number2"],// The mobile phone numbers for the room
>     "link": "The link number for the room"
>   },
>   "floor": "On which floor the room is",
>   "class": "The name of the grade that is there"
> }
> ```
> #### Throws
> `tokenException` When the token is bad <br>
> `payloadException` When you haven't provided the token <br>
> `payloadException` When you haven't provided the room short <br>
> `dataException` When `roomShort` doesn't exist

### Event
> **Url:** `/school/event` <br>
> **Description:** Returns as much information about a specific event
> #### Request
> ```json5
> {
>   "token": "Your auth token", // Optional; if not provided private events will not be accessible
>   "eventCode": NaN // the code for the event to use. It must be a number
> }
> ```
> #### Response
> The classic event object as provided in [news](#news)
> #### Throws
> `tokenException` When the token is bad <br>
> `payloadException` When you haven't provided the event code <br>
> `dataException` When `eventCode` doesn't exist

## User

### Profile
> **Url:** `/user/profile` <br>
> **Description:** Returns as much data about the current user as possible
> #### Request
> ```json5
> {
>   "token": "Your auth token"
> }
> ```
> #### Response
> ```json5
> {
>   "name": "Full name of the user",
>   "username": "The username of the user",
>   "age": "The age of the user",
>   "birth": "The date and place of birth",
>   "phone": "The phone of the user",
>   "homeAddress": "The home address of the user",
>   "contactAddress": "The contact address of the user", // if not specified it's the same as homeAddress
>   "grade": "User's grade",
>   "group": "User's group",
>   "reportNum": "The number in the class",
>   "privateEmail": "The private email of the user",
>   "schoolEmail": "The school email of the user",
>   "healthInsurance": "Name of the health insurance company",
>   "image": "The url of the students image",
>   "guardians": [
>     {
>       "name": "Full name of the guardian",
>       "phone": "Guardian's phone number",
>       "email": "Guardian's email"
>     } // ...
>   ],
>   "support": {
>     "variableSymbol": "The variable symbol to the students support",
>     "bankAccount": "The bank account to the students support",
>   }
> }
> ```
> #### Throws
> `tokenException` When the token is bad <br>
> `payloadException` When you haven't provided the token

### Profile edit
> **Url:** `/user/profile/edit` <br>
> #### POST METHOD
> > **Description:** Sends a list with all possible values to change and it's values.
> > ##### Request
> > ```json5
> > {
> >   "token": "Your auth token"
> > }
> > ```
> > ##### Response
> > ```json5
> > {
> >   "email": "Current email",
> >   "phone": "Current phone",
> >   "insurance": {
> >     "value": "Current health insurance company",
> >     "possibleValues": [ // all possible values for this field
> >       {
> >         "id": 0, // the id that MUST be sent
> >         "value": "The string value of the option"
> >       } // ...
> >     ]
> >   },
> >   "street": "Current street name + , + current sub-village",
> >   "houseNumber": "house registration + / + orientation number",
> >   "village": {
> >     "value": "current village/town name",
> >     "possibleValues": [ // all possible values for this field
> >       {
> >         "id": 0, // the id that MUST be sent
> >         "value": "The string value of the option"
> >       } // ...
> >     ]
> >   },
> >   "zip": "The zip code"
> > }
> > ```
> > ##### Throws
> > `tokenException` When the token is bad <br>
> > `payloadException` When you haven't provided the token
> 
> #### PUT METHOD
> > **Description:** Edits values in the user profile
> > ##### Request
> > ```json5
> > {
> >   "token": "Your auth token",
> >   "form": { // ONLY FORM
> >     // any of these can be missing, it will be set to the current value
> >     "email": "New user email",
> >     "phone": "New user phone",
> >     "insurance": 0, // new insurance id,
> >     "street": "New street value",
> >     "houseNumber": "New house number value",
> >     "village": 0, // new village id
> >     "zip": "New zip value"
> >   },
> >   "password": { // OR ONLY PASSWORD
> >     "oldPassword": "Old password",
> >     "newPassword": "New password"
> >   }
> > }
> > ```
> > **OR**
> > Content-Type: image/jpeg
> > File: image
> > ##### Response
> > The data object (like [this](#response-12)) if successful
> > If not successful -> error object ([reference](#server-behaviour))
> > ##### Throws
> > `tokenException` When the token is bad <br>
> > `payloadException` When you haven't provided the token <br>
> > `payloadException` When you provided form and password field together <br>
> > `payloadException` When `oldPassword` or `newPassword` or both in `password` field are missing <br>
> > `dataException` When `oldPassword` is wrong <br>
> > `dataException` When `newPassword` doesn't fulfill the password requirements <br>
> > `payloadException` When `insurance` or `village` have wrong value <br>
> > `payloadException` When image is too large <br>
> > `payloadException` When image is not JPEG format

### Grades
> **Url:** `/user/grades` <br>
> **Description:** Returns all user grades and an array with possible years and half-terms
> #### Request
> ```json5
> {
>   "token": "Your auth token",
>   "year": -1, // The year to take the grades from; Optional - if not provided it takes the current year. It has to be a number.
>   "half-term": -1 // The school year half id; Optional - if not provided it takes the first half-term possible. It has to be a number
> }
> ```
> #### Response
> ```json5
> {
>   "subjects": [
>     {
>       "subjectShort": "Short name of the subject",
>       "subjectName": "The full name of the subject",
>       "groups": [ // subject groups
>         {
>           "name": "The name of the grade group",
>           "grades": [ // the grades
>             {
>               "grade": "The grade number/letter",
>               "title": "The title of the grade",
>               "teacherShort": "Shortcut of the teacher that gave it",
>               "teacherFull": "Full name of the teacher",
>               "small": true, // if the grade is small
>               "date": "The date of the grade"
>             } // ...
>           ]
>         } // ...
>       ],
>       "final": "The final grade"
>     } // ...
>   ],
>   "behaviour": "Behaviour grade",
>   "years": [
>     {
>       "name": "The name of the year",
>       "id": -1, // the id of the year
>       "half-terms": [
>         {
>           "name": "The name of the half term",
>           "id": -1 // the id of the half-term
>         } // ...
>       ]
>     } // ...
>   ] 
> }
> > ```
> #### Throws
> `tokenException` When the token is bad <br>
> `payloadException` When you haven't provided the token <br>
> `payloadException` When `year` or `half-term` is not a number <br>
> `payloadException` When `year` or `half-term` don't exist

### Record list
> **Url:** `/user/record-list`
> **Description:** Returns a list of all the records (for parents)
> #### Request
> ```json5
> {
>   "token": "Your auth token"
> }
> ```
> #### Response
> ```json5
> {
>   "records": [
>     {
>       // TODO find more data to be able to parse this
>       //"good": true, // if it's good - true, if it's bad - false
>       //"type": "The type of the record",
>       //"date": "The date of the record",
>       //"reason": "The reason for the record",
>       //"referenceNumber": "The reference number" // or empty if none
>       "good": true,
>       "date": "The date of the record",
>       "text": "The text of the record"
>     } // ...
>   ]
> }
> ```
> #### Throws
> `tokenException` When the token is bad <br>
> `payloadException` When you haven't provided the token

### Absence
> **Url:** `/user/absence`
> **Description:** Returns users absence + list of available years
> #### Request
> ```json5
> {
>   "token": "Your auth token",
>   "year": -1, // The year to take the grades from; Optional - if not provided it takes the current year. It has to be a number.
> }
> ```
> #### Response
> ```json5
> {
>   "absence": [
>     {
>       "date": "The date of the absence",
>       "weekDay": "The day of the week",
>       "hours": 1 // how many hours missing
>     } // ...
>   ],
>   "years": [
>     {
>       "name": "The name of the year",
>       "id": "The id of the year"
>     } // ...
>   ]
> }
> ```
> #### Throws
> `tokenException` When the token is bad <br>
> `payloadException` When you haven't provided the token <br>
> `payloadException` When `year` is not a number <br>
> `payloadException` When `year` doesn't exist

### Passings
> **Url:** `/user/passings`
> **Description:** Returns a list of all users passings + a list of all availables years and months
> #### Request
> ```json5
> {
>   "token": "Your auth token",
>   "year": -1, // The year to take the grades from; Optional - if not provided it takes the current year. It has to be a number.
>   "month": -1 // The month id; Optional - if not provided it takes the first month possible. It has to be a number
> }
> ```
> #### Response
> ```json5
> {
>   "passings": [
>     {
>       "date": "The date of the passing",
>       "weekDay": "The day of the week",
>       "arrived": "The time when user arrived", // or empty if no arrive
>       "left": "The time when user left" // or empty if no left
>     } // ...
>   ],
>   "years": [
>     {
>       "name": "The name of the year",
>       "id": "The id of the year",
>       "months": [
>         {
>           "name": "The name of the month",
>           "id": "The id of the month"
>         } // ...
>       ]
>     } // ...
>   ]
> }
> ```
> #### Throws
> `tokenException` When the token is bad <br>
> `payloadException` When you haven't provided the token <br>
> `payloadException` When `year` or `month` is not a number <br>
> `payloadException` When `year` or `month` don't exist

### Schedule
> **Url:** `/user/schedule`
> **Description:** Returns a schedule for the user, including possible years and periods
> #### Request
> ```json5
> {
>   "token": "Your auth token",
>   "year": -1, // The year to take the grades from; Optional - if not provided it takes the current year. It has to be a number.
>   "period": -1 // The period id; Optional - if not provided it takes the first period possible. It has to be a number
> }
> ```
> #### Response
> ```json5
> {
>   "times": [
>     {
>       "lesson": 0, // the number of the lesson
>       "start": "The time when the lessons starts",
>       "end": "The time when the lesson ends"
>     } // ...
>   ],
>   "days": [
>     {
>       "dayShort": "The day shortcut",
>       "lessons": 0, // number of lessons in the day counting empties between lessons
>       "subjects": [
>         [
>           {
>             "type": "lesson",
>             "short": "The lesson name short",
>             "name": "The lesson full name",
>             "teacherShort": "The teacher shortcut",
>             "teacherName": "The teacher full name",
>             "classroom": "The classroom where the lesson is",
>             "class": "The class which is the lesson for",
>             "group": "The group who it is for or empty",
>             "length": 1 // the length of the lesson (usually 1)
>           } // more groups
>         ],
>         [
>           {
>             "type": "break"
>           } // more groups
>         ],
>         [
>           {
>             "type": "other"
>           } // more groups
>         ] // ...
>       ]
>     } // ...
>   ],
>   "years": [
>     {
>       "name": "The name of the year",
>       "id": "The id of the year",
>       "periods": [
>         {
>           "name": "The name of the period",
>           "id": "The id of the period"
>         } // ...
>       ]
>     } // ...
>   ]
> }
> ```
> #### Throws
> `tokenException` When the token is bad <br>
> `payloadException` When you haven't provided the token <br>
> `payloadException` When `year` or `period` is not a number <br>
> `payloadException` When `year` or `period` don't exist

### Special schedule
> **Url:** `/user/special-schedule` <br>
> **Description:** provides an url to the special schedule
> #### Request
> ```json5
> {}
> ```
> #### Response
> ```json5
> {
>   "url": "Special schedule url"
> }
> ```
> **Throws:** nothing

