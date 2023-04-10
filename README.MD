# Jecna API
Documentation: [DOCS.MD](DOCS.MD)

## Temporary instructions
To run this, you have to go to your `node_modules` and in `autorestapi/index.js` change line 15 to:
```js
const fileName = file.replace(".js", "").replace(".", "/");
```
and add
```js
if (fileName.includes("$")) return;
```
after line 15.