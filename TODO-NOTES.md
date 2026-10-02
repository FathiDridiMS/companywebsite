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
- Home page `<title>`, meta descriptions and the "An AI-driven Microsoft partner..." sentence (`index.html`, FR, DE) still use the "AI-driven" wording.
