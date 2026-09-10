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
