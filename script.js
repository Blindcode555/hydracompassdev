/**
 * ════════════════════════════════════════════════════════════════
 *  ATM Navigator — Idea Operating System
 *  script.js — Mission Control Logic
 *
 *  Sections:
 *   A · CONFIG DATA  — types, levels, budgets, crew
 *   B · WORKFLOW LIBRARY — 12 mission variants with all content
 *   C · CLASSIFIER ENGINE — keyword scoring system
 *   D · DOM BUILDERS — populate filter grids
 *   E · STATE MANAGEMENT — filter sync + status readout
 *   F · RENDER ENGINE — mission banner, nodes, scripts, output
 *   G · EVENT WIRING — all click / input handlers
 *   H · UTILITIES — boot, clock, counter, nav
 * ════════════════════════════════════════════════════════════════
 */

'use strict';


/* ════════════════════════════════════════════════
   A · CONFIG DATA
════════════════════════════════════════════════ */

/* Lucide icon names — rendered via lucide.createIcons() after DOM build */
var MISSION_TYPES = [
  { id:'content',  ico:'video',       label:'Video'    },
  { id:'audio',    ico:'mic',         label:'Audio'    },
  { id:'writing',  ico:'pen-line',    label:'Writing'  },
  { id:'business', ico:'briefcase',   label:'Business' },
  { id:'coding',   ico:'code-2',      label:'Coding'   },
  { id:'auto',     ico:'zap',         label:'Automate' },
  { id:'research', ico:'search',      label:'Research' },
  { id:'social',   ico:'share-2',     label:'Social'   },
];

var CLEARANCE_LEVELS = [
  { id:'explorer',  ico:'compass',   label:'Explorer',  sub:'New to AI'   },
  { id:'builder',   ico:'wrench',    label:'Builder',   sub:'Experienced' },
  { id:'architect', ico:'landmark',  label:'Architect', sub:'Power user'  },
];

var RESOURCE_BUDGETS = [
  { id:'free',    ico:'heart',        label:'Free',         sub:'No spend'    },
  { id:'startup', ico:'trending-up',  label:'Startup',      sub:'$10–60 /mo'  },
  { id:'pro',     ico:'star',         label:'Professional', sub:'$60+ /mo'    },
];

/* Maps planet/category → default workflow variant */
var PLANET_DEFAULTS = {
  content:'youtube', audio:'podcast', writing:'newsletter',
  business:'saas', coding:'webapp', auto:'nocode_auto',
  research:'research', social:'social',
};

/* Crew directory — placeholder data */
var CREW = [
  { name:'Aiden Flux',   handle:'@aiden_flux',  avatar:'🧑‍💻', role:'builder',   rank:'Builder',
    skills:['AI Prompts','Python','Automation'], missions:32, rating:4.9 },
  { name:'Mira Chen',    handle:'@mira_builds', avatar:'👩‍🎨', role:'architect', rank:'Architect',
    skills:['Content','YouTube','Strategy'],     missions:67, rating:5.0 },
  { name:'Dev Okafor',   handle:'@dev_ok',      avatar:'👨‍🚀', role:'explorer',  rank:'Explorer',
    skills:['SaaS','Validation','GTM'],          missions:8,  rating:4.7 },
  { name:'Sofia Ramos',  handle:'@sofiaramos',  avatar:'👩‍🔬', role:'builder',   rank:'Builder',
    skills:['Research','Writing','Newsletters'], missions:24, rating:4.8 },
  { name:'Luca Tanaka',  handle:'@luca_t',      avatar:'🧑‍🎤', role:'builder',   rank:'Engineer',
    skills:['Social Media','Video','TikTok'],    missions:41, rating:4.9 },
  { name:'Priya Nair',   handle:'@priya_arch',  avatar:'👩‍💼', role:'architect', rank:'Master Architect',
    skills:['Systems','No-Code','Make.com'],     missions:89, rating:5.0 },
];


/* ════════════════════════════════════════════════
   B · WORKFLOW LIBRARY
   12 variants. Each: { planet, icon, label, tags,
   steps[6]: { n, name, tool, time, desc, prompt },
   output: { title, desc, items[] } }
   Prompts use {IDEA} — replaced at render time.
════════════════════════════════════════════════ */

var WORKFLOWS = {

  /* ── YOUTUBE ─────────────────────────────────── */
  youtube:{
    planet:'content', icon:'🎬', label:'AI YouTube Channel',
    tags:['YouTube','Video','AI Production'],
    steps:[
      {n:'01',name:'Topic Research',tool:'Perplexity AI',time:'1–2 hrs',
       desc:'Identify high-demand, low-competition topics. Target search intent, not just view counts.',
       prompt:'Research YouTube content opportunities for: "{IDEA}"\n\n1. Top 10 questions people search on this topic (with intent: informational / transactional)\n2. Five underserved angles no large channel has covered well\n3. Three sub-topics rising in the last 90 days\n4. Best format for each angle (tutorial / story / list / comparison)\n5. Highest-potential video title and the reason it would rank'},
      {n:'02',name:'Script Generation',tool:'Claude',time:'2–3 hrs',
       desc:'Write a full script with hook–problem–solution–CTA structure. The first 30 seconds determine everything.',
       prompt:'Write a complete YouTube script for: "{IDEA}"\n\nStructure:\n— HOOK (0–30s): Bold statement or surprising stat. Never "Hey guys, welcome back."\n— PROBLEM (30s–2min): Make the viewer feel the gap between where they are and where they want to be\n— SOLUTION (bulk): 3–5 clear sections, each with one concrete example\n— CTA (last 30s): One action only\n\nTarget: ~1,500 words for a 10-minute video.\nTone: Conversational, direct, confident.'},
      {n:'03',name:'Media Production',tool:'CapCut / ElevenLabs',time:'3–6 hrs',
       desc:'Record visuals and narration. Use AI voiceover for faceless channels, or prep your on-camera setup.',
       prompt:'Write the production brief for: "{IDEA}"\n\n1. B-roll shot list: 10 specific visual descriptions (what to show while narrating)\n2. On-screen text moments: where to add overlays and exactly what they say\n3. Thumbnail concept: background, main visual, overlay text (max 4 words), colour scheme\n4. Music mood: energy level for intro / body / outro\n5. Voiceover pacing notes: where to speed up, slow down, or pause for effect'},
      {n:'04',name:'Edit & Optimise',tool:'Descript / CapCut',time:'2–4 hrs',
       desc:'Cut filler, add captions, tighten pacing. Every second earns its place.',
       prompt:'Create the editing guide for: "{IDEA}"\n\n1. Chapter timestamps: 6–8 sections with time estimates for a 10-minute video\n2. Hook audit: does the opening 30 seconds immediately create curiosity? Rewrite if not.\n3. Best 60-second segment for YouTube Shorts: which moment and why\n4. Auto-caption style guide: font, size, colour, position\n5. End screen: what to show in the last 20 seconds to maximise next-video click-through'},
      {n:'05',name:'Publish & SEO',tool:'YouTube Studio',time:'45 mins',
       desc:'Optimise title, description, and tags before publishing. First 48 hours determine long-term ranking.',
       prompt:'Write the full YouTube SEO package for: "{IDEA}"\n\n1. Five title options (primary keyword first, under 60 characters, curiosity-driven)\n2. Description:\n   — First 150 characters: the hook before "Show more"\n   — Full 300-word body with keywords woven naturally\n   — Timestamps section + 3 resource links\n3. 15 tags: mix broad topic / specific / long-tail question\n4. Best publish time for this content type'},
      {n:'06',name:'Promote & Repurpose',tool:'Buffer / Claude',time:'1 hr',
       desc:'One video = 5–10 assets. Repurposing multiplies reach with zero extra filming.',
       prompt:'Create a full repurpose pack for: "{IDEA}"\n\n1. YouTube Short: best 60-second segment — hook and punchline described\n2. X/Twitter thread: 8 tweets (hook → 3 insights → example → counterpoint → CTA)\n3. LinkedIn post: 200 words, professional angle, storytelling format\n4. Instagram carousel: 6 slides (hook title → 4 key points → follow CTA)\n5. Email newsletter: subject line + 150-word body + P.S.'},
    ],
    output:{title:'Published YouTube Video + Repurpose Pack',
      desc:'A researched, scripted, and published YouTube video optimised for search — plus a cross-platform pack generating 5+ content assets from one production session.',
      items:['🎬 Published video','📝 Full script','🎞 Shorts clip','🐦 Twitter thread','📧 Email send','📊 SEO package']},
  },

  /* ── PODCAST ─────────────────────────────────── */
  podcast:{
    planet:'audio', icon:'🎙', label:'Podcast Show',
    tags:['Podcast','Audio','Distribution'],
    steps:[
      {n:'01',name:'Episode Research',tool:'Perplexity AI',time:'1–2 hrs',
       desc:'Find episode topics your audience actively searches for. Research deeply before recording.',
       prompt:'Find 10 podcast episode ideas for: "{IDEA}"\n\nFor each:\n— Title (curiosity-driven, under 60 chars)\n— Core question this episode answers\n— 3 talking points\n— Solo or guest format recommendation\n— Why this topic is relevant right now\n\nAlso: top 5 competing podcasts in this space, and the gap this show can own'},
      {n:'02',name:'Episode Outline',tool:'Claude',time:'1–2 hrs',
       desc:'Structure the episode: cold open → arc → strong close. Outline before you record.',
       prompt:'Write a full podcast episode outline for: "{IDEA}"\n\n— COLD OPEN (30s): Story, stat, or question before the intro music\n— HOST INTRO: 2 sentences on what listeners gain\n— ACT 1: Context — why this matters now\n— ACT 2: Core (5 interview questions or teaching points with sub-points)\n— ACT 3: 3 specific takeaways listeners can act on this week\n— OUTRO: CTA + next episode teaser'},
      {n:'03',name:'Record & Produce',tool:'Riverside.fm',time:'2–4 hrs',
       desc:'Record with lossless audio. Use AI post-production to remove filler and noise.',
       prompt:'Create the recording and production checklist for: "{IDEA}"\n\n1. Pre-recording setup: mic position, room, software settings\n2. Guest briefing template for 24 hours before recording\n3. AI production workflow: noise removal → filler detection → normalisation → compression settings\n4. Intro script (15 seconds): hook + show name + episode title\n5. Outro script (15 seconds): key takeaway + CTA + next episode preview'},
      {n:'04',name:'Edit & Transcribe',tool:'Descript',time:'2–3 hrs',
       desc:'Edit from the transcript — faster than timeline editing. Find the best clip.',
       prompt:'Guide the editing process for: "{IDEA}"\n\n1. Always cut: filler words, repeated sentences, pauses over 1.5s, tangents\n2. Never cut: genuine reactions, surprising moments, strong opinions, laughter\n3. Best 60-second promo clip: what type of moment to look for\n4. Chapter markers: 6 titles for a 40-minute episode on this topic\n5. Show notes structure: 100-word summary / 5 takeaways / 3 resources / timestamps / transcript'},
      {n:'05',name:'Publish & Distribute',tool:'Buzzsprout',time:'30 mins',
       desc:'Upload to your host, push to all directories, optimise for search.',
       prompt:'Write the full publishing package for: "{IDEA}"\n\n1. Episode title: keyword-rich, curiosity-driven, under 65 characters\n2. Description:\n   — First sentence: the hook (what listeners gain — not "in this episode")\n   — 150-word body with 3–5 keywords\n   — Chapters and links\n3. Show notes blog post (400 words for organic search)\n4. Subscriber email: subject + 100-word announcement + listen CTA'},
      {n:'06',name:'Promote & Grow',tool:'Headliner / Buffer',time:'1 hr',
       desc:'Turn each episode into audiograms, clips, and quote cards. Consistent promotion compounds.',
       prompt:'Build a promotion plan for: "{IDEA}"\n\n1. Audiogram: best 30-second quote for a waveform video (describe the moment)\n2. Instagram/TikTok short: concept with a scroll-stopping hook\n3. Quote card: the single most shareable sentence from this episode\n4. X/Twitter thread: 7-tweet breakdown of key insights (numbered 1/7–7/7)\n5. 30-day re-promotion calendar: when and how to reshare after launch week'},
    ],
    output:{title:'Published Episode + Promo Pack',
      desc:'A fully produced podcast episode published across all major platforms with show notes, SEO-optimised metadata, and a 6-asset promotion pack to grow your audience.',
      items:['🎙 Published episode','📄 Show notes','🎬 Audiogram','📱 Social clips','📧 Subscriber email','🔍 SEO blog post']},
  },

  /* ── NEWSLETTER ──────────────────────────────── */
  newsletter:{
    planet:'writing', icon:'📧', label:'Newsletter / Blog',
    tags:['Newsletter','Blog','Email Marketing'],
    steps:[
      {n:'01',name:'Topic & Angle',tool:'Perplexity AI',time:'30 mins',
       desc:'A great angle is the difference between a skimmed and saved issue. Find the fresh take, not the obvious one.',
       prompt:'Find the sharpest angle for a newsletter about: "{IDEA}"\n\n1. Specific question readers have right now\n2. Five headline angles: contrarian / how-to / numbered / story-driven / bold prediction\n3. The angle no one else has covered\n4. Reader emotional state: before vs after reading this piece\n5. Best format: essay / listicle / how-to / case study / data deep-dive'},
      {n:'02',name:'Outline & Structure',tool:'Claude',time:'30 mins',
       desc:'Outline before drafting. The best newsletters make one clear point, not five.',
       prompt:'Write a newsletter outline for: "{IDEA}"\n\n— SUBJECT: 5 options (curiosity-gap / specific number / personal / bold claim / question)\n— PREVIEW TEXT: 80 characters that tease what the subject does not say\n— HOOK: Make the reader feel something in 3 sentences. No "In today\'s issue."\n— SECTION 1: Setup the problem with one example\n— SECTION 2: Core insight (the thing they came for)\n— SECTION 3: Application or implication\n— KEY INSIGHT: The one screenshot-worthy sentence\n— CTA: One action — reply / click / share / buy'},
      {n:'03',name:'Write the Draft',tool:'Claude',time:'1–2 hrs',
       desc:'Write the full draft fast and messy. You edit after. Never polish while writing.',
       prompt:'Write the full newsletter for: "{IDEA}"\n\nRules:\n— First sentence: the most interesting thing you have to say — no warm-up\n— Paragraphs: max 3 sentences\n— Section headers for scannability\n— One story or concrete example in the middle section\n— One pull-quote or stat as a callout block\n— Banned: passive voice, "very", "really", "I\'m excited to share", "In today\'s digital world"\n\nLength: 600–800 words for email / 1,200–1,500 for SEO blog'},
      {n:'04',name:'Edit & Polish',tool:'Claude / Hemingway App',time:'45 mins',
       desc:'Cut 20% of your first draft. Every sentence earns its place. Then run a readability pass.',
       prompt:'Edit this newsletter about: "{IDEA}"\n\n1. Opening audit: does the first sentence demand to be read? Rewrite if not.\n2. Identify the 3 weakest sentences — remove them\n3. Where does the piece lose momentum? Prescribe a fix.\n4. Closing audit: does it end with clarity and direction, or just trail off?\n5. Flag passive voice, sentences over 25 words, all filler phrases\n\nReturn: edited version with brief annotation for each change'},
      {n:'05',name:'Publish & Schedule',tool:'Beehiiv / Substack',time:'30 mins',
       desc:'Format for your platform, test the subject line, send at the right time.',
       prompt:'Create the publishing checklist for: "{IDEA}"\n\n1. Subject line A/B test: two options — predict which performs better and explain why\n2. Optimal send time: best day and hour for this type of audience\n3. SEO blog version: meta description (155 chars), image alt text, internal link opportunities\n4. New subscriber landing page: headline + 3 benefit bullets + email capture CTA\n5. Post-publish checklist: test send, check all links, mobile preview'},
      {n:'06',name:'Grow & Repurpose',tool:'ReferralHero / Buffer',time:'45 mins',
       desc:'Your newsletter is the hub. Every issue generates 4–5 social assets and one growth mechanic.',
       prompt:'Build the growth plan for: "{IDEA}"\n\n1. Referral incentive: what to offer readers to share (resource / early access / shoutout)\n2. Twitter/X thread: 7-tweet breakdown of the main insight\n3. LinkedIn post: professional framing, 300 words\n4. Instagram carousel: 6 slides distilling key points\n5. Lead magnet: what free resource could this issue become?\n6. Evergreen replay: how to reshare this issue in 3 months without it feeling stale'},
    ],
    output:{title:'Published Newsletter + Growth System',
      desc:'A polished issue or blog post, scheduled at optimal time, repurposed into 5+ social assets, with a subscriber growth mechanic built in from the start.',
      items:['📧 Published issue','✍️ Polished draft','📱 Social assets','🎁 Lead magnet','📊 SEO blog','🔁 Growth system']},
  },

  /* ── BOOK ────────────────────────────────────── */
  book:{
    planet:'writing', icon:'📖', label:'Write a Book with AI',
    tags:['Book','Long-form','Publishing'],
    steps:[
      {n:'01',name:'Concept & Outline',tool:'Claude',time:'2–3 hrs',
       desc:'Define premise, ideal reader, and chapter structure before writing a single word.',
       prompt:'Help me plan a book about: "{IDEA}"\n\n1. Core premise: the ONE thing this book argues or teaches (one sentence)\n2. Ideal reader: job, frustration, what they have tried, what they need\n3. Why this book now — what gap does it fill that existing books do not?\n4. Structure recommendation: narrative / framework / problem-solution / case studies\n5. 10-chapter outline: title + core idea + key story or example per chapter\n6. Working title and subtitle: 5 options each'},
      {n:'02',name:'Research & Evidence',tool:'Perplexity AI',time:'3–5 hrs',
       desc:'Build your evidence library before writing. One great story or data point per chapter changes everything.',
       prompt:'Find supporting material for a book about: "{IDEA}"\n\nFor each major chapter theme:\n1. Strongest available data point or statistic with source\n2. Real-world case study that proves the point\n3. Counterargument and how to pre-empt it\n4. Quotable expert or credible voice\n5. Story (personal, historical, or hypothetical) that brings the idea to life\n\nAlso: the 5 best existing books on this topic and the clear gap mine fills'},
      {n:'03',name:'Draft Chapters',tool:'Claude',time:'4–8 hrs',
       desc:'Write one chapter per session. Give the AI your outline and word count. Iterate, do not perfect.',
       prompt:'Write Chapter [X] of a book about: "{IDEA}"\n\nChapter goal: [what the reader can do after this chapter]\nCore argument: [one sentence]\nTarget: 2,500 words\n\nStructure:\n— Opening scene (400w): show, do not tell\n— Core concept simply explained (600w)\n— Evidence or research that supports it (400w)\n— Real-world example with specifics (400w)\n— Common mistake or misconception addressed (400w)\n— Takeaway and bridge to the next chapter (300w)\n\nVoice: [first person / third person / conversational / authoritative]'},
      {n:'04',name:'Edit & Refine',tool:'Claude / ProWritingAid',time:'3–4 hrs',
       desc:'Edit macro first (structure, argument) then micro (sentences, clarity). Never start line editing.',
       prompt:'Edit this book chapter about: "{IDEA}"\n\nMACRO:\n1. Does the chapter argument hold from start to finish? Where does it drift?\n2. Can a reader summarise it in one sentence? If not, what is the problem?\n3. Which section loses the most momentum — and how to fix it?\n\nMICRO:\n4. Five weakest sentences — rewrite each\n5. Flag every passive voice construction and rewrite as active\n6. Jargon needing a concrete example to land properly\n\nReturn: annotated chapter with all changes highlighted'},
      {n:'05',name:'Format & Proof',tool:'Atticus / Vellum',time:'2–3 hrs',
       desc:'Format for print and ebook in one pass. Never skip professional proofreading on the final manuscript.',
       prompt:'Create the final production checklist for: "{IDEA}"\n\n1. Cover design brief: style direction, 3 comparable covers to reference, back cover copy\n2. Interior: font choice, body size, margin proportions, chapter header style\n3. Front matter: title page, copyright, dedication, table of contents, introduction\n4. Back matter: acknowledgements, bibliography, about author, other works\n5. Ebook vs print: 5 formatting differences during conversion to watch for'},
      {n:'06',name:'Publish & Launch',tool:'KDP / Gumroad',time:'5+ hrs',
       desc:'Build a launch list before release. A book launching to zero people makes zero sales.',
       prompt:'Build the launch plan for: "{IDEA}"\n\nPRE-LAUNCH (4 weeks out):\n1. ARC strategy: where to find 20 advance readers for reviews\n2. Email warm-up: 3 emails in the 2 weeks before launch (tease → reveal → countdown)\n3. Build-in-public: 5 behind-the-scenes content ideas for launch month\n\nLAUNCH WEEK:\n4. Amazon KDP: best sub-categories, keywords, price strategy\n5. Launch day email + social posting schedule\n6. 3 partnership asks for promotional shares\n\nPOST-LAUNCH:\n7. What course, workshop, or newsletter series does this book become?'},
    ],
    output:{title:'Published Book + Launch Campaign',
      desc:'A drafted, edited, and formatted book self-published on Amazon KDP or Gumroad — with pre-launch list, review strategy, launch week plan, and post-launch repurpose roadmap.',
      items:['📖 Finished manuscript','🎨 Cover brief','📦 Amazon listing','📧 Launch emails','⭐ Review strategy','🎓 Repurpose plan']},
  },

  /* ── SAAS ────────────────────────────────────── */
  saas:{
    planet:'business', icon:'💼', label:'SaaS Product Launch',
    tags:['SaaS','MVP','GTM Strategy'],
    steps:[
      {n:'01',name:'Market Research',tool:'Perplexity AI',time:'2–4 hrs',
       desc:'Validate the problem before writing any code. Research competitors and talk to 10 potential customers first.',
       prompt:'Research the market for: "{IDEA}"\n\n1. Problem validation: is this a real, recurring pain that people actively pay to solve?\n2. Market sizing: TAM / SAM / SOM with reasoning for each\n3. Competitor matrix: top 5 — pricing, positioning, primary weakness, what their negative reviews say (G2/Capterra)\n4. Ideal customer profile: job title, company size, daily workflow, current tool, pain in their own words\n5. Underserved segment: which customer type does every competitor ignore?\n6. Price signal: what do people already pay for partial solutions to this problem?'},
      {n:'02',name:'Define the Product',tool:'Claude + Figma',time:'3–5 hrs',
       desc:'Design the simplest version that solves the core problem. Ruthless scoping — V1 does ONE thing well.',
       prompt:'Define the MVP scope for: "{IDEA}"\n\n1. Core job-to-be-done: the ONE thing users hire this product to accomplish (one sentence)\n2. Feature prioritisation:\n   MUST: product is broken without it\n   SHOULD: important, can ship in V1.1\n   LATER: nice to have — cut for now\n3. User flow: from sign-up to first value moment in 5 steps or fewer\n4. Explicit cut list: what is NOT in V1 (prevents scope creep)\n5. MVP success metric: how will you know V1 is working?\n6. Three core screens described in plain text'},
      {n:'03',name:'Build MVP',tool:'Cursor / Supabase',time:'2–6 weeks',
       desc:'Build only what you scoped. Use AI coding tools to ship in 4–6 weeks, not 6 months.',
       prompt:'Create the technical build plan for: "{IDEA}"\n\n1. Tech stack with reasoning: frontend / backend / database / auth / hosting\n2. Build sequence: what to build first and why each step unlocks the next\n3. Week-by-week 4-week sprint plan with specific deliverables\n4. What to hard-code or fake in V1 to ship faster\n5. Definition of done: what does "ready for first users" actually mean?\n6. AI coding tools to use at each stage of development'},
      {n:'04',name:'Test with Users',tool:'Loom / Notion',time:'1–2 weeks',
       desc:'Get 10 real users before any marketing. Watch them use it without explaining anything.',
       prompt:'Design the user testing plan for: "{IDEA}"\n\n1. Recruiting: where to find 10 ideal beta users for free (communities, LinkedIn, cold email)\n2. Onboarding message: what to say when inviting beta testers\n3. Session structure (45 min):\n   — 10 min: understand their current workflow\n   — 20 min: watch them use the product with no hints\n   — 15 min: open questions\n4. The 5 questions to ask after every session\n5. Signals that mean "keep going" vs "pivot"\n6. How to turn beta users into case studies and testimonials'},
      {n:'05',name:'Launch',tool:'Product Hunt / X',time:'1 week',
       desc:'Launch publicly to generate traction and data. A launch reveals what to fix faster than anything else.',
       prompt:'Build the launch plan for: "{IDEA}"\n\nPRE-LAUNCH (2 weeks):\n1. Build-in-public: what to share on X/LinkedIn before launch day\n2. Landing page: headline + 3 benefit bullets + social proof + CTA\n3. Waitlist email sequence: 3 emails (announcement → value → launch day)\n\nLAUNCH DAY:\n4. Product Hunt: tagline (60 chars), description (260 chars), first comment\n5. Social posting schedule for launch day\n6. Press targets: 5 newsletters or journalists who cover this space\n\nPOST-LAUNCH:\n7. How to triage the feedback surge and prioritise what to build next'},
      {n:'06',name:'Scale',tool:'Stripe + PostHog',time:'Ongoing',
       desc:'Fix retention before doubling acquisition. One leaky bucket. One growth channel. In that order.',
       prompt:'Build the scaling roadmap for: "{IDEA}"\n\n1. Retention audit: where do users drop off? Fix the top 3 churn points first.\n2. Growth channel ranking for this product type:\n   Content/SEO / Cold outreach / Paid ads / Partnerships / PLG\n3. Pricing optimisation: signals that indicate readiness to raise prices\n4. First hire: which role has the highest ROI at this stage?\n5. MRR milestones: $1k → $5k → $10k → $50k — what unlocks each level?\n6. Weekly metrics dashboard: the 5 numbers to review every Monday morning'},
    ],
    output:{title:'Launched SaaS Product',
      desc:'A validated SaaS idea, shipped MVP, 10+ beta users tested, public launch completed, and a scaling roadmap with the metrics dashboard to track it.',
      items:['✅ Validated idea','📋 Product spec','⚙️ Shipped MVP','👥 Beta results','🚀 Public launch','📈 Scale roadmap']},
  },

  /* ── WEB APP ─────────────────────────────────── */
  webapp:{
    planet:'coding', icon:'💻', label:'Web App Build',
    tags:['Web App','Full Stack','Deploy'],
    steps:[
      {n:'01',name:'Spec & Architecture',tool:'Claude',time:'2–3 hrs',
       desc:'Write the spec before touching code. A clear spec saves 10x more time than it takes to write.',
       prompt:'Design the technical architecture for: "{IDEA}"\n\n1. Tech stack with reasoning per choice: frontend / backend / database / auth / hosting\n2. Top 3 core user flows (step by step from landing to goal)\n3. Feature list: MUST HAVE / NICE TO HAVE / V2\n4. Critical API endpoints: 8 most important with method and purpose\n5. Non-functional requirements: performance targets, mobile support, concurrent users\n6. Top 3 technical risks and how to mitigate each'},
      {n:'02',name:'Scaffold & Setup',tool:'Cursor / Claude',time:'2–4 hrs',
       desc:'Generate the full boilerplate in one session. Start from a template, not a blank file.',
       prompt:'Generate the full project scaffold for: "{IDEA}"\n\nProvide:\n1. Complete folder structure with every file and folder named\n2. package.json with all dependencies\n3. Base layout component\n4. Database schema (Prisma schema or SQL CREATE statements)\n5. .env.example with all required environment variable keys\n6. README: local setup steps, how to run dev server, how to deploy\n\nStyle: clean, well-commented, production-quality from day one'},
      {n:'03',name:'Feature Development',tool:'Cursor IDE',time:'Varies by scope',
       desc:'Ship one feature per session. AI writes the first draft — you review before committing.',
       prompt:'Build this feature for: "{IDEA}"\n\nFeature: [describe specifically what it does]\nCurrent state: [what already exists]\n\nDeliver:\n1. Complete component or function code — not a skeleton\n2. Required API route or server action\n3. Database query if applicable\n4. Loading, error, and empty state handling\n5. TypeScript types for all new code\n6. One test case covering the happy path\n\nRule: add a comment above any non-obvious logic'},
      {n:'04',name:'Testing & QA',tool:'Playwright / Vitest',time:'2–3 hrs',
       desc:'Test every user-facing feature. 80% coverage of critical paths beats 100% of unimportant ones.',
       prompt:'Write the testing plan for: "{IDEA}"\n\n1. Unit tests: 5 most important functions with edge cases listed for each\n2. Integration tests: 3 most critical API endpoints and what to verify\n3. E2E scenarios (Playwright): 3 most important user flows described in plain English\n4. Manual QA checklist: 10 things to check before every production release\n5. Performance benchmarks: acceptable load times for each core user action'},
      {n:'05',name:'Security & Performance',tool:'Lighthouse',time:'2–4 hrs',
       desc:'Audit before launch. Common vulnerabilities are embarrassing and preventable — run the checklist.',
       prompt:'Audit this web app for security and performance: "{IDEA}"\n\nSECURITY:\n1. Input validation: every user input sanitised server-side?\n2. Auth: JWT expiry, session management, protected route enforcement\n3. CORS: correctly configured for production?\n4. Rate limiting on auth endpoints and expensive API calls?\n5. No secrets hardcoded — all in environment variables?\n\nPERFORMANCE:\n6. Core Web Vitals targets (LCP <2.5s, FID <100ms, CLS <0.1)\n7. Image optimisation strategy\n8. Database query review: N+1 problems, missing indexes'},
      {n:'06',name:'Deploy & Monitor',tool:'Vercel / Railway',time:'2 hrs',
       desc:'CI/CD from day one. Every push to main auto-deploys. Monitoring runs before you need it.',
       prompt:'Set up deployment and monitoring for: "{IDEA}"\n\n1. GitHub Actions CI/CD pipeline:\n   — Lint → Type check → Tests → Build → Deploy\n   — Preview deploy on every PR\n   — Production deploy on merge to main\n2. Environment: what differs between staging and production\n3. Error tracking: Sentry setup with alerting thresholds\n4. Uptime monitoring: alert within 1 minute of downtime\n5. Post-deploy checklist: 5 things to verify after every production release'},
    ],
    output:{title:'Deployed Production Web App',
      desc:'A live web application with CI/CD pipeline, automated tests, security-audited code, and monitoring in place — ready for real users from launch day.',
      items:['⚙️ Working codebase','🧪 Test suite','🔒 Security audit','🚀 Live deployment','📊 Error monitoring','📖 Documentation']},
  },

  /* ── AI TOOL ─────────────────────────────────── */
  ai_tool:{
    planet:'coding', icon:'🤖', label:'AI-Powered Product',
    tags:['AI Product','LLM','Prompt Engineering'],
    steps:[
      {n:'01',name:'Define the AI Task',tool:'Claude',time:'2 hrs',
       desc:'Most AI products fail because the AI is a solution in search of a problem. Define the exact task first.',
       prompt:'Help me design an AI-powered product for: "{IDEA}"\n\n1. The exact task AI performs (specific — "summarise X into Y format" not "use AI")\n2. Why AI is better than a human or traditional software for this task\n3. Input → AI process → Output: describe the full data flow\n4. Error modes: when will the AI get it wrong, and how does the product handle it?\n5. Minimum viable version: what can be built and tested in 48 hours?\n6. Model selection: Claude / GPT-4o / Gemini / open source — which and why?'},
      {n:'02',name:'Prompt Engineering',tool:'Claude / Promptfoo',time:'3–5 hrs',
       desc:'The prompt IS the product. Spend as much time engineering it as you would on core features.',
       prompt:'Engineer the core prompts for: "{IDEA}"\n\n1. System prompt (complete, production-ready):\n   — Model role and expertise\n   — Precise instructions for the task\n   — Exact output format the model must follow\n   — How to handle ambiguous or low-quality input\n   — Hard rules: what the model must never do\n\n2. User prompt template: how to structure what users send\n\n3. Output format: JSON structure or text format the model must return\n\n4. Evaluation set: 5 example inputs with expected outputs\n\n5. Failure tests: 3 inputs designed to break the prompt — and the guards against them'},
      {n:'03',name:'Build the Integration',tool:'Cursor / Anthropic SDK',time:'1–2 days',
       desc:'Connect prompt to UI. A text box, an AI call, and a result display is enough to test your core hypothesis.',
       prompt:'Build the AI integration code for: "{IDEA}"\n\nUsing Anthropic / OpenAI SDK:\n\n1. Complete API call:\n   — Model, max_tokens, temperature with reasoning\n   — Streaming vs non-streaming decision\n   — Error handling: rate limits, timeouts, content policy\n   — Cost per call estimate\n\n2. Minimal test UI:\n   — Input field → submit → streaming result display\n   — Loading and error states\n\n3. API key protection and rate limiting to prevent abuse\n\n4. Logging: prompt, response, latency, token count, cost per call'},
      {n:'04',name:'Evaluate Output Quality',tool:'Promptfoo',time:'1–2 days',
       desc:'AI quality is not binary. Build an eval system. What you can measure, you can systematically improve.',
       prompt:'Design the evaluation framework for: "{IDEA}"\n\n1. Quality dimensions: 3–5 criteria that define a "good" output\n2. Scoring rubric: what a score of 1, 3, and 5 looks like for each criterion\n3. Test set of 20 inputs:\n   — 10 standard use cases\n   — 5 edge cases\n   — 5 adversarial inputs designed to break the prompt\n4. Regression testing: how to verify new prompt versions do not break passing cases\n5. Human evaluation loop: when and how to have humans rate outputs to calibrate scoring'},
      {n:'05',name:'Ship & Monetise',tool:'Stripe / Vercel',time:'1 week',
       desc:'Add billing before you scale. Usage-based or freemium pricing fits most AI tools best.',
       prompt:'Build the monetisation plan for: "{IDEA}"\n\n1. Pricing model options:\n   — Freemium: what is free, what triggers an upgrade\n   — Usage-based: cost per query with margins\n   — Subscription tiers: what each tier includes\n\n2. API cost management:\n   — Cost per user at 100 / 1,000 / 10,000 requests per month\n   — Break-even calculation at each price point\n   — Token optimisation: how to reduce model costs without hurting quality\n\n3. Landing page copy: headline + 3 benefit bullets + pricing table + FAQ\n\n4. First 100 users: where to find them and what to offer'},
      {n:'06',name:'Iterate & Improve',tool:'PostHog / Sentry',time:'Ongoing',
       desc:'AI products improve through prompt iteration as much as code changes. Build the feedback loop from day one.',
       prompt:'Design the continuous improvement system for: "{IDEA}"\n\n1. User feedback capture: where in the UI to show thumbs up/down and what to ask\n2. Output analysis: what patterns in low-rated outputs reveal about prompt weaknesses\n3. Prompt versioning: how to safely A/B test new prompts without disrupting all users\n4. Model upgrade evaluation: when a new model releases, how to assess whether switching improves quality\n5. Feature signals from usage:\n   — Users editing outputs → add editing UI\n   — Users asking the same follow-up → build it in as a default\n   — Users abandoning at output step → fix the prompt, not the UI'},
    ],
    output:{title:'Live AI-Powered Product',
      desc:'A deployed AI product with engineered prompts, a quality eval system, Stripe billing, usage analytics, and a continuous improvement feedback loop.',
      items:['🤖 AI integration','💬 Engineered prompts','⚙️ Live product','💳 Billing setup','📊 Usage analytics','🔄 Eval system']},
  },

  /* ── NO-CODE AUTOMATION ──────────────────────── */
  nocode_auto:{
    planet:'auto', icon:'⚡', label:'No-Code Automation',
    tags:['Make.com','Zapier','n8n','No-Code'],
    steps:[
      {n:'01',name:'Map the Process',tool:'FigJam / Excalidraw',time:'1–2 hrs',
       desc:'Document the current manual process before automating it. Never automate a broken process.',
       prompt:'Map this process for automation: "{IDEA}"\n\n1. Every manual step in the current workflow (granular — every click and decision)\n2. Trigger: what specific event starts this process? (email / form / schedule / data change)\n3. Data flow: what information is created, transformed, or moved at each step?\n4. Decision points: where does a human currently make a judgment call?\n5. End state: what is the final output or result?\n6. Automation scoring: Easy / Medium / Hard to automate — with reasoning for each'},
      {n:'02',name:'Choose Tools',tool:'Make.com / n8n / Zapier',time:'1 hr',
       desc:'Match the platform to the complexity. Make.com for visual logic, n8n for self-hosted, Zapier for speed.',
       prompt:'Recommend the automation stack for: "{IDEA}"\n\n1. Platform comparison for this specific workflow:\n   — Zapier: best when [scenario], monthly cost at this volume\n   — Make.com: best when [scenario], estimated monthly cost\n   — n8n: best when [scenario], self-hosting requirements\n   — Custom script: when to choose code over no-code\n\n2. All integrations required: every app that needs to connect\n\n3. Native integration vs webhook approach for each app\n\n4. Cost estimate at 100 / 1,000 / 10,000 automation runs per day'},
      {n:'03',name:'Build the Flow',tool:'Make.com',time:'3–8 hrs',
       desc:'Build one module at a time, test each in isolation before connecting the full chain.',
       prompt:'Design the complete automation flow for: "{IDEA}"\n\n1. TRIGGER module: type, platform, exact trigger conditions and filters\n2. For each subsequent step:\n   — Module name and platform\n   — Action performed\n   — Input fields used from previous step\n   — Output fields created\n   — Any filters or conditional logic\n3. Error path: what happens when a step fails or returns unexpected data?\n4. Data transformation: fields needing reformatting between steps\n5. The single highest-risk point of failure and how to protect against it'},
      {n:'04',name:'Test & Validate',tool:'Make.com Test Mode',time:'2–4 hrs',
       desc:'Test on 10 real cases before touching production data. Never go live on assumptions.',
       prompt:'Write the testing protocol for: "{IDEA}"\n\n1. Test data set: 10 inputs covering:\n   — Typical case / edge case / missing or null field / duplicate trigger / high-volume burst\n2. Success criteria: for each module, what does correct output look like exactly?\n3. Most likely failure scenarios for this automation and detection method for each\n4. Rollback plan: if the automation processes production data incorrectly, how to undo the damage\n5. Sign-off checklist: what must be true before switching to live data?'},
      {n:'05',name:'Deploy & Document',tool:'Notion / Loom',time:'2 hrs',
       desc:'Document before deploying. Future-you will not remember how it works. 30 minutes now saves hours later.',
       prompt:'Write the deployment and documentation package for: "{IDEA}"\n\nDEPLOYMENT CHECKLIST:\n1. All API keys and credentials confirmed and stored securely\n2. Error notification channel set up (Slack / email with failure details)\n3. Rate limits checked against current plan\n4. Staging test completed on real sample data\n5. Stakeholders notified of go-live date\n\nDOCUMENTATION (for whoever maintains this later):\n— What this automation does (one sentence)\n— Trigger condition\n— Step-by-step flow description\n— Who to contact if it breaks\n— How to complete the task manually if automation is down'},
      {n:'06',name:'Monitor & Optimise',tool:'Make.com Logs / Slack',time:'Ongoing',
       desc:'Set failure alerts so you know within minutes when something breaks. Review logs weekly for the first month.',
       prompt:'Design the monitoring system for: "{IDEA}"\n\n1. Failure alerts: instant Slack/email on any failed run with timestamp, error, and data that caused it\n2. Daily summary: runs completed / failed / skipped\n3. Weekly review:\n   — Any runs taking longer than usual?\n   — Recurring error pattern?\n   — Volume approaching plan limits?\n4. Optimisation triggers: when to add retry / human-approval / split into two flows\n5. Maintenance schedule: monthly API version checks / quarterly process review'},
    ],
    output:{title:'Running No-Code Automation',
      desc:'A fully built and tested automation replacing a manual process — with documentation, failure alerts, a monitoring dashboard, and a maintenance guide.',
      items:['⚡ Live automation','📋 Documentation','🔔 Error alerts','📊 Run logs','✅ Test suite','🛠 Maintenance SOP']},
  },

  /* ── SCRIPT AUTOMATION ───────────────────────── */
  script_auto:{
    planet:'auto', icon:'🐍', label:'Code Automation Script',
    tags:['Python','Scripts','Scheduling'],
    steps:[
      {n:'01',name:'Define the Task',tool:'Claude',time:'1 hr',
       desc:'Specify what the script does, what it takes in, and what it outputs. Ambiguity creates bugs.',
       prompt:'Write the automation spec for: "{IDEA}"\n\n1. Trigger: cron schedule / webhook / manual execution / file watcher\n2. Input: what data does it receive and in what format? (CSV / JSON / API / database)\n3. Process: step-by-step logic in plain English\n4. Output: what does it produce and where does it go?\n5. Edge cases: 5 inputs that could break or confuse the script\n6. Language and library recommendation with reasoning\n7. Estimated runtime and compute requirements at expected volume'},
      {n:'02',name:'Write the Script',tool:'Claude / Cursor',time:'2–4 hrs',
       desc:'Generate the full script with AI. Always review every line before running — plausible is not correct.',
       prompt:'Write a complete, production-ready script for: "{IDEA}"\n\nRequirements:\n— Docstring at the top: what it does, expected inputs, outputs\n— All configurable values via argparse or environment variables — nothing hardcoded\n— Logging at INFO level for progress and ERROR level for failures (with timestamps)\n— Main logic wrapped in try/except with descriptive error messages\n— --dry-run flag: shows what would happen without making changes\n— Structured as functions, not one long procedural block\n— Type hints on every function signature\n\nReturn: complete, runnable code. No placeholders.'},
      {n:'03',name:'Add Error Handling',tool:'Python logging',time:'1–2 hrs',
       desc:'Production scripts fail silently without error handling. Build retry, alerting, and logging first.',
       prompt:'Add production-grade error handling to: "{IDEA}"\n\n1. Retry logic for external API calls:\n   — Exponential backoff: 1s → 2s → 4s → 8s, max 3 retries\n   — Retry on: timeout, rate limit (429), temporary server error (5xx)\n   — Fail immediately on: auth error (401/403), bad data (400)\n\n2. Failure alerting: Slack/email on failure with timestamp, error type, traceback, and data that triggered it\n\n3. Idempotency: if run twice on same input, does it create duplicates? Provide the fix.\n\n4. Checkpoint system: for long-running scripts, save progress so they can resume after a crash'},
      {n:'04',name:'Test the Script',tool:'pytest',time:'2–3 hrs',
       desc:'Write tests before running on production data. 30 minutes writing tests prevents hours of debugging.',
       prompt:'Write pytest tests for: "{IDEA}"\n\nFor each function:\n1. Happy path with realistic test data\n2. Edge case: empty input\n3. Edge case: malformed or unexpected input format\n4. Edge case: maximum / minimum values\n\nAdditionally:\n5. Mock all external dependencies (HTTP calls, database, filesystem)\n6. Integration test: run the full script against a test dataset and assert on the output\n7. Performance test: measure runtime at 10 / 100 / 1,000 records — where does it become too slow?\n\nReturn: complete test file with all imports, fixtures, and parametrised tests'},
      {n:'05',name:'Schedule & Deploy',tool:'GitHub Actions',time:'2 hrs',
       desc:'Deploy to GitHub Actions or a server. Set a cron schedule that runs without your laptop being on.',
       prompt:'Set up deployment and scheduling for: "{IDEA}"\n\nOption 1 — GitHub Actions:\n— Complete .github/workflows/run.yml with cron schedule syntax\n— How to store secrets securely in GitHub Secrets\n— How to view and download run logs\n\nOption 2 — Server / VPS:\n— Correct crontab entry with exact syntax\n— Run in background with nohup or systemd service\n— Log rotation to prevent disk fill\n\nOption 3 — Docker:\n— Dockerfile for this script\n— docker-compose.yml if a database is needed\n\nFor each option: pros, cons, and when to choose it'},
      {n:'06',name:'Monitor & Maintain',tool:'Datadog / Slack',time:'Ongoing',
       desc:'A script you do not monitor is a script you cannot trust. Build observability before you need it.',
       prompt:'Build the monitoring system for: "{IDEA}"\n\n1. Post-run summary (send via Slack/email after every run):\n   — Records processed, failed, runtime, API cost estimate\n\n2. Alert thresholds:\n   — Error rate exceeds 5%\n   — Runtime exceeds 2x the rolling average\n   — 0 records processed (may indicate upstream problem)\n\n3. Health check endpoint for webhook-triggered scripts\n\n4. Maintenance schedule:\n   — Monthly: run pip-audit for security vulnerabilities\n   — Quarterly: update dependencies and re-run full test suite\n\n5. README template: setup instructions, configuration guide, troubleshooting section'},
    ],
    output:{title:'Deployed Automation Script',
      desc:'A production-grade script with retry logic, pytest suite, scheduled deployment, failure alerts, and a monitoring system — running reliably with zero manual intervention.',
      items:['🐍 Polished script','🧪 Test suite','🔔 Failure alerts','⏰ Cron schedule','📊 Run reports','📖 README']},
  },

  /* ── RESEARCH ────────────────────────────────── */
  research:{
    planet:'research', icon:'🔭', label:'Research Project',
    tags:['Deep Research','Synthesis','Report Writing'],
    steps:[
      {n:'01',name:'Define the Question',tool:'Notion',time:'1 hr',
       desc:'A fuzzy research question produces fuzzy results. Narrow until the question is precisely answerable.',
       prompt:'Help me scope a research project on: "{IDEA}"\n\n1. Refine the research question: rewrite my topic as one precise, answerable question\n2. Five sub-questions whose combined answers address the main question\n3. Scope boundaries:\n   — What IS in scope (be explicit)\n   — What is NOT in scope (cut aggressively)\n4. What a successful outcome looks like — how I will know the question has been answered\n5. Intended audience: who reads this and what decision does it inform?\n6. Output format: research report / executive summary / presentation / article / data analysis'},
      {n:'02',name:'Source Discovery',tool:'Perplexity AI',time:'2–3 hrs',
       desc:'Build a list of 15–20 source candidates first, then filter to the best 8–10. Quality beats quantity.',
       prompt:'Find the best sources for research on: "{IDEA}"\n\n1. Three academic papers or peer-reviewed studies (most recent and most cited)\n2. Three primary sources (official data, government reports, industry surveys, first-hand accounts)\n3. Three expert practitioners with direct experience\n4. Two contrarian or critical perspectives\n5. One strong quantitative data source\n\nFor each: title and author, why it is credible, key finding in one sentence, where to access it'},
      {n:'03',name:'Extract Key Insights',tool:'Claude',time:'2–4 hrs',
       desc:'Read strategically, not linearly. Extract claim, evidence, and methodology from each source.',
       prompt:'Extract and structure key information for research on: "{IDEA}"\n\nFor each source I paste, extract:\n1. Main claim or finding (one sentence — not a summary, the central argument)\n2. Two to three strongest supporting data points or examples\n3. Methodology: how did they reach this conclusion?\n4. Author-stated limitations or caveats\n5. Relevance to my research question (high / medium / low — with reasoning)\n6. Best quotable passage with full citation info\n\nSource to process:\n[paste source text or describe the source]'},
      {n:'04',name:'Synthesise & Analyse',tool:'Claude',time:'2–3 hrs',
       desc:'Synthesis is not summary. Find patterns, contradictions, and gaps — that is where original insight lives.',
       prompt:'Synthesise research notes on: "{IDEA}"\n\nFrom these notes:\n[paste your extracted source notes]\n\nProvide:\n1. Three themes that appear across multiple sources\n2. Where sources converge — and what that consensus implies\n3. Where sources contradict — and what might explain the disagreement\n4. The most surprising or counterintuitive finding in the research\n5. The largest remaining gap: what does this body of research fail to answer?\n6. My synthesis statement: given all the evidence, what appears to be true?'},
      {n:'05',name:'Write the Report',tool:'Claude',time:'3–5 hrs',
       desc:'Structure before writing. The outline IS the argument. Write to persuade, not just to inform.',
       prompt:'Write a research report on: "{IDEA}"\n\nBased on synthesis:\n[paste your synthesis notes]\n\nStructure:\n— EXECUTIVE SUMMARY (150w): central finding, why it matters, key recommendation\n— INTRODUCTION: the question and why it is important now\n— FINDINGS 1: first theme with supporting evidence\n— FINDINGS 2: second theme with supporting evidence\n— FINDINGS 3: third theme with supporting evidence\n— ANALYSIS: what the findings mean together — the original contribution\n— LIMITATIONS: what this research cannot tell us\n— CONCLUSION + RECOMMENDATIONS: 3 specific, actionable recommendations\n\nTone: authoritative but readable — no jargon without explanation'},
      {n:'06',name:'Publish & Distribute',tool:'Notion / Substack',time:'1–2 hrs',
       desc:'Research that is not shared does not exist. Package it for how your audience actually reads.',
       prompt:'Create the publishing plan for: "{IDEA}"\n\n1. Document formatting for [Notion / PDF / Google Docs / Substack]:\n   — Which findings need a chart, table, or infographic?\n   — Visual hierarchy: headings, callout blocks, pull quotes\n\n2. One-page executive summary for time-constrained readers\n\n3. Social media adaptation:\n   — LinkedIn post: 600-word professional angle\n   — X/Twitter thread: 8 tweets with key findings (numbered 1/8–8/8)\n\n4. Presentation deck: 10-slide structure based on the report\n\n5. Next research question: what does this work surface that deserves its own investigation?'},
    ],
    output:{title:'Published Research Report',
      desc:'A fully sourced, synthesised, and written research report with executive summary — published in your target format and distributed as a document, article, and social thread.',
      items:['📄 Research report','📊 Data synthesis','💡 Original analysis','📑 Executive summary','📱 Social thread','🎤 Presentation deck']},
  },

  /* ── SOCIAL MEDIA ────────────────────────────── */
  social:{
    planet:'social', icon:'📡', label:'Social Media Content Engine',
    tags:['Content Calendar','Captions','Growth Strategy'],
    steps:[
      {n:'01',name:'Platform Strategy',tool:'SparkToro',time:'1–2 hrs',
       desc:'Pick 1–2 platforms based on where your audience is. More platforms = diluted effort. Focus wins.',
       prompt:'Design a social media strategy for: "{IDEA}"\n\n1. Platform selection: which 2 have the highest concentration of this audience and the best organic reach right now?\n2. Content format that outperforms on each (video / text / carousel / short audio)\n3. Optimal posting frequency to grow without burnout\n4. Content pillars: 4 topic categories to rotate through consistently\n5. Brand voice: 5 specific words (not "friendly", "professional", "authentic" — be precise)\n6. 3 accounts doing this well — what each is doing that this account can do differently'},
      {n:'02',name:'30-Day Content Plan',tool:'Claude',time:'2–3 hrs',
       desc:'Plan a full month in one session. Front-load your best ideas and vary format every post.',
       prompt:'Create a 30-day social media content plan for: "{IDEA}"\n\nPosting: [X times per week] on [platforms]\n\nFor each post:\n— Day number, platform, content pillar\n— Format (text / image / video / carousel / story / reel)\n— Hook (first line only — scroll-stopping, no generic openers)\n— Core message (one sentence)\n\nDistribution:\nWeek 1: 5 highest-conviction ideas\nWeeks 2–4: rotate pillars evenly\nRatio: 60% value content / 30% personality / 10% promotional'},
      {n:'03',name:'Caption Writing',tool:'Claude',time:'2 hrs',
       desc:'Write in batches of 10. The hook is the only part most people read — make it impossible to scroll past.',
       prompt:'Write 10 high-performing captions for: "{IDEA}"\n\nUse one of these proven hook formulas per caption:\n— "I used to believe X. Then Y happened."\n— "Nobody talks about X — so I will."\n— "The fastest way to X is not what you think."\n— "Stop doing X. Start doing Y."\n— "[Number] things I wish I knew before starting X"\n\nBody: 3–4 punchy lines or 3 tight bullet points\nCTA: one specific action\nHashtags: 5–8 relevant tags\n\nBanned phrases: "excited to share", "journey", "in today\'s digital world"'},
      {n:'04',name:'Visual Production',tool:'Canva / Midjourney',time:'3–5 hrs',
       desc:'Build reusable templates for every format. Consistent visual identity builds brand recognition faster than great content alone.',
       prompt:'Design the visual system for: "{IDEA}"\n\nCreate specs for each format:\n\n1. CAROUSEL (Instagram / LinkedIn):\n   — Slide 1 (hook): layout, image treatment, text placement\n   — Slides 2–5: grid system, icon usage\n   — Final slide (CTA): design + call to action\n\n2. QUOTE CARD: background, typography hierarchy, brand element placement\n\n3. VIDEO THUMBNAIL: style (bold text / face + text / graphic), colour blocking\n\n4. STORY / REEL COVER: safe zones, dimensions, branding placement\n\nAlso: 3-sentence visual brand guide — what this account always looks like and what it never looks like'},
      {n:'05',name:'Schedule & Automate',tool:'Buffer / Later',time:'1 hr',
       desc:'Schedule 2–4 weeks ahead. Add a 20-minute engagement block after every post goes live.',
       prompt:'Build the scheduling system for: "{IDEA}"\n\n1. 2-week posting schedule: exact days and times per platform (use general best-time benchmarks)\n2. Engagement SOP for first 30 minutes after posting:\n   — Reply to every comment within 15 minutes\n   — Leave 5 thoughtful comments on similar accounts immediately after posting\n   — Reshare to Story with a value-add caption\n3. What to do if a post gets under 10 engagements in the first 2 hours\n4. Monthly batch creation calendar: plan, write, design, schedule\n5. 90-day repurpose: which top-performing posts to recycle and how to refresh them'},
      {n:'06',name:'Analyse & Scale',tool:'Native Analytics',time:'30 mins / week',
       desc:'Track weekly. Double what works, cut what does not. One insight beats 20 posts of guesswork.',
       prompt:'Build the performance review system for: "{IDEA}"\n\n1. Weekly review (15 minutes):\n   — Top 3 posts: format / hook / engagement rate\n   — Bottom 3: what went wrong\n   — One pattern to test in the next 7 days\n\n2. Monthly review:\n   — Which content pillar drives the most followers?\n   — Which format wins on reach vs engagement?\n   — What is rising in this niche right now?\n\n3. Scale signals: metrics indicating readiness to post more or add a second platform\n\n4. Pivot signals: 3 warning signs the current strategy is not working\n\n5. Creator partnerships: how to find 3 collaborators to grow with in the next 90 days'},
    ],
    output:{title:'30-Day Social Media Content Engine',
      desc:'A complete 30-day calendar, 10 captions ready to post, visual templates for every format, a scheduling system, and a weekly analytics review — running near-autopilot.',
      items:['📅 30-day calendar','✍️ 10 captions','🎨 Visual templates','⏰ Scheduling queue','📊 Analytics system','🔄 Repurpose workflow']},
  },

}; /* end WORKFLOWS */


/* ════════════════════════════════════════════════
   C · CLASSIFIER ENGINE
   Scores each workflow variant against user input.
   Uses layered keyword rules with weights.
   Highest scorer wins; ties default to broader signal.
════════════════════════════════════════════════ */

/**
 * Classify user input text → best workflow variant ID.
 * @param {string} text
 * @returns {string} key from WORKFLOWS
 */
function classify(text) {
  var t = text.toLowerCase();
  var scores = {};

  /* Rule format: [ variantId, [ keywords ], weight ]
   * Weight scale: 10 = unmistakable / 7 = strong / 4 = moderate / 2 = weak */
  var RULES = [
    /* ─ Unmistakable (10) ─ */
    ['youtube',     ['youtube','youtube channel','yt channel','faceless channel','faceless youtube'],               10],
    ['podcast',     ['podcast','audio show','interview show','podcast episodes','podcast automation'],              10],
    ['newsletter',  ['newsletter','email list','substack','weekly email','email newsletter'],                       10],
    ['book',        ['write a book','writing a book','ebook','novel','memoir','manuscript','nonfiction'],           10],
    ['ai_tool',     ['ai tool','gpt wrapper','ai app','claude api','openai api','llm product','chatbot','ai-powered product','anthropic api'], 10],
    ['script_auto', ['python script','automation script','bash script','web scraper','scraping bot','cron job','playwright script','selenium'], 10],
    ['nocode_auto', ['zapier','make.com','n8n','airtable automation','no-code automation','workflow automation'],   10],
    ['social',      ['social media strategy','content engine','instagram growth','tiktok strategy','linkedin content'], 10],

    /* ─ Strong (7) ─ */
    ['saas',        ['saas','micro saas','indie saas','mrr','b2b saas','software subscription'],                   7],
    ['webapp',      ['web app','next.js app','react app','full stack app','dashboard app','web tool'],              7],
    ['research',    ['research project','deep research','white paper','literature review','systematic review'],     7],
    ['podcast',     ['podcast','audio'],                                                                           7],
    ['book',        ['book'],                                                                                      7],
    ['youtube',     ['youtube','video channel'],                                                                   7],

    /* ─ Moderate (4) ─ */
    ['newsletter',  ['blog','blogging','article','content writing'],                                               4],
    ['social',      ['social media','social','grow my audience','followers','content calendar'],                   4],
    ['saas',        ['startup','business idea','product idea','mvp','launch a product'],                           4],
    ['webapp',      ['app','build an app','website','web project'],                                                4],
    ['ai_tool',     ['ai','chatgpt','gpt','llm','claude'],                                                        4],
    ['nocode_auto', ['automate','no-code','workflow','pipeline'],                                                  4],
    ['research',    ['research','study','analysis','report'],                                                      4],
    ['script_auto', ['script','python','automation','scraper'],                                                    4],

    /* ─ Weak / directional (2) ─ */
    ['youtube',     ['video','content'],                                                                           2],
    ['podcast',     ['audio','listen'],                                                                            2],
    ['saas',        ['business','company'],                                                                        2],
    ['social',      ['social','post','caption'],                                                                   2],
    ['research',    ['learn','study','course'],                                                                    2],
  ];

  RULES.forEach(function(rule) {
    var variant = rule[0], keywords = rule[1], weight = rule[2];
    keywords.forEach(function(kw) {
      if (t.indexOf(kw) !== -1) {
        scores[variant] = (scores[variant] || 0) + weight;
      }
    });
  });

  var best = null, top = -1;
  Object.keys(scores).forEach(function(v) {
    if (scores[v] > top) { top = scores[v]; best = v; }
  });
  return best || 'youtube';
}


/* ════════════════════════════════════════════════
   D · DOM BUILDERS — populate filter panels
════════════════════════════════════════════════ */

function buildTypeGrid() {
  var grid = document.getElementById('type-grid');
  if (!grid) return;
  MISSION_TYPES.forEach(function(t) {
    var btn = document.createElement('button');
    btn.className = 'type-btn';
    btn.setAttribute('aria-pressed', 'false');
    btn.dataset.id = t.id;
    btn.innerHTML =
      '<span class="ico" aria-hidden="true"><i data-lucide="' + t.ico + '"></i></span>' +
      '<span class="type-lbl">' + t.label + '</span>';
    btn.addEventListener('click', function() {
      grid.querySelectorAll('.type-btn').forEach(function(b) { b.classList.remove('on'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('on'); btn.setAttribute('aria-pressed','true');
      state.type = t.id; syncState();
    });
    grid.appendChild(btn);
  });
  if (window.lucide) lucide.createIcons({ nameAttr: 'data-lucide', attrs: { 'stroke-width': '1.6' } });
}

function buildLevelGrid() {
  var el = document.getElementById('level-grid');
  if (!el) return;
  CLEARANCE_LEVELS.forEach(function(l) {
    var btn = document.createElement('button');
    btn.className = 'stk-btn';
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML =
      '<span class="stk-ico" aria-hidden="true"><i data-lucide="' + l.ico + '"></i></span>' +
      '<span class="stk-name">' + l.label + '</span>' +
      '<span class="stk-sub">' + l.sub + '</span>';
    btn.addEventListener('click', function() {
      el.querySelectorAll('.stk-btn').forEach(function(b) { b.classList.remove('on'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('on'); btn.setAttribute('aria-pressed','true');
      state.level = l.id; syncState();
    });
    el.appendChild(btn);
  });
  if (window.lucide) lucide.createIcons({ nameAttr: 'data-lucide', attrs: { 'stroke-width': '1.6' } });
}

function buildBudgetGrid() {
  var el = document.getElementById('budget-grid');
  if (!el) return;
  RESOURCE_BUDGETS.forEach(function(b) {
    var btn = document.createElement('button');
    btn.className = 'stk-btn';
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML =
      '<span class="stk-ico" aria-hidden="true"><i data-lucide="' + b.ico + '"></i></span>' +
      '<span class="stk-name">' + b.label + '</span>' +
      '<span class="stk-sub">' + b.sub + '</span>';
    btn.addEventListener('click', function() {
      el.querySelectorAll('.stk-btn').forEach(function(x) { x.classList.remove('on'); x.setAttribute('aria-pressed','false'); });
      btn.classList.add('on'); btn.setAttribute('aria-pressed','true');
      state.budget = b.id; syncState();
    });
    el.appendChild(btn);
  });
  if (window.lucide) lucide.createIcons({ nameAttr: 'data-lucide', attrs: { 'stroke-width': '1.6' } });
}

function buildCrewGrid() {
  var el = document.getElementById('crew-grid');
  if (!el) return;
  CREW.forEach(function(m) {
    var rankClass = 'rnk-' + m.role;
    var div = document.createElement('div');
    div.className = 'crew-card';
    div.setAttribute('role', 'listitem');
    div.dataset.role = m.role;
    div.innerHTML =
      '<div class="crew-top">' +
        '<div class="crew-avatar">' + m.avatar + '</div>' +
        '<div class="crew-info">' +
          '<div class="crew-name">' + m.name + '</div>' +
          '<div class="crew-handle">' + m.handle + '</div>' +
        '</div>' +
        '<span class="crew-rank ' + rankClass + '">' + m.rank + '</span>' +
      '</div>' +
      '<div class="crew-skills">' + m.skills.map(function(s) { return '<span class="skill-tag">' + s + '</span>'; }).join('') + '</div>' +
      '<div class="crew-stats">' +
        '<div><span class="cstat-v">' + m.missions + '</span><span class="cstat-k">Missions</span></div>' +
        '<div><span class="cstat-v">⭐ ' + m.rating + '</span><span class="cstat-k">Rating</span></div>' +
      '</div>';
    el.appendChild(div);
  });
}


/* ════════════════════════════════════════════════
   E · STATE MANAGEMENT
════════════════════════════════════════════════ */

var state = { type: null, level: null, budget: null };

function syncState() {
  var input  = document.getElementById('mission-input');
  var ccEl   = document.getElementById('char-count');
  var dotEl  = document.getElementById('rdot');
  var txtEl  = document.getElementById('rtxt');
  var chips  = document.getElementById('sel-chips');
  var btn    = document.getElementById('btn-generate');

  var val    = input ? input.value : '';
  var hasObj = !!(val.trim());
  var hasAll = !!(state.type && state.level && state.budget);
  var ready  = hasObj || hasAll;

  /* Char counter */
  if (ccEl) ccEl.textContent = val.length + ' / 120';

  /* Parameter chips */
  if (chips) {
    var chipArr = [];
    if (state.type)   { var t = MISSION_TYPES.find(function(x){return x.id===state.type;});    if(t) chipArr.push(t.label); }
    if (state.level)  { var l = CLEARANCE_LEVELS.find(function(x){return x.id===state.level;}); if(l) chipArr.push(l.label); }
    if (state.budget) { var b = RESOURCE_BUDGETS.find(function(x){return x.id===state.budget;});if(b) chipArr.push(b.label); }
    chips.innerHTML = chipArr.map(function(c){ return '<span class="sel-chip">' + c + '</span>'; }).join('');
  }

  /* Status readout */
  if (dotEl && txtEl) {
    dotEl.className = 'rdot';
    if (ready) {
      dotEl.classList.add('ready');
      txtEl.textContent = 'Parameters locked — ready to generate.';
    } else if (state.type || state.level || state.budget) {
      dotEl.classList.add('active');
      var missing = [];
      if (!state.type)   missing.push('type');
      if (!state.level)  missing.push('level');
      if (!state.budget) missing.push('budget');
      txtEl.textContent = 'Still needed: ' + missing.join(', ') + '.';
    } else {
      dotEl.classList.add('idle');
      txtEl.textContent = 'Awaiting mission parameters…';
    }
  }

  /* Button */
  btn.disabled = !ready;
  btn.setAttribute('aria-disabled', String(!ready));
}


/* ════════════════════════════════════════════════
   F · RENDER ENGINE
════════════════════════════════════════════════ */

/** Replace {IDEA} in prompt text */
function inject(text, idea) {
  return text.split('{IDEA}').join(idea || 'your project');
}

/** HTML-escape a string */
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/**
 * Render a complete mission into the output section.
 * @param {string} variant  — key from WORKFLOWS
 * @param {string} ideaText — the user's original input text
 */
function renderMission(variant, ideaText) {
  var data = WORKFLOWS[variant] || WORKFLOWS.youtube;
  var idea = ideaText || data.label;

  /* ─ Radar navigation path — sync labels + reset to node 1 ─ */
  RDR_LABELS = data.steps.map(function(s) { return s.name; });
  setNodeLevel(1);

  /* ─ Mission banner ─ */
  document.getElementById('mb-icon').textContent = data.icon;
  document.getElementById('mb-name').textContent = idea;
  document.getElementById('mb-tags').innerHTML = data.tags.map(function(t) {
    return '<span class="mb-tag">' + esc(t) + '</span>';
  }).join('');

  /* ─ Node timeline ─ */
  var tl = document.getElementById('node-timeline');
  tl.innerHTML = '';
  data.steps.forEach(function(s) {
    var row = document.createElement('div');
    row.className = 'node-row';
    row.setAttribute('role', 'listitem');
    row.innerHTML =
      '<div class="node-rail">' +
        '<div class="node-dot">' + s.n + '</div>' +
        '<div class="node-vline"></div>' +
      '</div>' +
      '<div class="node-body">' +
        '<div class="node-card">' +
          '<div class="node-info">' +
            '<div class="node-id">NODE ' + s.n + '</div>' +
            '<div class="node-name">' + esc(s.name) + '</div>' +
            '<div class="node-desc">' + esc(s.desc) + '</div>' +
          '</div>' +
          '<div class="node-meta">' +
            '<div class="node-tool">🛠 ' + esc(s.tool) + '</div>' +
            '<div class="node-time">⏱ ' + esc(s.time) + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    tl.appendChild(row);
  });

  /* Staggered reveal animation for nodes */
  var rows = tl.querySelectorAll('.node-row');
  rows.forEach(function(row, i) {
    setTimeout(function() { row.classList.add('visible'); }, 60 + i * 80);
  });

  /* ─ Command scripts ─ */
  var ss = document.getElementById('scripts-stack');
  ss.innerHTML = '';
  data.steps.forEach(function(s) {
    var raw = inject(s.prompt, idea);
    var card = document.createElement('div');
    card.className = 'script-card';
    card.setAttribute('role', 'listitem');
    card.innerHTML =
      '<div class="script-bar">' +
        '<div class="script-dots"><span class="sdot sd-r"></span><span class="sdot sd-y"></span><span class="sdot sd-g"></span></div>' +
        '<span class="script-fname">script_prompt_' + s.n + '.txt</span>' +
        '<span class="script-node-id">NODE ' + s.n + ' · ' + esc(s.name) + '</span>' +
        '<button class="btn-copy" data-raw="' + esc(raw) + '" aria-label="Copy command script for node ' + s.n + '">' +
          '<svg width="10" height="10" viewBox="0 0 11 11" fill="none" aria-hidden="true">' +
            '<rect x="3.5" y="3.5" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.1"/>' +
            '<path d="M1.5 7.5V2a.5.5 0 0 1 .5-.5h5.5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>' +
          '</svg> Copy' +
        '</button>' +
      '</div>' +
      '<div class="script-label">' + esc(s.name) + ' · ' + esc(s.tool) + '</div>' +
      '<pre class="script-body">' + esc(raw) + '</pre>';
    ss.appendChild(card);
  });

  /* Wire copy buttons */
  ss.querySelectorAll('.btn-copy').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var text = btn.getAttribute('data-raw')
        .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"');
      navigator.clipboard.writeText(text).then(function() {
        btn.classList.add('copied');
        btn.innerHTML = '<svg width="10" height="10" viewBox="0 0 11 11" fill="none" aria-hidden="true"><path d="M2 6l2.5 2.5L9 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg> Copied!';
        setTimeout(function() {
          btn.classList.remove('copied');
          btn.innerHTML = '<svg width="10" height="10" viewBox="0 0 11 11" fill="none" aria-hidden="true"><rect x="3.5" y="3.5" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.1"/><path d="M1.5 7.5V2a.5.5 0 0 1 .5-.5h5.5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg> Copy';
        }, 2200);
      });
    });
  });

  /* ─ Output panel ─ */
  var out = data.output;
  document.getElementById('output-wrap').innerHTML =
    '<div class="output-panel">' +
      '<div class="op-eye">✦ Mission Result</div>' +
      '<div class="op-title">' + esc(out.title) + '</div>' +
      '<div class="op-desc">' + esc(out.desc) + '</div>' +
      '<div class="op-items">' + out.items.map(function(i){ return '<span class="op-item">' + esc(i) + '</span>'; }).join('') + '</div>' +
    '</div>';

  /* ─ Reveal section ─ */
  var sec = document.getElementById('mission-output');
  sec.hidden = false;
  setTimeout(function() { sec.scrollIntoView({ behavior:'smooth', block:'start' }); }, 60);
}

/* ════════════════════════════════════════════════
   I · SIMULATION ENGINE
   Loads simulation.json, matches the classifier
   result to a mission, animates step-by-step
   console output, then hands off to the existing
   render engine.
════════════════════════════════════════════════ */

/* Maps classifier variant IDs → simulation mission IDs */
var SIM_MAP = {
  youtube:     'sim_youtube_001',
  podcast:     'sim_youtube_001',
  newsletter:  'sim_book_001',
  book:        'sim_book_001',
  saas:        'sim_startup_001',
  webapp:      'sim_startup_001',
  ai_tool:     'sim_ai_tool_001',
  nocode_auto: 'sim_automate_001',
  script_auto: 'sim_automate_001',
  research:    'sim_book_001',
  social:      'sim_youtube_001',
};

/* In-memory cache — fetch once per session */
var _simCache = null;

/**
 * Fetch simulation.json and cache the result.
 * Calls cb(data) on success, cb(null) on failure.
 */
function loadSimulations(cb) {
  if (_simCache) { cb(_simCache); return; }
  fetch('simulation.json')
    .then(function(r) { return r.json(); })
    .then(function(data) { _simCache = data; cb(data); })
    .catch(function() { cb(null); });
}

/**
 * Return the matching mission object from simulation data.
 * Falls back gracefully if no match is found.
 */
function matchSimulation(variant, data) {
  if (!data || !Array.isArray(data.missions)) return null;
  var id = SIM_MAP[variant] || 'sim_youtube_001';
  for (var i = 0; i < data.missions.length; i++) {
    if (data.missions[i].id === id) return data.missions[i];
  }
  return null;
}

/** Inject simulation overlay styles once into <head> */
var _simStylesInjected = false;
function injectSimStyles() {
  if (_simStylesInjected) return;
  _simStylesInjected = true;
  var s = document.createElement('style');
  s.id = 'sim-styles';
  s.textContent = [
    /* ── Overlay backdrop ── */
    '.sim-overlay{position:fixed;inset:0;z-index:500;',
    'background:rgba(2,5,8,.96);',
    'display:flex;align-items:center;justify-content:center;',
    'opacity:0;transition:opacity .3s ease;',
    'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);}',
    '.sim-overlay.visible{opacity:1;}',
    '.sim-overlay.fade-out{opacity:0;pointer-events:none;}',

    /* ── Panel ── */
    '.sim-panel{width:min(620px,92vw);',
    'background:rgba(9,18,24,.92);',
    'border:1px solid rgba(0,229,212,.22);border-radius:14px;',
    'overflow:hidden;position:relative;',
    'box-shadow:0 0 60px rgba(0,229,212,.13),0 8px 48px rgba(0,0,0,.75);}',

    /* Corner brackets */
    '.sim-panel::before,.sim-panel::after{content:"";position:absolute;',
    'width:18px;height:18px;border-color:rgba(0,229,212,.5);border-style:solid;pointer-events:none;}',
    '.sim-panel::before{top:8px;left:8px;border-width:1.5px 0 0 1.5px;}',
    '.sim-panel::after{bottom:8px;right:8px;border-width:0 1.5px 1.5px 0;}',

    /* ── Progress bar (top edge) ── */
    '.sim-progress{height:2px;background:rgba(0,229,212,.06);}',
    '.sim-progress-fill{height:100%;width:0;transition:width .55s ease;',
    'background:linear-gradient(90deg,#007a71,#00e5d4);',
    'box-shadow:0 0 10px rgba(0,229,212,.5);}',

    /* ── Terminal title bar ── */
    '.sim-topbar{display:flex;align-items:center;gap:8px;',
    'padding:9px 14px;background:rgba(0,229,212,.035);',
    'border-bottom:1px solid rgba(0,229,212,.07);}',
    '.sim-dots{display:flex;gap:5px;}',
    '.sim-dot{width:10px;height:10px;border-radius:50%;}',
    '.sim-dot-r{background:rgba(255,64,96,.5);}',
    '.sim-dot-y{background:rgba(255,176,32,.5);}',
    '.sim-dot-g{background:rgba(0,229,212,.4);}',
    '.sim-fname{font-family:"Share Tech Mono",monospace;font-size:.6rem;',
    'letter-spacing:.1em;color:rgba(0,229,212,.4);}',
    '.sim-badge{margin-left:auto;font-family:"Share Tech Mono",monospace;',
    'font-size:.52rem;letter-spacing:.14em;color:rgba(0,229,212,.5);',
    'background:rgba(0,229,212,.06);border:1px solid rgba(0,229,212,.15);',
    'border-radius:100px;padding:2px 8px;}',

    /* ── Mission header ── */
    '.sim-header{padding:1.2rem 1.5rem .85rem;',
    'border-bottom:1px solid rgba(0,229,212,.06);}',
    '.sim-sys-tag{font-family:"Share Tech Mono",monospace;font-size:.5rem;',
    'letter-spacing:.2em;color:rgba(0,229,212,.3);text-transform:uppercase;margin-bottom:.3rem;}',
    '.sim-title{font-family:"Orbitron",monospace;font-size:.95rem;font-weight:700;',
    'color:#d6f6f2;letter-spacing:.04em;text-shadow:0 0 20px rgba(0,229,212,.15);}',
    '.sim-meta{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:.55rem;}',
    '.sim-pill{font-family:"Share Tech Mono",monospace;font-size:.58rem;',
    'padding:2px 9px;background:rgba(0,229,212,.05);',
    'border:1px solid rgba(0,229,212,.12);border-radius:100px;',
    'color:rgba(0,229,212,.5);}',

    /* ── Step list body ── */
    '.sim-body{padding:.85rem 1.5rem 1.25rem;',
    'max-height:52vh;overflow-y:auto;scrollbar-width:none;}',
    '.sim-body::-webkit-scrollbar{display:none;}',

    /* ── Individual step row ── */
    '.sim-step{display:flex;gap:10px;align-items:flex-start;',
    'padding:.5rem 0;',
    'opacity:0;transform:translateY(7px);',
    'transition:opacity .3s ease,transform .3s ease;',
    'border-bottom:1px solid rgba(0,229,212,.04);}',
    '.sim-step:last-of-type{border-bottom:none;}',
    '.sim-step.show{opacity:1;transform:none;}',
    '.sim-step-n{font-family:"Share Tech Mono",monospace;',
    'font-size:.56rem;font-weight:700;color:#00e5d4;',
    'text-shadow:0 0 8px rgba(0,229,212,.5);',
    'flex-shrink:0;padding-top:3px;min-width:20px;}',
    '.sim-step-name{font-family:"Share Tech Mono",monospace;',
    'font-size:.7rem;font-weight:700;color:#d6f6f2;',
    'letter-spacing:.04em;margin-bottom:.2rem;}',
    '.sim-step-console{font-family:"Share Tech Mono",monospace;',
    'font-size:.69rem;color:rgba(0,229,212,.5);line-height:1.65;}',

    /* ── Blinking cursor ── */
    '.sim-cursor{display:inline-block;width:7px;height:13px;',
    'background:#00e5d4;vertical-align:middle;margin-left:2px;',
    'animation:sim-blink .72s step-end infinite;}',
    '@keyframes sim-blink{0%,100%{opacity:1}50%{opacity:0}}',
  ].join('');
  document.head.appendChild(s);
}

/**
 * Animate simulation steps then call onComplete.
 * @param {object}   mission    — mission object from simulation.json
 * @param {function} onComplete — fired after animation finishes
 */
function runSimulation(mission, onComplete) {
  injectSimStyles();

  var stepCount  = mission.steps.length;
  var STEP_DELAY = 700;

  /* ── Build overlay DOM ── */
  var overlay = document.createElement('div');
  overlay.className = 'sim-overlay';
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-label', 'Running mission simulation');
  overlay.setAttribute('aria-live', 'polite');

  var diffLabel = mission.difficulty.charAt(0).toUpperCase() + mission.difficulty.slice(1);

  overlay.innerHTML =
    '<div class="sim-panel">' +
      '<div class="sim-progress"><div class="sim-progress-fill" id="sim-pfill"></div></div>' +
      '<div class="sim-topbar">' +
        '<div class="sim-dots">' +
          '<span class="sim-dot sim-dot-r"></span>' +
          '<span class="sim-dot sim-dot-y"></span>' +
          '<span class="sim-dot sim-dot-g"></span>' +
        '</div>' +
        '<span class="sim-fname">simulation_engine.run()</span>' +
        '<span class="sim-badge">SYS — SIM</span>' +
      '</div>' +
      '<div class="sim-header">' +
        '<div class="sim-sys-tag">ATM Navigator · Mission Simulation</div>' +
        '<div class="sim-title">' + esc(mission.title) + '</div>' +
        '<div class="sim-meta">' +
          '<span class="sim-pill">⏱ ' + esc(mission.estimated_time) + '</span>' +
          '<span class="sim-pill">◈ ' + esc(diffLabel) + '</span>' +
          '<span class="sim-pill">' + stepCount + ' nodes</span>' +
        '</div>' +
      '</div>' +
      '<div class="sim-body" id="sim-body">' +
        '<span class="sim-cursor" id="sim-cursor"></span>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  /* Fade in on next paint */
  requestAnimationFrame(function() {
    requestAnimationFrame(function() { overlay.classList.add('visible'); });
  });

  var body   = document.getElementById('sim-body');
  var pfill  = document.getElementById('sim-pfill');
  var cursor = document.getElementById('sim-cursor');
  var i      = 0;

  function nextStep() {
    if (i >= stepCount) {
      /* All steps done — finalise and exit */
      if (cursor) cursor.remove();
      pfill.style.width = '100%';
      setTimeout(function() {
        overlay.classList.add('fade-out');
        setTimeout(function() {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
          onComplete();
        }, 360);
      }, 620);
      return;
    }

    var step = mission.steps[i];
    var num  = (i + 1 < 10) ? '0' + (i + 1) : String(i + 1);
    i++;

    /* Build step row */
    var row = document.createElement('div');
    row.className = 'sim-step';
    row.innerHTML =
      '<div class="sim-step-n">' + num + '</div>' +
      '<div>' +
        '<div class="sim-step-name">' + esc(step.name) + '</div>' +
        '<div class="sim-step-console">' + esc(step.console) + '</div>' +
      '</div>';

    /* Insert before cursor so cursor stays at bottom */
    body.insertBefore(row, cursor);

    /* Animate in */
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { row.classList.add('show'); });
    });

    /* Auto-scroll body to keep latest step visible */
    body.scrollTop = body.scrollHeight;

    /* Update progress bar — reserve last tick for 100% on complete */
    pfill.style.width = Math.round((i / stepCount) * 90) + '%';

    setTimeout(nextStep, STEP_DELAY);
  }

  /* Small initial pause before first step */
  setTimeout(nextStep, 320);
}


/** Resolve variant from state + input, then run simulation → render */
function generateMission() {
  var input   = document.getElementById('mission-input');
  var val     = input.value.trim();
  var variant = val ? classify(val) : (PLANET_DEFAULTS[state.type] || 'youtube');
  if (!val && !state.type) { input.focus(); return; }

  var idea = val || WORKFLOWS[variant].label;

  loadSimulations(function(data) {
    var mission = matchSimulation(variant, data);
    if (mission) {
      runSimulation(mission, function() {
        renderMission(variant, idea);
      });
    } else {
      /* Graceful fallback — skip simulation if JSON unavailable */
      renderMission(variant, idea);
    }
  });
}


/* ════════════════════════════════════════════════
   G · EVENT WIRING
════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {

  /* Build all dynamic grids */
  buildTypeGrid();
  buildLevelGrid();
  buildBudgetGrid();
  buildCrewGrid();
  syncState();

  /* Input: char count + sync + enter key */
  var input = document.getElementById('mission-input');
  if (input) {
    input.addEventListener('input', syncState);
    input.addEventListener('keydown', function(e) { if (e.key === 'Enter') generateMission(); });
  }

  /* Generate button */
  var btnGen = document.getElementById('btn-generate');
  if (btnGen) btnGen.addEventListener('click', generateMission);

  /* Example chips */
  document.querySelectorAll('.ex-chip').forEach(function(chip) {
    chip.addEventListener('click', function() {
      if (input) { input.value = chip.textContent.trim(); syncState(); generateMission(); }
    });
  });

  /* Reset */
  var btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', function() {
      if (input) input.value = '';
      state.type = state.level = state.budget = null;
      document.querySelectorAll('.type-btn, .stk-btn').forEach(function(b) {
        b.classList.remove('on'); b.setAttribute('aria-pressed','false');
      });
      var ms = document.getElementById('mission-output');
      if (ms) ms.hidden = true;
      syncState();
      document.getElementById('console').scrollIntoView({ behavior:'smooth', block:'start' });
    });
  }

  /* Launch Mission (placeholder — future API hook) */
  var btnLaunch = document.getElementById('btn-launch');
  if (btnLaunch) {
    btnLaunch.addEventListener('click', function() {
      var orig = btnLaunch.textContent;
      btnLaunch.textContent = '✓ Mission Launched!';
      btnLaunch.style.background = 'var(--green)';
      setTimeout(function() { btnLaunch.textContent = orig; btnLaunch.style.background = ''; }, 2800);
    });
  }

  /* Save to Library (placeholder) */
  var btnSave = document.getElementById('btn-save');
  if (btnSave) {
    btnSave.addEventListener('click', function() {
      var orig = btnSave.textContent;
      btnSave.textContent = '✓ Saved';
      setTimeout(function() { btnSave.textContent = orig; }, 2500);
    });
  }

  /* Crew filter buttons */
  document.querySelectorAll('.cf-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.cf-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.dataset.filter;
      document.querySelectorAll('.crew-card').forEach(function(c) {
        c.style.display = (f === 'all' || c.dataset.role === f) ? '' : 'none';
      });
    });
  });

  /* Mobile nav toggle */
  var toggle = document.getElementById('mob-toggle');
  var mNav   = document.getElementById('mob-nav');
  if (toggle && mNav) {
    toggle.addEventListener('click', function() {
      var open = !mNav.hidden;
      mNav.hidden = open;
      toggle.setAttribute('aria-expanded', String(!open));
    });
  }

  /* Smooth scroll nav */
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior:'smooth', block:'start' });
      if (mNav && !mNav.hidden) { mNav.hidden = true; if (toggle) toggle.setAttribute('aria-expanded','false'); }
    });
  });

});


/* ════════════════════════════════════════════════
   H · UTILITIES — boot sequence, clock, counter
════════════════════════════════════════════════ */

/** Boot sequence — runs immediately */
(function boot() {
  var overlay  = document.getElementById('boot-overlay');
  var bar      = document.getElementById('boot-fill');
  var statusEl = document.getElementById('boot-status');
  if (!overlay || !bar) return;

  var steps = [
    { pct: 20,  msg: 'LOADING KERNEL…'            },
    { pct: 45,  msg: 'MAPPING WORKFLOW LIBRARY…'  },
    { pct: 70,  msg: 'CALIBRATING CLASSIFIER…'    },
    { pct: 90,  msg: 'CONNECTING CREW NETWORK…'   },
    { pct: 100, msg: 'SYSTEM ONLINE'              },
  ];

  var i = 0;
  function tick() {
    if (i >= steps.length) {
      /* Fade out after final step */
      setTimeout(function() { overlay.classList.add('gone'); }, 320);
      return;
    }
    var step = steps[i++];
    bar.style.width = step.pct + '%';
    if (statusEl) statusEl.textContent = step.msg;
    setTimeout(tick, i === steps.length ? 300 : 240 + Math.random() * 100);
  }

  /* Small initial delay so fonts load */
  setTimeout(tick, 200);
})();

/** Live UTC clock */
function startClock() {
  var el = document.getElementById('utc-clock');
  if (!el) return;
  function tick() {
    var d = new Date();
    el.textContent =
      String(d.getUTCHours()).padStart(2,'0') + ':' +
      String(d.getUTCMinutes()).padStart(2,'0') + ':' +
      String(d.getUTCSeconds()).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);
}

/** Animated mission counter on load */
function animateCounter() {
  var el = document.getElementById('ctr-missions');
  if (!el) return;
  var target = 2841, current = target - 80, step = 3;
  var t = setInterval(function() {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString();
    if (current >= target) clearInterval(t);
  }, 22);
}

startClock();
animateCounter();


/* ════════════════════════════════════════════════
   I · RADAR NAVIGATION PATH
   ─────────────────────────────────────────────
   Single-variable control:
     setNodeLevel(n)  — pass 1..6
     n=1 → node 1 active, nodes 2–6 locked
     n=3 → nodes 1–2 completed, node 3 active, 4–6 locked

   Called automatically when renderMission() fires
   (resets to level 1 with step names from workflow).
   Prev / Next buttons advance it manually.
════════════════════════════════════════════════ */

/* ── The one variable you control ── */
var NODE_LEVEL = 1;

/* ── Node layout
   CSS left/top (%) map exactly to SVG viewBox 1000×200
   e.g. left:8%, top:48% → SVG x=80, y=96
   Adjust the y-values to reshape the wave path. ── */
var RDR_POS = [
  [8,  48],   /* Node 1 */
  [24, 28],   /* Node 2 */
  [40, 60],   /* Node 3 */
  [56, 32],   /* Node 4 */
  [72, 64],   /* Node 5 */
  [88, 44],   /* Node 6 */
];

/* Step name labels — overwritten by renderMission() */
var RDR_LABELS = ['Research', 'Create', 'Produce', 'Refine', 'Launch', 'Scale'];

/* ────────────────────────────────
   PUBLIC API
──────────────────────────────── */

/**
 * Set the active node level and re-render everything.
 * @param {number} n — 1-based. 1 = first node active.
 */
function setNodeLevel(n) {
  NODE_LEVEL = Math.max(1, Math.min(n, RDR_POS.length));
  _rdrLines();
  _rdrDots();
  _rdrStatus();
}

/* ────────────────────────────────
   PRIVATE RENDERERS
──────────────────────────────── */

function _rdrLines() {
  var svg = document.getElementById('rdr-lines');
  if (!svg) return;

  /* Glow filter — injected once into SVG defs */
  var defs =
    '<defs>' +
      '<filter id="rdr-glow" x="-80%" y="-80%" width="260%" height="260%">' +
        '<feGaussianBlur stdDeviation="1.2" result="blur"/>' +
        '<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>' +
      '</filter>' +
    '</defs>';

  var lines = '';
  for (var i = 0; i < RDR_POS.length - 1; i++) {
    /* Convert % coords → SVG viewBox 1000×200 coords */
    var x1 = RDR_POS[i][0]     * 10;
    var y1 = RDR_POS[i][1]     * 2;
    var x2 = RDR_POS[i + 1][0] * 10;
    var y2 = RDR_POS[i + 1][1] * 2;

    var cls    = i < NODE_LEVEL - 1 ? 'completed' :
                 i === NODE_LEVEL - 1 ? 'active-seg' : 'locked';
    var filter = cls === 'completed' ? ' filter="url(#rdr-glow)"' : '';

    lines +=
      '<line class="' + cls + '"' + filter +
      ' x1="' + x1 + '" y1="' + y1 + '"' +
      ' x2="' + x2 + '" y2="' + y2 + '"/>';
  }

  svg.innerHTML = defs + lines;
}

function _rdrDots() {
  var wrap = document.getElementById('rdr-nodes-wrap');
  if (!wrap) return;

  var html = '';
  RDR_POS.forEach(function(pos, i) {
    var num   = i + 1;
    var state = num < NODE_LEVEL ? 'completed' :
                num === NODE_LEVEL ? 'active'   : 'locked';
    var label = RDR_LABELS[i] || ('NODE ' + String(num).padStart(2, '0'));

    /* Three expanding rings on the active node only */
    var rings = state === 'active'
      ? '<div class="rdr-ring rdr-ring-1" aria-hidden="true"></div>' +
        '<div class="rdr-ring rdr-ring-2" aria-hidden="true"></div>' +
        '<div class="rdr-ring rdr-ring-3" aria-hidden="true"></div>'
      : '';

    html +=
      '<div class="rdr-node ' + state + '"' +
           ' style="left:' + pos[0] + '%;top:' + pos[1] + '%"' +
           ' role="listitem"' +
           ' aria-label="Phase ' + num + ': ' + label + ' (' + state + ')">' +
        rings +
        '<div class="rdr-dot">' +
          '<span class="rdr-n">' + String(num).padStart(2, '0') + '</span>' +
        '</div>' +
        '<div class="rdr-label">' + esc(label) + '</div>' +
      '</div>';
  });

  wrap.innerHTML = html;
}

function _rdrStatus() {
  var nodeVal  = document.getElementById('rds-node-val');
  var phaseLbl = document.getElementById('rds-phase-lbl');
  var barFill  = document.getElementById('rds-bar-fill');
  var barGlow  = document.getElementById('rds-bar-glow');
  var pb       = document.getElementById('rds-progressbar');

  var total = RDR_POS.length;
  var pct   = ((NODE_LEVEL - 1) / (total - 1)) * 100;

  if (nodeVal)  nodeVal.textContent  = String(NODE_LEVEL).padStart(2,'0') + ' / ' + String(total).padStart(2,'0');
  if (phaseLbl) phaseLbl.textContent = RDR_LABELS[NODE_LEVEL - 1] || 'ACTIVE';
  if (barFill)  barFill.style.width  = pct + '%';
  if (barGlow)  barGlow.style.left   = pct + '%';
  if (pb)       pb.setAttribute('aria-valuenow', NODE_LEVEL);
}

/* ────────────────────────────────
   WIRE PREV / NEXT + INITIAL RENDER
──────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  /* Initial render — node 1 active, labels are default */
  setNodeLevel(1);

  var prev = document.getElementById('rds-prev');
  var next = document.getElementById('rds-next');
  if (prev) prev.addEventListener('click', function() { setNodeLevel(NODE_LEVEL - 1); });
  if (next) next.addEventListener('click', function() { setNodeLevel(NODE_LEVEL + 1); });
});

/* ────────────────────────────────
   INTEGRATION HOOK
   Called from renderMission() (Section F).
   Updates radar labels from the workflow steps
   and resets to node 1 each time a new mission loads.

   To integrate, add these two lines inside renderMission():
     RDR_LABELS = data.steps.map(function(s){ return s.name; });
     setNodeLevel(1);
──────────────────────────────── */
