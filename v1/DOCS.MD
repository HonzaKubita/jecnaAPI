# JECNA API DOCUMENTATION

> ## Table of contents
> 1. [Server behaviour](#server-behaviour)
> 2. [Token system](#token-system)
> 3. [Exceptions](#exceptions)
> 4. [/login](#login)
> 5. [/logout](#logout)
> 6. [/check-token](#check-token)
> 7. [/school/food](#food)
> 8. [/school/food/login](#food-login)
> 9. [/school/moodle/login](#moodle-login)
> 10. [/school/news](#news)
> 11. [/school/news/archive](#news-archive)
> 12. [/school/event](#event)
> 13. [/school/teachers](#teachers)
> 14. [/school/teacher](#teacher)
> 15. [/school/rooms](#rooms)
> 16. [/school/room](#room)
> 17. [/user/profile](#profile)
> 18. [/user/profile/data](#profile-data)
> 19. [/user/profile/change-data](#profile-change-data)
> 20. [/user/profile/change-password](#profile-change-password)
> 21. [/user/profile/image](#profile-image)
> 22. [/user/record-list](#record-list)
> 23. [/user/record](#record)
> 24. [/user/absence](#absence)
> 25. [/user/grades](#grades)
> 26. [/user/passings](#passings)
> 27. [/user/schedule](#schedule)

## Basic info

### Server behaviour
#### Requests
All `GET` endpoints accept query parameters as their input data. <br>
Other methods such as `POST` or `PUT` mostly accept JSON, but there can be some exceptions. <br>
When the JSON format is wrong, the server returns a `payloadException` ([exceptions](#exceptions))
#### Responses
All endpoints return nothing or JSON data.
If some of the fields don't exist (for example when teacher does not have a private number), the server **does not** return `undefined`, it returns **an empty string**.

### Token system
Some of the endpoints need an authorization token in order to work. The token is **always** put into the `token` header. Here are three states/types of token:

|     State     |                     Meaning                     |                                             Errors                                              |
|:-------------:|:-----------------------------------------------:|:-----------------------------------------------------------------------------------------------:|
| **Required**  | When the token is needed, or else it won't work | `tokenException` When the token is invalid<br/>`payloadException` When the token isn't provided |
| **Optional**  | If the token is provided, it returns more data  |                           `tokenException` When the token is invalid                            |
| **Redundant** |  The token is useless - you can add it though   |                                          No exceptions                                          |

### Exceptions
When something goes wrong in the program, it will return JSON exception object like this:
```json5
{
  "type": "The exception type",
  "tree": "The exception tree",
  "message": "The exception message",
  "errors": {} // an object containing field:message pairs when some data have wrong format. Will be covered later
}
```
There are 3 main types of exceptions:
* `clientException` - is thrown when client (you) has done something wrong
* `serverException` - is thrown when something bad happened to the server. Please report this
* `internalException` - is thrown when something serious happened to the server and the server stopped. Urgently report this

## Root

### Login
> **Url:** `/login` <br>
> **Method:** `POST` <br>
> **Token:** Redundant <br>
> **Description:** Logs the user in and returns an auth token, that is used to access other endpoints
> #### Request
> **Type:** `application/json`
> ```json5
> {
>   "username": "admin", // string; required; Your username to log in
>   "password": "password123" // string; required; Your password to log in
> }
> ```
> #### Response
> **Type:** `application/json`
> ```json5
> {
>   "token": "5fwe54fas1f7we" // string; Your auth token
> }
> ```
> #### Throws
> `payloadException` When username or password not provided <br>
> `loginException` When the credentials are wrong

### Logout
> **Url:** `/logout` <br>
> **Method:** `POST` <br>
> **Token:** Redundant (cannot check if successfully logged in or not) <br>
> **Description:** Logs you out
> #### Request
> none
> #### Response
> none
> #### Throws
> nothing

### Check token
> **Url:** `/check-token` <br>
> **Method:** `GET` <br>
> **Token:** Required <br>
> **Description:** Checks if your token is valid or not
> #### Request
> none
> #### Response
> **Type:** `application/json`
> ```json5
> {
>   "valid": true // boolean; If your token is valid
> }
> ```
> #### Throws
> `payloadException` When token not provided

## School

### Food
> **Url:** `/school/food` <br>
> **Method:** `GET` <br>
> **Token:** Redundant <br>
> **Description:** Returns incoming lunch/es for jecna school canteen
> #### Request
> **Type:** `query params`
> ```yaml
> list: true # boolean; optional; default = true; If it should return all lunches, or just the first one
> ```
> #### Response
> **Type:** `application/json` <br>
> **If** list **is** *false*
> ```json5
> {
>   "date": "25.4.2023", // string; The date of the lunch
>   "dayOfWeek": "Úterý", // string; The day of the week
>   "lunch1": { // lunchObject; the object of the first lunch
>     "food": "Bramboračka, ;kuřecí, rýže, nápoj voda, pudink", // string; the lunch food
>     "allergens": [ // number[]; the list of all food's allergens
>       1, 3, 7, 9
>     ]
>   },
>   "lunch2": {} // lunchObject; the object of the second lunch (same props as lunch1)
> }
> ```
> **Else** `lunchObject[]` called `lunches`
> #### Throws
> `dataException` When list is not boolean

### Food login
> **Url:** `/school/food/login` <br>
> **Method:** `POST` <br>
> **Token:** Redundant <br>
> **Description:** Logs the user into school canteen and returns a session token, that can be used to access the website or other food endpoints
> #### Request
> **Type:** `application/json`
> ```json5
> {
>   "username": "admin", // string; required; Your username to log in
>   "password": "password123" // string; required; Your password to log in
> }
> ```
> #### Response
> **Type:** `application/json`
> ```json5
> {
>   "session": "4E3CC3BB380A83BEFBFFB34385" // string; Your session token
> }
> ```
> #### Throws
> `payloadException` When username or password not provided <br>
> `loginException` When the credentials are wrong

### Moodle login
> **Url:** `/school/moodle/login` <br>
> **Method:** `POST` <br>
> **Token:** Redundant <br>
> **Description:** Logs the user into school moodle web and returns the moodle session and moodle user id, which can be usd to access the website or other moodle endpoints
> #### Request
> **Type:** `application/json`
> ```json5
> {
>   "username": "admin", // string; required; Your username to log in
>   "password": "password123" // string; required; Your password to log in
> }
> ```
> #### Response
> **Type:** `application/json`
> ```json5
> {
>   "session": "qfc47qmf0l2n73rnnr6", // string; Your Moodle session cookie (MoodleSession)
>   "userId": "%25E8%25FC%2598K" // string; Your Moodle user id cookie (MOODLEID1_)
> }
> ```
> #### Throws
> `payloadException` When username or password not provided <br>
> `loginException` When the credentials are wrong

### News
> **Url:** `/school/news` <br>
> **Method:** `GET` <br>
> **Token:** Optional (if not provided displays only public events) <br>
> **Description:** Returns all the school news from the main feed
> #### Request
> none
> #### Response
> **Type:** `application/json`
> ```json5
> {
>   "news": [] // eventObject[]; Array of event objects
> }
> ```
> [*eventObject*](#event)
> #### Throws
> [**token exceptions**](#token-system)

### News archive
> **Url:** `/school/news/archive` <br>
> **Method:** `GET` <br>
> **Token:** Optional (if not provided displays only public events) <br>
> **Description:** Returns all school news. It either returns the list of event codes and names, or all events with details (that is very slow, please use max field)
> #### Request
> **Type:** `query params`
> ```yaml
> expand: true # boolean; optional; default = false; If it should return all the details (slow) or only a simple object
> index: 5 # number; optional; default = 0; From which index to start
> max: 20 # number; optional; default = Infinity; How many events it should return (USE THIS WITH expand: true!)
> ```
> #### Response
> **Type:** `application/json` <br>
> **If** expand **is** *false*
> ```json5
> {
>   "news": [ // simpleEventObject[]; Array of simple events
>     {
>       "title": "Přihlášky k maturitám", // string; The title of the event
>       "code": 2670 // number; The code of the event that can be used to fetch the event
>     } // ...
>   ]
> }
> ```
> **Else** `eventObject[]` called `news` - The list of selected events <br>
> [*eventObject*](#event)
> #### Throws
> [**token exceptions**](#token-system) <br>
> `payloadException` When expand is not a boolean <br>
> `payloadException` When index or max is not a number

### Event
> **Url:** `/school/event` <br>
> **Method:** `GET` <br>
> **Token:** Optional (if not provided excepts on private events) <br>
> **Description:** Returns as much information about a specific event
> #### Request
> **Type:** `query params`
> ```yaml
> code: 2670 # number; required; The event code
> ```
> #### Response
> **Type:** `application/json`
> ```json5
> {
>   "title": "Přihlášky k maturitám", // string; The title for the event
>   "content": "<p>Už <strong>DNES</strong> se lze přihlašovat!</p>", // string; The pure HTML content for the event
>   "author": "Jan Marek", // string; The name of the person who wrote the article
>   "date": "4.dubna", // string; The date of the article
>   "public": true, // boolean; If the event is available to the public
>   "attachments": [ "https://www.school.com/img/maturity.jpg", /*...*/ ] // string[]; all attachments (links) that are included
> }
> ```
> #### Throws
> [**token exceptions**](#token-system) <br>
> `payloadException` When code not provided <br>
> `dataException` When event code does not exist

### Teachers
> **Url:** `/school/teachers` <br>
> **Method:** `GET` <br>
> **Token:** Redundant <br>
> **Description:** Returns a list of all teachers and their shorts/codes
> #### Request
> none
> #### Response
> **Type:** `application/json`
> ```json5
> {
>   "teachers": [ // simpleTeacherObject[]; Array of teachers and their shorts
>     {
>       "name": "Jan Marek", // string; The name of the teacher
>       "short": "jm" // string; The short of the teacher that can be used to fetch the teacher
>     } // ...
>   ]
> }
> ```
> #### Throws
> nothing

### Teacher
> **Url:** `/school/teacher` <br>
> **Method:** `GET` <br>
> **Token:** Optional (if not provided it does not return some teacher data) <br>
> **Description:** Returns as much information about a specific teacher
> #### Request
> **Type:** `query params`
> ```yaml
> short: "jm" # string; required; The short of the teacher
> year:   14 # number; optional; default = current; The year id, the schedule is determined by that
> period: 158 # number; optional; default = current; The year period, the schedule is determined by that
> ```
> #### Response
> **Type:** `application/json`
> ```json5
> {
>   "name": "Jan Marek", // string; The full name of the teacher
>   "username": "marekja", // string; The username of the teacher (not shown without token)
>   "email": "marek@school.com", // string; The email of the teacher
>   "privateEmail": "janmarek@gmail.com", // string; The private email of the teacher
>   "phones": { // object; The phones of the teacher
>     "mobiles": [ "278 669 425", /*...*/ ], // string[]; The array of teacher's school phones
>     "link": 404, // number; The link phone of the teacher or 0 if none
>     "private": "778 569 852" // string; The private phone of the teacher (not shown without token)
>   },
>   "cabinet": "K23", // string; The teachers cabinet short, can be used to fetch it
>   "classTeacher": "E4", // string; The class that the teacher teaches
>   "consultations": "po domluvě", // string; The consultation hours of the teacher
>   "image": "https://www.school.com/img/IMG-1588.jpg", // string; The teacher profile image
>   "schedule": {}, // scheduleObject; The schedule of the teacher (not shown without token)
>   "certificates": [ // certificateObject[]; An array of certificate objects
>     {
>       "date": "08.01.2023", // string; The date of the certificate
>       "label": "Osvědčení", // string; The label/title of the certificate
>       "institution": "CERMAT" // string; The name of the institution, that gave the certificate
>     } // ...
>   ]
> }
> ```
> [*scheduleObject*](#schedule)
> #### Throws
> [**token exceptions**](#token-system) <br>
> `payloadException` When short not provided <br>
> `payloadException` When year or period is not a number <br>
> `dataException` When teacher short does not exist <br>
> `dataException` When year or period does not exist

### Rooms
> **Url:** `/school/rooms` <br>
> **Method:** `GET` <br>
> **Token:** Required <br>
> **Description:** Returns a list of all rooms shortly
> #### Request
> none
> #### Response
> **Type:** `application/json`
> ```json5
> {
>   "rooms": [ // simpleRoomObject[]; An array of all rooms
>     {
>       "short": "5a", // string; The room short, that can be used to fetch it
>       "name": "Učebna 5a", // string; The full name of the room
>       "class": "C1b", // string; The class that is there
>       "admin": "Jan Marek" // string; The class admin teacher
>     } // ...
>   ]
> }
> ```
> #### Throws
> [**token exceptions**](#token-system) <br>

### Room
> **Url:** `/school/room` <br>
> **Method:** `GET` <br>
> **Token:** Required <br>
> **Description:** Returns as much information about a specific room
> #### Request
> **Type:** `query params`
> ```yaml
> short: "D8" # string; required; The short of the room
> year:   14 # number; optional; default = current; The year id, the schedule is determined by that
> period: 158 # number; optional; default = current; The year period, the schedule is determined by that
> ```
> #### Response
> **Type:** `application/json`
> ```json5
> {
>   "admin": {}, // simpleTeacherObject; The admin of the room (the short is missing when the class is a root class
>   "phones": { // object; The room phones
>     "mobiles": [ "278 699 425", /*...*/ ], // string[]; The array of room's school phones
>     "link": 404 // number; The link phone of the room or 0 if none
>   },
>   "floor": 1, // number; The floor of the room or -1 if not defined
>   "class": "A2b", // string; Which class has the room as it's root class
>   "schedule": {} // scheduleObject; The schedule of the teacher (not shown without token)
> }
> ```
> [*simpleTeacherObject*](#teachers) <br>
> [*scheduleObject*](#schedule)
> #### Throws
> [**token exceptions**](#token-system) <br>
> `payloadException` When short not provided <br>
> `payloadException` When year or period is not a number <br>
> `dataException` When room short does not exist <br>
> `dataException` When year or period does not exist

## User

### Profile
> **Url:** `/user/profile` <br>
> **Method:** `GET` <br>
> **Token:** Required <br>
> **Description:** Returns as much information about the logged user
> #### Request
> none
> #### Response
> **Type:** `application/json`
> ```json5
> {
>   "name": "Petr Vidle", // string; The full name of the user
>   "username": "vidle", // string; The username of the user
>   "age": 17, // number; The age of the user
>   "birth": "15.3.2006, Praha", // string; The date and place of birth of the user
>   "phone": "605 254 575", // string; The phone of the user
>   "homeAddress": "Zemiská, Vinohrady 169/15, Praha 2, 120 00", // string; The home address of the user
>   "contactAddress": "Zemiská, Vinohrady 169/15, Praha 2, 120 00", // string; The contact address of the user, if not provided it's the same as home address
>   "grade": "A1b", // string; In which grade the user is
>   "groups": ["A1", "N3", /*...*/], // string[]; In which groups the user is
>   "reportNum": 15, // number; The number in report of the user
>   "privateEmail": "petrvidle@gmail.com", // string; The private email of the user
>   "schoolEmail": "petrvidle@school.com", // string; The school email of the user
>   "image": "https://www.school.com/img/vidle.png", // string; The URL of the user's current profile image
>   "guardians": [ // object[]; The list of all user's guardians
>     {
>       "name": "Marek Vidle", // string; The full name of the guardian
>       "phone": "778 956 321", // string; The phone of the guardian
>       "email": "marekvidle@centrum.cz" // string; The email of the guardian
>     } // ...
>   ],
>   "support": { // object; The financial support details
>     "variableSymbol": 454654, // number; The variable symbol for the user
>     "bankAccount": "4485464/3000" // string; The bank account number
>   }
> }
> ```
> #### Throws
> [**token exceptions**](#token-system)

### Profile data
> **Url:** `/user/profile/data` <br>
> **Method:** `GET` <br>
> **Token:** Required <br>
> **Description:** Returns a list of user's editable data, their current values and their possible values if they are select type
> #### Request
> none
> #### Response
> **Type:** `application/json`
> ```json5
> {
>   "email": "petrvidle@gmail.com", // string; The email of the user
>   "phone": "605 254 575", // string; The phone of the user
>   "street": "Zemiská, Vinohrady", // string; The street line of the address
>   "houseNumber": "169/15", // string; The house number of the user
>   "zip": "120000",
>   "insurance": { // dropdownSelectObject; The user's current insurance and it's possible values
>     "current": { // dropdownOptionObject; The currently selected insurance of the user
>       "id": 111, // number; The id of the insurance, it's used to select it
>       "name": "Obecná Zdravotní Pojišťovna" // string; The name of the insurance
>     },
>     "possibleValues": [] // dropdownOptionObject[]; The list of all possible values for the insurance
>   },
>   "village": {} // dropdownSelectObject; The user's current village and its possible values. WARNING - extremely long!!!
> }
> ```
> #### Throws
> [**token exceptions**](#token-system)

### Profile change data
> **Url:** `/user/profile/change-data` <br>
> **Method:** `PUT` <br>
> **Token:** Required <br>
> **Description:** Changes user personal data. (If you dont want to change some data, use the current values)
> #### Request
> **Type:** `application/json`
> ```json5
> {
>   "email": "vidle@seznam.cz", // string; required; The new email of the user
>   "phone": "708 659 781", // string; required; The new phone of the user
>   "insurance": 201, // number; required; The new insurance id of the user
>   "street": "Strizská", // string; required; New street of the user
>   "houseNumber": "145", // string; required; The new house number of the user
>   "village": 44364, // string; required; The new village of the user
>   "zip": "26500" // string; required; The new ZIP of the user
> }
> ```
> #### Response
> none
> #### Throws
> [**token exceptions**](#token-system) <br>
> `payloadException` When any of the required fields not provided <br>
> `dataException` When the format of any field is invalid
> * Field `errors` in the returned error object returns an object like this:
>   ```json5
>   {
>     "errors": {
>       "email": "Email není ve správném formátu", // format field: error message
>       "insurance": "'11154' nebyla nalezena v seznamu",
>       // ...
>     }
>   } 
>   ```

### Profile change password
> **Url:** `/user/profile/change-password` <br>
> **Method:** `PUT` <br>
> **Token:** Required <br>
> **Description:** Changes user password
> #### Request
> **Type:** `application/json`
> ```json5
> {
>   "oldPassword": "Hu65;*dwR", // string; required; User's old password
>   "newPassword": "Vidlak123" // string; required; User's new password
> }
> ```
> #### Response
> **Type:** `application/json`
> ```json5
> {
>   "password": "Vidlak123" // string; required; The user's new password (as a confirmation)
> }
> ```
> #### Throws
> [**token exceptions**](#token-system) <br>
> `payloadException` When oldPassword or newPassword not provided <br>
> `dataException`  When the format of any field is invalid
> * Field errors in the returned error object returns an object like this:
>   ```json5
>   {
>     "errors": {
>       "oldPassword": "Neplatné heslo.",
>       "newPassword": "Heslo musí být minimálně 8 znaků."
>     }
>   }
>   ```

### Profile image
> **Url:** `/user/profile/image` <br>
> **Token:** Required
> #### Get pending image
> > **Method:** `GET` <br>
> > **Description:** Gets the URL of the currently waiting image
> > ##### Request
> > none
> > ##### Response
> > **Type:** `application/json`
> > ```json5
> > {
> >   "image": "https://www.school.com/img/pending-vidle.jpg" // string; The link to the currently pending image
> > }
> > ```
> > ##### Throws
> > [**token exceptions**](#token-system) <br>
> > `stateException` When no image is currently pending
> 
> #### Post a new image
> > **Method:** `PUT` <br>
> > **Description:** Uploads a new profile image
> > ##### Request
> > **Type:** `multipart/form-data`
> > ```yml
> > image: ..... # buffer/file; The image that is being posted
> > ```
> > ##### Response
> > none
> > ##### Throws
> > [**token exceptions**](#token-system) <br>
> > `payloadException` When image too large <br>
> > `payloadException` When image not in JPEG format <br>
> > `payloadException` When you send more than one file <br>
> > `stateException` When the image is already pending
> 
> #### Cancel image request
> > **Method:** `DELETE` <br>
> > **Description:** Removes the pending image / cancels the request.
> > ##### Request
> > none
> > ##### Response
> > none
> > ##### Throws
> > [**token exceptions**](#token-system) <br>
> > `stateException` When no image is currently pending

### Record list
> **Url:** `/user/record-list` <br>
> **Method:** `GET` <br>
> **Token:** Required <br>
> **Description:** Returns a list of all user records (short or full info)
> #### Request
> **Type:** `query params`
> ```yaml
> expand: true # boolean; optional; default = false; If it should return parsed record description (slower) or only the description string
> index: 1 # number; optional; default = 0; From which index to start
> max: 20 # number; optional; default = Infinity; How many records should it return
> ```
> #### Response
> **Type:** `application/json` <br>
> **If** expand **is** *false*
> ```json5
> {
>   "records": [ // simpleRecordObject[]; Array of non-parsed records
>     {
>       "id": 9862, // number; The id of the record, can be used to fetch it
>       "good": true, // boolean; If the record is good or bad
>       "date": "28.4.2023", // string; The date of the record
>       "text": "Pochvala učitele - Jan Marek" // string; The non-parsed text of the record
>     } // ...
>   ]
> }
> ```
> **Else** `recordObject[]` called `records` - The list of selected records <br>
> [*recordObject*](#record)
> #### Throws
> [**token exceptions**](#token-system) <br>
> `payloadException` When expand is not a boolean <br>
> `payloadException` When index or max is not a number

### Record
> **Url:** `/user/record` <br>
> **Method:** `GET` <br>
> **Token:** Required <br>
> **Description:** Returns as much information about a specific record
> #### Request
> **Type:** `query params`
> ```yaml
> id: 2670 # number; required; The record id
> ```
> #### Response
> **Type:** `application/json`
> ```json5
> {
>   "type": "Důtka tř. učitele", // string; The type of the record
>   "date": "18.6.2023", // string; The date of the record
>   "reason": "Za vyrušování", // string; The reason for the record
>   "referenceNumber": "SPSE/00925/2023", // string; The reference number (blank for good: true)
>   "good": false // boolean; If the record is good or bad
> }
> ```
> #### Throws
> [**token exceptions**](#token-system) <br>
> `payloadException` When id not provided <br>
> `dataException` When record id does not exist

### Absence
> **Url:** `/user/absence` <br>
> **Method:** `GET` <br>
> **Token:** Required <br>
> **Description:** Returns a list of all user absences in a specified year
> #### Request
> **Type:** `query params`
> ```yaml
> year: 14 # number; optional; default = current; The year of the absences
> ```
> #### Response
> **Type:** `application/json`
> ```json5
> {
>   "absence": [ // absenceObject[]; The absences of the user
>     {
>       "date": "21.4.", // string; The date of the absence
>       "weekDay": "pátek", // string; The day of the week of the absence
>       "hours": 8 // number; How many hours was the student absent
>     } // ...
>   ],
>   "years": [ // yearObject[]; The years the user was absent
>     {
>       "name": "2022/23", // string; The name of the school year
>       "id": 14 // number; The id of the year, is used in year fields
>     } // ...
>   ]
> }
> ```
> #### Throws
> [**token exceptions**](#token-system) <br>
> `payloadException` When the year is not a number <br>
> `dataException` When the year does not exist

### Grades
> **Url:** `/user/grades` <br>
> **Method:** `GET` <br>
> **Token:** Required <br>
> **Description:** Returns all the user's grades in the specified year and half-term
> #### Request
> **Type:** `query params`
> ```yaml
> year: 14 # number; optional; default = current; The school year id of the grades
> halfTerm: 21 # number; optional; default = current; The school half-term id of the grades
> ```
> #### Response
> ```json5
> {
>   "subjects": [ // subjectObject[]; The list of all subjects
>     {
>       "short": "A", // string; The shortcut for the subject
>       "name": "Anglický jazyk", // string; The full name of the subject
>       "final": "4", // string; The final grade of the subject
>       "groups": [ // groupObject; The groups of grades
>         {
>           "name": "Teorie", // string; The name of the group or "Main" if there are no groups
>           "grades": [ // gradeObject[]; The grades for that group
>             {
>               "grade": "1", // string; The grade
>               "title": "letter", // string; The title for the grade
>               "teacherShort": "jm", // string; The short of the teacher that gave the grade
>               "teacherFull": "Jan Marek", // string; The name of the teacher that gave the grade
>               "small": false, // boolean; If the grade is small
>               "date": "25.06.2023" // string; The date of the grade
>             } // ...
>           ]
>         } // ...
>       ]
>     } // ...
>   ],
>   "behaviour": "1", // The grade of the student's behaviour
>   "years": [], // yearObject[]; The list of all possible years and their ids
>   "halfTerm": [] // yearObject[]; The list of all possible half-terms and their ids
> }
> ```
> [*yearObject*](#absence)
> #### Throws
> [**tokenExceptions**](#token-system) <br>
> `payloadException` When year or halfTerm is not a number <br>
> `dataException` When the year or halfTerms does not exist

### Passings
> **Url:** `/user/passings` <br>
> **Method:** `GET` <br>
> **Token:** Required <br>
> **Description:** Returns a list of all user's passings
> #### Request
> **Type:** `query params`
> ```yaml
> year: 14 # number; optional; default = current; The school year id of the passings
> month: 7 # number; optional; default = current; The month id of the passings
> ```
> #### Response
> **Type:** `application/json`
> ```json5
> {
>   "passings": [ // passingObject[]; The list of all the passings
>     {
>       "date": "1.8.", // string; The date of the passing
>       "weekDay": "pátek", // string; The week day of the passing
>       "arrived": "7:06", // string; The time the student arrived
>       "left": "15:36" // string; The time the student left
>     } // ...
>   ],
>   "years": [], // yearObject[]; The list of all possible years
>   "months": [] // yearObject[]; The list of all possible months
> }
> ```
> [*yearObject*](#absence)
> #### Throws
> [**token exceptions**](#token-system) <br>
> `payloadException` When year or month is not a number <br>
> `dataException` When the year or month doesn't exist

### Schedule
> **Url:** `/user/schedule` <br>
> **Method:** `GET` <br>
> **Token:** Required <br>
> **Description:** Returns the schedule for the specified year and period
> #### Request
> **Type:** `query params`
> ```yaml
> year: 14 # number; optional; default = current; The school year id of the shedule
> period: 157 # number; optional; default = current; The period id of the schedule
> ```
> #### Response
> **Type:** `application/json`
> ```json5
> {
>   "times": [ // timeObject[]; The list of all times for the lessons
>     {
>       "lesson": 1, // number; The number of the lesson the times are for
>       "start": "7:30", // string; The time when the lesson starts
>       "end": "8:15", // string; The time when the lesson ends
>     } // ...
>   ],
>   "days": [ // dayObject[]; The list of all the days
>     {
>       "dayShort": "Po", // string; The shortcut of the day
>       "lessons": 7, // number; The count of the lessons in the day
>       "subjects": [ // subject[][]; The list of lists of subjects (first list - one list = one lesson in one time, second list = the invidual lessons in one time (groups))
>         [ 
>           {
>             "type": "lesson", // string; The type of the subject ("lesson", "break", "meeting", "staff-meeting", "emergency")
>             // NOT FOR TYPE BREAK:
>             "length": 2, // number; how many lessons is the subject
>             // ONLY FOR LESSONS:
>             "short": "A", // string; The shortcut for the subject
>             "name": "Anglický jazyk", // string; The full name of the subject
>             "teacherShort": "Jm", // string; The shortcut of the teacher teaching this subject
>             "teacherFull": "Jan Marek", // string; The full name of the teacher
>             "classroom": "1", // string; The room short where the lesson is
>             "class": "A1b", // string; What class does have the lesson
>             "group": "1/2" // string; What group does have the lesson OR 0 if it's not a group lesson
>           } // ...
>         ] // ...
>       ]
>     } // ...
>   ],
>   "years": [], // yearObject[]; The list of all possible years
>   "periods": [] // yearObject[]; The list of all possible periods
> }
> ```
> [*yearObject*](#absence)
> #### Throws
> [**token exceptions**](#token-system) <br>
> `payloadException` When year or period is not a number <br>
> `dataException` When the year or the period does not exist