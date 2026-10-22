# ODS Consulting Website

The official website of **ODS Consulting**, a business performance
management consultancy (IBM Planning Analytics / TM1 and Microsoft
Power BI) based in Umhlanga Ridge, South Africa.

**Built in-house by ODS Consulting.**
Copyright (c) 2026 ODS Consulting. All rights reserved. ODS Consulting
reserves all rights in the source code and all code related to this
website. See [LICENSE](LICENSE). No permission is given to copy, reuse or
modify any part of it without ODS Consulting's written consent.

Live site: https://www.odsconsulting.tech/

---

## What it is

A static website: plain HTML, CSS and vanilla JavaScript. There is no
build step, no framework and no server code, so it can be hosted on any
ordinary web hosting (it is hosted with domains.co.za; GitHub Pages is
used for internal review).

## Files

```
index.html           Home
about.html           About ODS
why-ods.html         Why ODS (X-Factor tabs, client logos and testimonials)
our-values.html      Our Values and Mission
services.html        Services (3D Consulting, Training, Support, How We Work)
solutions.html       Solutions (Planning Analytics, Power BI, Data Automation)
contact.html         Contact page and form
privacy-policy.html  Privacy Policy
knowledge-hub.html   Hidden for now (not in the menu, not in the sitemap)
styles.css           All styling
script.js            All behaviour (menus, tabs, pop-ups, form, pop-in)
sitemap.xml          For search engines
robots.txt           For search engines
Assets/              Images, logos and icons
```

Keep every file in the same top-level folder, with `Assets/` next to
`index.html`.

## Common edits

- **Text:** edit the matching `.html` file. Page titles and descriptions
  are at the top of each file.
- **Colours and fonts:** the brand colours are defined at the top of
  `styles.css`. The font is Roboto (Google Fonts).
- **Images:** replace the file in `Assets/` using the same file name.
  Keep photos under about 300 KB so pages stay fast.
- **Testimonials:** client testimonials are in `why-ods.html` (the list
  and the client logo pop-ups). The timed mail pop-in on the home page
  has its own copy of the quotes in `script.js`.
- **Mail pop-in (home page):** timings and wording are at the top of the
  "MAIL POP-IN" section at the end of `script.js`.
- **Menus:** the top navigation and side menu are repeated in each HTML
  file, so change a menu item on every page.
- **Social links:** LinkedIn is set. Instagram and Facebook icons are
  placeholders (`href="#"`) until those accounts exist.

## Contact form and security

- The contact form sends through **Formspree**, protected by **Google
  reCAPTCHA**. The reCAPTCHA site key is in `contact.html`. The secret key
  is kept only in the Formspree dashboard and must never be put in this
  repository.
- The live domain must be listed in the reCAPTCHA admin for the captcha
  to work.
- A cookie notice is shown on the first visit. The privacy policy
  explains the cookies used.

## Going live checklist

1. Upload all files and the whole `Assets/` folder to the hosting root.
2. Check that the site opens at https://www.odsconsulting.tech/.
3. Test the contact form and reCAPTCHA.
4. Test the LinkedIn links.
5. Add the site to Google Search Console and submit
   `https://www.odsconsulting.tech/sitemap.xml`.
6. Run PageSpeed Insights and the Rich Results Test.

## Search engine setup

Each page has a title, description, canonical address and social
sharing tags. The home page includes structured business data. When a
page is added or removed, update `sitemap.xml`.

## Contact

ODS Consulting, SPACES Umhlanga, 2 Ncondo Place, Ridgeside,
Umhlanga Ridge, 4319, South Africa
hello@odsconsulting.tech
