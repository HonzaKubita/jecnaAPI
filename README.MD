# Jecna API
Documentation: [DOCS.MD](DOCS.MD)

## Install instructions
* `git clone git@github.com:RORAKUS/jecnapi.git`
* `cd jecnapi`
* `npm install`
* go to your `node_modules` and in `autorestapi/index.js` change line 15 to: `const fileName = file.replace(".js", "").replace(".", "/");`
* also add `if (fileName.includes("$")) return;` after line 15.
* `node main.js`