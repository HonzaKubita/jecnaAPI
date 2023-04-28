const {tokenValid, payloadIsJSON} = require("../../../modules/checker");
const {getSafeStringField, getSafeNumberField, documentOf, getToken} = require("../../../modules/utils");
const {jecnaAuthRequest, jecnaDataPost} = require("../../../modules/http");
const {DataException} = require("../../../exceptions/client/dataException");
module.exports = {
    put: async (req, res, next) => {
        payloadIsJSON(req.headers);

        const token = getToken(req, true);
        const email = getSafeStringField(req.body.email, "email");
        const phone = getSafeStringField(req.body.phone, "phone");
        const insurance = getSafeNumberField(req.body.insurance, "insurance");
        const street = getSafeStringField(req.body.street, "street");
        const houseNumber = getSafeStringField(req.body.houseNumber, "houseNumber");
        const village = getSafeNumberField(req.body.village, "village");
        const zip = getSafeStringField(req.body.zip, "zip");

        const dataBaseRes = await jecnaAuthRequest("/user-student/self-update", token);
        tokenValid(dataBaseRes.data);

        const formForm = documentOf(dataBaseRes.data).getElementsByClassName("form")[0].children[0]; // formDiv.children[0]
        const token1 = formForm.children[0].value;
        const token2 = formForm.children[1].value;

        const dataUploadRes = await jecnaDataPost("/user-student/self-update", token, {
            token1: token1,
            token2: token2,
            email: email,
            phone: phone,
            healthInsuranceId: insurance,
            street: street,
            streetNumber: houseNumber,
            czMsmtRaujId: village,
            zip: zip
        });

        // resolve errors
        const inputsTbody = documentOf(dataUploadRes.data)
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

        res.status(201).send();
        next();
    }
};


function jecnaIdToId(id) {
    switch (id) {
        case "healthInsuranceId":
            return "insurance";
        case "streetNumber":
            return "houseNumber";
        case "czMsmtRaujId":
            return "village";
        default:
            return id;
    }
}