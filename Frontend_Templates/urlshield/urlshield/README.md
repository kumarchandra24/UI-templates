# URLShield — Fake / Legitimate URL Detector

Open `index.html` (double-click). Works offline, no install, no server.

Pages: Dashboard (3D home) · URL Analyzer · Threat Analytics · Scan History · Help Center
Data:  data/urls_dataset.csv (50 links: 20 legitimate, 15 suspicious, 15 phishing — synthetic test links)
Logic: js/engine.js (feature extraction + weighted rule model, score 0-100; <20 safe, 20-59 suspicious, >=60 phishing)
