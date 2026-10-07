# FlowSight Traffic Command Center

**Contributor:** Hanuma  
**UI Topic:** Analytics & Data Visualization — Traffic Dashboard

## What this project is

FlowSight is a responsive traffic operations dashboard designed as a modern UI template for monitoring a smart-city road network.

## Research

Modern traffic-control dashboards commonly use:
- KPI cards for network health
- Live traffic maps
- Color-coded congestion states
- Time-series charts
- Incident queues
- Camera monitoring
- Route optimization
- Filtering and search
- Reports and operational settings

This implementation combines these patterns into one command-center interface while using an original visual design.

## Fully implemented sections

### 1. Overview
- Network KPIs
- Traffic volume chart
- 24H / 7D / 30D switching
- Live network map
- Clickable junction pins
- Zoom and center controls
- Junction performance
- Recent incidents
- Refresh
- CSV export

### 2. Junctions
- Search junctions
- Filter by status
- Add junction
- Junction management modal
- Signal optimization interaction

### 3. Incidents
- Search incidents
- Filter Open/Resolved
- Create incident
- Resolve incident
- Reopen incident
- Dynamic incident count

### 4. Routes
- Route cards
- Route health
- Travel time
- Delay information
- Route details
- Route optimization

### 5. Cameras
- Camera grid
- Search
- Live-feed simulation
- Camera settings
- Snapshot interaction
- Network scan

### 6. Analytics
- Vehicle volume
- Peak congestion
- Network efficiency
- Bar chart
- Vehicle distribution visualization
- Analytics export

### 7. Reports
- Multiple report templates
- Generate report
- CSV download

### 8. Settings
- Functional toggle controls
- Live refresh
- Notifications
- Sound alerts
- Compact tables
- Auto-center
- Privacy mode
- System test

### 9. Global features
- Responsive mobile sidebar
- Collapsible desktop sidebar
- Light/dark theme
- Notifications modal
- Operator profile
- Toast feedback
- Responsive design

## Technologies

HTML5, CSS3, Vanilla JavaScript and SVG.

No framework or build tool is required.

## Folder

```text
traffic-dashboard/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Run

Open `index.html` in Chrome, Edge or another modern browser.

## GitHub workflow

```text
Fork → Clone → Branch → Develop → Commit → Push → Pull Request → Review → Merge
```

Suggested branch:

```bash
git checkout -b feature/hanuma-traffic-command-center
```

Suggested commit:

```bash
git add .
git commit -m "feat: build fully interactive traffic command center"
git push origin feature/hanuma-traffic-command-center
```

## Original implementation

The UI is an original implementation based on common traffic analytics and command-center interaction patterns. It is not a copy of a specific website.
