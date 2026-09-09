import { loginUser } from "../api";
import { saveSession } from "../auth/session";
import { initPasswordToggles } from "../components/form-field";
import { createLoginForm } from "../components/login-form";

/**
 * Renders and connects the login form.
 * Saves the session after successful authentication.
 */
export function initLoginPage(): void {
  const container = document.querySelector<HTMLElement>("#login-container");

  if (!container) {
    return;
  }

  container.innerHTML = createLoginForm();
  initPasswordToggles(container);

  const form = container.querySelector<HTMLFormElement>("#login-form");
  const email = container.querySelector<HTMLInputElement>("#login-email");
  const password = container.querySelector<HTMLInputElement>("#login-password");
  const submit = container.querySelector<HTMLButtonElement>(
    "[data-login-submit]",
  );
  const error =
    container.querySelector<HTMLParagraphElement>("[data-login-error]");
  const status = container.querySelector<HTMLParagraphElement>(
    "[data-login-status]",
  );

  if (!form || !email || !password || !submit || !error || !status) {
    throw new Error("Login form is missing required elements.");
  }

  const reason = new URLSearchParams(window.location.search).get("reason");

  if (reason === "auth-required") {
    status.textContent =
      "Please log in to continue. Your previous session may have expired.";
  }

  let isSubmitting = false;

  form.addEventListener("input", () => {
    email.setCustomValidity("");
    error.textContent = "";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    error.textContent = "";
    email.setCustomValidity("");
    email.value = email.value.trim();

    if (email.value && !/^[^\s@]+@stud\.noroff\.no$/i.test(email.value)) {
      email.setCustomValidity("Use your @stud.noroff.no email address.");
    }

    if (!form.reportValidity()) {
      return;
    }

    isSubmitting = true;
    submit.disabled = true;
    status.textContent = "Logging in…";

    try {
      const { data } = await loginUser({
        email: email.value,
        password: password.value,
      });

      try {
        saveSession(data);
      } catch {
        throw new Error(
          "Unable to save a usable login session. Please allow site storage and try logging in again.",
        );
      }

      password.value = "";
      status.textContent = "Logged in. Opening auctions…";

      window.location.assign("/");
    } catch (requestError: unknown) {
      status.textContent = "";

      error.textContent =
        requestError instanceof Error
          ? requestError.message
          : "Unable to log in. Please try again.";

      error.tabIndex = -1;
      error.focus();

      isSubmitting = false;
      submit.disabled = false;
    }
  });
}
