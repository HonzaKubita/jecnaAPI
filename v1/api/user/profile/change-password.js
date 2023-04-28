const {tokenValid, payloadIsJSON} = require("../../../modules/checker");
const {getSafeStringField, documentOf, getToken} = require("../../../modules/utils");
const {jecnaAuthRequest, jecnaDataPost} = require("../../../modules/http");
const {DataException} = require("../../../exceptions/client/dataException");
module.exports = {
    put: async (req, res, next) => {
        payloadIsJSON(req.headers);

        const token = getToken(req, true);
        const oldPassword = getSafeStringField(req.body.oldPassword, "oldPassword");
        const newPassword = getSafeStringField(req.body.newPassword, "newPassword");

        const passwordBaseRes = await jecnaAuthRequest("/user/change-password", token);
        tokenValid(passwordBaseRes.data);

        const formForm = documentOf(passwordBaseRes.data).getElementById("passwordForm");
        const token1 = formForm.children[0].value;
        const token2 = formForm.children[1].value;

        const passwordUploadRes = await jecnaDataPost("/user/change-password", token, {
            token1: token1,
            token2: token2,
            oldpass: oldPassword,
            pass: newPassword,
            passre: newPassword
        });

        // resolve errors
        // const errorUls = documentOf(passwordUploadRes.data).getElementsByClassName("errors");
        // if (errorUls.length > 0) {
        //     const errorMessages = [];
        //     for (const errorUl of errorUls) {
        //         for (const errorLi of errorUl.children) {
        //             errorMessages.push(errorLi.innerHTML);
        //         }
        //     }
        //     const err = new PayloadException("Some of the fields have wrong value!");
        //     err.errors = errorMessages;
        //     throw err;
        // }
        const inputsTbody = documentOf(passwordUploadRes.data)
            .getElementsByClassName("form")[0]
            .getElementsByTagName("tbody")[0];
        const errors = {};
        for (const fieldTr of inputsTbody.children) {
            const fieldInput = fieldTr.getElementsByTagName("input")?.[0] ?? fieldTr.getElementsByTagName("select")?.[0];
            const fieldErrorUl = fieldTr.getElementsByClassName("errors")?.[0];
            if ((fieldInput.getAttribute("disabled") ?? "0") === "1" || fieldErrorUl === undefined) continue;

            errors[jecnaIdToId(fieldInput.id)] = fieldErrorUl.children[0].innerHTML;
        }
        if (Object.keys(errors).length > 0) {
            const ex = new DataException("Some of the fields have a wrong value!");
            ex.errors = errors;
            throw ex;
        }

        res.status(201).send({
            password: newPassword
        });
        next();
    }
};

function jecnaIdToId(id) {
    switch (id) {
        case "oldpass":
            return "oldPassword";
        case "pass":
            return "newPassword";
        default:
            return id;
    }
}