import axios from "axios";
const mdlContent = document.querySelector('.mdl-content');
const buttonClick = document.querySelectorAll(".btn-connect");
const modalWindow = document.querySelector(".mdl-box");
const modalBackground = document.querySelector(".mdl-flex");
const contentForm = document.querySelector(".mdl-content");
const form = document.querySelector(".mdl-forma");
const butClose = document.querySelector(".close");
const formUser = document.querySelector(".forma-for-connect");
let firstBut = document.querySelector(".first-item-list");
const boxFb = document.querySelector(".box-fb");
let textArea = document.querySelector(".user-textarea");
const TOKEN = "6794845207:AAFGkPMlyYK2gotnRYZ4sY5PIO7-HYRPQDM";
let IDCHAT = -1001956750616;
const NAME_PATTERN = /^[a-zA-Zа-яА-ЯёЁґҐіІїЇєЄ]+$/;
const PHONE_PATTERN = /^\+[0-9]{11,12}$/;

// show modal window
buttonClick.forEach(but => {
    but.addEventListener("click", showModalWindow);
});

//clear all inputs after close
function clearFormFields() {
    const inputsHS = document.querySelectorAll(".user-inpt");
    const firstButton = document.querySelector(".first-item-list");
    const title = document.querySelector(".title-form");
    textArea = document.querySelector(".user-textarea");
    inputsHS.forEach(input => {
        input.value = "";
    });
    textArea.value = "";
    title.textContent === "Contact with me" ? firstButton.textContent = "Choose a format study" : firstButton.textContent = "Оберіть варіант навчання";
    firstButton.classList.remove("first-item-list-active");
}

function showModalWindow() {
    modalWindow.style.display = "block";
    document.body.classList.add("is-hidden");

    form.classList.remove("form-feedback");
    boxFb.style.display = "none";
    contentForm.style.display = "flex";
}
// close modal window
document.addEventListener("keydown", closeModal);
modalBackground.addEventListener("click", closeModal);
butClose.addEventListener("click", closeModal);

function closeModal(e) {
    if (!e || e.target === modalBackground || e.key === "Escape" || e.target === butClose || e.target.classList.contains("use-close") || e.target.classList.contains("my-path")) {
        modalWindow.style.display = "none";
        document.body.classList.remove("is-hidden");
    }
}

// settings for my select
mdlContent.addEventListener("click", function (event) {
    if (event.target.matches(".user-btn")) {
        const selectList = event.target.nextElementSibling;
        selectList.classList.toggle("list-item-select-visible");
    }

    else if (event.target.matches(".list-item-select-opt")) {
        firstBut = event.target.closest(".new-select").querySelector(".user-btn");
        const selectList = mdlContent.querySelector(".list-item-select");
        firstBut.textContent = event.target.textContent;
        event.target.matches(".first-opt") ? firstBut.classList.remove("first-item-list-active") : firstBut.classList.add("first-item-list-active");
        selectList.classList.remove(".list-item-select-visible");
    }

    else {
        const selectList = mdlContent.querySelector(".list-item-select");
        selectList.classList.remove("list-item-select-visible");
    }
});

// send message
formUser.addEventListener("submit", handleSubmit);

async function handleSubmit(e) {
    e.preventDefault();
    let isValid = true;

    const inputsHS = document.querySelectorAll(".user-inpt");
    inputsHS.forEach(input => {
        if (input.classList.contains("username")) {
            if (!NAME_PATTERN.test(input.value)) {
                isValid = false;
                checkInputs(input);
            }
        } else if (!PHONE_PATTERN.test(input.value)) {
            isValid = false;
            checkInputs(input);
        }
    });

    if (!isValid) {
        return;
    }

    const formData = new FormData(e.target);
    const userName = formData.get("username");
    const userPhone = formData.get("phone");
    const comment = `${formData.get("comment").trim() === "" ? "Без коментарів" : formData.get("comment")}`;
    const education = `${(firstBut.textContent === "Оберіть варіант навчання") || (firstBut.textContent === "Choose a format study") ? "Формат не вибраний" : `${firstBut.textContent}`}`;

    const message = `
    Нова заявка:
    1) Ім'я: ${userName};
    2) Телефон: ${userPhone};
    3) Формат навчання: ${education};
    4) Коментар: ${comment};
    `;

    sendMessage(message);
}
async function sendMessage(message) {
    try {
        await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
            chat_id: IDCHAT,
            text: message
        });
        feedbackMessage(true);
    }
    catch (error) {
        feedbackMessage(false);
        console.error("Error in sending sms:", error);
    }
}

//check input
mdlContent.addEventListener("focusout", function (event) {
    if (event.target.matches("input")) {
        checkInputs(event.target);
    }
});

function checkInputs(input) {
    if (!input.checkValidity()) {
        errorParagraf(input.classList.value, true);
        input.classList.add("red");
    } else {
        errorParagraf(input.classList.value, false);
        input.classList.remove("red");
    }
}

// add error paragraf
function errorParagraf(classList, addOrRemove) {
    const classes = classList.split(' ');
    let selector = '';
    classes.forEach(className => {
        selector += `.${className}`;

    });

    const errorParagraph = document.querySelector(selector + " + .error-input");

    if (errorParagraph)
        errorParagraph.classList.toggle("check", addOrRemove);
}

//succes feedback//
async function feedbackMessage(success) {
    const titleFeedback = document.querySelector(".title-feedback");
    success ? titleFeedback.innerHTML = `See you soon!` : titleFeedback.innerHTML = `Error`;
    if (success) {
        document.querySelector(".p-success").style.display = "block";
        document.querySelector(".p-error").style.display = "none";
    }
    else {
        document.querySelector(".p-error").style.display = "block";
        document.querySelector(".p-success").style.display = "none";
    }

    contentForm.style.display = "none";
    boxFb.style.display = "flex";
    form.classList.add("form-feedback");
    clearFormFields();
}