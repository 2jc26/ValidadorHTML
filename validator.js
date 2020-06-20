const html2json = require("html2json").html2json;
const _ = require("lodash");
const css2json = require("css2json");
const jp = require("jsonpath");
const { response } = require("express");

let resp;

const domValidation = (contentHTML, contentCSS, htmlExpectedStructure, cssExpectedStructure) => {
  let isHtmlValid = true;
  let htmlnputStructure;
  let differencesHTML = [];

  let isCSSValid = true;
  let cssInputStructure = "";
  let differencesCSS = [];

  htmlnputStructure = parseHTML2JSON(contentHTML);
  isHtmlValid = _.isEqual(htmlnputStructure, htmlExpectedStructure);
  resp = [];
  if (!isHtmlValid) {
    compareJson(htmlnputStructure, htmlExpectedStructure, differencesHTML);
  }
  createResponse();
  //return resp;
  //return differencesHTML;
  /*
  if (contentCSS.toString() !== "") {
    cssInputStructure = parseCSS2JSON(contentCSS);
    isCSSValid = _.isEqual(cssInputStructure, cssExpectedStructure);
    differencesCSS = compareJSON4CSS(cssInputStructure, cssExpectedStructure);
  }

  let differencesHTML = compareJSON4HTML(
    htmlInputStructure.children[0],
    htmlExpectedStructure.children[0]
  );

  let response = {
    isHtmlValid,
    htmlInputStructure,
    htmlExpectedStructure,
    differencesHTML,
    isCSSValid,
    differencesCSS,
  };

  return response;
  */
};

function compareJson(obj1, obj2, differences) {
  compare("$.children[*].tag", "", differences);

  function compare(str, path, differences) {
    resp.push(path);
    let jp1 = jp.query(obj1, str);
    let jp2 = jp.query(obj2, str);

    valid = jp2.some((r) => {
      if (!jp1.includes(r)) {
        differences.push(`La respuesta no contiene el elemento ${path}/${r}`);
      }
    });

    for (let i = 0; i < jp2.length; i++) {
      let s = `?(@.tag=="${jp2[i]}")]`;
      let newStr = str.replace("*].tag", s) + ".children[*].tag";
      let newPath = path + "/" + jp2[i];
      compare(newStr, newPath, differences);
    }
  }
}

function createResponse() {
  let treePath = {};
  console.log("Respo: ", resp);
  resp.forEach((element) => {
    if (element !== "") {
      let nodes = element.split("/");
      nodes = nodes.filter((e) => e !== "");
      console.log("Resultado iteración: ", insertNode(nodes, treePath));
    }
  });

  //console.log("Response---->>>");
  //console.log(JSON.stringify(treePath, null, 4));
}

function insertNode(nodes, tree) {
  let base = { tag: nodes[0] };
  let raiz = base;
  for (let i = 1; i < nodes.length; i++) {
    let newNode = { tag: nodes[i] };
    if (!raiz.children) {
      raiz.children = [];
      raiz.children.push(newNode);
    }
    raiz = newNode;
  }
  return base;
}

const parseCSS2JSON = (data) => {
  return parseStyle(data.toString());
};

function parseStyle(json) {
  return css2json(json);
}

const parseHTML2JSON = (data) => {
  return parseHTML(html2json(data.toString()));
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

function compareJSON4HTML(obj1, obj2) {
  let result = [];
  let tags = compareTagName(obj1, obj2);
  let children = compareChildrenNumber(obj1, obj2);
  let attribs = compareAttribs(obj1, obj2);
  if (tags) result.push(tags);
  if (children) result.push(children);
  if (attribs) result.push(attribs);

  if (obj1.children && obj2.children) {
    for (let i = 0; i < obj1.children.length; i++) {
      let r = compareJSON4HTML(obj1.children[i], obj2.children[i]);
      result.push(r);
    }
  }
  return _.flattenDeep(result);
}

function compareJSON4CSS(obj1, obj2) {
  let result = [];

  if (obj1 && obj2) {
    for (let i in obj2) {
      if (!obj1.hasOwnProperty(i) || !_.isEqual(_.sortBy(obj2[i]), _.sortBy(obj1[i]))) {
        result.push(`Error en el selector ${i}`);
      }
    }
  }
  return _.flattenDeep(result);
}

function compareChildrenNumber(obj1, obj2) {
  if (obj1 && obj2 && obj1.children && obj2.children) {
    if (obj1.children.length !== obj2.children.length) {
      return `Se esperaba el elemento con el tag ${obj1.tag} tuviese ${obj2.children.length} hijos pero tiene ${obj1.children.length}`;
    }
  }
}
function compareTagName(obj1, obj2) {
  if (obj1 && obj2 && obj1.tag && obj2.tag) {
    if (obj1.tag !== obj2.tag) {
      return `Se esperaba el tag ${obj2.tag} pero se obtuvo ${obj1.tag}`;
    }
  }
}

function compareAttribs(obj1, obj2) {
  let cause = "";
  if (obj1 && obj2 && obj1.attr) {
    for (let i in obj2.attr) {
      if (!obj1.attr.hasOwnProperty(i) || !_.isEqual(_.sortBy(obj2.attr[i]), _.sortBy(obj1.attr[i]))) {
        cause += `Error en el atributo ${i}: ${obj2.attr[i]} del tag ${obj2.tag}`;
      }
    }
  }
  return cause;
}

exports.domValidation = domValidation;
exports.parseHTML2JSON = parseHTML2JSON;
exports.parseCSS2JSON = parseCSS2JSON;
