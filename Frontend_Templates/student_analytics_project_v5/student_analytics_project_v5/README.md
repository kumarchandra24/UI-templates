# Student Analytics & Data Visualization Project (v5 – International UI + 3D)

A complete, exam-ready, multi-page website with:

- **International-level home page** with heavy animations and 3D elements
- **New “Student Results” page** for full student overview
- Protected teacher-only pages
- Advanced analytics and settings

## What’s New in v5

### 1. International-Level Home Page

- Modern hero section with:
  - Animated gradient background
  - Floating 3D cube (pure CSS, no external libraries)
  - Smooth fade/slide animations
- Clear value propositions:
  - “For Educators” and “For Students” sections
  - Feature cards with rich descriptions
- No student table on home page (cleaner, more professional look)

### 2. New Page: Student Results (`results.html`)

- Contains the full **Students Overview** table
- Search and filter by:
  - Name
  - Roll No
  - Admission No
- Click any row to open detailed student result (`student.html`)

### 3. 3D and Animation Enhancements

- Rotating 3D cube on home page with labels: Analytics, Results, Insights, etc.
- Cards with 3D hover effects (tilt on hover)
- Animated background blobs (gradient orbs) on all pages
- Smooth fade-in and slide-up animations for sections

### 4. Dark, Modern Theme

- Dark background with gradient overlays
- High-contrast text and accents
- Professional, “product-level” UI suitable for presentations and demos

### 5. All Previous Features Retained

- Analytics with per-exam and all-exams graphs
- Teacher Dashboard (protected)
- Login page
- Settings with authentication options, public/private access, download/print toggles

## Teacher Credentials

- **Username:** `teacher_admin`  
- **Password:** `Exam@2025`

Use these on the **Login** page to access Teacher Dashboard and Settings.

## Pages

1. `index.html` – International-level home page (no student table)  
2. `results.html` – Student Results (full overview table + search)  
3. `student.html` – Individual student detail  
4. `analytics.html` – Analytics with per-exam and all-exam graphs  
5. `teacher.html` – Advanced teacher dashboard (protected)  
6. `login.html` – Teacher login  
7. `settings.html` – Teacher panel (protected)

## Running Locally

1. Unzip this folder.
2. Open `index.html` in a browser.
3. Navigate through the menu:
   - Home → modern landing page
   - Student Results → full student list with search
   - Analytics → class-wide charts
   - Teacher Dashboard (login required)
   - Settings (login required)

## Technologies

- HTML, CSS, JavaScript (vanilla)
- Chart.js for interactive data visualization
- LocalStorage for simple login state and settings
- Pure CSS 3D transforms and animations (no external 3D libraries)

## Customization

- Edit `js/data.js` to change student records.
- Modify `css/style.css` for themes, colors, and animations.
- Extend `js/auth.js` to integrate with a real backend authentication system.
