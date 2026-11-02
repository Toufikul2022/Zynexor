# Zynexor

Website for Zynexor, a digital brand and product design agency.

A static site (plain HTML, CSS and JavaScript, no build step):

| Page | File |
| --- | --- |
| Home | `index.html` |
| Services | `services.html` |
| Cases | `cases.html` |
| Blog | `blog.html` |
| Article | `article.html#<article-id>` |

Shared styles live in `site.css`, shared behaviour and content (case galleries, blog articles) in `site.js`.
Portfolio visuals are looping MP4 videos in `assets/video/`, with still posters in `assets/work/`.

## Before going live

Edit the settings at the top of `site.js`:

- `EMAIL`: the contact address shown across the site
- `FORM_ENDPOINT`: a form service URL (for example Formspree) so the contact form sends messages
- `SOCIAL`: links to your Instagram, Behance, Facebook, X and LinkedIn profiles

## Run locally

```bash
npx serve .
```

## Deploy

The site deploys to Vercel as-is: import this repository in Vercel, keep the framework preset as **Other**, and leave the build command and output directory empty. `vercel.json` enables clean URLs (`/services` instead of `/services.html`) and long-term caching for `assets/`.
