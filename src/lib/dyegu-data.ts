import episodesRaw from "@content/episodes.json";
import sourcesRaw from "@content/sources.json";

export const SITE_URL = "https://dyegu.co";
export const YOUTUBE_HANDLE = "@DYEGUOfficial";
export const YOUTUBE_URL = "https://youtube.com/@DYEGUOfficial";
export const YOUTUBE_SUBSCRIBE_URL = "https://youtube.com/@DYEGUOfficial?sub_confirmation=1";
export const INSTAGRAM_URL = "https://www.instagram.com/dyeguofficial";
export const X_URL = "https://x.com/dyeguofficial";
export const FACEBOOK_URL = "https://www.facebook.com/dyeguofficial";
export const SUPPORT_URL = "https://findahelpline.com";
export const PREMIERE_ISO = "2026-12-06T14:00:00Z";

export interface EpisodeChapter {
  timestamp: string;
  label: string;
}

export interface EpisodeShort {
  id: string;
  hook: string;
  proof: string;
  rollout_day: string;
}

export interface FeaturedClaim {
  id: string;
  text: string;
  tag: "V" | "E" | "T" | string;
  status: string;
  on_screen: string;
  url: string;
}

export interface EpisodeRecord {
  no: string;
  slug: string;
  runtime_minutes: number;
  word_count: number;
  structure_variant: string;
  chapters: EpisodeChapter[];
  shorts: EpisodeShort[];
  cold_open: string;
  dyegu_rule: string;
  comment_prompt: string;
  signoff: string;
  verified_claims: number;
  held_back: number;
  tag_counts: Record<string, number>;
  source_count: number;
  featured_claims: FeaturedClaim[];
}

export interface SourceItem {
  label: string;
  title: string;
  url: string;
  tag: "V" | "E" | "T" | string;
  on_screen: string;
}

export interface SourceRecord {
  verified_claims: number;
  held_back: number;
  tag_counts: Record<string, number>;
  sources: SourceItem[];
}

export const EPISODES = episodesRaw as Record<string, EpisodeRecord>;
export const SOURCES = sourcesRaw as Record<string, SourceRecord>;

export const TAG_LABELS: Record<string, string> = {
  V: "Primary record",
  E: "Established reporting",
  T: "Subject's own words",
};

export interface StoryMeta {
  no: string;
  slug: string;
  subject: string;
  date: string;
  livePage?: boolean;
  special?: boolean;
  tbc?: boolean;
  category: string;
  arc: string;
  wilderness: string;
  fall: string;
  rise: string;
  synopsis?: string;
  stages: string[];
  sampleCitations?: { citation: string; tag: "V" | "E" | "T"; url: string }[];
}

export const STORIES: StoryMeta[] = [
  {
    no: "01",
    slug: "steve-jobs",
    subject: "Steve Jobs",
    date: "2026-12-06T14:00:00Z",
    livePage: true,
    category: "Tech · US",
    arc: "The comeback that took a decade",
    wilderness: "11 years",
    fall: "Stripped of every operating role at Apple at 30. An office, a title, and no job.",
    rise: "Eleven years, two companies, and a near-bankrupt Apple later, he walked back in.",
    synopsis:
      "In May 1985, at thirty, Steve Jobs was stripped of every operating role at the company he co-founded. His own chief executive told Wall Street there was no role for him, today or in the future. He spent the next eleven years building NeXT and funding Pixar through losses that looked like defeat — until Toy Story, Pixar's IPO, and Apple's purchase of NeXT brought him back.",
    stages: ["job", "stuck", "rejected"],
    sampleCitations: [
      {
        citation: "Fortune, 5 August 1985 — Apple reorganisation, 20% staff cuts & first quarterly loss",
        tag: "E",
        url: "https://money.cnn.com/magazines/fortune/fortune_archive/1985/08/05/66254/index.htm",
      },
      {
        citation: "The Wall Street Journal, 18 September 1985 — Sculley statement & Jobs resignation",
        tag: "V",
        url: "https://tech-insider.org/mac/research/1985/0918.html",
      },
      {
        citation: "Computer History Museum — 1996 NeXT Draft S-1 Registration Filing",
        tag: "V",
        url: "https://computerhistory.org/?p=4330",
      },
    ],
  },
  {
    no: "02",
    slug: "jk-rowling",
    subject: "J.K. Rowling",
    date: "2026-12-13T14:00:00Z",
    livePage: true,
    category: "Literature · UK",
    arc: "Had it, lost it, rebuilt",
    wilderness: "3 years",
    fall: "A single mother on state benefits in Edinburgh, grieving, with three chapters and twelve rejections.",
    rise: "Then an eight-year-old girl read chapter one and asked for more.",
    synopsis:
      "In 1994, Joanne Rowling was jobless, grieving her mother, raising an infant alone on income support in Edinburgh, and calling herself the biggest failure she knew. Twelve publishers turned the manuscript down. Then Bloomsbury's chairman took chapter one home to his eight-year-old daughter.",
    stages: ["rejected", "money", "breakup", "grief"],
    sampleCitations: [
      {
        citation: "Harvard Gazette, June 2008 — Full text of J.K. Rowling Commencement Address",
        tag: "T",
        url: "https://news.harvard.edu/gazette/story/2008/06/text-of-j-k-rowling-speech/",
      },
      {
        citation: "The Herald (Glasgow), 8 July 1997 — Contemporary Edinburgh profile upon release",
        tag: "V",
        url: "https://accio-quote.org/articles/1997/0797-herald.html",
      },
      {
        citation: "Nigel Newton (Bloomsbury Chairman) — Alice Newton chapter-one testimony",
        tag: "E",
        url: "https://nzherald.co.nz/lifestyle/revealed-the-eight-year-old-girl-who-saved-harry-potter/UTQCYL6RAEUSL4V5JH7MMP3WTE",
      },
    ],
  },
  {
    no: "03",
    slug: "tyler-perry",
    subject: "Tyler Perry",
    date: "2026-12-20T14:00:00Z",
    livePage: true,
    category: "Film & Media · US",
    arc: "Had it, lost it, rebuilt",
    wilderness: "6 years",
    fall: "He bet his entire $12,000 savings on one play. Thirty people came. He slept in a Geo Metro.",
    rise: "He staged the same play once a year while it failed — until year seven.",
    synopsis:
      "Tyler Perry saved $12,000 as a bill collector and spent every dollar renting a hall in Atlanta in 1992. He expected 1,200 people; about thirty showed up. Six foot five, sleeping in a Geo Metro he hid from the repo man, he kept staging the play once a year while it failed — until 1998 broke everything open.",
    stages: ["money", "rejected", "stuck"],
    sampleCitations: [
      {
        citation: "AARP Interview (2022) — $12,000 savings & 1992 Atlanta hall staging",
        tag: "T",
        url: "https://www.aarp.org/entertainment/celebrities/info-2022/tyler-perry.html",
      },
      {
        citation: "Atlanta Journal-Constitution — Fort McPherson 330-acre studio acquisition",
        tag: "E",
        url: "https://www.ajc.com/news/tyler-perry-new-studio-won-shut-out-neighbors/J7oF5Zlm5U3hlzm0veYDCJ",
      },
      {
        citation: "BET Awards Speech, 23 June 2019 — Verbatim studio history record",
        tag: "T",
        url: "https://www.hollywoodreporter.com/news/tyler-perry-delivers-powerful-uplifting-speech-at-bet-awards-1220521",
      },
    ],
  },
  {
    no: "04",
    slug: "nwankwo-kanu",
    subject: "Nwankwo Kanu",
    date: "2026-12-27T14:00:00Z",
    category: "Football · Nigeria / UK",
    arc: "Two comebacks in one life",
    wilderness: "2 years",
    fall: "Weeks after Olympic gold at 20, a routine medical exposed a fatal heart defect.",
    rise: "After emergency open-heart surgery, he defied every diagnosis to become an Arsenal Invincible.",
    stages: ["health"],
  },
  {
    no: "05",
    slug: "brendan-fraser",
    subject: "Brendan Fraser",
    date: "2027-01-03T14:00:00Z",
    category: "Film · Canada / US",
    arc: "The comeback that took a decade",
    wilderness: "10 years",
    fall: "Seven years of spine, knee and vocal-cord surgeries alongside grief and a decade out of sight.",
    rise: "He returned to a six-minute standing ovation in Venice and the Best Actor Oscar.",
    stages: ["health", "job", "later", "grief"],
  },
  {
    no: "06",
    slug: "tina-turner",
    subject: "Tina Turner",
    date: "2027-01-10T14:00:00Z",
    category: "Music · US / Europe",
    arc: "Had it, lost it, rebuilt",
    wilderness: "8 years",
    fall: "She ran across a Dallas highway with 36 cents and a Mobil gas card — giving up everything to keep her name.",
    rise: "Dismissed by American labels at 44, she rebuilt in Europe and swept three Grammys.",
    stages: ["breakup", "money", "later"],
  },
  {
    no: "07",
    slug: "season-1-marathon",
    subject: "Mid-Season Marathon",
    date: "2027-01-17T14:00:00Z",
    special: true,
    category: "Special · 90 Minutes",
    arc: "Marathon compilation",
    wilderness: "6 lives",
    fall: "Six documented journeys of people who lost everything — Jobs, Rowling, Perry, Kanu, Fraser and Turner.",
    rise: "Woven together for focused Sunday living-room viewing.",
    stages: ["job", "money", "health", "breakup", "rejected", "later"],
  },
  {
    no: "08",
    slug: "denzel-washington",
    subject: "Denzel Washington",
    date: "2027-01-24T14:00:00Z",
    category: "Film · US",
    arc: "The comeback that took a decade",
    wilderness: "14 years",
    fall: "Dismissed from university with a 1.7 GPA while his closest boyhood friends went to prison.",
    rise: "A handwritten note in his mother's beauty parlour sparked a quiet, disciplined turnaround.",
    stages: ["stuck", "rejected"],
  },
  {
    no: "09",
    slug: "monica-seles",
    subject: "Monica Seles",
    date: "2027-01-31T14:00:00Z",
    category: "Tennis · Europe / US",
    arc: "Had it, lost it, rebuilt",
    wilderness: "28 months",
    fall: "World No. 1 with eight Grand Slams at 19 — until an on-court attack stole 28 months of her prime.",
    rise: "She walked back onto centre court and won the 1996 Australian Open.",
    stages: ["health", "stuck"],
  },
  {
    no: "10",
    slug: "tyson-fury",
    subject: "Tyson Fury",
    date: "2027-02-07T14:00:00Z",
    category: "Boxing · UK / Global",
    arc: "Had it, lost it, rebuilt",
    wilderness: "3 years",
    fall: "Stripped of his heavyweight belts and sinking to 400 pounds in crushing depression.",
    rise: "He shed over 150 pounds, rose off the canvas at nine, and reclaimed the title.",
    stages: ["health", "stuck", "money"],
  },
  {
    no: "11",
    slug: "shania-twain",
    subject: "Shania Twain",
    date: "2027-02-14T14:00:00Z",
    category: "Music · Canada / Global",
    arc: "Two comebacks in one life",
    wilderness: "15 years",
    fall: "Lost both parents at 22, and later lost her marriage and her singing voice to nerve damage.",
    rise: "After open-throat surgery and years of silent rehabilitation, she returned to #1.",
    stages: ["grief", "breakup", "health", "later"],
  },
  {
    no: "12",
    slug: "simone-biles",
    subject: "Simone Biles",
    date: "2027-02-21T14:00:00Z",
    category: "Gymnastics · US / Global",
    arc: "Had it, lost it, rebuilt",
    wilderness: "2 years",
    fall: "From foster care to global icon — then stepping away mid-Olympics in Tokyo under global backlash.",
    rise: "Two years spent healing her mind and body led to three Olympic gold medals in Paris.",
    stages: ["health", "rejected", "stuck"],
  },
  {
    no: "13",
    slug: "african-diaspora-comeback",
    subject: "African / Diaspora Comeback",
    date: "2027-02-28T14:00:00Z",
    tbc: true,
    category: "Announced Soon · Africa / Diaspora",
    arc: "Two comebacks in one life",
    wilderness: "Announced soon",
    fall: "A landmark documented African & diaspora rebuild — currently in final claims verification.",
    rise: "Announced first to Comeback File readers ahead of February 2027.",
    stages: ["money", "grief", "rejected", "stuck"],
  },
  {
    no: "14",
    slug: "george-foreman",
    subject: "George Foreman",
    date: "2027-03-07T14:00:00Z",
    category: "Boxing & Business · US",
    arc: "The comeback that took a decade",
    wilderness: "20 years",
    fall: "Broke, mocked, and twenty years past his prime while fighting to keep a youth centre open.",
    rise: "At 45, wearing the same red trunks from Zaire, he won the heavyweight title of the world.",
    stages: ["later", "money", "rejected"],
  },
];

export interface WildernessEntry {
  person: string;
  span: string;
  months: number;
  pct: number;
  arc: string;
}

export const WILDERNESS_TIMELINE: WildernessEntry[] = [
  { person: "Monica Seles", span: "28 months", months: 28, pct: 12, arc: "1993 stabbing → 1996 Australian Open" },
  { person: "J.K. Rowling", span: "3 years", months: 36, pct: 18, arc: "Edinburgh income support → Bloomsbury" },
  { person: "Tyler Perry", span: "6 years", months: 72, pct: 32, arc: "Geo Metro & failed stagings → 1998 breakthrough" },
  { person: "Tina Turner", span: "8 years", months: 96, pct: 43, arc: "36 cents in Dallas → Private Dancer" },
  { person: "Steve Jobs", span: "11 years", months: 132, pct: 58, arc: "Apple ouster → Pixar IPO & return" },
  { person: "Shania Twain", span: "15 years", months: 180, pct: 78, arc: "Vocal cord loss → #1 comeback" },
  { person: "George Foreman", span: "20 years", months: 240, pct: 100, arc: "Zaire 1974 → Heavyweight champion at 45" },
];

export interface StageChapter {
  key: string;
  short: string;
  mirror: string;
  title: string;
  tag: string;
  sub: string;
  scene: string;
  exhale: string;
  proofPerson: string;
  proofSlug: string;
  rulePreview: string;
  moves: [string, string, string][];
  sensitive?: boolean;
}

export const STAGES: StageChapter[] = [
  {
    key: "job",
    short: "I lost my job",
    mirror: "The room you built your name in just closed its door.",
    title: "The room closed its door.",
    tag: "Career & Identity",
    sub: "Fired, laid off, restructured out, or quietly pushed aside.",
    scene:
      "May 1985, Cupertino. At 30, Steve Jobs kept the title of chairman and lost every team he built. His own CEO told Wall Street there was no role for him at Apple, now or ever. It took eleven quiet years at NeXT and Pixar before he walked back in.",
    exhale:
      "Losing the seat you earned in public stings deeper than the payslip. You did not lose your mind, your judgement, or what you know how to build.",
    proofPerson: "Steve Jobs · Episode 01",
    proofSlug: "steve-jobs",
    rulePreview: "Losing the seat you built is brutal. Letting bitterness become your career is the only real defeat.",
    moves: [
      [
        "Put the facts on one clean page.",
        "Dates, decisions, what you controlled and what you didn't. Strip out verdicts about your worth. Facts turn fog into ground you can stand on.",
        "Day 1–2",
      ],
      [
        "Call three people who have seen you deliver.",
        "Not to beg for a role. Ask for fifteen minutes and one honest read on where you are sharpest. Most second acts begin in a conversation, not a portal.",
        "Day 3–4",
      ],
      [
        "Commit to one 90-day sharpen.",
        "Pick the single skill that makes you unmistakable in the room you want next. Block the first hour this week.",
        "Day 5–7",
      ],
    ],
  },
  {
    key: "money",
    short: "My business or money is gone",
    mirror: "Everyone thinks you're fine. Your account tells a different story.",
    title: "The business folded, or the money ran dry.",
    tag: "Finances & Venture",
    sub: "Debt, a closed company, savings wiped out while people still lean on you.",
    scene:
      "Atlanta, 1992. Tyler Perry spent his entire $12,000 savings renting a theatre for 1,200 people. Thirty showed up. He lost his apartment and slept in a Geo Metro — yet staged that same play once a year until year seven broke everything open.",
    exhale:
      "Financial collapse is loud at 2 a.m. and invisible to the people around you. A zero balance sheet is a season — never a verdict on what you can build next.",
    proofPerson: "Tyler Perry · Episode 03",
    proofSlug: "tyler-perry",
    rulePreview: "Your balance sheet can hit zero without erasing a single thing you know how to build.",
    moves: [
      [
        "Write the real number down on one sheet.",
        "Every figure, every lender, every due date. Panic feeds on the numbers you haven't looked straight in the eye.",
        "Day 1–2",
      ],
      [
        "List what nobody can repossess.",
        "Relationships, hard-won lessons, craft, taste, reputation. That is your actual starting capital.",
        "Day 3–4",
      ],
      [
        "Make one call before they call you.",
        "Pick one creditor or partner and ask for a realistic payment calendar. Get qualified advice before signing anything.",
        "Day 5–7",
      ],
    ],
  },
  {
    key: "breakup",
    short: "Starting over after a breakup",
    mirror: "The life you planned just broke into two halves.",
    title: "Starting again after the life you planned broke.",
    tag: "Home & Chapter Two",
    sub: "Divorce, separation, or walking away to keep your dignity intact.",
    scene:
      "Dallas, July 1976. Tina Turner ran across a highway at night with 36 cents and a Mobil gas card. In the divorce she surrendered every house and royalty just to keep her own name — and rebuilt from small lounges to sell 20 million copies of Private Dancer at 44.",
    exhale:
      "When a marriage or home ends, you lose the map of the next ten years. You are not starting from zero; you carry your name and everything you survived.",
    proofPerson: "Tina Turner · Episode 06",
    proofSlug: "jk-rowling",
    rulePreview: "Starting again is not starting from zero — you carry your name and everything you survived.",
    moves: [
      [
        "Guard the ordinary basics first.",
        "Sleep, real food, a daily walk, a fixed wake-up time. Never make five-year decisions while the floor is still shaking.",
        "Day 1–2",
      ],
      [
        "Drop the brave mask with one trusted person.",
        "Tell one real friend how it actually is — not the tidy version. Silence makes grief twice as heavy.",
        "Day 3–4",
      ],
      [
        "Claim one ritual that belongs only to you.",
        "A morning route, a project, a Sunday table, a skill. Something with your name on it, not your old life's.",
        "Day 5–7",
      ],
    ],
  },
  {
    key: "health",
    short: "A health setback",
    mirror: "Your body interrupted every plan you made.",
    title: "Your health rearranged the calendar.",
    tag: "Body & Recovery",
    sub: "A diagnosis, an injury, or a long recovery nobody else can see.",
    scene:
      "Autumn 1996. Weeks after captaining Nigeria to Olympic gold at 20, Nwankwo Kanu failed a routine Inter Milan medical with a fatal congenital heart defect. After emergency open-heart surgery, he returned to win two Premier League titles as an Arsenal Invincible.",
    exhale:
      "When your body changes the terms, waiting feels harder than fighting. Slower is not finished. Redraw the calendar — never surrender the dignity of the climb.",
    proofPerson: "Nwankwo Kanu · Episode 04",
    proofSlug: "steve-jobs",
    rulePreview: "Slower is not the same as over. Redraw the timeline, never surrender the climb.",
    moves: [
      [
        "Follow your care team and write your questions down.",
        "Walk into every appointment with a short written list. Clarity steadies the mind.",
        "Day 1–2",
      ],
      [
        "Measure wins in days, not years.",
        "A walk to the corner counts. Keep a short log; on hard days, read what you have already endured.",
        "Day 3–5",
      ],
      [
        "Adjust the pace without cancelling the future.",
        "Almost every real comeback took longer than anyone planned. Patience is still motion.",
        "Day 6–7",
      ],
    ],
    sensitive: true,
  },
  {
    key: "rejected",
    short: "Rejected again",
    mirror: "Twelve closed doors — and the quiet temptation to stop knocking.",
    title: "Another door just closed.",
    tag: "Persistence & Craft",
    sub: "The pitch, the publisher, the role, the grant that came back no.",
    scene:
      "Edinburgh, 1994. Living on state benefits with an infant daughter, Joanne Rowling watched twelve publishers pass on her manuscript. She didn't need twelve rooms to agree — she needed one chairman to hand chapter one to his eight-year-old daughter.",
    exhale:
      "Most rooms cannot recognise something worthwhile until somebody else validates it first. Twelve nos are data — never a verdict.",
    proofPerson: "J.K. Rowling · Episode 02",
    proofSlug: "jk-rowling",
    rulePreview: "Twelve nos are data, not a verdict. You only need the right room to read chapter one.",
    moves: [
      [
        "Log every no like a researcher.",
        "What you sent, to whom, what came back. Patterns appear on paper that bruised pride hides.",
        "Day 1–2",
      ],
      [
        "Ask one person who passed for one honest line.",
        "Short, calm, zero defensiveness. Most won't reply; the one who does can sharpen everything.",
        "Day 3–4",
      ],
      [
        "Commit to a number, not a deadline.",
        "'Ten more pitches' is in your hands. 'By next month' isn't.",
        "Day 5–7",
      ],
    ],
  },
  {
    key: "later",
    short: "Starting over at 40, 50 or later",
    mirror: "Starting again when everyone assumes you should already be settled.",
    title: "Rebuilding later in life.",
    tag: "Second Act",
    sub: "Real family bills, zero patience for noise, deeper judgement.",
    scene:
      "November 1994, Las Vegas. Twenty years after losing to Muhammad Ali in Zaire — broke, mocked, and written off — 45-year-old George Foreman climbed back into the ring in the same red trunks and knocked out the 26-year-old champion.",
    exhale:
      "You are not arriving at the starting line empty-handed — you are arriving with decades of scars and discernment no beginner can shortcut.",
    proofPerson: "George Foreman · Episode 14",
    proofSlug: "tyler-perry",
    rulePreview: "You are not late. You are arriving with decades of pattern recognition nobody can shortcut.",
    moves: [
      [
        "Inventory everything you know how to solve.",
        "Including the judgement you take for granted. You are not starting from zero; you are starting from experience.",
        "Day 1–2",
      ],
      [
        "Talk to one person ten years ahead on the new road.",
        "Ask how they made the crossing — and which detours they would skip.",
        "Day 3–5",
      ],
      [
        "Finish one visible piece of work in 30 days.",
        "Momentum beats grand five-year plans every time.",
        "Day 6–7",
      ],
    ],
  },
  {
    key: "stuck",
    short: "Stuck or lost my direction",
    mirror: "Nothing collapsed — you just can't see the next room anymore.",
    title: "Stuck in the fog while the years move.",
    tag: "Clarity & Motion",
    sub: "Standing still while life keeps accelerating around you.",
    scene:
      "Mount Vernon, March 1975. Dismissed from Fordham University with a 1.7 GPA while his closest childhood friends headed toward prison, Denzel Washington sat in his mother's beauty parlour with no map — until one small step set decades in motion.",
    exhale:
      "Clarity almost never arrives while staring at the wall — direction is what small motion leaves behind.",
    proofPerson: "Denzel Washington · Episode 08",
    proofSlug: "steve-jobs",
    rulePreview: "Clarity rarely arrives while standing still. Direction is what motion leaves behind.",
    moves: [
      [
        "Write down the last time you felt genuinely useful.",
        "What problem were you solving? Who was in the room? That is a compass bearing, not nostalgia.",
        "Day 1–2",
      ],
      [
        "Run one small experiment before Sunday.",
        "One phone call, one draft, one weekend prototype. Motion reveals doors thinking never will.",
        "Day 3–5",
      ],
      [
        "Cut one numbing habit that keeps you parked.",
        "One hour of late-night scrolling or one obligation you've outgrown. Give the experiment oxygen.",
        "Day 6–7",
      ],
    ],
  },
  {
    key: "grief",
    short: "Grieving a loss",
    mirror: "Carrying a loss nobody else knows how to talk about.",
    title: "Walking through grief.",
    tag: "Loss & Grounding",
    sub: "A parent, a partner, a chapter, or the version of yourself you knew.",
    scene:
      "December 1990. Anne Rowling died of multiple sclerosis at 45, months after her daughter began writing a children's book she would never read. Grief shaped every page Joanne wrote in those quiet Edinburgh cafés.",
    exhale:
      "Nothing here is meant to rush you or fix grief with a neat quote. Keeping one small daily anchor steady is enough for this week.",
    proofPerson: "J.K. Rowling · Episode 02",
    proofSlug: "jk-rowling",
    rulePreview: "You do not have to perform strength. Keep one steady anchor while the ground settles.",
    moves: [
      [
        "Stop pretending you're fine to make others comfortable.",
        "Tell one honest person how heavy this week actually is.",
        "Today",
      ],
      [
        "Keep one steady daily anchor.",
        "One walk, one meal at the same hour, one call. Something solid while the rest shifts.",
        "This week",
      ],
      [
        "Let trained support help carry it if it grows heavier.",
        "A doctor, counsellor, or grief group exists for a reason. Asking is strength.",
        "Whenever needed",
      ],
    ],
    sensitive: true,
  },
];

export const STAGE_MAP = Object.fromEntries(STAGES.map((s) => [s.key, s]));

export const CIRCLE_SAFETY_PROMISES = [
  ["Camera optional on rough days", "Show up as you are. Zero performance required."],
  ["'Pass' is always respected", "Share only what you want to share — never pushed."],
  ["Zero unsolicited lectures", "Peers sharing what worked — nobody talking down to you."],
  ["Strictly zero pitching", "No selling, no recruiting, no courses — enforced without exception."],
] as const;

export const CIRCLE_WEEKS = [
  ["Week 01", "Name the ground", "Meet 6–8 peers at your chapter, agree to confidentiality, and state honestly where you stand."],
  ["Week 02", "Strip the noise", "Run the Two-Column Reality Audit alongside one documented comeback story."],
  ["Week 03", "Count what remains", "Map surviving skills, allies, and one quiet win you can finish in 7 days."],
  ["Week 04", "The long middle", "Bring the hardest sticking point in your week for honest, lecture-free peer perspective."],
  ["Week 05", "Build outward proof", "Complete one concrete outward move — a call, a draft, an application, a boundary."],
  ["Week 06", "Your DYEGU rule", "Write the sentence you carry forward and set your next 90-day target."],
] as const;

export const SESSION_TOPICS = [
  ["career", "Job search, CVs and interviews"],
  ["change", "Changing career, including at 40+"],
  ["money", "Debt and money basics"],
  ["business", "Starting a business again"],
  ["legal", "Legal basics after a layoff or divorce"],
  ["health", "Living and working through recovery"],
  ["wellbeing", "Stress, sleep and staying well"],
  ["grief", "Grief and loss"],
  ["skills", "Learning a new skill fast"],
] as const;

export const VOLUNTEER_FORMATS = [
  ["session", "Lead a free group session (45 min talk and Q&A)"],
  ["circle", "Facilitate a Rebuild Circle (6 weekly calls, training provided)"],
  ["written", "Answer reader questions in writing for The Comeback File"],
  ["office", "One-to-one office hours (later, by invitation only)"],
] as const;

export const PLAYBOOK_CHAPTERS = [
  ["I", "Name the fall", "Separating documented reality from the private verdicts running in your head."],
  ["II", "Stop the bleeding", "The first fourteen days after a shock — protecting sleep, cash and judgement."],
  ["III", "Count what survives", "Skills, people, proof and judgement that nobody can repossess."],
  ["IV", "The first thirty days", "Small, verifiable moves that turn paralysis back into motion."],
  ["V", "The long middle", "How Season 1's subjects endured years when nothing looked like winning."],
  ["VI", "Building proof", "Earning rooms and trust again through quiet, documented output."],
  ["VII", "Your DYEGU rule", "The single operational principle you carry into your second act."],
] as const;

export const STUDIO_MUG = {
  key: "mug",
  name: "The Studio Mug",
  spec: "12 oz straight-wall matte-black ceramic · flat matte-gold phoenix",
  note: "Straight-wall matte black ceramic bearing the 2D flat-gold DYEGU phoenix. Nothing else. Crafted for the quiet 6 a.m. table — apparel lines remain on hold until physical samples clear studio inspection.",
  image: "/assets/products/mug.webp",
};

export const SHARE_PROMPTS = [
  ["In the middle of it", "Right now I'm in the middle of rebuilding after "],
  ["What nobody sees", "The hardest part nobody around me sees is "],
  ["What's keeping me standing", "One quiet thing keeping me standing this week is "],
] as const;

export const SPEAKER_KIT = {
  shortBio:
    "Sir K is the host and creator of DYEGU (Don't You Ever Give Up), an independent 4K documentary house and investigative comeback archive dedicated to primary-sourced rebuilds after public collapse. With more than twenty years building companies, teams and technology across Africa and beyond, he speaks plainly on endurance grounded in evidence, not slogans.",
  longBio:
    "Sir K has spent more than twenty years building companies, teams and technology across Africa and internationally — navigating growth as well as hard rebuilds firsthand. In 2026 he founded DYEGU (Don't You Ever Give Up), a primary-sourced documentary series and founding rebuilding community for adults navigating major setbacks. In talks and executive workshops, he skips motivational theatre in favour of documented history and practical clarity.",
  audiences: [
    "Corporate leadership & all-hands",
    "Founder & tech summits",
    "Universities & alumni",
    "Diaspora & global conferences",
  ],
  formats: [
    "Talk / keynote (30–60 min)",
    "Half-day workshop",
    "Fireside & open Q&A",
    "Virtual global sessions",
  ],
};

export interface JourneyChapter {
  slug: string;
  stageKey: "job" | "money" | "rejected" | "breakup" | "health" | "later" | "stuck" | "grief";
  shortLabel: string;
  mirrorLine: string;
  subLine: string;
  parallelSubject: string;
  parallelDuration: string;
  dossierSlug: string;
  highlightedSubjects: string[];
  plateHeader: string;
  plateBadge: string;
  plateHeadline: string;
  plateBeforeQuote: string;
  plateDecisiveQuote: string;
  plateAfterQuote: string;
  plateContext: string;
  plateImage?: string;
  plateExhibitCaption: string;
  benchPrompt: string;
  benchPlaceholder: string;
  quietMoveTitle: string;
  quietMoveDay: string;
  quietMoveDesc: string;
}

export const CHAPTERS: JourneyChapter[] = [
  {
    slug: "door-closed",
    stageKey: "job",
    shortLabel: "Career Exile & Closed Doors",
    mirrorLine: "The room you built your name in just closed its door.",
    subLine: "Fired, laid off, restructured out, or quietly pushed aside.",
    parallelSubject: "Steve Jobs",
    parallelDuration: "11 yrs",
    dossierSlug: "steve-jobs",
    highlightedSubjects: ["Steve Jobs"],
    plateHeader: "ARCHIVAL PLATE · EPISODE 01 · FORTUNE, 5 AUGUST 1985",
    plateBadge: "49 VERIFIED CLAIMS · 0 HELD BACK",
    plateHeadline: "An office, a title, and no job.",
    plateBeforeQuote:
      "At the end of May 1985, Apple reorganised in a rush. At thirty, Steve Jobs was stripped of every operating role at the company he co-founded. Weeks later, John Sculley told Wall Street analysts there was ",
    plateDecisiveQuote: "“no role for Steve Jobs at Apple, now or ever.”",
    plateAfterQuote: " Most careers do not survive a sentence like that.",
    plateContext:
      "His did—not quickly, and not cleanly. It took eleven years of public losses at NeXT and $50 million of his own money into Pixar before Toy Story, Pixar's IPO, and Apple's $400 million purchase of NeXT brought him back.",
    plateImage: "/assets/cards/ep01-fortune-1985.webp",
    plateExhibitCaption: "Exhibit A · Contemporary Press Record (Aug–Sep 1985)",
    benchPrompt:
      "Write down three assets, skills, or scars you carry out of that closed room that nobody can revoke.",
    benchPlaceholder: "1. \n2. \n3. ",
    quietMoveTitle: "Put the facts on one clean page.",
    quietMoveDay: "Tonight · 15 Minutes",
    quietMoveDesc:
      "Dates, decisions, what you controlled, and what you didn't. Strip out verdicts about your worth. Facts turn fog into ground you can stand on.",
  },
  {
    slug: "quiet-insolvency",
    stageKey: "money",
    shortLabel: "Quiet Financial Collapse",
    mirrorLine: "Everyone thinks you're fine. Your account tells a different story.",
    subLine: "Debt, a folded venture, or savings wiped out while others lean on you.",
    parallelSubject: "Tyler Perry",
    parallelDuration: "6 yrs",
    dossierSlug: "tyler-perry",
    highlightedSubjects: ["Tyler Perry"],
    plateHeader: "ARCHIVAL PLATE · EPISODE 03 · ATLANTA, 1992–1998",
    plateBadge: "44 VERIFIED CLAIMS · 0 HELD BACK",
    plateHeadline: "Thirty people in a 1,200-seat hall.",
    plateBeforeQuote:
      "In 1992, Tyler Perry saved $12,000 working as a bill collector and spent every dollar renting a hall in Atlanta. Expecting 1,200 seats filled, ",
    plateDecisiveQuote: "“about thirty people showed up—and he slept in a Geo Metro for three months.”",
    plateAfterQuote: " He hid the car from the repo man and refused to quit the play.",
    plateContext:
      "He staged the same play once a year while it failed for six straight years—until 1998 sold out the house. Seventeen years later he bought 330 acres of a former army base and built one of the largest studios in America.",
    plateExhibitCaption: "Exhibit C · AARP Record & Atlanta Journal-Constitution Archive",
    benchPrompt:
      "Separate your balance sheet from your capability: list three hard-won skills or relationships nobody can repossess.",
    benchPlaceholder: "What still stands even if the account is at zero:\n1. \n2. \n3. ",
    quietMoveTitle: "Write the exact numbers on one quiet sheet.",
    quietMoveDay: "Tonight · 20 Minutes",
    quietMoveDesc:
      "Every figure, every obligation, every due date. Panic feeds on the numbers you avoid looking straight in the eye.",
  },
  {
    slug: "twelve-nos",
    stageKey: "rejected",
    shortLabel: "Rejection & Closed Rooms",
    mirrorLine: "Twelve closed doors — and the quiet temptation to stop knocking.",
    subLine: "The pitch, publisher, role, visa, or grant that came back no.",
    parallelSubject: "J.K. Rowling",
    parallelDuration: "3 yrs",
    dossierSlug: "jk-rowling",
    highlightedSubjects: ["J.K. Rowling"],
    plateHeader: "ARCHIVAL PLATE · EPISODE 02 · EDINBURGH, 1994–1997",
    plateBadge: "38 VERIFIED CLAIMS · 1 HELD BACK",
    plateHeadline: "Twelve publishers passed before one eight-year-old read chapter one.",
    plateBeforeQuote:
      "In 1994, Joanne Rowling was jobless, grieving her mother, and raising an infant daughter on income support in Edinburgh. Twelve publishing houses rejected the manuscript. As she later told Harvard, ",
    plateDecisiveQuote: "“by every usual standard, I was the biggest failure I knew.”",
    plateAfterQuote: " She did not need twelve rooms to agree.",
    plateContext:
      "She needed Bloomsbury's chairman to take chapter one home to his eight-year-old daughter, Alice, who handed it back asking for the rest.",
    plateExhibitCaption: "Exhibit B · Harvard Gazette (2008) & The Herald (8 Jul 1997)",
    benchPrompt:
      "List three rooms that said no—and one adjustment or new room you haven't knocked on yet.",
    benchPlaceholder: "What the nos taught me — and the next room I will approach:\n",
    quietMoveTitle: "Log every 'no' like an investigator, not a defendant.",
    quietMoveDay: "Tonight · 15 Minutes",
    quietMoveDesc:
      "Write down what you sent, to whom, and what came back. Patterns appear on paper that bruised pride hides.",
  },
  {
    slug: "life-split",
    stageKey: "breakup",
    shortLabel: "Life Split in Half",
    mirrorLine: "The life you planned just broke into two halves.",
    subLine: "Divorce, separation, or walking away to keep your dignity intact.",
    parallelSubject: "Tina Turner",
    parallelDuration: "8 yrs",
    dossierSlug: "jk-rowling",
    highlightedSubjects: ["Tina Turner"],
    plateHeader: "ARCHIVAL PLATE · EPISODE 06 · DALLAS, JULY 1976",
    plateBadge: "SEASON 1 · DOCUMENTED RECORD",
    plateHeadline: "Thirty-six cents and her own name.",
    plateBeforeQuote:
      "In July 1976, Tina Turner ran across a Dallas highway at night leaving behind every house, car, and royalty stream. She walked out with ",
    plateDecisiveQuote: "“36 cents and a Mobil gas card—giving up everything just to keep her own name.”",
    plateAfterQuote: " American labels called her an oldies act at 44.",
    plateContext:
      "For eight years she played small lounges and rebuilt in Europe until Private Dancer swept three Grammys and sold twenty million copies.",
    plateExhibitCaption: "Exhibit F · Season 1 Archival Dossier (Airs 10 Jan 2027)",
    benchPrompt:
      "What part of your name, rhythm, or dignity belongs strictly to you—not to the life that ended?",
    benchPlaceholder: "What remains mine:\n",
    quietMoveTitle: "Guard the ordinary basics tonight.",
    quietMoveDay: "Tonight · 10 Minutes",
    quietMoveDesc:
      "Sleep, real food, one walk, and one trusted person who gets the unedited truth. Never make five-year decisions while the floor is still moving.",
  },
  {
    slug: "body-interrupted",
    stageKey: "health",
    shortLabel: "Body & Recovery Setback",
    mirrorLine: "Your body interrupted every plan you made.",
    subLine: "A diagnosis, injury, or long recovery nobody around you can see.",
    parallelSubject: "Monica Seles / Shania Twain",
    parallelDuration: "28 mos–15 yrs",
    dossierSlug: "steve-jobs",
    highlightedSubjects: ["Monica Seles", "Shania Twain"],
    plateHeader: "ARCHIVAL PLATE · EPISODES 09 & 11 · 1993–2017",
    plateBadge: "SEASON 1 · DOCUMENTED RECORD",
    plateHeadline: "Slower is not the same as finished.",
    plateBeforeQuote:
      "World No. 1 with eight Grand Slams at nineteen, Monica Seles lost twenty-eight months to an on-court attack—while Shania Twain lost her singing voice to nerve damage and open-throat surgery. ",
    plateDecisiveQuote: "“Seles walked back onto centre court and won the 1996 Australian Open; Twain returned to #1 after fifteen years.”",
    plateAfterQuote: " Patience was still motion.",
    plateContext:
      "Across Season 1—from Nwankwo Kanu's emergency heart surgery to Seles and Twain—rebuilding the body required redrawing the calendar without cancelling the future.",
    plateExhibitCaption: "Exhibit G · Season 1 Medical & Return Chronology",
    benchPrompt:
      "Write down one thing your body has already carried you through this month that you haven't credited yourself for.",
    benchPlaceholder: "Evidence of quiet endurance:\n",
    quietMoveTitle: "Write three clear questions for your next care visit.",
    quietMoveDay: "Tonight · 10 Minutes",
    quietMoveDesc:
      "Walk into every appointment with a short written list. Measure wins in days, not years.",
  },
  {
    slug: "starting-late",
    stageKey: "later",
    shortLabel: "Rebuilding at 40, 50 or Later",
    mirrorLine: "Starting again when everyone assumes you should already be settled.",
    subLine: "Real family bills, zero patience for noise, deeper judgement.",
    parallelSubject: "George Foreman",
    parallelDuration: "20 yrs",
    dossierSlug: "tyler-perry",
    highlightedSubjects: ["George Foreman"],
    plateHeader: "ARCHIVAL PLATE · EPISODE 14 · LAS VEGAS, 5 NOVEMBER 1994",
    plateBadge: "SEASON 1 FINALE · 20-YEAR ARC",
    plateHeadline: "The same red trunks from Zaire, twenty years later.",
    plateBeforeQuote:
      "Broke, mocked as a punchline, and twenty years past his defeat to Muhammad Ali in Zaire, George Foreman stepped back into the ring to keep a youth centre open. ",
    plateDecisiveQuote: "“At 45, wearing the same red trunks from Zaire, he won the heavyweight title of the world.”",
    plateAfterQuote: " Nobody could shortcut twenty years of judgement.",
    plateContext:
      "You are not arriving at the starting line empty-handed. You are arriving with decades of scars and pattern recognition a beginner cannot buy.",
    plateExhibitCaption: "Exhibit N · Season 1 Finale Chronology (Airs 7 Mar 2027)",
    benchPrompt:
      "List three problems you can solve in an hour today that would have taken your twenty-five-year-old self a year.",
    benchPlaceholder: "Pattern recognition I already carry:\n1. \n2. \n3. ",
    quietMoveTitle: "Inventory what you know how to solve.",
    quietMoveDay: "Tonight · 15 Minutes",
    quietMoveDesc:
      "Include the judgement you take for granted. Then pick one visible piece of work you can finish in 30 days.",
  },
  {
    slug: "year-three-fog",
    stageKey: "stuck",
    shortLabel: "Year-Three Fog",
    mirrorLine: "Nothing collapsed — you just can't see the next room anymore.",
    subLine: "Standing still in the fog while the years keep turning.",
    parallelSubject: "Season 1 Anthology",
    parallelDuration: "3–11 yrs",
    dossierSlug: "steve-jobs",
    highlightedSubjects: ["Steve Jobs", "Tyler Perry"],
    plateHeader: "ARCHIVAL PLATE · SEASON 1 CHRONOLOGY · YEARS TWO TO SIX",
    plateBadge: "131 VERIFIED CLAIMS · EPS 01–03",
    plateHeadline: "Almost nobody talks about what year three actually felt like.",
    plateBeforeQuote:
      "Between the dramatic collapse and the celebrated comeback sits the unfilmed middle: NeXT burning $40M a year, Perry's fourth empty theatre, Denzel Washington sitting in a barbershop after a 1.7 GPA dismissal. ",
    plateDecisiveQuote: "“Clarity rarely arrives while standing still—direction is what small motion leaves behind.”",
    plateAfterQuote: " Feeling stalled in year three is normal, not fatal.",
    plateContext:
      "Every subject in Season 1 spent years in rooms where nothing looked like winning before a single door shifted.",
    plateExhibitCaption: "Exhibit S · Cross-Season Wilderness Comparison",
    benchPrompt:
      "When was the last time you felt genuinely useful? Write down what problem you were solving and who was in the room.",
    benchPlaceholder: "A compass bearing from my own track record:\n",
    quietMoveTitle: "Run one small experiment before Sunday.",
    quietMoveDay: "Tonight · 15 Minutes",
    quietMoveDesc:
      "Pick one phone call, one page, or one weekend test—and cut one numbing habit to give it oxygen.",
  },
  {
    slug: "quiet-grief",
    stageKey: "grief",
    shortLabel: "Carrying Quiet Grief",
    mirrorLine: "Carrying a loss nobody else knows how to talk about.",
    subLine: "A parent, a partner, a chapter, or the version of yourself you knew.",
    parallelSubject: "J.K. Rowling / Season 1",
    parallelDuration: "3 yrs",
    dossierSlug: "jk-rowling",
    highlightedSubjects: ["J.K. Rowling"],
    plateHeader: "ARCHIVAL PLATE · EPISODE 02 · DECEMBER 1990 – 1994",
    plateBadge: "38 VERIFIED CLAIMS · 1 HELD BACK",
    plateHeadline: "Grief has its own clock.",
    plateBeforeQuote:
      "In December 1990, Anne Rowling died of multiple sclerosis at forty-five, months after her daughter began writing a children's book she would never get to read. ",
    plateDecisiveQuote: "“Grief shaped every page Joanne wrote in those quiet Edinburgh cafés.”",
    plateAfterQuote: " Nothing here tries to hurry it.",
    plateContext:
      "You do not owe anyone a tidy performance of strength. Keeping one steady daily anchor while the ground settles is enough for this week.",
    plateExhibitCaption: "Exhibit B2 · The Guardian (18 Apr 2001) & jkrowling.com",
    benchPrompt:
      "Name one honest, low-pressure anchor you can keep steady this week—without pretending you are fine.",
    benchPlaceholder: "One steady anchor for this week:\n",
    quietMoveTitle: "Drop the brave mask with one trusted person.",
    quietMoveDay: "Tonight · One Message",
    quietMoveDesc:
      "Send one honest sentence to someone safe. And if grief grows heavier, let a counsellor or doctor help carry it.",
  },
];

export const CHAPTER_MAP: Record<string, JourneyChapter> = Object.fromEntries(
  CHAPTERS.map((c) => [c.slug, c])
);

const LEGACY_STAGE_TO_CHAPTER: Record<string, string> = {
  job: "door-closed",
  money: "quiet-insolvency",
  rejected: "twelve-nos",
  breakup: "life-split",
  health: "body-interrupted",
  later: "starting-late",
  stuck: "year-three-fog",
  grief: "quiet-grief",
};

export function resolveChapterSlug(raw: string | null | undefined): string {
  if (!raw) return "door-closed";
  const clean = raw.trim().toLowerCase();
  if (CHAPTER_MAP[clean]) return clean;
  if (LEGACY_STAGE_TO_CHAPTER[clean]) return LEGACY_STAGE_TO_CHAPTER[clean];
  return "door-closed";
}

