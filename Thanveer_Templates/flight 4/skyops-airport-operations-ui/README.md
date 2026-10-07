# SkyOps — Airport Operations Control Center

## Team Project
**UI Topic:** Airport Operations Control Center

**Demo user:** Mr. Tyler Durden — Operations Lead

## Overview
SkyOps is a responsive airport operations dashboard designed for an operations lead who needs one place to monitor flights, gates, aircraft turnaround, incidents, staff and operational reports.

## Research / Design Rationale
Airport operations interfaces commonly combine high-density data tables, status indicators, gate/stand allocation, alerts and task progress. Modern operational UIs increasingly emphasize:
- Real-time status visibility
- Priority-based alerts
- Dense but scannable information
- Progressive disclosure through separate operational views
- Fast actions for incidents and resource assignment
- Clear visual states rather than decorative UI

This implementation adds a unified dark control-center experience, a live-style flight board, automatic stand assignment, incident creation/resolution, turnaround checklists, team roster, report export, filters and responsive mobile navigation.

## Implemented UIs
1. Operations Overview
2. Live Flight Board
3. Gates & Stands
4. Turnaround Control
5. Alerts & Incidents
6. Operations Team
7. Reports & Export
8. Settings

## Technologies
- HTML5
- CSS3
- Vanilla JavaScript
- No framework or external UI library required

## Run locally
Open `index.html` in a modern browser.

Optional local server:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

## GitHub Collaboration Workflow
Recommended contribution flow:
1. Fork repository
2. Clone fork
3. Create a feature branch
4. Implement one UI contribution
5. Commit with a meaningful message
6. Push branch
7. Open Pull Request
8. Review another member's PR
9. Respond to review feedback
10. Merge after approval

Example:
```bash
git checkout -b feature/flight-board
git add .
git commit -m "feat: add responsive airport flight board"
git push -u origin feature/flight-board
```

## Suggested Team Split
- Member 1: Overview + navigation
- Member 2: Flight Board + filters
- Member 3: Gates + turnaround
- Member 4: Alerts + incident workflow
- Member 5: Reports + responsive QA + README

## Screenshots
Add screenshots of the Overview, Flight Board, Gates and Alerts views to the final repository README.

## Originality
This project is an original implementation intended for educational use. It uses common airport operations patterns without copying a specific commercial website.
