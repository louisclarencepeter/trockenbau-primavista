# Trockenbau Prima Vista

Marketing website for **Trockenbau Prima Vista**, built with React and Vite.  
The current site is centered on the company’s Trockenbau offer:

- `Decken abhängen`
- `Wände stellen`
- `Estrich-Boden`
- `Dachschrägen`
- `Sonstiges`

It includes a homepage, a dedicated calculator page, project references, reviews, contact forms, cookie consent, and an AI-powered chatbot backed by a Netlify Function.

## Stack

- React 19
- Vite 8
- Sass
- Lucide React
- Font Awesome
- Netlify Functions
- OpenAI API

## Main Experience

The app is organized from [src/App.jsx](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/src/App.jsx).

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
├── netlify/
│   └── functions/
│       └── chat.js
├── public/
│   └── videos/
├── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── netlify.toml
├── package.json
└── vite.config.js
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the frontend

```bash
npm run dev
```

Vite runs on `http://localhost:5173`.

### 3. Build for production

```bash
npm run build
```

### 4. Preview the production build

```bash
npm run preview
```

### 5. Run the linter

```bash
npm run lint
```

## Environment Variables

The chatbot function requires an OpenAI API key:

```bash
OPENAI_API_KEY=your_api_key_here
```

Store it in a local `.env` file during development and in Netlify environment variables for deployment.

## Calculator

The calculator page lives in [src/components/Calculator/Calculator.jsx](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/src/components/Calculator/Calculator.jsx).

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
- Netlify-backed inquiry form
- rotating project media in the hero and request areas

## Forms

Two forms are currently set up for Netlify form handling:

- `contact`
- `calculator`

Both submit from the frontend using standard form encoding.

They are now also prepared for transactional email confirmations:

- submissions still go to Netlify Forms
- a separate Netlify Function at `/api/confirmations` can send a confirmation email to the client
- the same function can optionally send an internal notification copy to the business inbox
- if email configuration is missing, submissions still succeed and the email step is skipped safely

### Email Confirmation Configuration

The confirmation function is designed for `Resend` and is controlled through environment variables:

```bash
EMAIL_CONFIRMATIONS_ENABLED=true
EMAIL_PROVIDER=resend
EMAIL_FROM="Trockenbau Prima Vista <noreply@your-domain.tld>"
EMAIL_REPLY_TO=info@trockenbau-primavista.ch
EMAIL_NOTIFICATION_TO=
EMAIL_NOTIFICATION_BCC=
RESEND_API_KEY=re_your_resend_api_key
```

Recommended setup:

1. Verify a sending domain in Resend.
2. Set `EMAIL_FROM` to a verified sender on that domain.
3. Add the variables above in Netlify environment settings.
4. Keep `EMAIL_CONFIRMATIONS_ENABLED=false` until the sender domain is ready.

After that:

- `contact` submissions send a receipt email to the visitor
- `calculator` submissions send a receipt email including the project summary
- optional internal notifications go to `EMAIL_NOTIFICATION_TO`
- self-sends are skipped automatically if `EMAIL_NOTIFICATION_TO` matches `EMAIL_FROM`

## Chatbot

The chatbot UI lives in [src/components/Chatbot/Chatbot.jsx](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/src/components/Chatbot/Chatbot.jsx) and the backend handler lives in [netlify/functions/chat.js](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/netlify/functions/chat.js).

Current behavior:

- replies in German
- uses company context for Trockenbau-related questions
- encourages visitors to contact the business for quotes and project inquiries
- sends requests to a Netlify Function that calls the OpenAI API

## Netlify

This project includes [netlify.toml](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/netlify.toml) with:

- build output set to `dist`
- functions directory set to `netlify/functions`
- redirect from `/api/chat` to `/.netlify/functions/chat`
- custom function path `/api/confirmations` for email confirmations

If you want to test the chatbot through the Netlify function layer, use:

```bash
netlify dev
```

Plain `npm run dev` starts the Vite frontend only.

To test form submissions plus confirmation emails locally, prefer:

```bash
netlify dev
```

## Styling

Global styles are organized under [src/styles](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/src/styles):

- `colors.scss`
- `fonts.scss`
- `layout.scss`
- `z-index.scss`

Component-specific styles live next to their components in `src/components/*/*.scss`.

## Assets

- Local fonts are stored in `src/assets/fonts`
- Responsive images and image manifests live under `src/assets`
- Service, hero, about, and project visuals are managed through `responsiveImages`
- Video references are organized under [public/videos](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/public/videos)

### Current Video Folder Convention

Service video placeholders are currently kept only for the active service offer:

- `/public/videos/leistungen/decken-abhaengen`
- `/public/videos/leistungen/waende-stellen`
- `/public/videos/leistungen/estrich-boden`
- `/public/videos/leistungen/dachschraegen`
- `/public/videos/leistungen/sonstiges`

There is no longer a separate `desktop` / `mobil` split in that placeholder structure.

## Notes

- The site uses simple pathname-based page switching inside the React app.
- Cookie consent is stored in `localStorage`.
- The theme preference is stored in `localStorage`.
- The about section already has a real local video file referenced through [src/assets/videoManifest.js](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/src/assets/videoManifest.js).
