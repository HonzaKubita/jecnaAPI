const FormData = require("form-data");
const {payloadIsJSON, payloadIsType, tokenValid} = require("../../../modules/checker");
const {getSafeField, documentOf, getToken} = require("../../../modules/utils");
const {jecnaAuthRequest, jecnaDataPost} = require("../../../modules/http");
const {DataException} = require("../../../exceptions/client/dataException");
const {StateException} = require("../../../exceptions/client/stateException");
const {constants} = require("../../../modules/constants");
const {imageUpload} = require("../../../middleware/imageUpload");
module.exports = {
    get: async (req, res, next) => {


        const token = getToken(req);

        const imagePendingRes = await jecnaAuthRequest("/user-student/upload-photo", token);
        tokenValid(imagePendingRes.data);

        const photoLink = documentOf(imagePendingRes.data)
            .getElementsByClassName("confirmPhoto")?.[0]
            ?.getElementsByTagName("img")?.[0]
            ?.src;
        if (photoLink === undefined) throw new StateException("There is no image currently pending!");

        res.status(200).json({
            image: constants.jecna.baseURL + photoLink
        });
        next();
    },
    put: async (req, res, next) => {
        payloadIsType(req.headers, "multipart/form-data");

        const token = getToken(req);
        const file = getSafeField(req.file, "image");

        const imageBaseRes = await jecnaAuthRequest("/user-student/upload-photo", token);
        tokenValid(imageBaseRes.data);

        const formDiv = documentOf(imageBaseRes.data).getElementsByClassName("form")?.[0]?.children?.[0];

        const token1 = formDiv?.children?.[0]?.value;
        const token2 = formDiv?.children?.[1]?.value;

        if (token1 === undefined) throw new StateException("The image is already uploaded!");

        const reqData = new FormData();
        reqData.append("token1", token1);
        reqData.append("token2", token2);
        reqData.append("file", file.buffer, "image.png");

        const uploadRes = await jecnaDataPost("/user-student/upload-photo", token, reqData, "multipart/form-data");
        const errorDiv = documentOf(uploadRes.data).getElementsByClassName("message-error")?.[0];
        if (errorDiv !== undefined) throw new DataException(errorDiv.innerHTML);

        res.status(201).send(); // 201 = created
        next();
    },
    delete: async (req, res, next) => {
        payloadIsJSON(req.headers);

        const token = getToken(req);

        const imageBaseRes = await jecnaAuthRequest("/user-student/upload-photo", token);
        tokenValid(imageBaseRes.data);

        const rejectLink = documentOf(imageBaseRes.data)
            .getElementsByClassName("confirmPhotoRules")?.[0]
            ?.getElementsByClassName("link-button")?.[0]
            ?.href;
        if (rejectLink === undefined) throw new StateException("There is no image currently pending!");

        await jecnaAuthRequest(rejectLink, token);
        res.status(200).send();
        next();
    },
    middleware: {
        put: [ imageUpload.single("image") ]
    }
}