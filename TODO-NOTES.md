# Website redesign - follow-up notes

Things we agreed to do later. Update as we go.

## About + Contact merge ("Contact Us")
- **Done (naming only):** the header nav now has a single **Contact Us** item (EN) / **Contact** (FR) / **Kontakt** (DE) pointing to `contact.html`. The separate **About** item was removed from the nav.
- **Not done yet (behaviour):** `about.html`, `fr/about.html`, `de/about.html` still exist as separate pages and are now **orphaned from the header** (still linked from the footer, sitemap, `llms.txt`, internal links and hreflang).
- **To do later:**
  - Decide the real merged page: either fold the About content into `contact.html` (as a section) or build a new "Contact Us" page.
  - Then remove or redirect `about.html` (EN/FR/DE), and update the footer, `sitemap.xml`, `llms.txt`, canonical/hreflang tags and any in-page links to `about.html`.
  - The merged page's `<title>`/meta descriptions need rewriting.

## Header nav naming
- Labels normalised to short nouns, standard-navbar style. EN: Home, Solutions, Managed Services, Licensing, Engineering, Case Studies, Contact Us.
- FR unchanged apart from the merge: Accueil, Solutions, Services manag&eacute;s, Licences, Ing&eacute;nierie, R&eacute;f&eacute;rences, Contact.
- DE: Lizenzierung -> **Lizenzen**, Engineering-Teams -> **Engineering**, Ueber uns + Kontakt -> **Kontakt**. Header labels no longer wrap onto two lines.
- "Managed Services" renamed to **IT Support** (FR: Support IT, DE: IT-Support) because the page is a Microsoft 365 support desk (SLA-based incident handling) plus optional full tenant administration. The page H1 and footer link still say "Support Desk & Managed Services"; align them if wanted.
- The page titles / H1s of `engineering.html` and `licensing.html` may still use the old wording - check consistency.

## Other open items
- Home hero H1 differs by language on purpose (EN: "Build smarter. Secure better. Scale faster."; FR/DE are Microsoft + AI focused). Decide whether EN should match.
- The Contact page still shows a visible developer note under the form ("This form is a front-end demonstration..."). Remove or wire the form before launch.
- Friend's Solutions-page CSS still has a blue left stripe on callouts and a thin top line on offer cards (`.page-modern .callout`, `.page-modern .offer`). Left as-is per merge rule.

## Contact form to Microsoft Bookings (set-up needed)
- The site side is done: `js/main.js` sends the form to `FORM_ENDPOINT`, then redirects to the Bookings page (`BOOKING_URL`). `FORM_ENDPOINT` is **empty**, so for now visitors go straight to Bookings and what they typed in the form is not saved.
- To finish: in Power Automate create a flow "When an HTTP request is received" (any user can call it), then "Send an email (V2)" to business@consultim-it.com. The browser posts JSON as plain text, so read the fields with `json(triggerBody())` (or a Parse JSON step on `string(triggerBody())`). Fields: name, organisation, email, country, topic, message, consent, language, page, sent.
- Copy the flow's HTTP POST URL into `FORM_ENDPOINT` in `js/main.js`. The URL is public in the page source, so keep the flow limited to sending that one email.
- Still needed: a privacy notice (the consent line has no link yet).

## OVH deployment
- Upload the contents of the site into the `www` folder of the OVH hosting. Do NOT upload: `.git`, `README.md`, `TODO-NOTES.md`, `partners/` (originals), `.nojekyll`.
- Upload `.htaccess` too (it is a hidden file: enable "show hidden files" in the FTP client).
- Before uploading `.htaccess`: activate the free SSL certificate for consultim-it.com AND www.consultim-it.com in the OVH control panel and wait until https works. The file redirects http to https and www to non-www (canonical: https://consultim-it.com).
- After https works, uncomment the HSTS line in `.htaccess`.
- Check: https://consultim-it.com/does-not-exist shows the custom 404 page with a 404 status; http:// and www. redirect to https://consultim-it.com.
- After launch: submit sitemap.xml in Google Search Console and Bing Webmaster Tools.
