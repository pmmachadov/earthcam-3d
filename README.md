# US Live Cams 🇺🇸

A modern, responsive real-time web application to explore live nature, wildlife, coastal, and iconic city webcams across the United States.

Built with **React 19**, **TypeScript**, and **Vite** following clean Model-View-Controller (MVC) frontend architecture principles.

---

## 🌟 Key Features

- **🔴 20 Verified 24/7 Live Streams**: Real, non-recorded live broadcasts featuring Alaska brown bears, Monterey Bay sea otters, bald eagle nests, Florida manatees, tropical beaches, and iconic landmarks.
- **⚡ Real-Time Live Thumbnails**: Cards display actual live video snapshot frames dynamically provided by YouTube stream feeds (`hqdefault_live`).
- **🔍 Instant Search & Instant Filtering**: Full-text location, animal, and landmark search with category pills (*Wildlife*, *Beaches*, *Marine*, *Parks & Nature*, *City Skylines*).
- **❤️ LocalStorage Favorites Watchlist**: Save your favorite live streams for quick access; state persists across browser reloads.
- **🛡️ Player Resilience & Error Detection**: Dynamic detection of playback restrictions via the YouTube IFrame API and HTML postMessage events, featuring a direct fallback action button to open feeds on their official channels.
- **🤖 Built-in Stream Health Checker**: Run `pnpm check:cams` to automatically verify the liveliness and embeddability of every camera in the catalog.

---

## 🗂️ Project Architecture

```
src/
├── models/                     # Data definitions & catalog
│   ├── webcam.types.ts         # TypeScript interfaces & domain types
│   └── mockWebcams.ts          # Curated list of 20 verified live streams
├── views/                      # Presentation layer
│   └── components/
│       ├── Header/
│       │   └── Navbar.tsx      # Sticky brand bar, search & category filters
│       ├── Card/
│       │   └── WebcamCard.tsx  # Responsive live stream card with hover telemetry
│       └── Player/
│           └── WebcamModal.tsx # Fullscreen video player modal & fallback handler
├── App.tsx                     # Main controller coordinating search, filters & state
└── main.tsx                    # React application bootstrap
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (tested on Node v20/v22/v24)
- **pnpm** (recommended) or npm/yarn

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/pmmachadov/us-live-cams.git
cd us-live-cams

# Install dependencies
pnpm install
```

### 2. Run Locally

```bash
pnpm dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Verify All Streams Live Status

```bash
pnpm run check:cams
```

This runs our automated health check script against YouTube's playability status API and reports the exact live and embed status of all 20 cameras:

```
🔍 Checking US Live Cams status...
✅ Brooks Falls Brown Bears             [live=yes, embed=yes]
✅ Decorah Eagles North Nest (4K)       [live=yes, embed=yes]
✅ Monterey Bay Sea Otter Cam           [live=yes, embed=yes]
...
📊 Summary: 20/20 cameras active and verified.
```

### 4. Build for Production

```bash
pnpm run build
```

---

## ☁️ Deployment

This project includes a pre-configured [`vercel.json`](./vercel.json) ready for instant zero-config deployment on **Vercel**:

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `us-live-cams` repository.
4. Framework Preset will automatically detect **Vite**.
5. Click **Deploy**.

---

## 📡 Live Stream Partners & Sources

All streams are non-commercial public feeds broadcast by conservation organizations, state parks, and coastal services:

- **[explore.org](https://explore.org)**: Katmai National Park Brown Bears, Decorah Bald Eagles, Silver Springs Manatees, Wolf Center.
- **[Monterey Bay Aquarium](https://www.montereybayaquarium.org)**: Sea Otters, Giant Kelp Forest, Coastal Bay.
- **[EarthCam](https://www.earthcam.com)**: Statue of Liberty, Brooklyn Bridge, New Orleans Bourbon Street, Washington Monument.
- **[PTZtv](https://www.portfever.com)**: Fort Lauderdale Beach, Key West Historic Harbor.

---

## 📄 License

MIT © [pmmachadov](https://github.com/pmmachadov)
