const form = document.querySelector('.inscription form');
const submitBtn = document.querySelector('.inscription form button');

submitBtn.addEventListener('click', (event) => {
  event.preventDefault();

  if (form.checkValidity()) {
    form.classList.remove('was-validated');
    const formData = new FormData(form);
    sendData([...formData]);
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