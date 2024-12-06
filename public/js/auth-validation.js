import { api } from './api.js';

const generateErrorMessages = (conditions, type) => {
    const messages = {};
    if (type === "password") {
        messages.minLength = `Password must be at least ${conditions.minLength} characters long`;
        messages.minUpperCase = `Password must contain at least ${conditions.minUpperCase} uppercase letter`;
        messages.minLowerCase = `Password must contain at least ${conditions.minLowerCase} lowercase letter`;
        messages.minNumber = `Password must contain at least ${conditions.minNumber} number`;
        messages.minSpecial = `Password must contain at least ${conditions.minSpecial} special character`;
        messages.misMatch = "Passwords do not match";
        messages.required = "Password is required";
    } else if (type === "username") {
        messages.minLength = `Username must be at least ${conditions.minLength} characters long`;
        messages.maxLength = `Username cannot be longer than ${conditions.maxLength} characters`;
        messages.pattern = "Username can only contain letters, numbers, underscores, and hyphens";
        messages.required = "Username is required";
    }
    return messages;
};

const passwordConfig = {
    conditions: {
        minLength: 8,
        minUpperCase: 1,
        minLowerCase: 1,
        minNumber: 1,
        minSpecial: 1
    },
    errors: generateErrorMessages({
        minLength: 8,
        minUpperCase: 1,
        minLowerCase: 1,
        minNumber: 1,
        minSpecial: 1
    }, "password")
};

const usernameConfig = {
    conditions: {
        minLength: 3,
        maxLength: 20,
        pattern: /^[a-zA-Z0-9_-]+$/
    },
    errors: generateErrorMessages({
        minLength: 3,
        maxLength: 20
    }, "username")
};

function validateUsername(username) {
    const errors = [];

    if (!username || username.trim() === '') {
        errors.push(usernameConfig.errors.required);
        return errors;
    }

    if (username.length < usernameConfig.conditions.minLength) {
        errors.push(usernameConfig.errors.minLength);
    }

    if (username.length > usernameConfig.conditions.maxLength) {
        errors.push(usernameConfig.errors.maxLength);
    }

    if (!usernameConfig.conditions.pattern.test(username)) {
        errors.push(usernameConfig.errors.pattern);
    }

    return errors;
}

function validatePassword(password, confirmPassword = null) {
    const errors = [];

    if (!password || password.trim() === '') {
        errors.push(passwordConfig.errors.required);
        return errors;
    }

    if (password.length < passwordConfig.conditions.minLength) {
        errors.push(passwordConfig.errors.minLength);
    }

    if (!/[A-Z]/.test(password)) {
        errors.push(passwordConfig.errors.minUpperCase);
    }

    if (!/[a-z]/.test(password)) {
        errors.push(passwordConfig.errors.minLowerCase);
    }

    if (!/[0-9]/.test(password)) {
        errors.push(passwordConfig.errors.minNumber);
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
        errors.push(passwordConfig.errors.minSpecial);
    }

    if (confirmPassword !== null && password !== confirmPassword) {
        errors.push(passwordConfig.errors.misMatch);
    }

    return errors;
}

function showError(inputElement, errorElementId, message) {
    const errorElement = document.getElementById(errorElementId);

    if (errorElement && inputElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('d-none');
        inputElement.classList.add('is-invalid');
    }
}

function clearError(inputElement, errorElementId) {
    const errorElement = document.getElementById(errorElementId);

    if (errorElement && inputElement) {
        errorElement.textContent = '';
        errorElement.classList.add('d-none');
        inputElement.classList.remove('is-invalid');
    }
}

export function setupRealTimeValidation() {
    const form = document.getElementById("AuthForm");
    if (!form) return;

    const usernameInput = form.querySelector('#username');
    const passwordInput = form.querySelector('#password');
    const confirmPasswordInput = form.querySelector('#confirmPassword');

    if (usernameInput) {
        usernameInput.addEventListener('input', () => {
            const errors = validateUsername(usernameInput.value);
            if (errors.length > 0) {
                showError(usernameInput, 'AuthForm-error-username', errors[0]);
            } else {
                clearError(usernameInput, 'AuthForm-error-username');
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            const errors = validatePassword(passwordInput.value,
                confirmPasswordInput ? confirmPasswordInput.value : null);

            if (errors.length > 0) {
                showError(passwordInput, 'AuthForm-error-password', errors[0]);
            } else {
                clearError(passwordInput, 'AuthForm-error-password');
            }
        });
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', () => {
            const errors = validatePassword(passwordInput.value, confirmPasswordInput.value);
            if (errors.length > 0) {
                showError(confirmPasswordInput, 'AuthForm-error-confirmPassword', errors[0]);
            } else {
                clearError(confirmPasswordInput, 'AuthForm-error-confirmPassword');
                const passwordErrors = validatePassword(passwordInput.value, confirmPasswordInput.value);
                if (passwordErrors.length > 0) {
                    showError(passwordInput, 'AuthForm-error-password', passwordErrors[0]);
                } else {
                    clearError(passwordInput, 'AuthForm-error-password');
                }
            }
        });
    }
}

export function submit(e) {
    e.preventDefault();

    const form = document.getElementById("AuthForm");
    if (!form) return;

    const formData = new FormData(form);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    const usernameErrors = validateUsername(username);
    const passwordErrors = validatePassword(password, confirmPassword);
    const confirmPasswordErrors = confirmPassword ? validatePassword(confirmPassword, password) : [];

    let error = false;

    if (usernameErrors.length > 0) {
        showError(form.querySelector('#username'), 'AuthForm-error-username', usernameErrors[0]);
        error |= true;
    }

    if (passwordErrors.length > 0) {
        showError(form.querySelector('#password'), 'AuthForm-error-password', passwordErrors[0]);
        error |= true;
    }

    if (confirmPassword && password !== confirmPassword) {
        showError(form.querySelector('#confirmPassword'), 'AuthForm-error-confirmPassword', passwordConfig.errors.misMatch);
        error |= true;
    }

    if (error) {
        return;
    }

    const globalError = form.querySelector('#AuthForm-error-global');

    const todos = JSON.parse(localStorage.getItem('todos')) || [];

    api("POST", form.action, {
        username,
        email,
        password,
        confirmPassword,
        todos
    }).then((response) => {
        if (form.action.includes("login")) {
            localStorage.removeItem('todos');
        }
        window.location.href = response.redirect;
    }).catch((err) => {
        globalError.textContent = err.message;
        globalError.classList.remove('d-none');
    })
}

