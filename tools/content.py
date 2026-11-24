"""DYEGU site content. Edit words here, then run: python3 tools/build.py
Everything Sir K hasn't approved yet is marked DRAFT in a comment."""

SITE = "https://dyegu.co"   # change once the domain is bought (dyegulive.com?)
YOUTUBE = "https://www.youtube.com/@DYEGUOfficial"
SUPPORT_URL = "https://findahelpline.com"

# ---- Season 1 slate (subjects fixed; titles stay off the site until Gate 1A) ----
# stages: which "Where are you right now?" pages each story appears on
STORIES = [
    dict(no="01", slug="steve-jobs", subject="Steve Jobs", date="2026-12-06T14:00:00Z", live_page=True,
         fall="Forced out of Apple, the company he co-founded, at 30.",
         rise="Eleven years, two companies and a near-bankrupt Apple later, he walked back in.",
         synopsis="In 1985, at 30, Steve Jobs was stripped of every operating role at the company he co-founded and walked out. He spent eleven years building NeXT and funding Pixar through years of losses. Then Toy Story, Pixar's IPO and Apple's purchase of NeXT brought him back to a company that had just lost more than a billion dollars.",
         stages=["job", "stuck", "rejected"]),
    dict(no="02", slug="jk-rowling", subject="J.K. Rowling", date="2026-12-13T14:00:00Z", live_page=True,
         fall="A single mother on benefits in Edinburgh, grieving, with three chapters and a stack of rejections.",
         rise="Then one reader said yes.",
         synopsis="In the mid-1990s Joanne Rowling was a single mother on state benefits in Edinburgh, still grieving her mother, with the opening chapters of a children's book. Publisher after publisher said no. Then an eight-year-old girl read chapter one.",
         stages=["rejected", "money", "breakup", "grief"]),
    dict(no="03", slug="tyler-perry", subject="Tyler Perry", date="2026-12-20T14:00:00Z", live_page=True,
         fall="He spent his savings on one play. About thirty people came. He slept in his car.",
         rise="He kept staging it, year after year, until the seventh. Today he owns one of America's largest studios.",
         synopsis="Tyler Perry saved $12,000 and spent all of it staging his first play in Atlanta in 1992. About thirty people came. He lived in his car for three months and kept staging the same play once a year while it failed, until 1998. In 2015 he bought 330 acres of a former army base and built one of America's largest film studios.",
         stages=["money", "rejected", "stuck"]),
    dict(no="04", slug="nwankwo-kanu", subject="Nwankwo Kanu", date="2026-12-27T14:00:00Z",
         fall="Weeks after Olympic gold, a medical found a heart defect at 20.", rise="", stages=["health"]),
    dict(no="05", slug="brendan-fraser", subject="Brendan Fraser", date="2027-01-03T14:00:00Z",
         fall="Years of surgeries and a quiet exile from Hollywood.", rise="", stages=["health", "job", "later"]),
    dict(no="06", slug="tina-turner", subject="Tina Turner", date="2027-01-10T14:00:00Z",
         fall="She walked away with 36 cents and a gas card.", rise="", stages=["breakup", "money", "later"]),
    dict(no="08", slug="denzel-washington", subject="Denzel Washington", date="2027-01-24T14:00:00Z",
         fall="Dismissed from university with a 1.7 GPA.", rise="", stages=["stuck", "rejected"]),
    dict(no="11", slug="shania-twain", subject="Shania Twain", date="2027-02-14T14:00:00Z",
         fall="Lost both parents at 22, later her marriage and her voice.", rise="", stages=["grief", "breakup", "health"]),
    dict(no="14", slug="george-foreman", subject="George Foreman", date="2027-03-07T14:00:00Z",
         fall="Broke, mocked and twenty years past his prime.", rise="", stages=["later", "money"]),
]

# ---- "Where are you right now?" ---- DRAFT copy, Sir K to approve
STAGES = [
    dict(key="job", short="I lost my job", title="You lost your job.",
         lede="Fired, laid off, pushed out or quietly passed over. It feels personal because work is where a lot of us keep our sense of worth. It is not the end of your story.",
         moves=[
             ("Write down what happened, facts only.", "One page. Dates, decisions, what you did and didn't control. No verdicts on yourself. It turns a fog into something you can work with."),
             ("Message three people who've seen your work.", "Not to ask for a job. Ask for fifteen minutes and one honest view of where you're strongest. Most comebacks start with a conversation, not an application."),
             ("Pick one skill for the next 90 days.", "The one that would make you more valuable in the room you want to be in. Book the first hour of it this week."),
         ]),
    dict(key="money", short="My business or money is gone", title="Your business failed, or the money ran out.",
         lede="Debt, a closed company, savings gone. Money trouble is loud and private at the same time. People have rebuilt from far less than you have right now.",
         moves=[
             ("Put the whole number on one page.", "What you owe, to whom, and when it's due. Fear lives in the parts you haven't looked at."),
             ("Separate the loss from who you are.", "Write down what the attempt taught you that nobody can repossess: skills, contacts, judgement."),
             ("Make one call before they call you.", "Pick one creditor or one partner and ask what a realistic plan looks like. Get qualified advice before signing anything; this page isn't financial advice."),
         ]),
    dict(key="breakup", short="Starting over after a breakup", title="You're starting over after a breakup or divorce.",
         lede="The life you planned has changed shape, and sometimes the home, the friends and the money change with it. Starting again is not starting from nothing.",
         moves=[
             ("Protect the basics first.", "Sleep, food, movement, a regular time you get up. Big decisions wait until the ground stops moving."),
             ("Tell one trusted person exactly how it is.", "Not the brave version. The real one. Carrying it alone makes it heavier."),
             ("Start one thing that's only yours.", "A class, a route, a project, a Sunday ritual. Something with your name on it, not your old life's."),
         ]),
    dict(key="health", short="A health setback", title="Your health set you back.",
         lede="An injury, a diagnosis, a long recovery. When your body changes the plan, everything else can feel on hold. Many of the comebacks in this series started in a hospital.",
         moves=[
             ("Follow your care team's plan, and ask your questions.", "Write them down before appointments. You're allowed to understand what's happening to you."),
             ("Measure progress in small units.", "Days, not months. A walk to the corner counts. Write each one down; on bad days, read the list."),
             ("Redraw the timeline, not the goal.", "Most comebacks took longer than anyone expected. Slower is not the same as over."),
         ], sensitive=True),
    dict(key="rejected", short="Rejected again", title="You've been rejected. Again.",
         lede="The application, the audition, the pitch, the publisher. Every no lands on the same bruise. The people in these stories collected a lot of them before the yes.",
         moves=[
             ("Count the nos as data, not a verdict.", "Keep a list: what you sent, to whom, what came back. Patterns show up that feelings hide."),
             ("Ask one person who said no for one reason.", "Short and polite. Most won't answer; the one who does may change your next attempt."),
             ("Set a number, not a deadline.", "\"Ten more attempts\" is in your control. \"By March\" isn't."),
         ]),
    dict(key="later", short="Starting over at 40, 50 or later", title="You're starting over later in life.",
         lede="40, 50, 60 or beyond, with less time and more responsibility than the first time. Experience is an asset most beginners would pay for.",
         moves=[
             ("List what you already know how to do.", "Everything, including the things you stopped noticing. You're not starting from zero; you're starting from a different place."),
             ("Find one person ten years ahead of you on the new road.", "Ask how they started, and what they'd skip."),
             ("Choose a first step you can finish in a month.", "Momentum matters more than the size of the first win."),
         ]),
    dict(key="stuck", short="Stuck or lost my direction", title="You're stuck, or you've lost your direction.",
         lede="Nothing has collapsed, exactly. You just can't see the next step, and the years are moving. That counts as a setback too.",
         moves=[
             ("Write down when you last felt fully alive at work or in life.", "What were you doing? Who with? That's a clue, not nostalgia."),
             ("Run one small experiment this week.", "A conversation, a class, a weekend project. Direction usually comes from motion, not thinking."),
             ("Cut one thing that keeps you comfortable and stuck.", "An hour of scrolling, a standing commitment you've outgrown. Make room for the experiment."),
         ]),
    dict(key="grief", short="Grieving a loss", title="You're grieving.",
         lede="A person, a marriage, a career, a version of yourself. Grief doesn't follow a schedule, and nothing here is meant to rush it.",
         moves=[
             ("Let it be as big as it is.", "You don't need to be fine. Tell someone you trust how it actually is."),
             ("Keep one small daily anchor.", "A walk, a meal at the same time, a call. Something steady while the rest isn't."),
             ("Get support if it's getting heavier, not lighter.", "A doctor, a counsellor or a grief group can help carry it. Asking is strength, not weakness."),
         ], sensitive=True),
]

# ---- Drop 01 — Rise ---- (DRAFT; no sales until vector masters, trademark search and gold-matched samples clear)
PRODUCTS = [
    dict(key="mug", name="The Studio Mug", note="Matte black, gold phoenix. The one on Sir K's table in every episode."),
    dict(key="tee", name="Rise Tee", note="Heavyweight black cotton. Small gold phoenix on the chest; DON'T YOU EVER GIVE UP across the back."),
    dict(key="hoodie", name="Rise Hoodie", note="Heavyweight black fleece, same placement as the tee. For the long nights."),
    dict(key="cap", name="Phoenix Cap", note="Black, embroidered gold phoenix. Nothing else."),
    dict(key="journal", name="Rebuild Journal", note="A black notebook made to sit beside the Rebuild Playbook."),
]
