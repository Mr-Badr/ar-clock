---
name: google-ads-compliance
description: "Google Ads landing page quality and compliance rules. Use when building or improving any page that receives Google Ads traffic, reviewing landing page quality score, or fixing Below Average landing page experience. Covers: message match, content requirements, trust pages, mobile performance, Quality Score."
---

# Google Ads Compliance

## 1. Why This Skill Exists
- Google Ads rejects or limits campaigns based on landing page quality — a good ad pointing to a poor page will not serve or will be severely throttled
- Since February 2025, Google's AI prediction model evaluates landing page quality BEFORE the page receives any traffic — a new page can receive a "Below Average" quality score with zero impressions
- Poor landing page experience results in 47% higher CPC and 23% lower ad visibility compared to "Above Average" pages
- "Above Average" landing page experience combined with strong ad relevance produces CPCs 36% below average — quality compliance is directly financial
- Google's AI Max campaigns use the landing page content to determine which search queries to match ads against — a thin page limits the AI's ability to find relevant traffic

## 2. Message Match — The Most Critical Factor
- Message match means the landing page must directly deliver what the ad headline promised
- If the ad says "تجربة مجانية لمدة 30 يوم", the landing page must immediately show and offer a 30-day free trial — any disconnect causes immediate distrust and a lower quality score
- The page H1 heading must mirror or closely rephrase the ad headline — this is the single most impactful change for improving Quality Score
- Never send Google Ads traffic to a homepage — homepages have 20+ navigation options and address no specific intent, which Google's 2025 model explicitly penalizes as "navigation friction"
- Every ad group should have a dedicated landing page — generic pages that serve multiple ad groups rank poorly for all of them

## 3. Content Requirements for Landing Pages
- Minimum 400 words of original, substantive content that directly addresses the intent behind the ads pointing to this page
- Content must be specific to the offer: who it is for, what it does, what the user gets, how it is different from alternatives
- Generic marketing copy ("the best solution for your needs", "we help businesses grow") is flagged as thin content — it does not score well because it applies to any competitor equally
- Include real, specific proof: actual numbers, real customer names or logos, specific outcomes — vague social proof ("thousands of satisfied customers") is now weighted much lower than specific proof
- Content must be visible on the page itself — content in modals, tabs, or collapsible sections that does not appear on initial load carries less weight in quality evaluation

## 4. Trust and Transparency Requirements
- Privacy Policy page must exist, be accessible from the landing page footer, and describe specifically how user data is collected and used
- A blank, placeholder, or auto-generated privacy policy will fail review — the policy must match what the page actually does
- About Us page must exist and describe the real business — hidden or missing About pages signal low credibility
- Contact information must be present and functional — at minimum a contact form or email address; a phone number significantly improves trust scores in Arabic markets
- Never use hidden fees, price obfuscation, or asterisks leading to terms that change the offer — pricing transparency is now an explicit factor in Google's 2025 landing page evaluation model
- Popups that fire on page load (especially those that block content or require dismissal before reading) are penalized — especially intrusive interstitials on mobile

## 5. Navigation Must Be Present and Clear
- The landing page must have functional navigation — users must be able to leave and explore the site
- A page with no header, no navigation, and no internal links is classified as a "doorway page" — it will be rejected
- Provide at minimum: a logo linking to the homepage, a link to the Privacy Policy, and a link to a Contact or About page
- The primary CTA must be clearly identifiable — one prominent action per landing page; multiple competing CTAs reduce conversion and quality score
- Do not use dark patterns: fake countdown timers, false "limited availability" claims, or deceptive button labels that confuse the user about what they are agreeing to

## 6. Mobile Performance Is a Quality Score Component
- Google's Quality Score explicitly includes mobile performance — a page that scores well on desktop but poorly on mobile will receive a below-average landing page rating
- 1-second delay in mobile load time reduces conversions by 20% — LCP must be under 2.5 seconds on a 4G mobile connection
- Text must be readable without zooming — minimum 16px body text, ideally 18px for Arabic
- Buttons and form fields must be large enough to tap accurately — 44×44px minimum
- Never use full-page overlays or bottom sheets that appear on mobile load — they trigger Google's intrusive interstitial penalty
- Test the landing page using Google's Mobile-Friendly Test before launching any campaign

## 7. Ad-to-Page Content Alignment
- The primary keyword or topic of your ad must appear in the page H1, in the first paragraph, and in at least two sub-headings
- This is not keyword stuffing — it is semantic alignment that confirms to Google's crawler that the page actually covers the topic the ad promised
- Never use keyword stuffing (repeating the same keyword 15 times) — it is detected and penalized
- The page language must match the ad language — an Arabic ad pointing to a page with primarily English content will perform poorly

## 8. What Causes Immediate Rejection
- Landing pages that return HTTP errors (500, 503) or take too long to load — the ad is disapproved immediately
- Pages that download files automatically on arrival
- Pages that display full-screen popups, alerts, or permission requests before the content is visible
- Pages with content that violates Google's core policies: counterfeit goods, dangerous products, deceptive practices, adult content
- Pages that are clearly scraped, auto-generated, or copied from other sites — duplicate content detection is active
- Pages that impersonate another brand or domain
- Pages that collect personal information with no Privacy Policy

## 9. What Causes Slow Degradation
- Content that does not change or improve over time — Google re-crawls landing pages continuously and rewards improvement
- Pages with high bounce rates and very low time-on-page — these behavioral signals feed back into Quality Score
- Pages that are relevant to the ad but fail to convert — Google infers conversion rate indirectly and rewards pages that turn clicks into outcomes
- Inconsistent message between the ad, the keyword, and the page — even a technically compliant page that feels disconnected to a user will perform poorly

## 10. Ongoing Compliance Maintenance
- Google re-evaluates landing page quality on a rolling basis — improvement takes 2–4 weeks to reflect in Quality Score
- Check Google Ads Quality Score and Landing Page Experience columns weekly while campaigns are active
- A drop in Quality Score with no change to the ad usually means the landing page content has become stale, competitive, or is now loading slowly
- Any change to the landing page — especially removing content, removing trust signals, or adding heavy scripts — must be followed by a Quality Score check within 7 days
- For accounts running Arabic-language campaigns, test the landing page experience with an Arabic-language browser locale — some layout and font rendering issues only appear in this context