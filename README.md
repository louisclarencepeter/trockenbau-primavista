# Trockenbau Prima Vista

Marketing website for **Trockenbau Prima Vista**, built with React and Vite.  
The current site is centered on the company’s Trockenbau offer:

- `Decken abhängen`
- `Wände stellen`
- `Estrich-Boden`
- `Dachschrägen`
- `Sonstiges`

It includes a homepage, a dedicated calculator page, project references, reviews, contact forms, cookie consent, and an AI-powered chatbot backed by a Node server for Render.

## Stack

- React 19
- Vite 8
- Sass
- Lucide React
- Font Awesome
- Express
- OpenAI API

## Main Experience

The frontend entrypoint lives at [client/src/App.jsx](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/client/src/App.jsx).

### Homepage

- `Navbar`
- `Hero`
- `Services`
- `CalculatorTeaser`
- `About`
- `Projects`
- `Reviews`
- `Contact`
- `Footer`
- `Chatbot`
- `CookieBanner`

### Additional Pages

- `/kalkulator` -> interactive Trockenbau calculator
- `/impressum` -> legal page
- `/datenschutz` -> privacy page

## Project Structure

```text
.
├── client/
│   ├── public/
│   │   └── videos/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── render.yaml
│   └── vite.config.js
├── server/
│   ├── app.js
│   └── lib/
├── package.json
├── render.yaml
└── README.md
```

## Getting Started

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Start the server

```bash
npm run dev:server
```

### 3. Start the frontend

```bash
npm run dev
```

Vite runs on `http://localhost:5173` and proxies API requests to `http://localhost:8787`.

### 4. Build for production

```bash
npm run build
```

### 5. Start the production server locally

```bash
npm run start
```

### 6. Run the linter

```bash
npm run lint
```

## Environment Variables

The chatbot function requires an OpenAI API key:

```bash
OPENAI_API_KEY=your_api_key_here
```

Store it in a local `.env` file during development and in Render environment variables for deployment.

## Calculator

The calculator page lives in [client/src/components/Calculator/Calculator.jsx](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/client/src/components/Calculator/Calculator.jsx).

It currently supports the site’s main Trockenbau categories:

- `Decken abhängen`
- `Wände stellen`
- `Estrich-Boden`
- `Dachschrägen`
- `Sonstiges`

The calculator includes:

- package selection
- room size selection
- add-on selection
- live cost estimate
- server-backed inquiry forms
- Render-ready API server for chat, reviews, forms, and emails
- rotating project media in the hero and request areas

## Forms

Three forms submit directly to the app server:

- `contact`
- `calculator`
- `anfrage`

All three post JSON to `/api/forms/submit`.

Current behavior:

- the Render server receives the form submission directly
- the same request sends the internal business notification email
- optional customer confirmation emails are controlled by `EMAIL_CONFIRMATIONS_ENABLED`
- if internal delivery is not configured, the form request fails instead of silently dropping leads

### Email Confirmation Configuration

The server supports both `Brevo` and `Resend` for notifications and confirmations:

```bash
PORT=8787
EMAIL_CONFIRMATIONS_ENABLED=false
EMAIL_PROVIDER=brevo
EMAIL_FROM="Trockenbau Prima Vista <noreply@your-domain.tld>"
EMAIL_REPLY_TO=info@trockenbau-primavista.ch
EMAIL_NOTIFICATION_TO=info@trockenbau-primavista.ch
EMAIL_NOTIFICATION_BCC=
BREVO_API_KEY=your-brevo-api-key
RESEND_API_KEY=re_your_resend_api_key
```

Recommended setup:

1. Verify a sending domain with Brevo or Resend.
2. Set `EMAIL_FROM` to a verified sender on that domain.
3. Set `EMAIL_NOTIFICATION_TO` to the inbox that should receive website leads.
4. Add the variables above in Render environment settings.
5. Keep `EMAIL_CONFIRMATIONS_ENABLED=false` until the sender domain is ready.

After that:

- `contact`, `calculator`, and `anfrage` send a customer receipt email when `EMAIL_CONFIRMATIONS_ENABLED=true`
- the same customer receipt is BCCed to `EMAIL_NOTIFICATION_TO`
- if no customer receipt is being sent, the server falls back to a separate internal notification email
- self-sends are skipped automatically if `EMAIL_NOTIFICATION_TO` matches `EMAIL_FROM`

## Chatbot

The chatbot UI lives in [client/src/components/Chatbot/Chatbot.jsx](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/client/src/components/Chatbot/Chatbot.jsx) and the backend logic now runs through [server/lib/chat.js](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/server/lib/chat.js).

Current behavior:

- replies in German
- uses company context for Trockenbau-related questions
- encourages visitors to contact the business for quotes and project inquiries
- sends requests to the Render server at `/api/chat`

## Server & Render

The app server entrypoint is [server/index.js](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/server/index.js) and the Express app lives in [server/app.js](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/server/app.js).

Available routes:

- `POST /api/chat`
- `GET /api/reviews`
- `POST /api/confirmations`
- `POST /api/forms/submit`
- `GET /api/health`

Local development:

```bash
npm run dev:server
```

In a second terminal:

```bash
npm run dev
```

`npm run dev` starts Vite on `5173` and proxies `/api/*` to the Node server on `8787`.

Production start:

```bash
npm run build
npm run start
```

Render deployment can use [render.yaml](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/render.yaml) or these commands directly:

- Build command: `npm run install:all && npm run build`
- Start command: `npm run start`

## Styling

Global styles are organized under [client/src/styles](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/client/src/styles):

- `colors.scss`
- `fonts.scss`
- `layout.scss`
- `z-index.scss`

Component-specific styles live next to their components in `client/src/components/*/*.scss`.

## Assets

- Local fonts are stored in `client/src/assets/fonts`
- Responsive images and image manifests live under `client/src/assets`
- Service, hero, about, and project visuals are managed through `responsiveImages`
- Video references are organized under [client/public/videos](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/client/public/videos)

### Current Video Folder Convention

Service video placeholders are currently kept only for the active service offer:

- `/client/public/videos/leistungen/decken-abhaengen`
- `/client/public/videos/leistungen/waende-stellen`
- `/client/public/videos/leistungen/estrich-boden`
- `/client/public/videos/leistungen/dachschraegen`
- `/client/public/videos/leistungen/sonstiges`

There is no longer a separate `desktop` / `mobil` split in that placeholder structure.

## Notes

- The site uses simple pathname-based page switching inside the React app.
- Cookie consent is stored in `localStorage`.
- The theme preference is stored in `localStorage`.
- The about section already has a real local video file referenced through [client/src/assets/videoManifest.js](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/client/src/assets/videoManifest.js).
