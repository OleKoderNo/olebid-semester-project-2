# Project structure

OleBid groups interface components by feature. API requests, session
management, page initialization and general utilities have separate folders.

## Source folders

| Location        | Responsibility                                                              |
| --------------- | --------------------------------------------------------------------------- |
| `src/*.ts`      | HTML page entry points: load styles and initialize layout and page behavior |
| `src/style.css` | Tailwind setup, design tokens and shared base styles                        |
| `src/api/`      | HTTP requests, authentication headers and API response handling             |
| `src/auth/`     | Session storage, token handling and protected-page checks                   |
| `src/pages/`    | Page initialization and coordination                                        |
| `src/types/`    | Shared TypeScript types for API data and application models                 |
| `src/utils/`    | General helpers used across features                                        |

## Component folders

| Location                       | Responsibility                                                |
| ------------------------------ | ------------------------------------------------------------- |
| `components/auth/`             | Login and registration forms                                  |
| `components/bidding/`          | Bid forms, submission and bid history                         |
| `components/layout/`           | Header, footer, navigation and header credit balance          |
| `components/listings/`         | Auction cards, grids, filters, summaries and galleries        |
| `components/profile/`          | Profile summary, images and editor coordination               |
| `components/profile/edit/`     | Profile editing forms, previews, validation and saving        |
| `components/profile/activity/` | Own listings, bidding activity and related data preparation   |
| `components/shared/`           | Reusable controls and form behavior used by multiple features |

## Where new code belongs

Place feature-specific code alongside the feature that uses it.

For example, `load-profile-bid-listings.ts` belongs in profile activity
because it prepares auctions specifically for that section. The individual
HTTP requests it uses remain in `api/`.

Put a helper in `utils/` when it has a general purpose across features.
Put reusable interface controls in `components/shared/`.

## Naming

Use descriptive kebab-case filenames, such as `bid-submit.ts` and
`profile-edit-preview.ts`. Keep filenames recognizable in editor tabs.

Use camelCase for functions and variables, and PascalCase for interfaces
and type aliases.

Function names should describe their job:

- `create…` builds markup or creates a configured object.
- `render…` writes a view into the DOM.
- `init…` initializes a component or connects event handlers.
- `get…` retrieves or derives information.
- `load…` coordinates loading data for a feature.
- `update…` updates existing information.
- `placeBid` names the specific action performed by the bid request.

Use `-view.ts` when presentation has been extracted from a larger
component. Use names such as `-form`, `-submit` and `-validation` when
those responsibilities need separate modules.

## Imports and barrel files

An `index.ts` file exposes a folder's public interface.

Consumers outside a feature should use its public exports where available.
Files within the feature should use direct imports for internal helpers.

Avoid importing a parent barrel from a child module when that barrel
exports code which depends on the child. This can create circular
dependencies.

Export only what other modules need. Internal view and validation helpers
do not need to be added to every barrel.

## When to split a file

Split a module when it contains distinct responsibilities that are easier
to understand and maintain separately.

Examples include:

- Gallery markup and gallery interaction.
- Form markup and password-toggle behavior.
- Profile form events and image-loading validation.
- Activity-section markup and request handling.

Do not split files solely to meet a line-count target. Keep closely related
state, event handlers and cleanup together when separating them would make
the code harder to follow.

## Refactoring workflow

1. Move one related group of files at a time.
2. Update imports and public exports.
3. Run `npm run build`.
4. Check the affected interface and interactions.
5. Commit the focused change.

Keep file moves separate from behavior changes where practical.
