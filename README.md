# Gender Reveal — React (Vite) + Tailwind + Framer Motion

## Local Dev
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

The production assets will be in `dist/`.

## Deploy to **Azure Static Web Apps**
1. Push this repo to GitHub (or Azure Repos).
2. In the Azure Portal, create **Static Web App** → Build Presets: **Vite**.
3. App location: `/`  
   Build command: `npm run build`  
   Output location: `dist`
4. Azure will add a GitHub Action. On push, it will build and deploy.
5. (Optional) You can also zip `dist/` and upload via the **Azure Static Web Apps CLI** or configure a pipeline yourself.

This project includes a `staticwebapp.config.json` for SPA routing.
