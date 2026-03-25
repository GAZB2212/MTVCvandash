# MTVC Van Control System

Dashboard application for the Mobile Tyre Van City power van control system running on a Raspberry Pi 5 with a 7" touchscreen.

## Views

- `/` — Main Panel (800×480px) — Power cabinet touchscreen
- `/cab` — Cab Display (1280×400px) — Windscreen bar screen

## How to Run Locally

```bash
npm run dev
```

or using pnpm from the monorepo root:

```bash
pnpm --filter @workspace/mtvc-dashboard run dev
```

## How to Build for Pi

```bash
npm run build
```

This generates a static bundle in the `dist/` folder.

## How to Copy to Pi

```bash
rsync -av dist/ pi@vanctrl.local:~/vanctrl/ui/
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL for the van control API server. Defaults to `http://localhost:8000` in development and `http://vanctrl.local:8000` in production. |

The app currently uses simulated live data (`useLiveData`). To connect to a real Pi API server, swap to `useApi` in `MainPanel.tsx` and `CabDisplay.tsx`.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Wouter (routing)

## Features

- Dark/light mode toggle
- Live data simulation (2s interval)
- 6 main panel tabs: Inverter, Battery, Air, Fans, Lights, Status
- Interactive fan control with AUTO mode
- Individual lighting zone control (8 zones)
- Emergency button on cab display
- Real-time uptime clock
- Arc gauge components for SOC and PSI
