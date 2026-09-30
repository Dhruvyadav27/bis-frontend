# BIS Smart Assist — frontend

React (Vite) + Tailwind CSS frontend for the BIS Smart Assist (SIH 26107).
The UI is designed for the BIS Smart Assist experience. Authentication uses the configured backend, while Google Sign-In uses Google Identity Services when `VITE_GOOGLE_CLIENT_ID` is present.

## Getting started

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173.

## Notes

- All `src/api/*.js` modules run in mock mode (`MOCK_MODE = true` in `src/api/axiosInstance.js`).
  Each mock function mirrors the exact request/response shape a real backend would use — flip
  `MOCK_MODE` to `false` once the backend is ready and set `VITE_API_BASE_URL`.
- Auth state and journey progress live in Zustand stores (`src/store`).
- The floating AI assistant widget is mounted once in `src/App.jsx`, outside the route switch,
  so it's present on every page and always aware of the current route/step.
- `Complete guide` is intentionally static — no forms, no dynamic AI responses.
- Renewal/licence-status tracking is out of scope and not implemented.


## Google Sign-In

1. Copy `.env.example` to `.env`.
2. Set `VITE_GOOGLE_CLIENT_ID` to a Google OAuth 2.0 Web Client ID.
3. Add your local/deployed frontend origin to the OAuth client's **Authorized JavaScript origins**.
4. Ensure the backend exposes `POST /auth/google` and verifies the returned Google ID token.

The login screen waits for the Google Identity Services script to load before rendering the button, so the button no longer fails simply because the script is loaded asynchronously.
