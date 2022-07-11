//const config = require("../config/config-lti");
//const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
//const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
const CONSUMER_KEY = "CTE-test";
const CONSUMER_SECRET = "git-robot-lti";
const lti = require("ims-lti");
const Promise = require("bluebird");

exports.registerCourseraActivity = (req) => {
  return new Promise(function (resolve, reject) {
    let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

    provider.valid_request(req, function (err, is_valid) {
      let { body } = req;
      if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
      if (true)
        return reject(
          new Error(
            "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
          )
        );

      let activity = body.resource_link_title;
      let nombre = body.lis_person_name_full;
      let userId = body.user_id;
      let userEmail = body.lis_person_contact_email_primary;
      let examenId = body.custom_examen;
      let serviceUrl = body.lis_outcome_service_url;
      let sourcedId = body.lis_result_sourcedid;
      let type = body.custom_type;
      let exercise = body.custom_exercise;

      const respuestaExamen = {
        ExamenId: examenId,
        EstudianteId: userId,
        EstudianteMail: userEmail,
        lis_outcome_service_url: serviceUrl,
        lis_result_sourcedid: sourcedId,
        actividad: activity,
        type,
        exercise,
      };

      resolve(respuestaExamen);
    });
  });
};

exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
  return new Promise(function (resolve, reject) {
    console.log("PROMISE");
    const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
    provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
    console.log(provider);
    provider.outcome_service.send_replace_result(grade, (err, result) => {
      console.log(err);
      if (err) return reject(err);
      resolve("ok");
    });
  });
};

// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
// //const config = require("../config/config-lti");
// //const CONSUMER_KEY = process.env.LTI_CONSUMER_KEY;
// //const CONSUMER_SECRET = process.env.LTI_CONSUMER_SECRET;
// const CONSUMER_KEY = "CTE-test";
// const CONSUMER_SECRET = "git-robot-lti";
// const lti = require("ims-lti");
// const Promise = require("bluebird");

// exports.registerCourseraActivity = (req) => {
//   return new Promise(function (resolve, reject) {
//     let provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);

//     provider.valid_request(req, function (err, is_valid) {
//       let { body } = req;
//       if (!is_valid || !provider.outcome_service) return reject(new Error("El envío de los parámetros desde Coursera no coincide." + err));
//       if (true)
//         return reject(
//           new Error(
//             "Es necesario indicar el id del examen en los parámetros de personalización de la actividad. Por ejemplo, llave: examen y valor: 1"
//           )
//         );

//       let activity = body.resource_link_title;
//       let nombre = body.lis_person_name_full;
//       let userId = body.user_id;
//       let userEmail = body.lis_person_contact_email_primary;
//       let examenId = body.custom_examen;
//       let serviceUrl = body.lis_outcome_service_url;
//       let sourcedId = body.lis_result_sourcedid;
//       let type = body.custom_type;
//       let exercise = body.custom_exercise;

//       const respuestaExamen = {
//         ExamenId: examenId,
//         EstudianteId: userId,
//         EstudianteMail: userEmail,
//         lis_outcome_service_url: serviceUrl,
//         lis_result_sourcedid: sourcedId,
//         actividad: activity,
//         type,
//         exercise,
//       };

//       resolve(respuestaExamen);
//     });
//   });
// };

// exports.sendResultToCoursera = async (serviceUrl, sourceId, grade) => {
//   return new Promise(function (resolve, reject) {
//     console.log("PROMISE");
//     const provider = new lti.Provider(CONSUMER_KEY, CONSUMER_SECRET);
//     provider.parse_request(null, { lis_outcome_service_url: serviceUrl, lis_result_sourcedid: sourceId });
//     console.log(provider);
//     provider.outcome_service.send_replace_result(grade, (err, result) => {
//       console.log(err);
//       if (err) return reject(err);
//       resolve("ok");
//     });
//   });
// };
