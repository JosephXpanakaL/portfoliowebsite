# Blessen Portfolio — Manual Editing Guide

## Main files

- `index.html` — all portfolio text, sections, links and image references.
- `public/assets/styles.css` — colours, layout, navigation, responsiveness and animation.
- `public/assets/script.js` — full-screen navigation, sound, contact form and chatbot.
- `public/assets/` — portraits, project artwork and the generated abstract background.

## Common edits

### Change section text

Open `index.html`, find the relevant section ID such as `profile`, `skills`, `work`, `education`, `credentials` or `contact`, then edit the visible text.

### Replace an image

Place the replacement file inside `public/assets/`, then update its `src` in `index.html`. Keep WebP images where possible for speed and clarity.

### Change the full background

Replace `public/assets/professional-abstract-bg.webp` with another landscape WebP using the same filename, or change the URL in the `.site-background` rule near the end of `public/assets/styles.css`.

### Change colours

Edit the CSS variables at the top of `public/assets/styles.css`. The main accent is `--copper`.

## Preview locally

1. Install Node.js.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the address shown in the terminal.

## Publish through GitHub

Upload the extracted files to the root of the GitHub repository, preserving the folder structure. Services such as Vercel can then rebuild the Vite project automatically.
