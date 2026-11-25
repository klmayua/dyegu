"""DYEGU site content — written in DYEGU's documentary voice.
Run `python tools/build.py --sync` after edits."""

SITE = "https://dyegu.co"
HANDLE = "@dyegulive"
YOUTUBE = "https://www.youtube.com/@dyegulive"
INSTAGRAM = "https://www.instagram.com/dyegulive"
X_URL = "https://x.com/dyegulive"
FACEBOOK = "https://www.facebook.com/dyegulive"
SUPPORT_URL = "https://findahelpline.com"

# ---- Complete Season 1 slate (14 Sundays: 6 Dec 2026 – 7 Mar 2027) ----
STORIES = [
    dict(no="01", slug="steve-jobs", subject="Steve Jobs", date="2026-12-06T14:00:00Z", live_page=True,
         category="Tech · US", arc="The comeback that took a decade", wilderness="11 years",
         fall="Stripped of every operating role at Apple at 30. An office, a title, and no job.",
         rise="Eleven years, two companies, and a near-bankrupt Apple later, he walked back in.",
         synopsis="In May 1985, at thirty, Steve Jobs was stripped of every operating role at the company he co-founded. His own chief executive told Wall Street there was no role for him, today or in the future. He spent the next eleven years building NeXT and funding Pixar through losses that looked like defeat — until Toy Story, Pixar's IPO, and Apple's purchase of NeXT brought him back.",
         stages=["job", "stuck", "rejected"]),
    dict(no="02", slug="jk-rowling", subject="J.K. Rowling", date="2026-12-13T14:00:00Z", live_page=True,
         category="Literature · UK", arc="Had it, lost it, rebuilt", wilderness="3 years",
         fall="A single mother on state benefits in Edinburgh, grieving, with three chapters and twelve rejections.",
         rise="Then an eight-year-old girl read chapter one and asked for more.",
         synopsis="In 1994, Joanne Rowling was jobless, grieving her mother, raising an infant alone on income support in Edinburgh, and calling herself the biggest failure she knew. Twelve publishers turned the manuscript down. Then Bloomsbury's chairman took chapter one home to his eight-year-old daughter.",
         stages=["rejected", "money", "breakup", "grief"]),
    dict(no="03", slug="tyler-perry", subject="Tyler Perry", date="2026-12-20T14:00:00Z", live_page=True,
         category="Film & Media · US", arc="Had it, lost it, rebuilt", wilderness="6 years",
         fall="He bet his entire $12,000 savings on one play. Thirty people came. He slept in a Geo Metro.",
         rise="He staged the same play once a year while it failed — until year seven.",
         synopsis="Tyler Perry saved $12,000 as a bill collector and spent every dollar renting a hall in Atlanta in 1992. He expected 1,200 people; about thirty showed up. Six foot five, sleeping in a Geo Metro he hid from the repo man, he kept staging the play once a year while it failed — until 1998 broke everything open.",
         stages=["money", "rejected", "stuck"]),
    dict(no="04", slug="nwankwo-kanu", subject="Nwankwo Kanu", date="2026-12-27T14:00:00Z",
         category="Football · Nigeria / UK", arc="Two comebacks in one life", wilderness="2 years",
         fall="Weeks after Olympic gold at 20, a routine medical exposed a fatal heart defect.",
         rise="After emergency open-heart surgery, he defied every diagnosis to become an Arsenal Invincible.",
         stages=["health"]),
    dict(no="05", slug="brendan-fraser", subject="Brendan Fraser", date="2027-01-03T14:00:00Z",
         category="Film · Canada / US", arc="The comeback that took a decade", wilderness="10 years",
         fall="Seven years of spine, knee and vocal-cord surgeries alongside grief and a decade out of sight.",
         rise="He returned to a six-minute standing ovation in Venice and the Best Actor Oscar.",
         stages=["health", "job", "later", "grief"]),
    dict(no="06", slug="tina-turner", subject="Tina Turner", date="2027-01-10T14:00:00Z",
         category="Music · US / Europe", arc="Had it, lost it, rebuilt", wilderness="8 years",
         fall="She ran across a Dallas highway with 36 cents and a Mobil gas card — giving up everything to keep her name.",
         rise="Dismissed by American labels at 44, she rebuilt in Europe and swept three Grammys.",
         stages=["breakup", "money", "later"]),
    dict(no="07", slug="season-1-marathon", subject="Mid-Season Marathon", date="2027-01-17T14:00:00Z",
         special=True, category="Special · 90 Minutes", arc="Marathon compilation", wilderness="6 lives",
         fall="Six documented journeys of people who lost everything — Jobs, Rowling, Perry, Kanu, Fraser and Turner.",
         rise="Woven together for focused Sunday living-room viewing.",
         stages=["job", "money", "health", "breakup", "rejected", "later"]),
    dict(no="08", slug="denzel-washington", subject="Denzel Washington", date="2027-01-24T14:00:00Z",
         category="Film · US", arc="The comeback that took a decade", wilderness="14 years",
         fall="Dismissed from university with a 1.7 GPA while his closest boyhood friends went to prison.",
         rise="A handwritten note in his mother's beauty parlour sparked a quiet, disciplined turnaround.",
         stages=["stuck", "rejected"]),
    dict(no="09", slug="monica-seles", subject="Monica Seles", date="2027-01-31T14:00:00Z",
         category="Tennis · Europe / US", arc="Had it, lost it, rebuilt", wilderness="28 months",
         fall="World No. 1 with eight Grand Slams at 19 — until an on-court attack stole 28 months of her prime.",
         rise="She walked back onto centre court and won the 1996 Australian Open.",
         stages=["health", "stuck"]),
    dict(no="10", slug="tyson-fury", subject="Tyson Fury", date="2027-02-07T14:00:00Z",
         category="Boxing · UK / Global", arc="Had it, lost it, rebuilt", wilderness="3 years",
         fall="Stripped of his heavyweight belts and sinking to 400 pounds in crushing depression.",
         rise="He shed over 150 pounds, rose off the canvas at nine, and reclaimed the title.",
         stages=["health", "stuck", "money"]),
    dict(no="11", slug="shania-twain", subject="Shania Twain", date="2027-02-14T14:00:00Z",
         category="Music · Canada / Global", arc="Two comebacks in one life", wilderness="15 years",
         fall="Lost both parents at 22, and later lost her marriage and her singing voice to nerve damage.",
         rise="After open-throat surgery and years of silent rehabilitation, she returned to #1.",
         stages=["grief", "breakup", "health", "later"]),
    dict(no="12", slug="simone-biles", subject="Simone Biles", date="2027-02-21T14:00:00Z",
         category="Gymnastics · US / Global", arc="Had it, lost it, rebuilt", wilderness="2 years",
         fall="From foster care to global icon — then stepping away mid-Olympics in Tokyo under global backlash.",
         rise="Two years spent healing her mind and body led to three Olympic gold medals in Paris.",
         stages=["health", "rejected", "stuck"]),
    dict(no="13", slug="african-diaspora-comeback", subject="African / Diaspora Comeback", date="2027-02-28T14:00:00Z",
         tbc=True, category="Announced Soon · Africa / Diaspora", arc="Two comebacks in one life", wilderness="Announced soon",
         fall="A landmark documented African & diaspora rebuild — currently in final claims verification.",
         rise="Announced first to Comeback File readers ahead of February 2027.",
         stages=["money", "grief", "rejected", "stuck"]),
    dict(no="14", slug="george-foreman", subject="George Foreman", date="2027-03-07T14:00:00Z",
         category="Boxing & Business · US", arc="The comeback that took a decade", wilderness="20 years",
         fall="Broke, mocked, and twenty years past his prime while fighting to keep a youth centre open.",
         rise="At 45, wearing the same red trunks from Zaire, he won the heavyweight title of the world.",
         stages=["later", "money", "rejected"]),
]

# ---- Excerpt directly from Episode 01 script (Show, Don't Tell) ----
EP01_EXCERPT = dict(
    eyebrow="From Episode 01 · Steve Jobs (May–September 1985)",
    title="An office, a title, and no job.",
    paragraphs=[
        "At the end of May 1985, Apple reorganised in a rush. Jobs was stripped of every operating role. He kept one thing: the title of chairman, with nothing to run. In the same weeks, Apple cut a fifth of its workforce and announced the first quarterly loss in its history.",
        "John Sculley told Wall Street analysts there was no role for Steve Jobs at Apple, now or ever. Pause on that for a moment. He was thirty years old. Most careers do not survive a sentence like that.",
        "His did. But not quickly — and not the way anyone expected. It took eleven years of losing money on NeXT and Pixar before anyone called it a comeback.",
    ],
    card_img="/assets/cards/ep01-fortune-1985.webp",
    card_alt="Archival headline card: Apple reorganises, cuts 20% of staff, posts first-ever quarterly loss — Fortune, 5 August 1985",
)

# ---- Wilderness Duration Graph ----
WILDERNESS_TIMELINE = [
    dict(person="Monica Seles", span="28 months", pct=16, note="Stabbed on court in Hamburg → 1996 Australian Open champion"),
    dict(person="J.K. Rowling", span="3 years", pct=24, note="Income support in Edinburgh & 12 rejections → Bloomsbury says yes"),
    dict(person="Tyler Perry", span="6 years", pct=38, note="Geo Metro & failed annual stagings → 1998 breakthrough"),
    dict(person="Tina Turner", span="8 years", pct=48, note="36 cents in Dallas (1976) → Private Dancer & 3 Grammys at 44"),
    dict(person="Steve Jobs", span="11 years", pct=64, note="Pushed out of Apple (1985) → Pixar IPO & $400M return"),
    dict(person="Shania Twain", span="15 years", pct=82, note="Lost her singing voice & open-throat surgery → #1 comeback"),
    dict(person="George Foreman", span="20 years", pct=100, note="Zaire (1974) → oldest heavyweight champion in history at 45"),
]

# ---- Soulful Adult Story Mirrors (Written for "The Strong One Who Took a Hit") ----
STAGES = [
    dict(key="job", short="I lost my job",
         mirror="The room you built your name in just closed its door.",
         title="The room closed its door.",
         tag="Career & Identity",
         sub="Fired, laid off, restructured out, or quietly pushed aside.",
         scene="May 1985, Cupertino. At 30, Steve Jobs kept the title of chairman and lost every team he built. His own CEO told Wall Street he would never run a part of Apple again. It took eleven quiet years at NeXT and Pixar before he walked back through the front door.",
         exhale="Losing the seat you earned in public stings deeper than the payslip. You did not lose your mind, your judgement, or what you know how to build.",
         proof_person="Steve Jobs", proof_slug="steve-jobs",
         lede="Fired, laid off, pushed out or quietly passed over. It feels personal because work is where grown adults carry their name. It is not the end of yours.",
         rule_preview="Losing the seat you built is brutal. Letting bitterness become your career is the only real defeat.",
         moves=[
             ("Put the facts on one clean page.", "Dates, decisions, what you controlled and what you didn't. Strip out verdicts about your worth. Facts turn fog into ground you can stand on.", "Day 1–2"),
             ("Call three people who have seen you deliver.", "Not to beg for a role. Ask for fifteen minutes and one honest read on where you are sharpest. Most second acts begin in a conversation, not a portal.", "Day 3–4"),
             ("Commit to one 90-day sharpen.", "Pick the single skill that makes you unmistakable in the room you want next. Block the first hour this week.", "Day 5–7"),
         ]),
    dict(key="money", short="My business or money is gone",
         mirror="Everyone thinks you're fine. Your account tells a different story.",
         title="The business folded, or the money ran dry.",
         tag="Finances & Venture",
         sub="Debt, a closed company, savings wiped out while people still lean on you.",
         scene="Atlanta, 1992. Tyler Perry spent his entire $12,000 savings renting a theatre for 1,200 people. Thirty showed up. He lost his apartment and slept in a Geo Metro for three months — yet staged that same play every year until year seven changed everything.",
         exhale="Financial collapse is loud in your head at 2 a.m. and invisible to the people around you. A zero balance sheet is a season — never a sentence on what you can build next.",
         proof_person="Tyler Perry", proof_slug="tyler-perry",
         lede="Debt, a closed company, savings gone while family still expects you to be the strong one. People have rebuilt from far less than what you still carry inside your head.",
         rule_preview="Your balance sheet can hit zero without erasing a single thing you know how to build.",
         moves=[
             ("Write the real number down on one sheet.", "Every figure, every lender, every due date. Panic feeds on the numbers you haven't looked straight in the eye.", "Day 1–2"),
             ("List what nobody can repossess.", "Relationships, hard-won lessons, craft, taste, reputation. That is your actual starting capital.", "Day 3–4"),
             ("Make one call before they call you.", "Pick one creditor or partner and ask for a realistic payment calendar. Get qualified advice before signing anything.", "Day 5–7"),
         ]),
    dict(key="breakup", short="Starting over after a breakup",
         mirror="The life you planned just broke into two halves.",
         title="Starting again after the life you planned broke.",
         tag="Home & Chapter Two",
         sub="Divorce, separation, or walking away to keep your dignity intact.",
         scene="Dallas, July 1976. Tina Turner ran across a highway at night with 36 cents and a Mobil gas card. In the divorce she surrendered every house and royalty just to keep her own name — and rebuilt from small lounges to sell 20 million copies of Private Dancer at 44.",
         exhale="When a marriage or home ends, you don't just lose a partner — you lose the map of the next ten years. You are not starting from zero; you carry your name and everything you survived.",
         proof_person="Tina Turner", proof_slug="jk-rowling",
         lede="The life you planned changed shape overnight, and sometimes the house, friends and money shifted with it. Starting again is not starting from nothing.",
         rule_preview="Starting again is not starting from zero — you carry your name and everything you survived.",
         moves=[
             ("Guard the ordinary basics first.", "Sleep, real food, a daily walk, a fixed wake-up time. Never make five-year decisions while the floor is still shaking.", "Day 1–2"),
             ("Drop the brave mask with one trusted person.", "Tell one real friend how it actually is — not the tidy version. Silence makes grief twice as heavy.", "Day 3–4"),
             ("Claim one ritual that belongs only to you.", "A morning route, a project, a Sunday table, a skill. Something with your name on it, not your old life's.", "Day 5–7"),
         ]),
    dict(key="health", short="A health setback",
         mirror="Your body interrupted every plan you made.",
         title="Your health rearranged the calendar.",
         tag="Body & Recovery",
         sub="A diagnosis, an injury, or a long recovery nobody else can see.",
         scene="Autumn 1996. Weeks after captaining Nigeria to Olympic gold at 20, Nwankwo Kanu failed a routine Inter Milan medical with a fatal congenital heart defect. After emergency open-heart surgery in Cleveland, he returned to win two Premier League titles as an Arsenal Invincible.",
         exhale="When your body changes the terms, waiting feels harder than fighting. Slower is not finished. Redraw the calendar — never surrender the dignity of the climb.",
         proof_person="Nwankwo Kanu", proof_slug="steve-jobs",
         lede="An injury, a diagnosis, a long recovery. Many of the strongest comebacks on record began in a hospital bed.",
         rule_preview="Slower is not the same as over. Redraw the timeline, never surrender the climb.",
         moves=[
             ("Follow your care team and write your questions down.", "Walk into every appointment with a short written list. Clarity steadies the mind.", "Day 1–2"),
             ("Measure wins in days, not years.", "A walk to the corner counts. Keep a short log; on hard days, read what you have already endured.", "Day 3–5"),
             ("Adjust the pace without cancelling the future.", "Almost every real comeback took longer than anyone planned. Patience is still motion.", "Day 6–7"),
         ], sensitive=True),
    dict(key="rejected", short="Rejected again",
         mirror="Twelve closed doors — and the quiet temptation to stop knocking.",
         title="Another door just closed.",
         tag="Persistence & Craft",
         sub="The pitch, the publisher, the role, the grant that came back no.",
         scene="Edinburgh, 1994. Living on state benefits with an infant daughter, Joanne Rowling watched twelve publishers pass on her manuscript. She didn't need twelve rooms to agree — she needed one chairman to hand chapter one to his eight-year-old daughter.",
         exhale="Every rejection lands on the exact same bruise. Most rooms cannot recognise something worthwhile until somebody else validates it first. Twelve nos are data — never a verdict.",
         proof_person="J.K. Rowling", proof_slug="jk-rowling",
         lede="The application, the pitch, the publisher, the visa. Every no feels personal — until you read how many nos came right before the room that mattered.",
         rule_preview="Twelve nos are data, not a verdict. You only need the right room to read chapter one.",
         moves=[
             ("Log every no like a researcher.", "What you sent, to whom, what came back. Patterns appear on paper that bruised pride hides.", "Day 1–2"),
             ("Ask one person who passed for one honest line.", "Short, calm, zero defensiveness. Most won't reply; the one who does can sharpen everything.", "Day 3–4"),
             ("Commit to a number, not a deadline.", "'Ten more pitches' is in your hands. 'By next month' isn't.", "Day 5–7"),
         ]),
    dict(key="later", short="Starting over at 40, 50 or later",
         mirror="Starting again when everyone assumes you should already be settled.",
         title="Rebuilding later in life.",
         tag="Second Act",
         sub="Real family bills, zero patience for noise, deeper judgement.",
         scene="November 1994, Las Vegas. Twenty years after losing to Muhammad Ali in Zaire — broke, mocked, and written off — 45-year-old George Foreman climbed back into the ring in the same red trunks and knocked out the 26-year-old champion.",
         exhale="Quiet the voice telling you the clock ran out. You are not arriving at the starting line empty-handed — you are arriving with decades of scars and discernment no beginner can shortcut.",
         proof_person="George Foreman", proof_slug="tyler-perry",
         lede="40, 50, 60 or beyond, carrying responsibilities a twenty-year-old doesn't have. Experience is an unfair advantage once you stop apologising for your age.",
         rule_preview="You are not late. You are arriving with decades of pattern recognition nobody can shortcut.",
         moves=[
             ("Inventory everything you know how to solve.", "Including the judgement you take for granted. You are not starting from zero; you are starting from experience.", "Day 1–2"),
             ("Talk to one person ten years ahead on the new road.", "Ask how they made the crossing — and which detours they would skip.", "Day 3–5"),
             ("Finish one visible piece of work in 30 days.", "Momentum beats grand five-year plans every time.", "Day 6–7"),
         ]),
    dict(key="stuck", short="Stuck or lost my direction",
         mirror="Nothing collapsed — you just can't see the next room anymore.",
         title="Stuck in the fog while the years move.",
         tag="Clarity & Motion",
         sub="Standing still while life keeps accelerating around you.",
         scene="Mount Vernon, March 1975. Dismissed from Fordham University with a 1.7 GPA while his closest childhood friends headed toward prison, Denzel Washington sat in his mother's beauty parlour with no map — until one small step toward acting set decades in motion.",
         exhale="You don't need a dramatic catastrophe to feel quietly drained. Clarity almost never arrives while staring at the wall — direction is what small motion leaves behind.",
         proof_person="Denzel Washington", proof_slug="steve-jobs",
         lede="Nothing has blown up, exactly. You just can't see the next step while the years keep turning. That is a real crossroads too.",
         rule_preview="Clarity rarely arrives while standing still. Direction is what motion leaves behind.",
         moves=[
             ("Write down the last time you felt genuinely useful.", "What problem were you solving? Who was in the room? That is a compass bearing, not nostalgia.", "Day 1–2"),
             ("Run one small experiment before Sunday.", "One phone call, one draft, one weekend prototype. Motion reveals doors thinking never will.", "Day 3–5"),
             ("Cut one numbing habit that keeps you parked.", "One hour of late-night scrolling or one obligation you've outgrown. Give the experiment oxygen.", "Day 6–7"),
         ]),
    dict(key="grief", short="Grieving a loss",
         mirror="Carrying a loss nobody else knows how to talk about.",
         title="Walking through grief.",
         tag="Loss & Grounding",
         sub="A parent, a partner, a chapter, or the version of yourself you knew.",
         scene="End of 1990. Anne Rowling died of multiple sclerosis at 45, months after her daughter began writing a children's book she would never get to read. Grief shaped every page Joanne wrote in those quiet Edinburgh cafés.",
         exhale="Nothing here is meant to rush you or fix grief with a neat quote. You don't owe anyone a performance of strength. Keeping one small daily anchor steady is enough for this week.",
         proof_person="J.K. Rowling", proof_slug="jk-rowling",
         lede="A person, a marriage, a career, a version of yourself. Grief has its own clock, and nothing here tries to hurry it.",
         rule_preview="You do not have to perform strength. Keep one steady anchor while the ground settles.",
         moves=[
             ("Stop pretending you're fine to make others comfortable.", "Tell one honest person how heavy this week actually is.", "Today"),
             ("Keep one steady daily anchor.", "One walk, one meal at the same hour, one call. Something solid while the rest shifts.", "This week"),
             ("Let trained support help carry it if it grows heavier.", "A doctor, counsellor, or grief group exists for a reason. Asking is strength.", "Whenever needed"),
         ], sensitive=True),
]

# ---- 4 Quiet Dignity Promises for Community ----
CIRCLE_SAFETY_PROMISES = [
    ("Camera optional on rough days", "Show up as you are. Zero performance required."),
    ("'Pass' is always respected", "Share only what you want to share — never pushed."),
    ("Zero unsolicited lectures", "Equals sharing what worked — nobody talking down to you."),
    ("Strictly zero pitching", "No selling, no recruiting, no courses — enforced without exception."),
]

SHARE_PROMPTS = [
    ("In the middle of it", "Right now I'm in the middle of rebuilding after "),
    ("What nobody sees", "The hardest part nobody around me sees is "),
    ("What's keeping me standing", "One quiet thing keeping me standing this week is "),
]

PRODUCTS = [
    dict(key="mug", name="The Studio Mug", spec="12 oz matte-black ceramic · flat gold phoenix",
         note="Matte black ceramic with the flat-gold phoenix. Made for the quiet 6 a.m. table."),
    dict(key="tee", name="Rise Tee", spec="280 gsm heavyweight black cotton · chest mark + back script",
         note="Heavyweight black cotton. Restrained gold phoenix on the chest; DON'T YOU EVER GIVE UP on the back."),
    dict(key="hoodie", name="Rise Hoodie", spec="420 gsm brushed black fleece · structured hood",
         note="Heavyweight black fleece, clean silhouette. Built for the long nights."),
    dict(key="cap", name="Phoenix Cap", spec="6-panel matte cotton twill · flat gold stitch",
         note="Structured matte black with an embroidered gold phoenix. Nothing else."),
    dict(key="journal", name="Rebuild Journal", spec="A5 linen hardcover · 192 dot-grid pages · gold ribbon",
         note="A matte-black linen notebook designed to sit beside The Rebuild Playbook."),
]

PLAYBOOK_CHAPTERS = [
    ("I", "Name the fall", "Separating documented reality from the private verdicts running in your head."),
    ("II", "Stop the bleeding", "The first fourteen days after a shock — protecting sleep, cash and judgement."),
    ("III", "Count what survives", "Skills, people, proof and judgement that nobody can repossess."),
    ("IV", "The first thirty days", "Small, verifiable moves that turn paralysis back into motion."),
    ("V", "The long middle", "How Season 1's subjects endured years when nothing looked like winning."),
    ("VI", "Building proof", "Earning rooms and trust again through quiet, documented output."),
    ("VII", "Your DYEGU rule", "The single operational principle you carry into your second act."),
]

PLAYBOOK_SAMPLE = dict(
    chapter="Chapter I · Worksheet Excerpt",
    title="The Two-Column Reality Audit",
    intro="Before Steve Jobs built NeXT or J.K. Rowling finished chapter four, they had to separate what actually happened from the verdict in their head. Complete this on one clean page:",
    prompts=[
        ("Column A — The Documented Facts", "Write 5 lines a journalist could verify with dates and figures. Zero adjectives about your worth."),
        ("Column B — The Verdict You Added", "Write the private sentences looping at 2 a.m. ('I ruined everything', 'I'm too late'). Draw one straight line through each."),
        ("What Survived the Wreck", "List 3 capabilities, 3 people who respect your work, and 1 finishable move for the next 7 days."),
    ],
)

CIRCLE_WEEKS = [
    ("Week 01", "Name the ground", "Meet 6–8 peers at your chapter, agree to confidentiality, and state honestly where you stand."),
    ("Week 02", "Strip the noise", "Run the Two-Column Reality Audit alongside one documented comeback story."),
    ("Week 03", "Count what remains", "Map surviving skills, allies, and one quiet win you can finish in 7 days."),
    ("Week 04", "The long middle", "Bring the hardest sticking point in your week for honest, lecture-free peer perspective."),
    ("Week 05", "Build outward proof", "Complete one concrete outward move — a call, a draft, an application, a boundary."),
    ("Week 06", "Your DYEGU rule", "Write the sentence you carry forward and set your next 90-day target."),
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
    ("written", "Answer reader questions in writing for The Comeback File"),
    ("office", "One-to-one office hours (later, by invitation only)"),
]

SPEAKER_KIT = dict(
    short_bio="Sir K is the creator of DYEGU (Don't You Ever Give Up), an independent documentary house and free rebuilding community dedicated to primary-sourced comebacks after public loss. With more than twenty years building companies, teams and technology across Africa and beyond, he speaks plainly on resilience grounded in evidence, not slogans.",
    long_bio="Sir K has spent more than twenty years building companies, teams and technology across Africa and internationally — navigating growth as well as hard rebuilds firsthand. In 2026 he founded DYEGU (Don't You Ever Give Up), a primary-sourced documentary series and free peer-support community built for adults navigating major setbacks. In talks and executive workshops, he skips motivational theatre in favour of documented history and practical clarity.",
    audiences=["Corporate leadership & all-hands", "Founder & tech summits", "Universities & alumni", "Diaspora & global conferences"],
    formats=["Talk / keynote (30–60 min)", "Half-day workshop", "Fireside & open Q&A", "Virtual global sessions"],
)
