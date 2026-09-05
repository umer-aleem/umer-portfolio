# Muhammad Umer — Personal Website (Standard palette)

This is the **standard** version — warm off-white, deep charcoal, and a muted teal accent.
A second package, **vibrant/high-contrast**, uses the same layout and content with a bolder black/white/coral-cyan palette for comparison.

A static, no-build personal brand site for Muhammad Umer (Principal Data Engineer), built to link from Upwork, Toptal, and LinkedIn.

It's plain HTML/CSS/JS — nothing to install, nothing to build. You can host it on GitHub Pages for free in a few clicks, entirely from the GitHub website.

## Files

```
index.html          → homepage (hero, expertise, projects, architecture, journey, testimonials, contact)
experience.html      → full career experience detail
testimonials.html    → full testimonials page
style.css            → all styling
script.js            → nav, contact modal, project accordion, AI chat demo
assets/umer-portrait-mono.jpg → your photo, used in the About section
```

## Publish it on GitHub Pages (no local install needed)

1. Go to [github.com](https://github.com) and log in (create a free account if you don't have one).
2. Click the **+** icon top-right → **New repository**.
   - Name it something like `my-portfolio` or `umer-portfolio`.
   - Set it to **Public**.
   - Click **Create repository**.
3. On the new repo's page, click **"uploading an existing file"** (or Add file → Upload files).
4. Drag in all the files from this folder — `index.html`, `experience.html`, `testimonials.html`, `style.css`, `script.js`, and the `assets` folder with the photo inside it. Keep the same folder structure (the image must stay inside a folder named `assets`).
5. Click **Commit changes**.
6. In the repo, go to **Settings → Pages** (left sidebar).
7. Under **Build and deployment → Source**, choose **Deploy from a branch**.
8. Under **Branch**, choose `main` and folder `/ (root)`, then **Save**.
9. Wait about a minute, then refresh the page — GitHub will show you a live URL, usually:
   `https://your-username.github.io/your-repo-name/`

That link is what you put on Upwork, Toptal, and LinkedIn.

## The contact form

The "Let's Talk" button opens a pop-up contact form. It sends messages straight to **umeraleem1001@gmail.com** using [FormSubmit](https://formsubmit.co) — a free service that emails form submissions with no backend or server needed.

**One-time step:** the first time someone submits the form, FormSubmit will send a confirmation email to your inbox asking you to activate that form endpoint. Open that email and click "Activate" — after that, every future submission goes straight to your inbox. You can test this yourself as soon as the site is live: fill out the form once with your own details.

## Updating content later

Everything is in plain HTML, so you can edit text directly in `index.html`, `experience.html`, or `testimonials.html` using GitHub's built-in editor (click the pencil icon on any file in your repo) — no local setup required. Colors, fonts, and spacing all live in `style.css`.
