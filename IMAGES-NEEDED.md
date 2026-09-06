# Images checklist

Two real photos from the live site are already wired in directly (hero background +
Marci's headshot in the About section) — no action needed for those.

The rest of the site's images are loaded by GoDaddy's site builder via JavaScript, so
they can't be scraped by an automated fetch — you'll need to grab them by hand. It's a
5-minute job:

1. Open https://marcimetzger.com/ in your browser.
2. Right-click each photo you want (gallery photos, service section photos) → "Save
   image as..." → save into this project's `images/` folder.
3. In `js/script.js`, find the `galleryItems` array and swap the relevant `bg:` values
   from a `linear-gradient(...)` string to `url('images/your-file.jpg')`.
4. In `css/styles.css`, find `.service-media--clay`, `.service-media--sage`, and
   `.service-media--gold` and add a `background-image: url('images/your-file.jpg');`
   line to each (keep the gradient as a fallback — it'll just sit behind the photo).
5. If you want real listing photos instead of the sample-data gradients, do the same
   inside the `sampleListings` array in `js/script.js`.

The gradient placeholders were chosen to match the site's palette, so the page looks
intentional even before you swap them — but real photography will read much stronger
for the final submission.
