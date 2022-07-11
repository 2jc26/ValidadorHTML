var express = require("express");
var router = express.Router();

const {
  domValidation,
  parseHTML2JSON,
  parseCSS2JSON,
} = require("../lib/validator");

const lti = require("../lib/lti");

function validate(req) {
  const {
    body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
  } = req;

  let htmlBuffer = Buffer.from(htmlContent, "base64");
  let cssBuffer = Buffer.from(cssContent, "base64");

  return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
}

router.post("/test", (req, res) => {
  res.json(validate(req));
});

router.post("/", (req, res) => {
  
  const result = validate(req);
  
  res.cookie("AccessToken", "***Auth token value***", {
    httpOnly: true,
    expires: 0,
  });

  key = req.body['key']
  if (req.cookies["AccessToken"] == "***Auth token value***") {

    if (key) {
      
      let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
      const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
        keyBuffer
      );
      
      console.log("Validating");
      lti
        .sendResultToCoursera(
          lis_outcome_service_url,
          lis_result_sourcedid,
          parseFloat(result.grade) / 5.0
        )
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(result.grade / 5.0);
          console.log("Error when sending results to Coursera: ", error);
        });
    }
    res.json(result);
  } else {
    
    res.status(401).send();
  }
});

router.post("/parseHTML2JSON", (req, res) => {
  const {
    body: { htmlContent },
  } = req;
  const htmlBuffer = Buffer.from(htmlContent, "base64");
  const result = parseHTML2JSON(htmlBuffer);
  res.json(result);
});

router.post("/parseCSS2JSON", (req, res) => {
  const {
    body: { contentCSS },
  } = req;
  const cssText = Buffer.from(contentCSS, "base64");
  const result = parseCSS2JSON(cssText);
  res.json(result);
});

router.post("/lti_access", function (req, res, next) {
  res.cookie("AccessToken", "***Auth token value***", {
    httpOnly: true,
    expires: 0,
  });
  lti
    .registerCourseraActivity(req)
    .then(function (resp) {
      const { lis_outcome_service_url, lis_result_sourcedid } = resp;
      let key = { lis_outcome_service_url, lis_result_sourcedid };
      let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
      res.redirect(
        `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
          buffer
        )}`
      );
    })
    .catch(next);
});

module.exports = router;

// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
// var express = require("express");
// var router = express.Router();

// const {
//   domValidation,
//   parseHTML2JSON,
//   parseCSS2JSON,
// } = require("../lib/validator");

// const lti = require("../lib/lti");

// function validate(req) {
//   const {
//     body: { htmlContent, cssContent, htmlStructure, cssStructure, key },
//   } = req;

//   let htmlBuffer = Buffer.from(htmlContent, "base64");
//   let cssBuffer = Buffer.from(cssContent, "base64");

//   return domValidation(htmlBuffer, cssBuffer, htmlStructure, cssStructure);
// }

// router.post("/test", (req, res) => {
//   res.json(validate(req));
// });

// router.post("/", (req, res) => {
  
//   const result = validate(req);
  
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });

//   key = req.body['key']
//   if (req.cookies["AccessToken"] == "***Auth token value***") {

//     if (key) {
      
//       let keyBuffer = Buffer.from(decodeURIComponent(key), "base64").toString();
      
//       const { lis_outcome_service_url, lis_result_sourcedid } = JSON.parse(
//         keyBuffer
//       );
      
//       console.log("Validating");
//       lti
//         .sendResultToCoursera(
//           lis_outcome_service_url,
//           lis_result_sourcedid,
//           parseFloat(result.grade) / 5.0
//         )
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((error) => {
//           console.log(result.grade / 5.0);
//           console.log("Error when sending results to Coursera: ", error);
//         });
//     }
//     res.json(result);
//   } else {
    
//     res.status(401).send();
//   }
// });

// router.post("/parseHTML2JSON", (req, res) => {
//   const {
//     body: { htmlContent },
//   } = req;
//   const htmlBuffer = Buffer.from(htmlContent, "base64");
//   const result = parseHTML2JSON(htmlBuffer);
//   res.json(result);
// });

// router.post("/parseCSS2JSON", (req, res) => {
//   const {
//     body: { contentCSS },
//   } = req;
//   const cssText = Buffer.from(contentCSS, "base64");
//   const result = parseCSS2JSON(cssText);
//   res.json(result);
// });

// router.post("/lti_access", function (req, res, next) {
//   res.cookie("AccessToken", "***Auth token value***", {
//     httpOnly: true,
//     expires: 0,
//   });
//   lti
//     .registerCourseraActivity(req)
//     .then(function (resp) {
//       const { lis_outcome_service_url, lis_result_sourcedid } = resp;
//       let key = { lis_outcome_service_url, lis_result_sourcedid };
//       let buffer = Buffer.from(JSON.stringify(key)).toString("base64");
//       res.redirect(
//         `/?type=${resp.type}&exercise=${resp.exercise}&key=${encodeURIComponent(
//           buffer
//         )}`
//       );
//     })
//     .catch(next);
// });

// module.exports = router;
