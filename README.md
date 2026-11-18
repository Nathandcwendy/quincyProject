# Drug Verification System

**[Live Demonstration](https://quincy-393920.web.app/) · [GitHub Repository](https://github.com/Nathandcwendy/quincyProject)**

## Description

I built the Drug Verification System to make drug registration information easier to search and to provide a structured way to report a product. Users can look up records by NAFDAC registration number or search by drug name, view product details, and open a reporting form.

The application has a React frontend and an Express API deployed through Firebase Functions. I use Cloud Firestore to store drug records, name-search indexes, and submitted reports. Firebase anonymous authentication establishes a session for API access without requiring users to create an account manually.

## Problem Statement

Consumers need a straightforward way to look up drug registration details and compare them with the information on a product. Relevant information can be difficult to find, and an incomplete report may omit the details needed to identify a drug or manufacturer.

My goal was to bring record lookup and product reporting into one application. The system helps users find stored registration information and submit consistent product details when they want to raise a concern.

## Primary Objectives

- Support searches by NAFDAC registration number and drug name.
- Present product, manufacturer, ingredient, and registration information in one interface.
- Display an Active or Inactive status using the stored licence expiry date.
- Provide a structured reporting form with required fields and format checks.
- Associate API requests and reports with an authenticated anonymous session.
- Provide a responsive interface with light and dark themes.

## Features

### Registration-Number Lookup

Users can enter a NAFDAC registration number and select **Verify**. The API queries the `drugsData` collection for records whose `nrn` matches the supplied value and returns the matching records.

### Drug-Name Search

I use a lightweight name index to support suggestions. The frontend requests the index for the first character of the search, filters the returned names using a case-insensitive prefix match, and displays up to five suggestions.

Selecting a suggestion retrieves the full record by its document ID.

### Product Details

Depending on the stored record, the details view displays:

- Product name and NAFDAC registration number.
- Active ingredients and strength.
- Applicant name, approval date, and licence expiry date.
- Manufacturer name and country.
- Product form, route of administration, and ATC code.
- Marketing category, product category, and product description.
- Summary of Product Characteristics link where one is available.

### Status Display

The API derives an Active or Inactive label from the record's `expiry_date`. A valid future date produces an Active result; other values produce an Inactive result.

This status describes the stored registration record. The application uses its Firestore dataset for lookups and does not implement physical-product authentication or a live NAFDAC verification integration.

### Drug Reporting

Users can open an empty report or start from a retrieved record. When a report starts from a record, I prefill the product name, registration number, manufacturer name, and manufacturer country.

The report form collects:

| Field | Requirement |
| --- | --- |
| Product Name | Required. |
| NAFDAC Registration Number | Required; checked against the application's alphanumeric, hyphen-separated format. |
| Manufacturer Name | Required. |
| Manufacturer Country | Required. |
| Manufacture Date | Required; `YYYY-MM-DD` format. |
| Expiry Date | Required; `YYYY-MM-DD` format. |

The backend checks required values and the registration-number and date formats before adding a report to `drugReports`. It associates the report with the anonymous user's UID and returns the generated document ID. The frontend displays submission progress, errors, and a success message.

### Authentication and Request Handling

The frontend signs in anonymously through Firebase Authentication and obtains an ID token. Axios sends the token in an `Authorization: Bearer <token>` header.

The Express authentication middleware verifies the token through Firebase Admin before allowing access to the API routes. Shared context manages loading states, search results, errors, and report submission.

## Tools, Technologies and Platforms Used

| Area | Technologies | Purpose |
| --- | --- | --- |
| Frontend | React 18, React DOM, JavaScript, JSX | User interface and client-side behaviour. |
| Routing and state | React Router 6, React Context, React Hooks | Navigation, search state, reporting state, and themes. |
| Styling | Tailwind CSS 3, PostCSS, Autoprefixer, Preline UI, React Icons | Responsive layouts, theme styling, components, and icons. |
| Development tooling | Vite 4, ESLint | Development server, production builds, and linting. |
| HTTP requests | Axios | Requests from the frontend to the API. |
| Backend | Node.js, Express, Firebase Functions v2 | Authenticated lookup and reporting endpoints. |
| Authentication | Firebase Authentication, Firebase Admin SDK | Anonymous sign-in and server-side ID-token verification. |
| Database | Cloud Firestore | Drug records, name indexes, and product reports. |
| Hosting | Firebase Hosting | Frontend delivery and routing of `/api` requests to the backend. |
| Local tooling | Firebase CLI and emulators | Local hosting and functions workflows. |

The backend package currently declares Node.js 18 in its `engines` configuration.

## Implementation

### Request Flow

1. The browser establishes an anonymous Firebase session.
2. The user enters a registration number or selects a drug-name suggestion.
3. The frontend sends an authenticated request to the relative `/api` path.
4. Firebase Hosting forwards API requests to the exported `api` function.
5. Express verifies the token and queries Firestore.
6. The frontend renders the returned record or an appropriate error state.
7. A submitted report passes through the same authentication layer before being stored.

I keep the frontend's API and authentication logic in [DataContext.jsx](https://github.com/Nathandcwendy/quincyProject/blob/main/src/contexts/DataContext.jsx). The deployed API entry point is [api/functions/index.js](https://github.com/Nathandcwendy/quincyProject/blob/main/api/functions/index.js), as configured in the root `firebase.json`.

### Firestore Collections

| Collection | Contents |
| --- | --- |
| `drugsData` | Full product and registration records, addressed by document ID and queried by `nrn`. |
| `indexes` | Documents such as `index_A` containing mappings from record IDs to product names; `index_misc` handles other initial characters. |
| `drugReports` | Submitted product/manufacturer/date information and the submitting anonymous user's `userId`. |

The import helpers in `api/` prepare records and name indexes from a separately supplied local dataset.

### API Endpoints

All endpoints require a Firebase ID token in the Authorization header.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api` | Return a basic API response. |
| GET | `/api/inventory/:letter` | Retrieve the name index for one initial character. |
| GET | `/api/nrn/:nrn` | Find records matching a registration number. |
| GET | `/api/id/:id` | Retrieve one drug record by document ID. |
| POST | `/api/report` | Validate and save a drug report. |

Successful responses include `status`, `message`, and a `result` or `results` value. The API uses error responses for invalid requests, unauthorized access, missing records, and server failures.

### Project Structure

```text
quincyProject/
├── src/
│   ├── components/           # Header and reusable text inputs
│   ├── contexts/             # API, authentication, reporting, and theme state
│   ├── pages/
│   │   ├── HomePage.jsx      # Lookup, suggestions, and product details
│   │   └── ReportFormPage.jsx
│   ├── App.jsx               # Shared layout and providers
│   └── main.jsx              # Route definitions
├── api/
│   ├── functions/
│   │   ├── index.js          # Express API exported as a Firebase function
│   │   └── package.json      # Backend dependencies and runtime
│   ├── dataUploader.js       # Data/index import helper
│   ├── firestore.js          # Data preparation helpers
│   └── firestore.rules
├── firebase.json             # Root hosting/functions configuration
├── tailwind.config.js
└── vite.config.js
```

## Running the Project Locally

### 1. Install Dependencies

Install Node.js and npm, then clone the repository and install the frontend and backend dependencies:

```bash
git clone https://github.com/Nathandcwendy/quincyProject.git
cd quincyProject
npm install
npm --prefix api/functions install
```

### 2. Configure Firebase

Create a `.env.local` file in the repository root:

```dotenv
VITE_FIREBASE_API_KEY=your_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_APP_ID=your_firebase_app_id
VITE_MEASUREMENT_ID=your_measurement_id
```

Use a separate Firebase development project, enable **Anonymous** authentication, and create the `drugsData` and `indexes` collections with your development dataset. The report endpoint creates documents in `drugReports` when reports are submitted.

Use the same project for the frontend configuration and Firebase CLI selection. The deployed backend initializes Firebase Admin with its runtime credentials.

The optional import helpers reference a local data service on port `3060` and a `serviceAccount.json` file. Those inputs are not bundled with the repository and must be supplied separately if you use the import tools.

### 3. Start the Frontend

```bash
npm run dev
```

This starts Vite. The frontend calls `/api`, so full API functionality also requires a backend connection. The current Vite configuration does not include an API proxy.

### 4. Run the Frontend and API Together

For a local integrated workflow, use the Firebase Hosting and Functions emulators with a development Firebase project.

First, replace the machine-specific Hosting and Functions emulator addresses in the root `firebase.json` with distinct local ports. The relevant entries inside `emulators` should be:

```json
{
  "functions": {
    "host": "127.0.0.1",
    "port": 5001
  },
  "hosting": {
    "host": "127.0.0.1",
    "port": 5000
  }
}
```

Keep the existing hosting rewrites and functions source configuration. Then run:

```bash
npx firebase login
npm run build
npx firebase emulators:start --only hosting,functions --project YOUR_DEVELOPMENT_PROJECT_ID
```

Open `http://127.0.0.1:5000`. This workflow serves the built frontend and API locally while using the selected development project's cloud Authentication and Firestore services.

### Available Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Build the frontend into `dist/`. |
| `npm run preview` | Preview the built frontend; this does not start the API. |
| `npm run lint` | Run the frontend ESLint configuration. |
| `npm --prefix api/functions run lint` | Run the backend ESLint configuration. |

## Deployment

After selecting and configuring the target Firebase project:

```bash
npx firebase login
npm run build
npx firebase deploy --only functions,hosting --project YOUR_FIREBASE_PROJECT_ID
```

The root hosting configuration serves `dist/`, forwards `/api` and `/api/**` to the `api` function, and serves the React application for the home and reporting routes.

## Demonstration Link

**[Open Drug Verification System](https://quincy-393920.web.app/)**

Suggested walkthrough:

1. Select **Drug Name** and enter `Paracetamol`.
2. Select a suggested product to display its full record.
3. Explain the manufacturer, ingredients, registration details, and status.
4. Demonstrate the registration-number search with a number from the dataset.
5. Open a report from a product record to show the prefilled fields.
6. Explain the required manufacturing and expiry dates and the submission feedback.

## Current Scope and Future Improvements

The application queries an imported Firestore dataset, so record coverage and freshness depend on the supplied data. Reports are saved within this application's database; forwarding them to a regulator is outside the current implementation.

Future improvements include a documented data-refresh process, an administrative report-review interface, stronger date validation, report tracking, and automated tests for API and reporting workflows.

## Project Documentation / Report

This README is my project report and technical guide. It covers the problem, objectives, features, data model, API, local configuration, and deployment workflow.

**Source code:** [Nathandcwendy/quincyProject](https://github.com/Nathandcwendy/quincyProject)
