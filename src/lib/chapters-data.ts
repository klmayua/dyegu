export type ChapterIconName =
  | "DoorClosed"
  | "Wallet"
  | "Compass"
  | "HeartCrack"
  | "Activity"
  | "Clock"
  | "CloudFog"
  | "Flame";

export type ProtocolIconName =
  | "Sunrise"
  | "Shield"
  | "Footprints"
  | "FileSpreadsheet"
  | "PhoneCall"
  | "Compass"
  | "BookOpen"
  | "Anchor"
  | "Heart"
  | "Clock"
  | "PenLine";

export interface ProtocolStep {
  step: string;
  icon: ProtocolIconName;
  text: string;
}

export interface MasterChapter {
  slug: string;
  stageKey: "job" | "money" | "rejected" | "breakup" | "health" | "later" | "stuck" | "grief";
  icon: ChapterIconName;
  shortLabel: string;
  line: string;
  subtext: string;
  mirrorSubject: string;
  wildernessDuration: string;
  dossierSlug: string;
  highlightedSubjects: string[];
  mirrorEyebrow: string;
  mirrorHeadline: string;
  mirrorNarrative: string;
  plateCitation: string;
  plateBadge: string;
  plateQuotePrefix: string;
  plateQuoteHighlighted: string;
  plateQuoteSuffix: string;
  plateImage?: string;
  receiptCtaLabel: string;
  protocolSteps: [ProtocolStep, ProtocolStep, ProtocolStep];
  privateNotePrompt: string;
}

export const MASTER_CHAPTERS: MasterChapter[] = [
  {
    slug: "door-closed",
    stageKey: "job",
    icon: "DoorClosed",
    shortLabel: "Career Exile & Closed Doors",
    line: "The room you built your name in just closed its door.",
    subtext: "Fired, laid off, restructured out, or quietly pushed aside.",
    mirrorSubject: "Steve Jobs",
    wildernessDuration: "11 years",
    dossierSlug: "steve-jobs",
    highlightedSubjects: ["Steve Jobs"],
    mirrorEyebrow: "YOUR HISTORICAL MIRROR · EPISODE 01",
    mirrorHeadline: "An office, a title, and no job.",
    mirrorNarrative:
      "If the phone stopped ringing this week, you know the specific humiliation of losing a seat you built. In May 1985, Steve Jobs was thirty years old—stripped of every operating role at Apple, left with a ceremonial chairman title and an empty building across the street. Wall Street was told there was no role for him now or ever. He didn't bounce back in ninety days. He spent eleven years losing money on NeXT and Pixar before anyone called it a comeback. You are not finished. You are simply at the start of the unglamorous middle.",
    plateCitation: "ARCHIVAL PLATE · FORTUNE MAGAZINE, 5 AUGUST 1985",
    plateBadge: "49 VERIFIED CLAIMS · 0 HELD BACK",
    plateQuotePrefix:
      "Apple reorganises, cuts 20% of staff, posts first-ever quarterly loss. Sculley tells analysts there is ",
    plateQuoteHighlighted: "no role for Steve Jobs at Apple, now or ever.",
    plateQuoteSuffix: "",
    plateImage: "/assets/cards/ep01-fortune-1985.webp",
    receiptCtaLabel: "Inspect 49 Verified Primary Receipts →",
    protocolSteps: [
      {
        step: "01 · Protect Your First Hour",
        icon: "Sunrise",
        text: "Do not open LinkedIn, job boards, or reactive messages for the first 60 minutes after waking. Drink water, sit in silence, and remind your nervous system that an empty calendar is not an emergency.",
      },
      {
        step: "02 · Separate the Seat From the Builder",
        icon: "Shield",
        text: "Write down three skills, instincts, or relationships you built inside that old room that nobody could confiscate when they took your title. That is your actual capital.",
      },
      {
        step: "03 · Lay One Unhurried Brick",
        icon: "Footprints",
        text: "Send one honest, zero-desperation note to a former peer or mentor—not asking for a job, simply stating what you are building or exploring next.",
      },
    ],
    privateNotePrompt: "One sentence you want to remember at 7:00 AM tomorrow.",
  },
  {
    slug: "quiet-insolvency",
    stageKey: "money",
    icon: "Wallet",
    shortLabel: "Quiet Financial Collapse",
    line: "Everyone thinks you're fine. Your account tells a different story.",
    subtext: "Debt, a closed company, or savings wiped out while people still lean on you.",
    mirrorSubject: "Tyler Perry",
    wildernessDuration: "6 years",
    dossierSlug: "tyler-perry",
    highlightedSubjects: ["Tyler Perry"],
    mirrorEyebrow: "YOUR HISTORICAL MIRROR · EPISODE 03",
    mirrorHeadline: "Thirty people in a 1,200-seat hall.",
    mirrorNarrative:
      "Financial collapse is loud in your head at 2:00 AM and completely invisible to the people who still expect you to carry them. In 1992, Tyler Perry took his entire $12,000 savings from working as a bill collector and rented an Atlanta theatre expecting 1,200 people. Thirty showed up. He lost his apartment and slept in a Geo Metro he hid from the repo man—yet he staged that same play once a year through six years of failure before 1998 broke open. A zero balance sheet is a season, never a sentence on what you know how to build.",
    plateCitation: "ARCHIVAL PLATE · ATLANTA RECORD, 1992–1998",
    plateBadge: "44 VERIFIED CLAIMS · 0 HELD BACK",
    plateQuotePrefix:
      "After spending his entire $12,000 life savings on a single weekend staging in Atlanta, ",
    plateQuoteHighlighted: "about thirty people came—and he lived in his car for three months.",
    plateQuoteSuffix: " Six annual stagings later, the house sold out.",
    receiptCtaLabel: "Inspect 44 Verified Primary Receipts →",
    protocolSteps: [
      {
        step: "01 · Look Straight at the Numbers",
        icon: "FileSpreadsheet",
        text: "Before noon, put every real balance, lender, and due date onto one plain sheet of paper. Panic feeds on the figures you avoid reading in daylight.",
      },
      {
        step: "02 · Count What Cannot Be Repossessed",
        icon: "Shield",
        text: "List three capabilities, relationships, or craft lessons you still carry inside your head. That is your actual starting capital.",
      },
      {
        step: "03 · Make One Call Before They Call You",
        icon: "PhoneCall",
        text: "Reach out calmly to one creditor, vendor, or partner with a realistic calendar—and pause before signing any hurried debt rescue.",
      },
    ],
    privateNotePrompt: "One truthful number or boundary you will face calmly tomorrow morning.",
  },
  {
    slug: "twelve-nos",
    stageKey: "rejected",
    icon: "Compass",
    shortLabel: "Rejection & Closed Rooms",
    line: "Twelve closed doors — and the quiet temptation to stop knocking.",
    subtext: "The pitch, the role, the publisher, or the grant that came back no.",
    mirrorSubject: "J.K. Rowling",
    wildernessDuration: "3 years",
    dossierSlug: "jk-rowling",
    highlightedSubjects: ["J.K. Rowling"],
    mirrorEyebrow: "YOUR HISTORICAL MIRROR · EPISODE 02",
    mirrorHeadline: "Twelve publishers passed before one reader said yes.",
    mirrorNarrative:
      "Every rejection lands on the exact same bruise until you start mistaking a gatekeeper's hesitation for a verdict on your worth. In 1994, Joanne Rowling was grieving her mother, raising an infant daughter on state income support in Edinburgh, and watching twelve publishers turn down her manuscript. She didn't need twelve committees to agree—she needed one chairman to hand chapter one to his eight-year-old daughter. Twelve nos are data, not a final judgement.",
    plateCitation: "ARCHIVAL PLATE · HARVARD GAZETTE & THE HERALD, 1997",
    plateBadge: "38 VERIFIED CLAIMS · 1 HELD BACK",
    plateQuotePrefix:
      "Turned down by twelve publishing houses while living on income support in Edinburgh, she recalled: ",
    plateQuoteHighlighted: "“by every usual standard, I was the biggest failure I knew.”",
    plateQuoteSuffix: "",
    receiptCtaLabel: "Inspect 38 Verified Primary Receipts →",
    protocolSteps: [
      {
        step: "01 · Log Every 'No' Like a Researcher",
        icon: "BookOpen",
        text: "Open one clean ledger: what you sent, to whom, and what came back. Patterns appear on paper that bruised pride conceals.",
      },
      {
        step: "02 · Ask One Room for One Honest Line",
        icon: "Compass",
        text: "Send a calm, two-sentence note to one person who passed—zero defensiveness, asking for a single point that would make the work sharper.",
      },
      {
        step: "03 · Commit to a Volume, Not a Date",
        icon: "Footprints",
        text: "Decide before noon on your next five doors. Sending five sharper pitches is inside your control; when the yes arrives is not.",
      },
    ],
    privateNotePrompt: "The next room you will knock on before Friday—without apologising for your work.",
  },
  {
    slug: "life-split",
    stageKey: "breakup",
    icon: "HeartCrack",
    shortLabel: "Life Split in Half",
    line: "The life you planned just broke into two halves.",
    subtext: "Divorce, separation, or walking away to keep your dignity intact.",
    mirrorSubject: "Tina Turner",
    wildernessDuration: "8 years",
    dossierSlug: "jk-rowling",
    highlightedSubjects: ["Tina Turner"],
    mirrorEyebrow: "YOUR HISTORICAL MIRROR · EPISODE 06",
    mirrorHeadline: "Thirty-six cents and her own name.",
    mirrorNarrative:
      "When a marriage or home splits, you don't only lose a partner—you lose the entire map of the next ten years. In July 1976, Tina Turner ran across a Dallas highway at night with thirty-six cents and a Mobil gas card, surrendering every house and royalty in the divorce just to keep her own name. American labels dismissed her at 44; eight years of rebuilding in small lounges and Europe ended with Private Dancer and three Grammys. You are not starting from zero—you carry your name and everything you survived.",
    plateCitation: "ARCHIVAL PLATE · SEASON 1 FILE · DALLAS, JULY 1976",
    plateBadge: "SEASON 1 · AIRS 10 JANUARY 2027",
    plateQuotePrefix:
      "Walking out of a sixteen-year partnership to preserve her life and name, she carried ",
    plateQuoteHighlighted: "36 cents and a Mobil gas card—rebuilding for eight years until age 44.",
    plateQuoteSuffix: "",
    receiptCtaLabel: "Inspect Season 1 Verification Dossiers →",
    protocolSteps: [
      {
        step: "01 · Guard the Ordinary Basics",
        icon: "Sunrise",
        text: "Protect sleep, a real meal, and a 20-minute morning walk before noon. Refuse to make five-year commitments while the floor is still shifting.",
      },
      {
        step: "02 · Drop the Brave Mask Once",
        icon: "Heart",
        text: "Tell one steady, trustworthy friend the unedited version of this week—not the tidy summary you give everyone else.",
      },
      {
        step: "03 · Claim One Ritual With Only Your Name",
        icon: "Anchor",
        text: "Choose one small daily anchor—a morning coffee table, a route, a quiet project—that belongs solely to Chapter Two.",
      },
    ],
    privateNotePrompt: "One boundary or quiet ritual that belongs strictly to your new chapter.",
  },
  {
    slug: "body-interrupted",
    stageKey: "health",
    icon: "Activity",
    shortLabel: "Body & Recovery Setback",
    line: "Your body interrupted every plan you made.",
    subtext: "A diagnosis, an injury, or a long recovery nobody else can see.",
    mirrorSubject: "Monica Seles & Shania Twain",
    wildernessDuration: "28 mos – 15 yrs",
    dossierSlug: "steve-jobs",
    highlightedSubjects: ["Monica Seles", "Shania Twain"],
    mirrorEyebrow: "YOUR HISTORICAL MIRROR · EPISODES 09 & 11",
    mirrorHeadline: "Slower is not the same as finished.",
    mirrorNarrative:
      "When your body rewrites the terms, waiting feels harder than fighting. At nineteen, Monica Seles held eight Grand Slams before an on-court stabbing took twenty-eight months of her prime; Shania Twain lost her singing voice to nerve damage and endured open-throat surgery and fifteen years of quiet rehabilitation. Seles walked back onto centre court to win the 1996 Australian Open; Twain returned to #1. Redraw the calendar without surrendering the climb.",
    plateCitation: "ARCHIVAL PLATE · SEASON 1 CHRONOLOGY · 1993–2017",
    plateBadge: "SEASON 1 · DOCUMENTED RECOVERY ARCS",
    plateQuotePrefix:
      "Across 28 months for Seles and 15 years for Twain, the record confirms one truth: ",
    plateQuoteHighlighted: "a longer recovery timeline is still forward motion.",
    plateQuoteSuffix: "",
    receiptCtaLabel: "Inspect Season 1 Verification Dossiers →",
    protocolSteps: [
      {
        step: "01 · Put Three Questions on Paper",
        icon: "PenLine",
        text: "Write a short, calm list of questions for your doctor or care team before your next appointment. Written clarity lowers nervous-system static.",
      },
      {
        step: "02 · Measure Tomorrow in Hours, Not Years",
        icon: "Clock",
        text: "Decide on one sustainable act of care before noon—rest, medication, gentle movement—and count it as a real win.",
      },
      {
        step: "03 · Keep a Short Endurance Log",
        icon: "Shield",
        text: "Record one sentence about what you have already carried this month. On heavier days, read back your own receipts.",
      },
    ],
    privateNotePrompt: "One gentle pace rule you will honour for your body tomorrow morning.",
  },
  {
    slug: "starting-late",
    stageKey: "later",
    icon: "Clock",
    shortLabel: "Rebuilding at 40, 50 or Later",
    line: "Starting again when everyone assumes you should already be settled.",
    subtext: "Real family bills, zero patience for noise, deeper judgement.",
    mirrorSubject: "George Foreman",
    wildernessDuration: "20 years",
    dossierSlug: "tyler-perry",
    highlightedSubjects: ["George Foreman"],
    mirrorEyebrow: "YOUR HISTORICAL MIRROR · EPISODE 14",
    mirrorHeadline: "The same red trunks from Zaire, twenty years later.",
    mirrorNarrative:
      "Rebuilding at forty, fifty, or beyond carries responsibilities a twenty-year-old doesn't have—and a quiet pressure to pretend you should already be finished. Twenty years after losing to Muhammad Ali in Zaire, George Foreman was broke, mocked by sportswriters, and fighting to keep his youth centre open. On 5 November 1994, at 45 years old, wearing the exact same red trunks, he won the heavyweight championship of the world. You are not late; you are arriving with decades of discernment no beginner can shortcut.",
    plateCitation: "ARCHIVAL PLATE · LAS VEGAS, 5 NOVEMBER 1994",
    plateBadge: "SEASON 1 FINALE · 20-YEAR WILDERNESS",
    plateQuotePrefix:
      "Written off as a punchline twenty years after Zaire, ",
    plateQuoteHighlighted: "at 45 George Foreman became the oldest heavyweight champion in history.",
    plateQuoteSuffix: "",
    receiptCtaLabel: "Inspect Season 1 Verification Dossiers →",
    protocolSteps: [
      {
        step: "01 · Audit Your Pattern Recognition",
        icon: "Shield",
        text: "Write down three complex problems you can diagnose in twenty minutes today that took you ten years to learn. Stop apologising for your age.",
      },
      {
        step: "02 · Call One Person Ten Years Ahead",
        icon: "PhoneCall",
        text: "Reach out to one person who made a mid-life crossing and ask which detours they would skip.",
      },
      {
        step: "03 · Ship One Visible Proof in 30 Days",
        icon: "Footprints",
        text: "Pick one finite, concrete piece of work you can begin before noon—momentum beats grand five-year speeches every time.",
      },
    ],
    privateNotePrompt: "One hard-earned advantage from your years that you will put to work tomorrow.",
  },
  {
    slug: "year-three-fog",
    stageKey: "stuck",
    icon: "CloudFog",
    shortLabel: "Year-Three Fog",
    line: "Nothing collapsed — you just can't see the next room anymore.",
    subtext: "Standing still while life keeps accelerating around you.",
    mirrorSubject: "Season 1 Anthology",
    wildernessDuration: "3–11 years",
    dossierSlug: "steve-jobs",
    highlightedSubjects: ["Steve Jobs", "Tyler Perry"],
    mirrorEyebrow: "YOUR HISTORICAL MIRROR · SEASON 1 ANTHOLOGY",
    mirrorHeadline: "Nobody talks about what year three actually felt like.",
    mirrorNarrative:
      "You don't need a dramatic catastrophe to feel quietly drained. Between every public fall and every celebrated comeback sits the long, unfilmed middle—NeXT losing $40M a year, Perry's fourth empty theatre, Denzel Washington sitting in his mother's beauty parlour after being dismissed with a 1.7 GPA. Clarity almost never arrives while staring at the wall; direction is what small, stubborn motion leaves behind.",
    plateCitation: "ARCHIVAL PLATE · SEASON 1 CROSS-CHRONOLOGY",
    plateBadge: "131 VERIFIED CLAIMS · EPS 01–03",
    plateQuotePrefix:
      "Across all fourteen documented arcs in Season 1, the middle years looked indistinguishable from failure: ",
    plateQuoteHighlighted: "every breakthrough arrived years after observers stopped watching.",
    plateQuoteSuffix: "",
    receiptCtaLabel: "Inspect 49 Verified Primary Receipts →",
    protocolSteps: [
      {
        step: "01 · Trace Your Last Compass Bearing",
        icon: "Compass",
        text: "Write down the last time you felt genuinely useful—what problem were you solving, and who was in the room? That is data, not nostalgia.",
      },
      {
        step: "02 · Cut One Numbing Habit Tomorrow",
        icon: "Sunrise",
        text: "Remove one hour of late-night scrolling or one obligation you've outgrown to give your attention back its oxygen.",
      },
      {
        step: "03 · Run One Small Experiment Before Noon",
        icon: "Footprints",
        text: "Make one phone call, write one rough page, or test one small idea. Motion opens doors thinking alone never will.",
      },
    ],
    privateNotePrompt: "One small experiment you will run before noon tomorrow to break the fog.",
  },
  {
    slug: "quiet-grief",
    stageKey: "grief",
    icon: "Flame",
    shortLabel: "Carrying Quiet Grief",
    line: "Carrying a loss nobody else knows how to talk about.",
    subtext: "A parent, a partner, a chapter, or the version of yourself you knew.",
    mirrorSubject: "J.K. Rowling & Season 1",
    wildernessDuration: "3 years",
    dossierSlug: "jk-rowling",
    highlightedSubjects: ["J.K. Rowling"],
    mirrorEyebrow: "YOUR HISTORICAL MIRROR · EPISODE 02",
    mirrorHeadline: "Grief has its own clock.",
    mirrorNarrative:
      "In December 1990, Anne Rowling died of multiple sclerosis at forty-five—months after her daughter began writing a children's book she would never get to read. Grief sat beside Joanne in every quiet Edinburgh café where those chapters took shape. Nothing here tries to rush grief or tidy it into a motivational lesson. Keeping one steady anchor while the ground settles is enough for this week.",
    plateCitation: "ARCHIVAL PLATE · THE GUARDIAN (2001) & JKROWLING.COM",
    plateBadge: "38 VERIFIED CLAIMS · 1 HELD BACK",
    plateQuotePrefix:
      "Losing her mother six months after beginning the manuscript reshaped every page that followed: ",
    plateQuoteHighlighted: "you do not owe anyone a tidy performance of strength.",
    plateQuoteSuffix: "",
    receiptCtaLabel: "Inspect 38 Verified Primary Receipts →",
    protocolSteps: [
      {
        step: "01 · Keep One Quiet Daily Anchor",
        icon: "Anchor",
        text: "One morning walk, one meal at the same hour, one glass of water in stillness—something solid while everything else shifts.",
      },
      {
        step: "02 · Speak Honestly to One Safe Person",
        icon: "Heart",
        text: "Stop pretending you're fine just to make a room comfortable. Send one honest line to someone who can hold it.",
      },
      {
        step: "03 · Let Trained Support Share the Weight",
        icon: "Shield",
        text: "If the heaviness deepens, let a counsellor, doctor, or grief group sit beside you. Asking for steady ground is strength.",
      },
    ],
    privateNotePrompt: "One quiet anchor you will keep steady tomorrow without performing strength.",
  },
];

export const MASTER_CHAPTER_MAP: Record<string, MasterChapter> = Object.fromEntries(
  MASTER_CHAPTERS.map((c) => [c.slug, c])
);

const ALIAS_MAP: Record<string, string> = {
  job: "door-closed",
  money: "quiet-insolvency",
  rejected: "twelve-nos",
  breakup: "life-split",
  health: "body-interrupted",
  later: "starting-late",
  stuck: "year-three-fog",
  grief: "quiet-grief",
};

export function resolveMasterChapter(raw: string | null | undefined): MasterChapter {
  if (!raw) return MASTER_CHAPTERS[0];
  const clean = raw.trim().toLowerCase();
  if (MASTER_CHAPTER_MAP[clean]) return MASTER_CHAPTER_MAP[clean];
  if (ALIAS_MAP[clean]) return MASTER_CHAPTER_MAP[ALIAS_MAP[clean]];
  return MASTER_CHAPTERS[0];
}

export const SEEDED_WITNESS_DISPATCHES = [
  {
    id: "seed-1",
    text: "Lagos · Month 14 after shutting down my agency. Tonight is the first night I didn't feel ashamed.",
  },
  {
    id: "seed-2",
    text: "Toronto · 46 years old, starting over after a 17-year marriage. Taking tomorrow one hour at a time.",
  },
  {
    id: "seed-3",
    text: "London · Twelve rejections this quarter. Still knocking.",
  },
] as const;

export const WILDERNESS_CHART_BARS = [
  {
    subject: "Monica Seles",
    duration: "28 months",
    pct: 12,
    label: "1993 Hamburg stabbing → 1996 Australian Open",
    chapterSlug: "body-interrupted",
  },
  {
    subject: "J.K. Rowling",
    duration: "3 years",
    pct: 18,
    label: "Edinburgh state support & 12 rejections → Bloomsbury",
    chapterSlug: "twelve-nos",
  },
  {
    subject: "Tyler Perry",
    duration: "6 years",
    pct: 32,
    label: "Geo Metro & failed stagings → 1998 breakthrough",
    chapterSlug: "quiet-insolvency",
  },
  {
    subject: "Tina Turner",
    duration: "8 years",
    pct: 43,
    label: "36 cents in Dallas (1976) → Private Dancer & 3 Grammys",
    chapterSlug: "life-split",
  },
  {
    subject: "Steve Jobs",
    duration: "11 years",
    pct: 58,
    label: "Ousted from Apple (1985) → Pixar IPO & $400M return",
    chapterSlug: "door-closed",
  },
  {
    subject: "Shania Twain",
    duration: "15 years",
    pct: 78,
    label: "Lost singing voice & open-throat surgery → #1 comeback",
    chapterSlug: "body-interrupted",
  },
  {
    subject: "George Foreman",
    duration: "20 years",
    pct: 100,
    label: "Zaire (1974) → Oldest heavyweight champion at 45",
    chapterSlug: "starting-late",
  },
] as const;
