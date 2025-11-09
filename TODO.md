# TODO: Fix 404 and Service Worker Errors

## Issues Identified
1. **Missing Image**: `abovefooter_.jpg` referenced in `src/app/page.tsx` but file doesn't exist in `public/images/`
2. **Service Worker Cache Failure**: `sw.js` trying to cache invalid URLs like `/static/css/app.css` and `/static/js/app.js` which don't exist in Next.js
3. **Port Mismatch**: App running on 3001 but error mentions 3000

## Plan
- [x] Replace missing image reference with existing image or placeholder
- [x] Update service worker cache URLs to valid Next.js paths
- [x] Test fixes by running dev server and checking console

## Files to Edit
- [x] `src/app/page.tsx`: Change background image URL
- [x] `public/sw.js`: Update urlsToCache array
