# Jecna API
Documentation: [Here](DOCS.MD)

## Quick start
**Host: [https://www.jecnaapi.com/](https://www.jecnaapi.com/?githubRedir=true)** <br>
Firstly you have to log in to the server using the endpoint [`/user/login`](DOCS.MD#login): *(This is in javascript, but feel free to use any other language)*
```js
let response = await client({
    url: "/user/login",
    method: "POST",
    data: {
        username: "Your username on the website",
        password: "Your password on the website"
    }
});
```
You will receive back a json with `token` field, which is used to access other endpoints. More about that [in the documentation](DOCS.MD#token-system)

## Local installation instructions
If you want to run your own copy of the server, just execute these commands:
* `git clone git@github.com:HonzaKubita/jecnaAPI.git`
* `cd jecnaAPI`
* `echo PORT=YourPort > .env`
* `npm install`
* `node main.js`

For older versions:
* `git clone --branch version git@github.com:HonzaKubita/jecnaAPI.git` <br>
Example: `git clone --branch v1.0.0-beta git@github.com:HonzaKubita/jecnaAPI.git`