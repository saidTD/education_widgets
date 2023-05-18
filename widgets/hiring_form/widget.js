const form = document.querySelector('.hiring form');
const submitBtn = document.querySelector('.hiring form button');

submitBtn.addEventListener('click', (event) => {
    event.preventDefault();

    if (form.checkValidity()) {
        form.classList.remove('was-validated');
        const formData = new FormData(form);
        if(!validateFile(formData.get('cv'))){
            return;
        }
        
        convertFileToBase64(formData.get('cv')).then(base64 => {
            sendData([["cv_base64", base64], ["carrer", {{params.carrer_uid}}],...formData]);
        })
        

        
    } else {
        form.classList.add('was-validated');
    }
});

function sendData(formData) {
    let formattedData = formatter(formData);
    fetch("{{params.api_url}}", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: formattedData,
    }).then((res) => {
        if (res.ok) {
            showMsg('votre formulaire a été soumis avec succès', 'success', form);
        } else {
            throw new Error("Error! status: " + res.status);
        }
    }).catch((err) => {
        showMsg('Un problème est survenu lors de la soumission de votre formulaire, veuillez réessayer!', 'danger', form);
    });
}

function showMsg(msg, type, wrapper) {
    if (!msg || !type || !wrapper) return;

    const id = new Date().getTime().toString();
    const alert = document.createElement("div");
    alert.classList.add('alert', `alert-${type}`);
    alert.setAttribute('role', 'alert');
    alert.setAttribute('id', id);
    alert.textContent = msg;
    wrapper.prepend(alert);

    const timeout = setTimeout(() => {
        clearTimeout(timeout);

        document.getElementById(id)?.remove();

    }, 5000);
}

function formatter(data) {
    const formatedData = {};
    data.forEach(([key, value]) => formatedData[key] = value);
    return JSON.stringify(formatedData);
}


const inputFile = document.getElementById("cv-file");


function validateFile(file) {
    const inputWrapper = document.querySelector(".custom-input-file-container");
    if(!inputWrapper) {
        return;
    }
    const ACCEPTED_TYPE = ["application/pdf", "application/msword"];
    if(ACCEPTED_TYPE.includes(file.type)) {
        inputWrapper.classList.remove('invalide')
        return true;
    }
    inputWrapper.classList.add('invalide')
    return false;
}

function openInputFile(){
const toggler = document.querySelector('.file-view');
    
    if(!toggler || !inputFile) {
        return;
    }

    toggler.addEventListener('click', () => {
        inputFile.click();
    })
}


function changeFile() {
    const textWrapper = document.querySelector('.placeholder-input');
    const fileName = document.querySelector('.file_name');
    inputFile.addEventListener('change', (e) => {
        let file = inputFile.files[0];
        if(!validateFile(file)) {
            return ;
        }
        textWrapper.classList.add('d-none')
        fileName.innerHTML = file.name
    })
}

changeFile();

openInputFile();

function convertFileToBase64(file) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onloadend = function() {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }