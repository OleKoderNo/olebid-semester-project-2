import { registerUser } from "../api";
import { initPasswordToggles } from "../components/form-field";
import { createRegistrationForm } from "../components/registration-form";

/**
 * Renders and connects the student registration form.
 * Validates account details and prevents duplicate submissions.
 */
export function initRegisterPage(): void {
  const container = document.querySelector<HTMLElement>(
    "#registration-container",
  );

  if (!container) {
    return;
  }

  container.innerHTML = createRegistrationForm();
  initPasswordToggles(container);

  const form = container.querySelector<HTMLFormElement>("#registration-form");
  const name = container.querySelector<HTMLInputElement>("#register-name");
  const email = container.querySelector<HTMLInputElement>("#register-email");
  const password =
    container.querySelector<HTMLInputElement>("#register-password");
  const confirmation = container.querySelector<HTMLInputElement>(
    "#register-confirm-password",
  );
  const submit = container.querySelector<HTMLButtonElement>(
    "[data-register-submit]",
  );
  const error = container.querySelector<HTMLParagraphElement>(
    "[data-register-error]",
  );
  const status = container.querySelector<HTMLDivElement>(
    "[data-register-status]",
  );
  const success = container.querySelector<HTMLDivElement>(
    "[data-register-success]",
  );

  if (
    !form ||
    !name ||
    !email ||
    !password ||
    !confirmation ||
    !submit ||
    !error ||
    !status ||
    !success
  ) {
    throw new Error("Registration form is missing required elements.");
  }

  let isSubmitting = false;
  let registered = false;

  form.addEventListener("input", () => {
    [name, email, password, confirmation].forEach((input) => {
      input.setCustomValidity("");
    });

    error.textContent = "";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmitting || registered) {
      return;
    }

    error.textContent = "";

    [name, email, password, confirmation].forEach((input) => {
      input.setCustomValidity("");
    });

    name.value = name.value.trim();
    email.value = email.value.trim();

    if (name.value && !/^[a-zA-Z0-9_]+$/.test(name.value)) {
      name.setCustomValidity(
        "Use letters, numbers and underscores, without spaces.",
      );
    }

    if (email.value && !/^[^\s@]+@stud\.noroff\.no$/i.test(email.value)) {
      email.setCustomValidity("Use your @stud.noroff.no email address.");
    }

    if (password.value && password.value.length < 8) {
      password.setCustomValidity("Use at least 8 characters.");
    }

    if (confirmation.value && confirmation.value !== password.value) {
      confirmation.setCustomValidity("Your passwords must match.");
    }

    if (!form.reportValidity()) {
      return;
    }

    isSubmitting = true;
    submit.disabled = true;
    status.textContent = "Creating your account…";

    try {
      await registerUser({
        name: name.value,
        email: email.value,
        password: password.value,
      });

      registered = true;

      password.value = "";
      confirmation.value = "";

      form.hidden = true;
      success.hidden = false;

      status.textContent =
        "Your account has been created. Log in to get started.";
      status.tabIndex = -1;
      status.focus();
    } catch (requestError: unknown) {
      status.textContent = "";

      error.textContent =
        requestError instanceof Error
          ? requestError.message
          : "Unable to create your account. Please try again.";

      error.tabIndex = -1;
      error.focus();
    } finally {
      isSubmitting = false;
      submit.disabled = false;
    }
  });
}
