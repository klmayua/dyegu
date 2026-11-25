"""DYEGU site content. Edit words here, then run: python tools/build.py --sync
Everything Sir K hasn't approved yet is marked DRAFT in a comment."""

SITE = "https://dyegu.co"   # change once the domain is bought (dyegulive.com?)
YOUTUBE = "https://www.youtube.com/@DYEGUOfficial"
SUPPORT_URL = "https://findahelpline.com"

# ---- Complete Season 1 slate (14 Sundays: 6 Dec 2026 – 7 Mar 2027) ----
# Titles stay off the public site until Gate 1A; subjects and documented arcs lead.
STORIES = [
    dict(no="01", slug="steve-jobs", subject="Steve Jobs", date="2026-12-06T14:00:00Z", live_page=True,
         category="Tech · US", arc="The comeback that took a decade",
         fall="Forced out of Apple, the company he co-founded, at 30.",
         rise="Eleven years, two companies and a near-bankrupt Apple later, he walked back in.",
         synopsis="In 1985, at 30, Steve Jobs was stripped of every operating role at the company he co-founded and walked out. He spent eleven years building NeXT and funding Pixar through years of losses. Then Toy Story, Pixar's IPO and Apple's purchase of NeXT brought him back to a company that had just lost more than a billion dollars.",
         stages=["job", "stuck", "rejected"]),
    dict(no="02", slug="jk-rowling", subject="J.K. Rowling", date="2026-12-13T14:00:00Z", live_page=True,
         category="Literature · UK", arc="Had it, lost it, rebuilt",
         fall="A single mother on benefits in Edinburgh, grieving, with three chapters and a stack of rejections.",
         rise="Then one eight-year-old reader said yes.",
         synopsis="In the mid-1990s Joanne Rowling was a single mother on state benefits in Edinburgh, still grieving her mother, with the opening chapters of a children's book. Publisher after publisher said no. Then an eight-year-old girl read chapter one.",
         stages=["rejected", "money", "breakup", "grief"]),
    dict(no="03", slug="tyler-perry", subject="Tyler Perry", date="2026-12-20T14:00:00Z", live_page=True,
         category="Film & Media · US", arc="Had it, lost it, rebuilt",
         fall="He spent his $12,000 savings on one play. About thirty people came. He slept in his car.",
         rise="He kept staging it, year after year, until the seventh. Today he owns one of America's largest studios.",
         synopsis="Tyler Perry saved $12,000 and spent all of it staging his first play in Atlanta in 1992. About thirty people came. He lived in his car for three months and kept staging the same play once a year while it failed, until 1998. In 2015 he bought 330 acres of a former army base and built one of America's largest film studios.",
         stages=["money", "rejected", "stuck"]),
    dict(no="04", slug="nwankwo-kanu", subject="Nwankwo Kanu", date="2026-12-27T14:00:00Z",
         category="Football · Nigeria / UK", arc="Two comebacks in one life",
         fall="Weeks after captaining Nigeria to Olympic gold at 20, a routine medical exposed a fatal congenital heart defect.",
         rise="After emergency open-heart surgery, he defied every diagnosis to become an Arsenal Invincible.",
         stages=["health"]),
    dict(no="05", slug="brendan-fraser", subject="Brendan Fraser", date="2027-01-03T14:00:00Z",
         category="Film · Canada / US", arc="The comeback that took a decade",
         fall="Seven years of spine, knee and vocal-cord surgeries alongside grief and a decade of quiet exile from Hollywood.",
         rise="He returned to a six-minute standing ovation in Venice and the Best Actor Oscar.",
         stages=["health", "job", "later", "grief"]),
    dict(no="06", slug="tina-turner", subject="Tina Turner", date="2027-01-10T14:00:00Z",
         category="Music · US / Europe", arc="Had it, lost it, rebuilt",
         fall="She walked away with 36 cents and a gas card, giving up everything else just to keep her name.",
         rise="Dismissed by labels at 44, she rebuilt in Europe and swept three Grammys.",
         stages=["breakup", "money", "later"]),
    dict(no="07", slug="season-1-marathon", subject="Mid-Season Marathon", date="2027-01-17T14:00:00Z",
         special=True, category="Special · 90 Minutes", arc="Marathon compilation",
         fall="Six documented journeys of people who lost everything — Jobs, Rowling, Perry, Kanu, Fraser and Turner.",
         rise="Woven with a brand-new 2027 New Year reflection from Sir K for focused Sunday viewing.",
         stages=["job", "money", "health", "breakup", "rejected", "later"]),
    dict(no="08", slug="denzel-washington", subject="Denzel Washington", date="2027-01-24T14:00:00Z",
         category="Film · US", arc="The comeback that took a decade",
         fall="Dismissed from Fordham University with a 1.7 GPA while his closest boyhood friends faced decades in prison.",
         rise="A handwritten note in his mother's beauty parlour sparked a turnaround that reshaped cinema.",
         stages=["stuck", "rejected"]),
    dict(no="09", slug="monica-seles", subject="Monica Seles", date="2027-01-31T14:00:00Z",
         category="Tennis · Europe / US", arc="Had it, lost it, rebuilt",
         fall="World No. 1 with eight Grand Slams at 19 — until an on-court attack stole 28 months of her prime.",
         rise="She walked back onto centre court and won the 1996 Australian Open.",
         stages=["health", "stuck"]),
    dict(no="10", slug="tyson-fury", subject="Tyson Fury", date="2027-02-07T14:00:00Z",
         category="Boxing · UK / Global", arc="Had it, lost it, rebuilt",
         fall="Stripped of his heavyweight belts and sinking to 400 pounds in severe depression after reaching the summit.",
         rise="He shed over 150 pounds, rose off the canvas at the count of nine, and reclaimed the crown.",
         stages=["health", "stuck", "money"]),
    dict(no="11", slug="shania-twain", subject="Shania Twain", date="2027-02-14T14:00:00Z",
         category="Music · Canada / Global", arc="Two comebacks in one life",
         fall="Lost both parents at 22, and later lost her marriage and her singing voice to nerve damage.",
         rise="After open-throat surgery and years of rehabilitation, she returned to top the Billboard charts.",
         stages=["grief", "breakup", "health", "later"]),
    dict(no="12", slug="simone-biles", subject="Simone Biles", date="2027-02-21T14:00:00Z",
         category="Gymnastics · US / Global", arc="Had it, lost it, rebuilt",
         fall="From foster care to global icon — then walking away mid-Olympics in Tokyo under fierce backlash.",
         rise="Two years spent healing her mind and body led to three Olympic gold medals in Paris.",
         stages=["health", "rejected", "stuck"]),
    dict(no="13", slug="african-diaspora-comeback", subject="African / Diaspora Comeback", date="2027-02-28T14:00:00Z",
         tbc=True, category="Announced Soon · Africa / Diaspora", arc="Two comebacks in one life",
         fall="A landmark documented African & diaspora rebuild — currently in final claims review from our Season 1 shortlist.",
         rise="Revealed first to Comeback File subscribers ahead of February 2027.",
         stages=["money", "grief", "rejected", "stuck"]),
    dict(no="14", slug="george-foreman", subject="George Foreman", date="2027-03-07T14:00:00Z",
         category="Boxing & Business · US", arc="The comeback that took a decade",
         fall="Broke, mocked and twenty years past his prime while fighting to keep his Houston youth centre alive.",
         rise="At 45, wearing the same red trunks from Zaire, he won the heavyweight title and built a business empire.",
         stages=["later", "money", "rejected"]),
]

# ---- "Where are you right now?" ---- DRAFT copy, Sir K to approve
STAGES = [
    dict(key="job", short="I lost my job", title="You lost your job.",
         tag="Career & Identity",
         sub="Fired, laid off, pushed out or quietly passed over.",
         lede="Fired, laid off, pushed out or quietly passed over. It feels personal because work is where a lot of us keep our sense of worth. It is not the end of your story.",
         rule_preview="Losing the seat you built is brutal. Letting bitterness become your career is the only real defeat.",
         moves=[
             ("Write down what happened, facts only.", "One page. Dates, decisions, what you did and didn't control. No verdicts on yourself. It turns a fog into something you can work with.", "Day 1–2"),
             ("Message three people who've seen your work.", "Not to ask for a job. Ask for fifteen minutes and one honest view of where you're strongest. Most comebacks start with a conversation, not an application.", "Day 3–4"),
             ("Pick one skill for the next 90 days.", "The one that would make you more valuable in the room you want to be in. Book the first hour of it this week.", "Day 5–7"),
         ]),
    dict(key="money", short="My business or money is gone", title="Your business failed, or the money ran out.",
         tag="Finances & Venture",
         sub="Debt, a closed company, savings depleted.",
         lede="Debt, a closed company, savings gone. Money trouble is loud and private at the same time. People have rebuilt from far less than you have right now.",
         rule_preview="Your balance sheet can hit zero without erasing what you know how to build.",
         moves=[
             ("Put the whole number on one page.", "What you owe, to whom, and when it's due. Fear lives in the parts you haven't looked at.", "Day 1–2"),
             ("Separate the loss from who you are.", "Write down what the attempt taught you that nobody can repossess: skills, contacts, judgement.", "Day 3–4"),
             ("Make one call before they call you.", "Pick one creditor or one partner and ask what a realistic plan looks like. Get qualified advice before signing anything; this page isn't financial advice.", "Day 5–7"),
         ]),
    dict(key="breakup", short="Starting over after a breakup", title="You're starting over after a breakup or divorce.",
         tag="Home & Chapter Two",
         sub="The life you planned has changed shape.",
         lede="The life you planned has changed shape, and sometimes the home, the friends and the money change with it. Starting again is not starting from nothing.",
         rule_preview="Starting again is not starting from zero — you carry your name and everything you survived.",
         moves=[
             ("Protect the basics first.", "Sleep, food, movement, a regular time you get up. Big decisions wait until the ground stops moving.", "Day 1–2"),
             ("Tell one trusted person exactly how it is.", "Not the brave version. The real one. Carrying it alone makes it heavier.", "Day 3–4"),
             ("Start one thing that's only yours.", "A class, a route, a project, a Sunday ritual. Something with your name on it, not your old life's.", "Day 5–7"),
         ]),
    dict(key="health", short="A health setback", title="Your health set you back.",
         tag="Body & Recovery",
         sub="An injury, a diagnosis, a long recovery.",
         lede="An injury, a diagnosis, a long recovery. When your body changes the plan, everything else can feel on hold. Many of the comebacks in this series started in a hospital.",
         rule_preview="Slower is not the same as over. Redraw the timeline, never surrender the dignity of the climb.",
         moves=[
             ("Follow your care team's plan, and ask your questions.", "Write them down before appointments. You're allowed to understand what's happening to you.", "Day 1–2"),
             ("Measure progress in small units.", "Days, not months. A walk to the corner counts. Write each one down; on bad days, read the list.", "Day 3–5"),
             ("Redraw the timeline, not the goal.", "Most comebacks took longer than anyone expected. Slower is not the same as over.", "Day 6–7"),
         ], sensitive=True),
    dict(key="rejected", short="Rejected again", title="You've been rejected. Again.",
         tag="Persistence & Craft",
         sub="The pitch, the publisher, the role, the door that stayed closed.",
         lede="The application, the audition, the pitch, the publisher. Every no lands on the same bruise. The people in these stories collected a lot of them before the yes.",
         rule_preview="Twelve nos are data, not a verdict. You only need the right room to read chapter one.",
         moves=[
             ("Count the nos as data, not a verdict.", "Keep a list: what you sent, to whom, what came back. Patterns show up that feelings hide.", "Day 1–2"),
             ("Ask one person who said no for one reason.", "Short and polite. Most won't answer; the one who does may change your next attempt.", "Day 3–4"),
             ("Set a number, not a deadline.", "\"Ten more attempts\" is in your control. \"By March\" isn't.", "Day 5–7"),
         ]),
    dict(key="later", short="Starting over at 40, 50 or later", title="You're starting over later in life.",
         tag="Second Act",
         sub="More responsibility, less patience for noise, deeper judgement.",
         lede="40, 50, 60 or beyond, with less time and more responsibility than the first time. Experience is an asset most beginners would pay for.",
         rule_preview="You are not late. You are arriving with decades of pattern recognition nobody can shortcut.",
         moves=[
             ("List what you already know how to do.", "Everything, including the things you stopped noticing. You're not starting from zero; you're starting from a different place.", "Day 1–2"),
             ("Find one person ten years ahead of you on the new road.", "Ask how they started, and what they'd skip.", "Day 3–5"),
             ("Choose a first step you can finish in a month.", "Momentum matters more than the size of the first win.", "Day 6–7"),
         ]),
    dict(key="stuck", short="Stuck or lost my direction", title="You're stuck, or you've lost your direction.",
         tag="Clarity & Motion",
         sub="Nothing collapsed — you just can't see the next step.",
         lede="Nothing has collapsed, exactly. You just can't see the next step, and the years are moving. That counts as a setback too.",
         rule_preview="Clarity rarely arrives while standing still. Direction is what motion leaves behind.",
         moves=[
             ("Write down when you last felt fully alive at work or in life.", "What were you doing? Who with? That's a clue, not nostalgia.", "Day 1–2"),
             ("Run one small experiment this week.", "A conversation, a class, a weekend project. Direction usually comes from motion, not thinking.", "Day 3–5"),
             ("Cut one thing that keeps you comfortable and stuck.", "An hour of scrolling, a standing commitment you've outgrown. Make room for the experiment.", "Day 6–7"),
         ]),
    dict(key="grief", short="Grieving a loss", title="You're grieving.",
         tag="Loss & Grounding",
         sub="A person, a marriage, a career, a version of yourself.",
         lede="A person, a marriage, a career, a version of yourself. Grief doesn't follow a schedule, and nothing here is meant to rush it.",
         rule_preview="You do not have to perform strength. Keep one steady anchor while the ground settles.",
         moves=[
             ("Let it be as big as it is.", "You don't need to be fine. Tell someone you trust how it actually is.", "Today"),
             ("Keep one small daily anchor.", "A walk, a meal at the same time, a call. Something steady while the rest isn't.", "This week"),
             ("Get support if it's getting heavier, not lighter.", "A doctor, a counsellor or a grief group can help carry it. Asking is strength, not weakness.", "Whenever needed"),
         ], sensitive=True),
]

# ---- Drop 01 — Rise ---- (DRAFT; no sales until vector masters, trademark search and gold-matched samples clear)
PRODUCTS = [
    dict(key="mug", name="The Studio Mug", spec="12 oz matte-black ceramic · flat gold phoenix",
         note="Matte black, gold phoenix. The straight-walled ceramic mug on Sir K's desk in every episode."),
    dict(key="tee", name="Rise Tee", spec="280 gsm heavyweight black cotton · chest mark + back script",
         note="Heavyweight black cotton. Small gold phoenix on the chest; DON'T YOU EVER GIVE UP across the back."),
    dict(key="hoodie", name="Rise Hoodie", spec="420 gsm brushed black fleece · structured hood",
         note="Heavyweight black fleece, same restrained placement as the tee. Built for the long nights."),
    dict(key="cap", name="Phoenix Cap", spec="6-panel matte cotton twill · flat gold stitch",
         note="Structured matte black with an embroidered gold phoenix. Nothing else."),
    dict(key="journal", name="Rebuild Journal", spec="A5 linen hardcover · 192 dot-grid pages · gold ribbon",
         note="A matte-black linen notebook designed to sit beside The Rebuild Playbook."),
]

# ---- Rebuild Playbook Chapter 1 Sample Preview ----
PLAYBOOK_CHAPTERS = [
    ("I", "Name the fall", "What actually happened, without the verdict you've been telling yourself."),
    ("II", "Stop the bleeding", "The first fourteen days after a shock — protecting sleep, cash and judgement."),
    ("III", "Count what survives", "Skills, relationships, proof and time that nobody can repossess."),
    ("IV", "The first thirty days", "Small, verifiable moves that convert paralysis into momentum."),
    ("V", "The long middle", "How Season 1's subjects endured years when nothing looked like winning."),
    ("VI", "Building proof", "Earning trust and rooms again through quiet, documented output."),
    ("VII", "Your DYEGU rule", "Distilling the single operational sentence you will carry into Act II."),
]

PLAYBOOK_SAMPLE = dict(
    chapter="Chapter I · Worksheet Excerpt",
    title="The Two-Column Reality Audit",
    intro="Before Steve Jobs built NeXT or J.K. Rowling finished chapter four, they had to separate documented fact from internal catastrophe. Complete this on one quiet page:",
    prompts=[
        ("Column A — The Documented Facts", "Write 5 bullet points a journalist could verify with dates and numbers. No adjectives about your worth."),
        ("Column B — The Story You Added", "Write the private verdicts running in your head ('I ruined everything', 'I'm too late'). Draw a line through each one."),
        ("The Surviving Inventory", "List 3 capabilities, 3 people who respect your work, and 1 thing you can finish in the next 7 days."),
    ],
)

# ---- Community ---- DRAFT, Sir K to approve
CIRCLE_WEEKS = [
    ("Week 01", "Name the ground", "Meet your 6–8 peers, establish confidentiality, and state honestly where you stand."),
    ("Week 02", "Strip the noise", "Separate facts from verdicts using the DYEGU reality audit and one documented story."),
    ("Week 03", "Count what remains", "Map transferable skills, allies, and one quiet win you can complete in 7 days."),
    ("Week 04", "The long middle", "Tackle the hardest obstacle in your rebuild with honest group feedback."),
    ("Week 05", "Build proof", "Make one outward move — an email, a prototype, an application, a boundary."),
    ("Week 06", "Your DYEGU rule", "Write the principle you are carrying forward and set your 90-day next milestone."),
]

SESSION_TOPICS = [
    ("career", "Job search, CVs and interviews"),
    ("change", "Changing career, including at 40+"),
    ("money", "Debt and money basics"),
    ("business", "Starting a business again"),
    ("legal", "Legal basics after a layoff or divorce"),
    ("health", "Living and working through recovery"),
    ("wellbeing", "Stress, sleep and staying well"),
    ("grief", "Grief and loss"),
    ("skills", "Learning a new skill fast"),
]

VOLUNTEER_FORMATS = [
    ("session", "Lead a free group session (45 min talk and Q&A)"),
    ("circle", "Facilitate a Rebuild Circle (6 weekly calls, training provided)"),
    ("written", "Answer reader questions in writing for the Comeback File"),
    ("office", "One-to-one office hours (later, by invitation only)"),
]

# ---- Sir K Speaker & Press Kit ----
SPEAKER_KIT = dict(
    short_bio="Sir K is the creator and host of DYEGU (Don't You Ever Give Up), a fact-checked documentary series profiling documented comebacks after public loss. With more than twenty years building companies, teams and technology across Africa and beyond, he speaks to organisations, founders and global audiences on resilience grounded in evidence, not slogans.",
    long_bio="Sir K has spent more than two decades building companies, teams and technology ventures across Africa and internationally—navigating major growth cycles as well as hard rebuilds firsthand. In 2026 he launched DYEGU (Don't You Ever Give Up), an independent documentary house and free peer-support community dedicated to telling true, primary-sourced stories of people who lost status, health, livelihood or direction and came back. On stage, Sir K brings the same calm baritone, journalistic rigour and practical clarity that define the series—leaving audiences with concrete frameworks for rebuilding rather than temporary motivational hype.",
    audiences=["Corporate leadership & all-hands", "Founder & tech summits", "Universities & alumni", "Diaspora & global conferences"],
    formats=["Keynote (30–60 min)", "Half-day executive workshop", "Fireside & moderated Q&A", "Virtual global town halls"],
)
