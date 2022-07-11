const url = new URL(window.location.href);
const type = url.searchParams.get("type");
const exercise = url.searchParams.get("exercise");
const key = url.searchParams.get("key");

document.getElementById("formType2").hidden = type === "1" ? true : false;

document.getElementById("fileForm").onchange = (event) => {
  event.preventDefault();
  if (document.getElementById("fileHTML").files.length > 0) {
    if (
      type === "1" ||
      (type === "2" && document.getElementById("fileCSS").files.length > 0)
    ) {
      document.getElementById("submit").disabled = false;
    }
  }
};

document.getElementById("fileForm").onsubmit = (event) => {
  event.preventDefault();
  document.getElementById("form-container").hidden = true;
  const selectedHTMLFile = document.getElementById("fileHTML").files[0];
  const selectedCSSFile = document.getElementById("fileCSS").files[0];
  processFiles(selectedHTMLFile, selectedCSSFile);
};

function processFiles(selectedHTMLFile, selectedCSSFile) {
  returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
    let htmlContent = btoa(dataHTML);
    let cssContent = btoa(dataCSS);
    d3.json(`./validResponses/${exercise}.json`, (error, data) => {
      const payload = {
        htmlContent,
        htmlStructure: data.htmlStructure,
        cssContent,
        cssStructure: data.cssStructure,
        key,
      };
      fetch("http://localhost:8000", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch((error) => {
          
          document.getElementById("general-errors").hidden = false;
          document.getElementById("general-errors").innerHTML = `
            <p>
              Ocurrió un error durante la validación: ${error}
            </p>
            <p>
              Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
              para que le indique los pasos a seguir. 
            </p>`;
        })
        .then((res) => {
          renderResponse(
            res.isHtmlValid,
            res.isHtmlWellFormed,
            res.differencesHTML,
            res.isCSSValid,
            res.differencesCSS,
            res.grade
          );
          if (res.isHtmlWellFormed) {
            drawTree(res.htmlInputStructure, "#source");
            drawTree(res.htmlExpectedStructure, "#target");
          }
        });
    });
  });
}

function returnFileContent(htmlFile, cssFile, callback) {
  if (htmlFile) {
    returnFile(htmlFile, (dataHTML) => {
      if (cssFile) {
        returnFile(cssFile, (dataCSS) => {
          callback(dataHTML, dataCSS);
        });
      } else {
        callback(dataHTML, "");
      }
    });
  } else {
    callback("", "");
  }
}

function returnFile(file, callback) {
  var reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  reader.onload = function (evt) {
    callback(evt.target.result);
  };
  reader.onerror = function (evt) {
    console.log("Error when reading file");
  };
}

function renderResponse(
  isHtmlValid,
  isHtmlWellFormed,
  differencesHTML,
  isCSSValid,
  differencesCSS,
  grade
) {
  document.getElementById("validation-html").hidden = false;

  if (type === "2") {
    document.getElementById("validation-css").hidden = false;
  }

  if (isHtmlValid) {
    document.getElementById(
      "structureResult-html"
    ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
    document.getElementById("structureResult-html").className = "text-success";
  } else {
    document.getElementById("details-html").hidden = false;
    document.getElementById("errors-html").hidden = false;

    if (!isHtmlWellFormed) {
      document.getElementById("well-formed").hidden = true;
      document.getElementById("errors-html-list").innerHTML =
        "<p>El archivo proporcionado no es un documento HTML válido.</p>";
      document.getElementById("errors-html-list").innerHTML += differencesHTML
        .map((e) => `<li>${e.value} </li>`)
        .join("");
    } else {
      document.getElementById(
        "structureResult-html"
      ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
      document.getElementById("structureResult-html").className = "text-danger";

      document.getElementById("errors-html-list").innerHTML = differencesHTML
        .map((e) => `<li>${e.message} ${e.value} </li>`)
        .join("");
    }
  }

  if (isCSSValid) {
    document.getElementById("structureResult-css").innerHTML =
      "La estructura del archivo css proporcionado es válida";
    document.getElementById("structureResult-css").className = "text-success";
  } else {
    document.getElementById("errors-css").hidden = false;
    document.getElementById("structureResult-css").innerHTML =
      "La estructura del archivo css proporcionado no es válida";
    document.getElementById("structureResult-css").className = "text-danger";

    document.getElementById("errors-css-list").innerHTML = differencesCSS
      .map((e) => `<li>${e}</li>`)
      .join("");
  }
}



// const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }const url = new URL(window.location.href);
// const type = url.searchParams.get("type");
// const exercise = url.searchParams.get("exercise");
// const key = url.searchParams.get("key");

// document.getElementById("formType2").hidden = type === "1" ? true : false;

// document.getElementById("fileForm").onchange = (event) => {
//   event.preventDefault();
//   if (document.getElementById("fileHTML").files.length > 0) {
//     if (
//       type === "1" ||
//       (type === "2" && document.getElementById("fileCSS").files.length > 0)
//     ) {
//       document.getElementById("submit").disabled = false;
//     }
//   }
// };

// document.getElementById("fileForm").onsubmit = (event) => {
//   event.preventDefault();
//   document.getElementById("form-container").hidden = true;
//   const selectedHTMLFile = document.getElementById("fileHTML").files[0];
//   const selectedCSSFile = document.getElementById("fileCSS").files[0];
//   processFiles(selectedHTMLFile, selectedCSSFile);
// };

// function processFiles(selectedHTMLFile, selectedCSSFile) {
//   returnFileContent(selectedHTMLFile, selectedCSSFile, (dataHTML, dataCSS) => {
//     let htmlContent = btoa(dataHTML);
//     let cssContent = btoa(dataCSS);
//     d3.json(`./validResponses/${exercise}.json`, (error, data) => {
//       const payload = {
//         htmlContent,
//         htmlStructure: data.htmlStructure,
//         cssContent,
//         cssStructure: data.cssStructure,
//         key,
//       };
//       fetch("http://localhost:8000", {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//         .then((res) => res.json())
//         .catch((error) => {
          
//           document.getElementById("general-errors").hidden = false;
//           document.getElementById("general-errors").innerHTML = `
//             <p>
//               Ocurrió un error durante la validación: ${error}
//             </p>
//             <p>
//               Por favor póngase envie un correo a misovirtual-isw@uniandes.edu.co, 
//               para que le indique los pasos a seguir. 
//             </p>`;
//         })
//         .then((res) => {
//           renderResponse(
//             res.isHtmlValid,
//             res.isHtmlWellFormed,
//             res.differencesHTML,
//             res.isCSSValid,
//             res.differencesCSS,
//             res.grade
//           );
//           if (res.isHtmlWellFormed) {
//             drawTree(res.htmlInputStructure, "#source");
//             drawTree(res.htmlExpectedStructure, "#target");
//           }
//         });
//     });
//   });
// }

// function returnFileContent(htmlFile, cssFile, callback) {
//   if (htmlFile) {
//     returnFile(htmlFile, (dataHTML) => {
//       if (cssFile) {
//         returnFile(cssFile, (dataCSS) => {
//           callback(dataHTML, dataCSS);
//         });
//       } else {
//         callback(dataHTML, "");
//       }
//     });
//   } else {
//     callback("", "");
//   }
// }

// function returnFile(file, callback) {
//   var reader = new FileReader();
//   reader.readAsText(file, "UTF-8");
//   reader.onload = function (evt) {
//     callback(evt.target.result);
//   };
//   reader.onerror = function (evt) {
//     console.log("Error when reading file");
//   };
// }

// function renderResponse(
//   isHtmlValid,
//   isHtmlWellFormed,
//   differencesHTML,
//   isCSSValid,
//   differencesCSS,
//   grade
// ) {
//   document.getElementById("validation-html").hidden = false;

//   if (type === "2") {
//     document.getElementById("validation-css").hidden = false;
//   }

//   if (isHtmlValid) {
//     document.getElementById(
//       "structureResult-html"
//     ).innerHTML = `<p>La estructura del archivo html proporcionado es válida.</p><p>Nota: ${grade}</p>`;
//     document.getElementById("structureResult-html").className = "text-success";
//   } else {
//     document.getElementById("details-html").hidden = false;
//     document.getElementById("errors-html").hidden = false;

//     if (!isHtmlWellFormed) {
//       document.getElementById("well-formed").hidden = true;
//       document.getElementById("errors-html-list").innerHTML =
//         "<p>El archivo proporcionado no es un documento HTML válido.</p>";
//       document.getElementById("errors-html-list").innerHTML += differencesHTML
//         .map((e) => `<li>${e.value} </li>`)
//         .join("");
//     } else {
//       document.getElementById(
//         "structureResult-html"
//       ).innerHTML = `<p>La estructura del archivo html proporcionado no es válida</p><p>Nota: ${grade}</p>`;
//       document.getElementById("structureResult-html").className = "text-danger";

//       document.getElementById("errors-html-list").innerHTML = differencesHTML
//         .map((e) => `<li>${e.message} ${e.value} </li>`)
//         .join("");
//     }
//   }

//   if (isCSSValid) {
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado es válida";
//     document.getElementById("structureResult-css").className = "text-success";
//   } else {
//     document.getElementById("errors-css").hidden = false;
//     document.getElementById("structureResult-css").innerHTML =
//       "La estructura del archivo css proporcionado no es válida";
//     document.getElementById("structureResult-css").className = "text-danger";

//     document.getElementById("errors-css-list").innerHTML = differencesCSS
//       .map((e) => `<li>${e}</li>`)
//       .join("");
//   }
// }