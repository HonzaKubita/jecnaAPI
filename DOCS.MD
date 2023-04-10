# JECNA API DOCUMENTATION

> ## Table of contents
> 1. [Server behaviour](#server-behaviour)
> 2. [/login](#login)
> 3. [/logout](#logout)
> 4. [/check-token](#check-token)
> 5. [/school/news](#news)
> 6. [/school/news/archive](#news-archive)
> 7. [/school/moodle](#moodle)
> 8. [/school/food](#food)
> 9. [/school/food/login](#food-login)
> 10. [/school/teachers](#teachers)
> 11. [/school/rooms](#rooms)
> 12. [/school/teacher](#teacher)
> 13. [/school/room](#room)
> 14. [/school/event](#event)
> 15. [/user/profile](#profile)
> 16. [/user/profile/data](#profile-data)
> 17. [/user/profile/image](#profile-image)
> 18. [/user/profile/password](#profile-password)
> 19. [/user/grades](#grades)
> 20. [/user/record-list](#record-list)
> 21. [/user/record](#record)
> 22. [/user/absence](#absence)
> 23. [/user/passings](#passings)
> 24. [/user/schedule](#schedule)
> 25. [/user/special-schedule](#special-schedule)

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

### Check token
> **Url:** `/check-token` <br>
> **Description:** Checks if your token is valid
> #### Request
> ```json5
> {
>   "token": "Your auth token"
> }
> ```
> #### Response
> ```json5
> {
>   "valid": true // if your token is valid
> }
> ```
> #### Throws
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
> **Description:** Returns a list of all teachers on the school. Teachers can then be fetched using `/school/teacher`
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
>   "period": -1 // The period of the schedule; Optional - if not provided it selects the current period. It has to a number 
> }
> ```
> #### Response
> If some of the values are not available, they return **an empty string**, empty object or empty array
> ```json5
> {
>   "name": "The whole name of the teacher",
>   "username": "The username of the teacher",
>   "email": "The email of the teacher",
>   "privateEmail": "The private email of the teacher",
>   "phones": {
>     "mobiles": [], // The mobile numbers of the teacher
>     "link": "The number of teachers phone link",
>     "private": "Teachers private number"
>   },
>   "cabinet": "The teachers cabinet",
>   "classTeacher": "The class the teacher teaches",
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
> `payloadException` When `year` or `period` is not a number <br>
> `payloadException` When `year` or `period` don't exist

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
>   "groups": ["group1"],// User's groups
>   "reportNum": 0, // The number in the class
>   "privateEmail": "The private email of the user",
>   "schoolEmail": "The school email of the user",
>   "image": "The url of the students image",
>   "guardians": [
>     {
>       "name": "Full name of the guardian",
>       "phone": "Guardian's phone number",
>       "email": "Guardian's email"
>     } // ...
>   ],
>   "support": {
>     "variableSymbol": 0, // The variable symbol to the students support
>     "bankAccount": "The bank account to the students support",
>   }
> }
> ```
> #### Throws
> `tokenException` When the token is bad <br>
> `payloadException` When you haven't provided the token

### Profile data
> **Url:** `/user/profile/data` <br>
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
> >     "current": {
> >       "id": 0, // the id
> >       "value": "The text value"
> >     },
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
> >     "current": {
> >       "id": 0, // the id
> >       "value": "The text value"
> >     },
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
> >   "email": "New user email",
> >   "phone": "New user phone",
> >   "insurance": 0, // new insurance id,
> >   "street": "New street value",
> >   "houseNumber": "New house number value",
> >   "village": 0, // new village id
> >   "zip": "New zip value"
> >   
> > }
> > ```
> > ##### Response
> > Empty if everything ok
> > ##### Throws
> > `tokenException` When the token is bad <br>
> > `payloadException` When you haven't provided the token <br>
> > `payloadException` When any of the fields are missing <br>
> > `payloadException` When some field has wrong value + **added `errors{{field: message,...}}` field with error messages** <br>

### Profile image
> **Url:** `/profile/image`
> #### POST METHOD
> > **Description:** Returns currently pending image
> > **Warning:** If some other token uploaded/rejected the image, you have to acquire a new one, in order to work
> > ##### Request
> > ```json5
> > {
> >   "token": "Your auth token"
> > }
> > ```
> > ##### Response
> > ```json5
> > {
> >   "image": "The url of the currently pending image"
> > }
> > ```
> > ##### Throws
> > `tokenException` When the token is bad <br>
> > `payloadException` When you haven't provided the token <br>
> > `stateException` When no image is pending
> 
> #### PUT METHOD
> > **Description:** Changes the profile image to a new image
> > **Warning:** If some other token uploaded/rejected the image, you have to acquire a new one, in order to work
> > ##### Request
> > **Content type:** `multipart/form-data`
> > ```json5
> > {
> >   token: "Your auth token",
> >   image: "image/jpeg" // The image buffer you send
> > }
> > ```
> > ##### Response
> > Empty if everything ok
> > ##### Throws
> > `payloadException` When image is too large <br>
> > `payloadException` When image is not JPEG format <br>
> > `payloadException` When you send more than one file <br>
> > `stateException` When other image is already requested
> 
> #### DELETE METHOD
> > **Description:** Cancels image request
> > **Warning:** If some other token uploaded/rejected the image, you have to acquire a new one, in order to work
> > ##### Request
> > ```json5
> > {
> >   "token": "Your auth token"
> > }
> > ```
> > ##### Response
> > Empty if everything ok
> > ##### Throws
> > `tokenException` When the token is bad <br>
> > `payloadException` When you haven't provided the token <br>
> > `stateException` When no image is pending

### Profile password
> **Url:** `/user/profile/password`
> **Description:** Changes the password
> **Method:** `PUT`
> #### Request
> ```json5
> {
>   "token": "Your auth token",
>   "oldPassword": "Your old password",
>   "newPassword": "Your new password"
> }
> ```
> #### Response
> ```json5
> {
>   "password": "The new password"
> }
> ```
> #### Throws
> `tokenException` When the token is bad <br>
> `payloadException` When you haven't provided the token <br>
> `payloadException` When `oldPassword` or `newPassword` field is missing <br>
> `dataException` When `oldPassword` is wrong or `newPassword` does not fulfill the password requirements

### Grades
> **Url:** `/user/grades` <br>
> **Description:** Returns all user grades and an array with possible years and half-terms
> #### Request
> ```json5
> {
>   "token": "Your auth token",
>   "year": -1, // The year to take the grades from; Optional - if not provided or not existing it takes the current year. It has to be a number.
>   "halfTerm": -1 // The school year half id; Optional - if not provided or not existing it takes the first half-term possible. It has to be a number
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
>     } // ...
>   ],
>   "halfTerms": [
>     {
>       "name": "The name of the half term",
>       "id": -1 // the id of the half-term
>     } // ...
>   ]
> }
> > ```
> #### Throws
> `tokenException` When the token is bad <br>
> `payloadException` When you haven't provided the token <br>
> `payloadException` When `year` or `halfTerm` is not a number

### Record list
> **Url:** `/user/record-list`
> **Description:** Returns a list of all the records (for parents)
> #### Request
> ```json5
> {
>   "token": "Your auth token",
>   "expand": false, // if it should expand all the records - takes longer; OPTIONAL; default = false
>   "index": 0, // index to start from; OPTIONAL; default = 0
>   "max": Infinity // the maximum number of records; OPTIONAL; default = Infinity
> }
> ```
> #### Response
> If `expand` is false:
> ```json5
> {
>   "records": [
>     {
>       "id": 0, // The id of the record, can be used in /user/record
>       "good": true,
>       "date": "The date of the record",
>       "text": "The text of the record"
>     } // ...
>   ]
> }
> ```
> Else:
> ```json5
> {
>   "records": [
>     {
>       "good": true,
>       "type": "The type of the record",
>       "date": "The date of the record",
>       "reason": "The reason for the record",
>       "referenceNumber": "The reference number"
>     } // ...
>   ]
> }
> ```
> #### Throws
> `tokenException` When the token is bad <br>
> `payloadException` When you haven't provided the token

### Record
> **Url:** `/user/record` <br>
> **Description:** Provides as much information about a record as possible
> #### Request
> ```json5
> {
>   "token": "Your auth token",
>   "id": 0 // the id of the record
> }
> ```
> #### Response
> The classic record object provided in [Record list](#record-list) when `expand` is true
> #### Throws
> `tokenException` When the token is bad <br>
> `payloadException` When you haven't provided the token <br>
> `payloadException` When `id` does not exist

### Absence
> **Url:** `/user/absence` <br>
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
>       "id": "The id of the year"
>     } // ...
>   ],
>   "months": [
>     {
>       "name": "The name of the month",
>       "id": "The id of the month"
>     } // ...
>  ]
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

