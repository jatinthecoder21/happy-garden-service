# Happy Garden Service — Website

A fast, mobile-friendly, SEO-optimised website for **Happy Garden Service** (Auckland landscaping & garden maintenance).

Built as a plain static site — **HTML + CSS + vanilla JavaScript**, no build step, no frameworks. That means it loads fast, costs nothing to host, and is easy to edit.

---

## Pages

| File | Page |
|------|------|
| `index.html` | Home |
| `about.html` | About (Ravi & the team) |
| `services.html` | Services (with anchors `#lawn`, `#hedge`, `#weed`, `#planting`, `#blasting`, `#waste`) |
| `portfolio.html` | Gallery (before/after slider + photo grid) |
| `pricing.html` | Pricing + booking/quote form (`#book`) |

```
HappyGardenServices/
├── index.html  about.html  services.html  portfolio.html  pricing.html
├── css/styles.css        ← all styling + design tokens (colours, fonts)
├── js/main.js            ← menu, dropdown, animations, before/after, form
├── assets/
│   ├── favicon.svg       ← logo / favicon (leaf mark)
│   └── images/           ← all photos
├── robots.txt  sitemap.xml
└── README.md
```

---

## ✅ Before it goes live — 3 quick things

### 1. Activate the booking form (2 minutes)
The form currently **falls back to opening the visitor's email app**. To have submissions emailed to you automatically:

1. Go to **https://web3forms.com** → enter **happygarden114@gmail.com** → you'll get an **Access Key** by email (free, no account needed).
2. Open `pricing.html`, find this line near the form:
   ```html
   <form id="booking-form" data-access-key="PASTE-YOUR-WEB3FORMS-ACCESS-KEY-HERE" novalidate>
   ```
3. Replace `PASTE-YOUR-WEB3FORMS-ACCESS-KEY-HERE` with your key. Save. Done — quote requests now land in your inbox.

*(If you deploy to Netlify instead, you can use Netlify Forms — ask and it can be switched over.)*

### 2. Add your real photos (recommended)
The gallery and service photos are **example stock images**. Swap them for your own Auckland jobs:
- Drop your photos into `assets/images/`
- In the HTML, update the `src="assets/images/..."` and the `alt="..."` description to match.
- Best impact: replace the **before/after** images in `portfolio.html` (`forest-cta.jpg` = before, `lush-garden.jpg` = after) with a real transformation.

### 3. Replace the sample reviews
On `index.html` there's a "Kind words" section with **example testimonials**. Swap these for real Google/Facebook reviews once you have them (look for the `NOTE TO OWNER` comment in the file).

---

## Editing common things

- **Phone number:** search all files for `027 275 7419` and `+64272757419` (the `tel:` links).
- **Email:** search for `happygarden114@gmail.com`.
- **Social links:** Instagram/Facebook URLs are in the footer of each page.
- **Prices:** edit the three cards in `pricing.html` (they're marked as "from / guide" prices).
- **Colours & fonts:** all defined once at the top of `css/styles.css` under `:root` (e.g. `--green-800`, `--amber`).

---

## Viewing it locally

Just double-click `index.html` — it opens in your browser.
For the contact form/animations to behave exactly like production, run a tiny local server:

```bash
# from inside the HappyGardenServices folder
python -m http.server 8000
# then open http://localhost:8000
```

---

## Deploying

This is a static site, so any of these work (all have free tiers):

- **GitHub Pages** — push to a GitHub repo → Settings → Pages → deploy from `main` branch, root.
- **Netlify** — drag the folder onto app.netlify.com, or connect the GitHub repo.
- **Vercel** — import the GitHub repo (framework preset: "Other").

After deploying, point the domain (when purchased) at the host, and update the `https://www.happygardenservice.co.nz/` URLs in the `<link rel="canonical">`, Open Graph tags, `sitemap.xml` and `robots.txt` if the final domain differs.

---

## SEO notes
- Each page has a unique `<title>`, meta description, canonical URL and Open Graph tags.
- The home page includes **LocalBusiness (LandscapingBusiness) structured data** for Google — helps with local search & Google Ads quality.
- `sitemap.xml` + `robots.txt` are included. Submit the sitemap in **Google Search Console** once live.
- For Google Ads: the clear single goal (call / free quote), fast load, and mobile-friendliness all help the landing-page experience score.

---

*Built with the client brief in mind: clean & minimal, natural green palette, large readable text and tap targets for an older audience, and a single clear call-to-action — get a FREE quote.*
