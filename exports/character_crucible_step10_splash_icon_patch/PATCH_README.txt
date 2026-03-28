Character Crucible Step 10 splash + icon patch

Files included:
- index.html
- assets/css/app.css
- assets/js/app.js
- assets/js/app.bundle.js
- assets/img/icons/favicon.ico
- assets/img/icons/favicon-32x32.png
- assets/img/icons/favicon-16x16.png
- assets/img/icons/apple-touch-icon.png
- assets/video/Animating_Flames_and_Lighting_in_Image.mp4

Notes:
- Icons live in assets/img/icons and are linked with relative paths for subpath-safe hosting.
- The splash keeps the existing 8 second timing.
- The splash now uses a single fixed video plate only, with no visible image fallback path, no poster image, and no media swap classes.
- The movie frame stays stable from first render through fade-out, and a true playback failure now leaves a blank splash plate instead of switching layouts.
