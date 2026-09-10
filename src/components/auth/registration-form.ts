import { createFormField } from "../shared";

/**
 * Creates the student registration form.
 *
 * @returns Form markup with account fields and request feedback.
 */
export function createRegistrationForm(): string {
  return `
    <form id="registration-form" novalidate class="space-y-6">
      <p class="text-sm leading-6 text-muted">
        All fields are required.
      </p>

      ${createFormField({
        id: "register-name",
        name: "name",
        label: "Username",
        autocomplete: "username",
        hint: "Use letters, numbers and underscores. No spaces.",
      })}

      ${createFormField({
        id: "register-email",
        name: "email",
        label: "Student email",
        type: "email",
        autocomplete: "email",
        hint: "Use your @stud.noroff.no email address.",
      })}

      ${createFormField({
        id: "register-password",
        name: "password",
        label: "Password",
        type: "password",
        autocomplete: "new-password",
        hint: "Use at least 8 characters.",
        minLength: 8,
      })}

           ${createFormField({
             id: "register-confirm-password",
             name: "confirmPassword",
             label: "Confirm password",
             type: "password",
             autocomplete: "new-password",
           })}

      <p
        data-register-error
        role="alert"
        aria-atomic="true"
        class="text-base leading-6 text-error"
      ></p>

      <button
        data-register-submit
        type="submit"
        class="min-h-13.5 w-full rounded-lg bg-burgundy px-6 py-3 font-medium text-surface hover:bg-burgundy-hover disabled:cursor-wait disabled:bg-disabled disabled:text-muted"
      >
        Create account
      </button>
    </form>

    <div
      data-register-status
      role="status"
      aria-atomic="true"
      class="mt-4 text-base leading-6"
    ></div>

    <div data-register-success hidden class="mt-6">
      <a
        href="/login/"
        class="inline-flex min-h-12 items-center rounded-lg bg-burgundy px-6 py-3 font-medium text-surface hover:bg-burgundy-hover"
      >
        Log in
      </a>
    </div>
  `;
}
