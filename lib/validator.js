const html2json = require("html2json").html2json;
const _ = require("lodash");
const css2json = require("css2json");
const jp = require("jsonpath");

const domValidation = (
  contentHTML,
  contentCSS,
  htmlExpectedStructure,
  cssExpectedStructure
) => {
  let isHtmlValid = true;
  let isHtmlWellFormed = true;
  let htmlInputStructure = "";
  let differencesHTML = [];

  let isCSSValid = true;
  let cssInputStructure = "";
  let differencesCSS = [];

  let grade = 0;
  if (contentHTML.toString() !== "") {
    try {
      htmlInputStructure = parseHTML2JSON(contentHTML);
      differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
      isHtmlValid = differencesHTML.length === 0 ? true : false;
    } catch (error) {
      differencesHTML = [
        {
          message: "error",
          value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
        },
      ];
      isHtmlValid = false;
      isHtmlWellFormed = false;
    }
  }

  if (contentCSS.toString() !== "") {
    cssInputStructure = parseCSS2JSON(contentCSS);
    isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
    if (true) {
      differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
    }
  }

  grade =
    !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
      ? 0
      : getGrade(htmlExpectedStructure, differencesHTML);

  let response = {
    isHtmlValid,
    isHtmlWellFormed,
    htmlInputStructure,
    htmlExpectedStructure,
    differencesHTML,
    isCSSValid,
    differencesCSS,
    grade,
  };

  return response;
};

function getGrade(input, differences) {
  let tags = jp.query(input, "$.children..tag").length;
  let diffs = differences.length;
  let grade = ((tags - diffs) / tags) * 5;
  return grade.toFixed(2);
}

function compareJson(obj1, obj2) {
  let differences = [];
  compareTags("$.children[*].tag", "");
  compareAttribs();
  return differences;

  function compareTags(str, path) {
    let jp1 = jp.query(obj1, str);
    let jp2 = jp.query(obj2, str);

    valid = jp2.some((r) => {
      if (!jp1.includes(r)) {
        differences.push({
          message: "La respuesta no contiene el elemento",
          value: `${path}/${r}`,
          type: "tag",
        });
      }
    });

    jp2.forEach((element) => {
      let s = `?(@.tag=="${element}")]`;
      let newStr = str.replace("*].tag", s) + ".children[*].tag";
      let newPath = path + "/" + element;
      compareTags(newStr, newPath);
    });
  }

  function compareAttribs() {
    let jp1 = jp.nodes(obj1, "$.children..attr");
    let jp2 = jp.nodes(obj2, "$.children..attr");

    let array = jp2.filter(
      (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
    );
    array.forEach((element) => {
      differences.push({
        message: "La respuesta no contiene el elemento",
        value: `${JSON.stringify(element.value)}`,
        type: "attr",
      });
    });
  }
}

const parseCSS2JSON = (data) => {
  return parseStyle(data.toString());
};

function parseStyle(json) {
  return css2json(json);
}

const parseHTML2JSON = (data) => {
  var searchMask = "<!doctype html>";
  var regEx = new RegExp(searchMask, "ig");
  var replaceMask = "";
  try {
    return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
  } catch (error) {
    throw error;
  }
};

const parseHTML = (json) => {
  let responseObject = {};
  if (json.node === "root") {
    responseObject.node = "root";
  }
  if (json.tag) {
    responseObject.tag = json.tag;
  }
  if (json.attr) {
    responseObject.attr = json.attr;
  }

  if (json.child) {
    let tmpArray = [];
    for (let i = 0; i < json.child.length; i++) {
      let response = parseHTML(json.child[i]);
      if (_.has(response, "tag")) {
        tmpArray.push(response);
      }
    }
    if (tmpArray.length !== 0) {
      responseObject.children = tmpArray;
    }
  }
  return responseObject;
};

function compareJSON4CSS(obj1, obj2) {
  let result = [];

  if (obj1 && obj2) {
    for (let i in obj2) {
      if (
        !obj1.hasOwnProperty(i) ||
        !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
      ) {
        result.push(`Error en el selector ${i}`);
      }
    }
  }
  return _.flattenDeep(result);
}

exports.domValidation = domValidation;
exports.parseHTML2JSON = parseHTML2JSON;
exports.parseCSS2JSON = parseCSS2JSON;

// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
// const html2json = require("html2json").html2json;
// const _ = require("lodash");
// const css2json = require("css2json");
// const jp = require("jsonpath");

// const domValidation = (
//   contentHTML,
//   contentCSS,
//   htmlExpectedStructure,
//   cssExpectedStructure
// ) => {
//   let isHtmlValid = true;
//   let isHtmlWellFormed = true;
//   let htmlInputStructure = "";
//   let differencesHTML = [];

//   let isCSSValid = true;
//   let cssInputStructure = "";
//   let differencesCSS = [];

//   let grade = 0;
//   if (contentHTML.toString() !== "") {
//     try {
//       htmlInputStructure = parseHTML2JSON(contentHTML);
//       differencesHTML = compareJson(htmlInputStructure, htmlExpectedStructure);
//       isHtmlValid = differencesHTML.length === 0 ? true : false;
//     } catch (error) {
//       differencesHTML = [
//         {
//           message: "error",
//           value: `<xmp>${JSON.stringify(error.split("\n")[0])}</xmp>`,
//         },
//       ];
//       isHtmlValid = false;
//       isHtmlWellFormed = false;
//     }
//   }

//   if (contentCSS.toString() !== "") {
//     cssInputStructure = parseCSS2JSON(contentCSS);
//     isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
//     if (true) {
//       differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
//     }
//   }

//   grade =
//     !isHtmlWellFormed || getGrade(htmlExpectedStructure, differencesHTML) < 0
//       ? 0
//       : getGrade(htmlExpectedStructure, differencesHTML);

//   let response = {
//     isHtmlValid,
//     isHtmlWellFormed,
//     htmlInputStructure,
//     htmlExpectedStructure,
//     differencesHTML,
//     isCSSValid,
//     differencesCSS,
//     grade,
//   };

//   return response;
// };

// function getGrade(input, differences) {
//   let tags = jp.query(input, "$.children..tag").length;
//   let diffs = differences.length;
//   let grade = ((tags - diffs) / tags) * 5;
//   return grade.toFixed(2);
// }

// function compareJson(obj1, obj2) {
//   let differences = [];
//   compareTags("$.children[*].tag", "");
//   compareAttribs();
//   return differences;

//   function compareTags(str, path) {
//     let jp1 = jp.query(obj1, str);
//     let jp2 = jp.query(obj2, str);

//     valid = jp2.some((r) => {
//       if (!jp1.includes(r)) {
//         differences.push({
//           message: "La respuesta no contiene el elemento",
//           value: `${path}/${r}`,
//           type: "tag",
//         });
//       }
//     });

//     jp2.forEach((element) => {
//       let s = `?(@.tag=="${element}")]`;
//       let newStr = str.replace("*].tag", s) + ".children[*].tag";
//       let newPath = path + "/" + element;
//       compareTags(newStr, newPath);
//     });
//   }

//   function compareAttribs() {
//     let jp1 = jp.nodes(obj1, "$.children..attr");
//     let jp2 = jp.nodes(obj2, "$.children..attr");

//     let array = jp2.filter(
//       (entry1) => !jp1.some((entry2) => _.isEqual(entry1.value, entry2.value))
//     );
//     array.forEach((element) => {
//       differences.push({
//         message: "La respuesta no contiene el elemento",
//         value: `${JSON.stringify(element.value)}`,
//         type: "attr",
//       });
//     });
//   }
// }

// const parseCSS2JSON = (data) => {
//   return parseStyle(data.toString());
// };

// function parseStyle(json) {
//   return css2json(json);
// }

// const parseHTML2JSON = (data) => {
//   var searchMask = "<!doctype html>";
//   var regEx = new RegExp(searchMask, "ig");
//   var replaceMask = "";
//   try {
//     return parseHTML(html2json(data.toString().replace(regEx, replaceMask)));
//   } catch (error) {
//     throw error;
//   }
// };

// const parseHTML = (json) => {
//   let responseObject = {};
//   if (json.node === "root") {
//     responseObject.node = "root";
//   }
//   if (json.tag) {
//     responseObject.tag = json.tag;
//   }
//   if (json.attr) {
//     responseObject.attr = json.attr;
//   }

//   if (json.child) {
//     let tmpArray = [];
//     for (let i = 0; i < json.child.length; i++) {
//       let response = parseHTML(json.child[i]);
//       if (_.has(response, "tag")) {
//         tmpArray.push(response);
//       }
//     }
//     if (tmpArray.length !== 0) {
//       responseObject.children = tmpArray;
//     }
//   }
//   return responseObject;
// };

// function compareJSON4CSS(obj1, obj2) {
//   let result = [];

//   if (obj1 && obj2) {
//     for (let i in obj2) {
//       if (
//         !obj1.hasOwnProperty(i) ||
//         !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))
//       ) {
//         result.push(`Error en el selector ${i}`);
//       }
//     }
//   }
//   return _.flattenDeep(result);
// }

// exports.domValidation = domValidation;
// exports.parseHTML2JSON = parseHTML2JSON;
// exports.parseCSS2JSON = parseCSS2JSON;
