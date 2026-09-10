import { createFormField } from "../shared";

/**
 * Creates the login form using shared form fields.
 *
 * @returns Login markup with validation and request feedback areas.
 */
export function createLoginForm(): string {
  return `
    <form id="login-form" novalidate class="space-y-6">
      <p class="text-sm leading-6 text-muted">
        All fields are required.
      </p>

      ${createFormField({
        id: "login-email",
        name: "email",
        label: "Student email",
        type: "email",
        autocomplete: "username",
        hint: "Use your @stud.noroff.no email address.",
      })}

      ${createFormField({
        id: "login-password",
        name: "password",
        label: "Password",
        type: "password",
        autocomplete: "current-password",
      })}

      <p
        data-login-error
        role="alert"
        aria-atomic="true"
        class="text-base leading-6 text-error"
      ></p>

      <button
        data-login-submit
        type="submit"
        class="min-h-13.5 w-full rounded-lg bg-burgundy px-6 py-3 font-medium text-surface hover:bg-burgundy-hover disabled:cursor-wait disabled:bg-disabled disabled:text-muted"
      >
        Log in
      </button>
    </form>

    <p
      data-login-status
      role="status"
      aria-atomic="true"
      class="mt-4 text-base leading-6"
    ></p>

    <p class="mt-6 text-base leading-6 text-muted">
      New to OleBid?
      <a
        href="/register/"
        class="inline-flex min-h-11 items-center rounded-sm font-medium text-burgundy underline underline-offset-4"
      >
        Create an account
      </a>
    </p>
  `;
}
