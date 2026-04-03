# Trockenbau Prima Vista

Marketing website for **Trockenbau Prima Vista**, built with React and Vite. The site presents the company’s services, company profile, project references, contact details, a cookie consent UI, and an AI-powered chatbot backed by a Netlify Function.

## Stack

- React 19
- Vite 8
- Sass
- Lucide React
- Font Awesome
- Netlify Functions
- OpenAI API

## Site Structure

The app is organized into these main sections in [src/App.jsx](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/src/App.jsx):

- `Navbar`
- `Hero`
- `Services`
- `About`
- `Projects`
- `Contact`
- `Footer`
- `Chatbot`
- `CookieBanner`

## Project Structure

```text
.
├── netlify/
│   └── functions/
│       └── chat.js
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── styles/
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

Vite runs on `http://localhost:5173` and is configured to open the browser automatically.

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

## Chatbot

The chatbot UI lives in [src/components/Chatbot/Chatbot.jsx](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/src/components/Chatbot/Chatbot.jsx) and the backend handler lives in [netlify/functions/chat.js](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/netlify/functions/chat.js).

Current behavior:

- Replies in German
- Uses company context for Trockenbau, Sanierung, Renovierung, and Innenausbau
- Encourages visitors to get in touch for quotes and project inquiries
- Sends requests to a Netlify Function that calls the OpenAI API

## Netlify

This project includes [netlify.toml](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/netlify.toml) with:

- build output set to `dist`
- functions directory set to `netlify/functions`
- redirect from `/api/chat` to `/.netlify/functions/chat`

If you want to test the chatbot locally through the Netlify function layer, use Netlify Dev instead of plain Vite:

```bash
netlify dev
```

Plain `npm run dev` starts the Vite frontend only.

## Styling

Global styles are organized under [src/styles](/Users/louisclarencepetersgmail.com/Projects/trockenbau-primavista/src/styles):

- `colors.scss`
- `fonts.scss`
- `layout.scss`
- `z-index.scss`

Component-specific styles live next to their components in `src/components/*/*.scss`.

## Assets

- Local fonts are stored in `src/assets/fonts`
- Active content images are organized in `src/assets/images/about`, `src/assets/images/hero`, `src/assets/images/services`, and `src/assets/images/projects`
- Reference photos are grouped by subject in `src/assets/images/reference/ceilings`, `src/assets/images/reference/framing`, `src/assets/images/reference/interiors`, and `src/assets/images/reference/windows`
- The logo is stored in `src/assets/logo.png`

## Notes

- The site is currently content-driven and mostly static aside from the chatbot and cookie consent state.
- Cookie consent is stored in `localStorage`.
- The contact form is presentational at the moment and does not submit to a backend.
