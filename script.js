const paymentForm = document.getElementById("paymentForm");
const successState = document.getElementById("successState");
const backButton = document.getElementById("backButton");

const amount = document.getElementById("amount");
const amountPreview = document.getElementById("amountPreview");

const cardNumber = document.getElementById("cardNumber");
const expiry = document.getElementById("expiry");
const cvv2 = document.getElementById("cvv2");
const captcha = document.getElementById("captcha");

const cardError = document.getElementById("cardError");

const captchaCode = document.getElementById("captchaCode");
const refreshCaptcha = document.getElementById("refreshCaptcha");

const timer = document.getElementById("timer");
const payButton = document.getElementById("payButton");

const successAmount = document.getElementById("successAmount");
const trackingCode = document.getElementById("trackingCode");

let currentCaptcha = "";
let remainingSeconds = 599;

const toPersianNumber = value =>
    value.toString().replace(/\d/g, digit => "۰۱۲۳۴۵۶۷۸۹"[digit]);

const generateCaptcha = () => {
    currentCaptcha = Math.floor(1000 + Math.random() * 9000).toString();
    captchaCode.textContent = toPersianNumber(currentCaptcha);
    captcha.value = "";
};

const formatCardNumber = value =>
    value
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim();

const validateCardNumber = number =>
    number.replace(/\D/g, "").length === 16;

const formatExpiry = value => {
    const numbers = value.replace(/\D/g, "").slice(0, 4);

    return numbers.length > 2
        ? `${numbers.slice(0, 2)} / ${numbers.slice(2)}`
        : numbers;
};

const updateTimer = () => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    timer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    if (remainingSeconds === 0) {
        clearInterval(timerInterval);
        payButton.disabled = true;
        payButton.classList.add("cursor-not-allowed", "opacity-50");
        return;
    }

    remainingSeconds--;
};

amount.addEventListener("input", () => {
    const value = amount.value.replace(/\D/g, "");

    amount.value = value
        ? Number(value).toLocaleString("en-US")
        : "";

    amountPreview.textContent = value
        ? `${Number(value).toLocaleString("fa-IR")} تومان`
        : "";
});

cardNumber.addEventListener("input", () => {
    cardNumber.value = formatCardNumber(cardNumber.value);
    cardError.classList.add("hidden");
});

cardNumber.addEventListener("blur", () => {
    if (cardNumber.value && !validateCardNumber(cardNumber.value)) {
        cardError.classList.remove("hidden");
    }
});

expiry.addEventListener("input", () => {
    expiry.value = formatExpiry(expiry.value);
});

cvv2.addEventListener("input", () => {
    cvv2.value = cvv2.value.replace(/\D/g, "").slice(0, 4);
});

captcha.addEventListener("input", () => {
    captcha.value = captcha.value.replace(/\D/g, "").slice(0, 4);
});

refreshCaptcha.addEventListener("click", generateCaptcha);

paymentForm.addEventListener("submit", event => {
    event.preventDefault();

    const amountValue = amount.value.replace(/\D/g, "");
    const cardValid = validateCardNumber(cardNumber.value);
    const captchaValid = captcha.value === currentCaptcha;

    if (!amountValue || Number(amountValue) <= 0) {
        amount.focus();
        return;
    }

    if (!cardValid) {
        cardError.classList.remove("hidden");
        cardNumber.focus();
        return;
    }

    if (!captchaValid) {
        captcha.classList.add("border-red-400");

        setTimeout(() => {
            captcha.classList.remove("border-red-400");
        }, 1500);

        generateCaptcha();
        captcha.focus();

        return;
    }

    payButton.disabled = true;

    payButton.innerHTML = `
        <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" opacity=".3"/>
            <path d="M21 12A9 9 0 0 0 12 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>در حال پردازش...</span>
    `;

    setTimeout(() => {
        paymentForm.classList.add("hidden");
        successState.classList.remove("hidden");

        successAmount.textContent =
            `${Number(amountValue).toLocaleString("fa-IR")} تومان`;

        trackingCode.textContent =
            Math.floor(100000000 + Math.random() * 900000000);
    }, 1500);
});

backButton.addEventListener("click", () => {
    successState.classList.add("hidden");
    paymentForm.classList.remove("hidden");

    payButton.disabled = false;

    payButton.innerHTML = `
        <span>پرداخت و تکمیل خرید</span>

        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24">
            <path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;

    generateCaptcha();
});

generateCaptcha();
updateTimer();

const timerInterval = setInterval(updateTimer, 1000);