// (function() {
//   const form = document.querySelector('.inscription form');
//   const submitBtn = document.querySelector('.inscription form button');

//   submitBtn.addEventListener('click', (event) => {
//     event.preventDefault();

//     if (form.checkValidity()) {
//       form.classList.remove('was-validated');
//       const formData = new FormData(form);
//       sendData([...formData]);
//     } else {
//       form.classList.add('was-validated');
//     }
//   });

//   function formatter(data) {
//     const formatedData = {};
//     data.forEach(([key, value]) => formatedData[key] = value);
//     return JSON.stringify(formatedData);
//   }
  
//   function sendData(formData) {
//     let formattedData = formatter(formData);
//     fetch("{{params.api_url}}", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: formattedData,
//     }).then((res) => {
//       if (res.ok) {
//         showMsg('votre formulaire a été soumis avec succès', 'success', form);
//         form.reset();
//       } else {
//         throw new Error("Error! status: " + res.status);
//       }
//     }).catch((err) => {
//       showMsg('Un problème est survenu lors de la soumission de votre formulaire, veuillez réessayer!', 'danger', form);
//     });
//   }
  
//   function showMsg(msg, type, wrapper) {
//     if (!msg || !type || !wrapper) return;
  
//     const id = new Date().getTime().toString();
//     const alert = document.createElement("div");
//     alert.classList.add('alert', `alert-${type}`);
//     alert.setAttribute('role', 'alert');
//     alert.setAttribute('id', id);
//     alert.textContent = msg;
//     wrapper.prepend(alert);
  
//     const timeout = setTimeout(() => {
//       clearTimeout(timeout);
//       document.getElementById(id)?.remove();
//     }, 5000);
//   }
// })();

// var Form = function (options) {
//   console.log(form)
//   const defaultConfig = {
//     elementSelctor: "",
//     withUTM: false,
//     staticData: {
//       uid: "issam",
//       token: "lasj-lsafla-ladslj-hsa90",
//     },
//   };

//   let config = { ...defaultConfig, ...options };
//   let hasFile = config.hasFile;
//   let withUTM = config.withUTM;
//   const form = document.querySelector(config.elementSelctor);
//   const submitButtom = form.querySelector("button");
//   init();

//   function formatter(data) {
//     let formatedData = {};
//     data.forEach(([key, value]) => (formatedData[key] = value));
//     if (withUTM) {
//       formatedData = { ...formatedData, ...getUTMValues() };
//     }
//     return JSON.stringify({ ...formatedData, ...config.staticData });
//   }

//   function sendData(formData) {
//     let formattedData = formatter(formData);
//     fetch("{{params.api_url}}", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: formattedData,
//     })
//       .then((res) => {
//         if (res.ok) {
//           showMsg("votre formulaire a été soumis avec succès", "success", form);
//           form.reset();
//         } else {
//           throw new Error("Error! status: " + res.status);
//         }
//       })
//       .catch((err) => {
//         showMsg(
//           "Un problème est survenu lors de la soumission de votre formulaire, veuillez réessayer!",
//           "danger",
//           form
//         );
//       });
//   }

//   function showMsg(msg, type, wrapper) {
//     if (!msg || !type || !wrapper) return;

//     const id = new Date().getTime().toString();
//     const alert = document.createElement("div");
//     alert.classList.add("alert", `alert-${type}`);
//     alert.setAttribute("role", "alert");
//     alert.setAttribute("id", id);
//     alert.textContent = msg;
//     wrapper.prepend(alert);

//     const timeout = setTimeout(() => {
//       clearTimeout(timeout);
//       document.getElementById(id)?.remove();
//     }, 5000);
//   }

//   // UTM

//   function checkUTM() {
//     const searchParams = new URLSearchParams(window.location);
//     if (
//       searchParams.has("utm_medium") &&
//       searchParams.has("utm_campaign") &&
//       searchParams.has("utm_source")
//     ) {
//       console.log(searchParams.has("utm_medium"));
//       withUTM = true;
//     }
//   }

//   function getUTMValues() {
//     const searchParams = new URLSearchParams(window.location);
//     const utmValues = {};

//     utmValues["utm_source"] = searchParams.get("utm_source");
//     utmValues["utm_campaign"] = searchParams.get("utm_campaign");
//     utmValues["utm_medium"] = searchParams.get("utm_medium");

//     return utmValues;
//   }

//   // Files

//   function changeFile() {
//     if(!hasFile){
//       return;
//     }
//     const textWrapper = document.querySelector(".placeholder-input");
//     const fileName = document.querySelector(".file_name");
//     const inputFile = form.querySelector(".form-control-inputs-file");
//     inputFile.addEventListener("change", (e) => {
//       let file = inputFile.files[0];
//       if (!validateFile(file)) {
//         return;
//       }
//       textWrapper.classList.add("d-none");
//       fileName.innerHTML = file.name;
//     });
//   }

//   function convertFileToBase64(file) {
//     return new Promise(function (resolve, reject) {
//       var reader = new FileReader();
//       reader.onloadend = function () {
//         resolve(reader.result);
//       };
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });
//   }

//   function validateFile(file) {
//     const inputWrapper = document.querySelector(".custom-input-file-container");
//     if (!inputWrapper) {
//       return;
//     }
//     const ACCEPTED_TYPE = ["application/pdf", "application/msword"];
//     if (ACCEPTED_TYPE.includes(file.type)) {
//       inputWrapper.classList.remove("invalide");
//       return true;
//     }
//     inputWrapper.classList.add("invalide");
//     return false;
//   }

//   function init() {
//     submitButtom.addEventListener("click", (event) => {
//       event.preventDefault();
//       console.log("click");
//       if (form.checkValidity()) {
//         form.classList.remove("was-validated");
//         const formData = new FormData(form);

//         if (hasFile) {
//           if (!validateFile(formData.get("cv"))) {
//             return;
//           }

//           convertFileToBase64(formData.get("cv")).then((base64) => {
//             sendData([["cv_base64", base64], ...formData]);
//           });
//         } else {
//           sendData([...formData]);
//         }
//       } else {
//         form.classList.add("was-validated");
//       }
//     });

//     checkUTM();
//     changeFile();
//   }
// };

new Form({elementSelctor : ".inscription form", apiURL : "{{params.api_url}}"});