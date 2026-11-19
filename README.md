# Zynexor

Live at https://www.zynexor.com (deployed on Vercel).

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

- `EMAIL`: the contact address shown across the site (currently infozynexor@gmail.com)
- `FORM_ENDPOINT`: where contact-form messages go (FormSubmit, delivering to infozynexor@gmail.com)
- `CALENDLY`: the booking link opened by every "Book a call" button
- `SOCIAL`: links to your Instagram, Behance, Facebook, X and LinkedIn profiles

## Run locally

```bash
npx serve .
```

## Deploy

The site deploys to Vercel as-is: import this repository in Vercel, keep the framework preset as **Other**, and leave the build command and output directory empty. `vercel.json` enables clean URLs (`/services` instead of `/services.html`) and long-term caching for `assets/`.

## Blog articles and SEO

Articles are written in `site.js` (the `ARTICLES` list). After adding or editing one, run:

```bash
node scripts/build-seo.js
```

This regenerates a static, indexable page for each article at `blog/<id>.html` (served as `/blog/<id>`) and updates `sitemap.xml`. Also add the new article to the Blog list in `llms.txt`.
