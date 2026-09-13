#AI Usage Log

**Tool:** ChatGPT
**Dates:** 6–7 September 2026
**Purpose:** Design decisions, project organisation and technical learning.

ChatGPT was used as a supporting tool during development, primarily for naming conventions, JSDoc documentation, readability improvements, and clarification of technical concepts.

I used ChatGPT to discuss appropriate names for functions, variables, and components, and to improve the consistency and readability of existing code. I also used it to help write and refine JSDoc comments.

Some existing lines of code were reviewed with ChatGPT to identify ways they could be made clearer or more readable. I reviewed the suggestions and incorporated changes where they were appropriate for the project.

ChatGPT was also used to discuss design decisions, project organisation, and technical questions, including navigation, keyboard accessibility, focus handling, and the skip-to-content link.

The core implementation and project-specific decisions were made by me. AI suggestions were reviewed, adapted, and tested before being incorporated into the project. The purpose of using AI was to support development and learning rather than to generate the project as a whole.

## Refactoring and project structure

**Tool:** ChatGPT
**Date:** 10 September 2026
**Scope:** Component organisation, file splitting and project documentation.

As the project grew, I found the flat components folder harder to navigate. I proposed grouping related files into feature folders and using folder-level `index.ts` exports to simplify imports. I asked ChatGPT to help refine and carry out that cleanup.

I also requested a review of files that could benefit from splitting. ChatGPT helped identify separate responsibilities and provided revised code examples for extracting password-toggle behavior, gallery markup, bid-history entries, profile image validation and profile-listings presentation.

I applied the changes locally in focused commits and used ChatGPT to help resolve import paths and TypeScript errors encountered during the refactor. We discussed keeping related behavior together where further splitting would add unnecessary complexity.

ChatGPT also drafted the project-structure documentation and README link, covering the agreed folder organisation, naming conventions and import guidelines.

The direction for this PR came from my own experience working in the project. AI assistance helped me implement and document the cleanup while learning more about maintainable module structure.

### Auction listing creation — 10 September 2026

I asked ChatGPT for larger files to be split into smaller modules with clear responsibilities. ChatGPT supplied code suggestions and JSDoc documentation, which I reviewed and incorporated.

I also used ChatGPT to understand how device-local deadlines convert to UTC timestamps for the API and display in each visitor’s local time. I chose to use native JavaScript without adding a date dependency.

I tested the completed creation flow and its validation, error handling, and navigation before preparing the pull request.

### 2026-09-13 — Responsive design review

During the testing and improvement of my app, I used ChatGPT as a support tool to review my work and help me identify potential issues and improvements.

After completing my own testing across both mobile and desktop, I used ChatGPT to go through my testing results with me and double-check that I had covered everything I needed to test. During this review, ChatGPT helped me discover some wrapping issues with the descriptive text that was placed under the label tags. Based on the feedback, I moved the text to improve the layout.

ChatGPT also recommended using a white background for the text areas in my forms and in the About Item section. I implemented this as a visual and layout improvement. These were two specific improvements that I discovered with the help of AI.

I also asked ChatGPT to create a checklist of things I should check when reviewing all the pages of my site. While working through this checklist, I discovered that the delete button was not working. This allowed me to identify and catch a functional issue that I had previously missed.

In addition to testing and design feedback, I used AI to help me write and improve commit messages, correct my written text, and improve comments in my code

## 2026-09-13 — Pagination results focus and scroll fix

Used ChatGPT to diagnose a pagination usability issue. The Browse page focused the results heading before the asynchronous listing request completed. The results were then replaced afterward, so the browser did not reliably position the new results near the top of the viewport.

I added a pagination-focus flag and applied focus only after the new results finished rendering. The heading is focused with `preventScroll: true`, then `scrollIntoView({ block: "start" })` positions the results correctly while preserving keyboard accessibility. I manually verified that pagination now returns the viewport to the results heading and that keyboard focus remains visible.

I chose to keep the pagination component unchanged because the issue belonged to the Browse page’s asynchronous loading flow.
