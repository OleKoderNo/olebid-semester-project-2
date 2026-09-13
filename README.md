# OleBid

OleBid is a student-only auction platform built for the Noroff Semester Project 2 assignment. Registered users can create listings, manage their profiles, place bids using virtual credits, and view their auction activity. Visitors can browse, search, filter, and view listings without logging in.

## Live demo

[Visit the OleBid live application](https://olebid.vercel.app/)

## Features

### Visitors

- Browse active auction listings
- Search listings by keywords
- Filter listings by status and tag
- Sort listings by newest, oldest, or ending soon
- View individual listing details
- View bid history
- View responsive layouts on desktop and mobile

### Registered users

- Register with a `@stud.noroff.no` email address
- Log in and log out securely
- View their available virtual-credit balance
- Create auction listings
- Add image galleries with previews and descriptions
- Edit their own listings
- Delete their own listings
- Place bids on other users’ listings
- Edit their profile bio, avatar, and banner
- View listings they created
- View listings they have bid on

## Technology

- TypeScript
- HTML
- Tailwind CSS
- Vite
- Noroff Auction House API v2
- Vercel
- GitHub Projects
- Figma

No front-end framework is used.

## Getting started

### Requirements

- Node.js
- npm
- A Noroff API key

### Installation

Clone the repository:

```bash
git clone https://github.com/OleKoderNo/olebid-semester-project-2.git
cd olebid-semester-project-2
```

Install dependencies:

```bash
npm install
```

Create a local environment file and add your Noroff API key:

```env
VITE_NOROFF_API_KEY=your_api_key_here
```

Never commit the real API key. Environment files containing secrets are excluded from version control.

### Development

Start the local development server:

```bash
npm run dev
```

### Verification

Run the TypeScript checks:

```bash
npm run typecheck
```

Create a production build:

```bash
npm run build
```

## Project structure

The project uses feature-based folders with shared components and utilities.

See [Project structure and naming conventions](docs/project-structure.md) for folder responsibilities, import rules, and guidance on splitting modules.

## Accessibility and responsive design

Accessibility and universal design were considered throughout the project.

The application includes:

- Keyboard-accessible navigation and controls
- Visible focus indicators
- Semantic headings, forms, lists, tables, and landmarks
- Accessible labels and status messages
- Alternative text for listing and profile images
- Responsive layouts for mobile and desktop
- Validation feedback for invalid form input
- Layout checks at 200% browser zoom
- Device-local date and time display
- Mobile menu support

## Testing

The application was manually tested across:

- Visitor and authenticated user flows
- Registration and login
- Listing creation, editing, and deletion
- Bidding and bid history
- Profile editing
- Search, sorting, filtering, and pagination
- Mobile and desktop layouts
- Keyboard navigation
- Form validation
- 200% browser zoom
- Production deployment

The production build and TypeScript checks pass locally.

## Design and planning

- [Figma mobile prototype](https://www.figma.com/proto/DSSuHKeaxHxzJRxKQO3SfU/OleBid-%E2%80%94-Design---Style-Guide?node-id=18-407&starting-point-node-id=18%3A407&t=S3c4zEMzkLxvzLS3-1)
- [Figma desktop prototype](https://www.figma.com/proto/DSSuHKeaxHxzJRxKQO3SfU/OleBid-%E2%80%94-Design---Style-Guide?node-id=12-379&starting-point-node-id=12%3A379&t=9QQ44oIEjXIOwY9c-1)
- [Complete Figma file, including the style guide](https://www.figma.com/design/DSSuHKeaxHxzJRxKQO3SfU/OleBid-%E2%80%94-Design---Style-Guide?node-id=0-1&t=lH3HgrSK3jAkdI4U-1)
- [Project board and planning documentation](https://github.com/users/OleKoderNo/projects/10)
- [Project structure and naming conventions](docs/project-structure.md)

## Image attribution

Images used in the application come from publicly accessible image sources and API listing data. Attribution is provided where required by the source.

Add any specific source credits here if required by the images used in your final deployment.

## AI use

AI assistance was used for brainstorming, explaining technical concepts, reviewing responsive layouts, diagnosing bugs, and improving documentation and commit messages.

All AI assistance was reviewed, understood, adapted, and manually tested before being included in the project. See [AI usage log](AI_LOG.md) for details.

## License

This project was created as part of the Noroff Semester Project 2 assignment.
