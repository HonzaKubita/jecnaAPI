const { JSDOM } = require("jsdom");
const { BASE_URL } = require("../modules/http");
const parseSchedule = require("./schedule");

// Parser for teacher profile
module.exports = (htmlBody) => {
  // get the main DOM
  const teacherDOM = new JSDOM(htmlBody).window.document;
  // create a teacher json object with default values
  let teacherJSON = {
    name: "",
    username: "",
    email: "",
    private_email: "",
    phones: {
      mobile: "",
      link: "",
      private: ""
    },
    cabinet: "",
    class_teacher: "",
    consultations: "",
    image: "",
    schedule: {},
    certificates: []
  };

    // parse the profile image:
    const profileImageDivChild = teacherDOM.getElementsByClassName("profilephoto")[0].children[0].children[0]; // get profile photo div
    if (profileImageDivChild.tagName !== "img") teacherJSON.image = ""; // if it's not image set image to none
    else teacherJSON.image = `${BASE_URL}${profileImageDivChild.getAttribute("src")}`; // set image

    // parse profile
    const userProfileTbody = teacherDOM.getElementsByClassName("userprofile")[0].children[0]; // get <tbody> element with user profile
    for (const statRow of userProfileTbody.children) { // for every row in table
      const statName = statRow.children[0].children[0].innerHTML; // set name of then statistic
      const statValueWr = statRow.children[1].children[0]; // set raw value of the statistic
      const statValue = statValueWr.innerHTML; // get data of the statistic

      switch (statName) { // for every possible name set the value
        case "Jméno":
          teacherJSON.name = statValue;
          break;
        case "Uživatelské jméno":
          teacherJSON.username = statValue;
          break;
        case "E-mail":
          teacherJSON.email = statValueWr.children[1].innerHTML;
          break;
        case "Soukromý e-mail":
          teacherJSON.private_email = statValueWr.children[1].innerHTML;
          break;
        case "Telefon":
          const mobile = statValue.split(" a linka ")[0]; // split mobile and link
          const link = statValue.split(" a linka ")[1].replace("<strong>", "").replace("</strong>", "").trim();
          teacherJSON.phones = {
            mobile: mobile.replaceAll(" ", ""),
            link: link
          };
          break;
        case "Soukromý telefon":
          teacherJSON.phones.private = statValue;
          break;
        case "Kabinet":
          teacherJSON.cabinet = statValueWr.children[0].innerHTML;
          break;
        case "Třídní učitel":
          teacherJSON.class_teacher = statValue;
          break;
        case "Konzultační hodiny":
          teacherJSON.consultations = statValue;
          break;
        default:
          ;
      }
    }
    // parse schedule
    teacherJSON.schedule = parseSchedule(htmlBody);
    // parse certificates
    const certificationsUls = teacherDOM.getElementsByClassName("certifications"); // get all certifications elements
    if (certificationsUls.length === 0) return teacherJSON; // if there are none just return
    const certificationsUl = certificationsUls[0]; // set it to the only one and first
    for (const certificationLi of certificationsUl.children) { // for every <li> of the <ul> of certificates
      const date = certificationLi.children[0].innerHTML; // set the date
      const label = certificationLi.children[1].children[0].innerHTML; // the label
      const institution = certificationLi.children[1].children[1].innerHTML; // and the institution

      teacherJSON.certificates.push({ // and push it all into the array
        date: date,
        label: label,
        institution: institution
      });
    }

    return teacherJSON; // finally return 
}