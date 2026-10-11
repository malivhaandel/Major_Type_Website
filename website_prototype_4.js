const FONT_FILES = {
  Rough: "data/ABCStefanTrial-Simple.otf",
  Stefan: "data/ABCStefanTrial-Simple.otf",
  AreaBody: "data/AreaTrialNormal-Extrabold.otf",
  AreaLabel: "data/AreaTrialNormal-Black.otf"
};
const D = "Rough", B = "Stefan", S = "AreaBody", MONO = "AreaLabel";
(() => { const st = document.createElement("style"); st.textContent = Object.entries(FONT_FILES).map(([n, f]) => '@font-face{font-family:"' + n + '";src:url("' + f + '");font-display:block;}').join(""); document.head.appendChild(st); })();

// ---- TYPE SETTINGS
const TRK_B = -100, TRK_S = -70;                 // tracking in 1/1000 em: Stefan -100, Area -70
const SZ_B = 17, LEAD_B = 18;                    // Stefan body: size / leading
const SZ_S = 15, LEAD_S = 16;                    // Area body: size / leading
const TRK = { Rough: TRK_B, Stefan: TRK_B, AreaBody: TRK_S, AreaLabel: TRK_S };
const IND = () => max(26, 38 * u());             // indent for every second sentence (10mm)
const GLY = "*&!+#?";                            // glyphs used instead of shapes

const PAPER = "#ddd7c4", BLACK = "#111111", ORANGE = "#ff5a14", KEY = "lahs_v3";
const HH = 64, FH = 0;
const SURF_W = 900, SURF_H = 765;            // journal page size in "logical" units (scales to screen)
const INKS = ["#111111", "#d9381e", "#2f6fb5", "#3d8b4f", "#e0a800", "#8a4fb0"];
const SIZES = [3, 7, 14];
const KINDS = { D: "DRAW IT", P: "ADD A PHOTO", W: "WRITE IT" };
// headline words that speak to the reader get the marker font (Stefan); every other headline word is Area
const AUD = ["you", "your", "yours", "yourself", "my", "mine", "money", "needs", "wants", "life", "keep", "lessons", "mind", "we", "our",
  "learn", "asking", "kept", "where", "start", "finding", "pick", "topic", "make", "figured"];

// WELCOME HEADLINE (tweak here)
//   stack = true: REFERENCE-STYLE headline. Chunky stacked lines of 1-3 words, each line scaled to fill the width, tight leading,
//           ALL CAPS: Area Black words (DON'T, HAVE, TO, WHOLE, OUT) next to Stefan words (YOU, YOUR, LIFE, FIGURED).
//           Everything is random: how the words group into lines, the size of each word, which lines run short, where short lines sit
//           (left / middle / right), tiny tilts and baseline wobbles. Of 48 random layouts it keeps the one that best fills the window.
//   stackLead = line spacing in stack mode (x the biggest word in the line). 0.8 = lines just kiss, lower = more overlap
//   rel = the relative sizes words in a line pick from at random (wider spread = bigger size differences within a line)
//   (stack = false falls back to the older layouts below)
//   clear = true: no overlap, words scattered randomly (older version)
//   clear = false: the original overlapping random headline. It uses rot / lead / dy / gap, black, tiers (Area Black size steps), fixed
// Click or tap the headline to reshuffle just the headline (the rest of the page stays as it is).
// The same stacked style is used for the big title on every page (see head()).
const HEAD_OPT = { stack: true, stackLead: 0.8, rel: [0.6, 0.85, 1, 1.25],
  clear: false, rot: 0.26, pad: 0.12, fillMin: 0.6, black: true, tiers: [0.4, 0.7, 1.1, 1.6, 2.2, 2.9],
  lead: 1.04, dy: 0.14, gap: 2, fixed: false, fixSz: 0.95 };
// WELCOME HEADLINE SIZE: how much of the window it fills. wide = fraction of the window width, tall = fraction of the window height.
// 1 = fills the window edge to edge (it starts 60px down, so tall 1 runs a little past the bottom). Raise for bigger, lower for smaller.
const HEAD_FILL = { wide: 0.98, tall: 1.0, stackWide: 0.96, stackTall: 1.0 };
// ...the first two are used by the older overlapping layouts. stackWide / stackTall are used by the stacked (reference-style) headline:
// stackWide = fraction of the window width. stackTall = fraction of the VISIBLE height (the window minus the top margin) the headline may use.
// The stacked headline is never taller than that, so with stackTall 1 it fills the first screen and fits without scrolling.
// Lower either number for a smaller headline.

const AREAS = [
  ["money", "Money", "Want to feel a little more confident with money?"],
  ["work", "Work", "Thinking about jobs, earning, careers or what comes next?"],
  ["housing", "Housing", "Curious about moving out or living more independently?"],
  ["relationships", "Relationships", "Figuring out friendships, family, dating or boundaries?"],
  ["social", "Social life", "Thinking about friends, going out or finding your people?"],
  ["education", "Education", "Not sure what to study, where to go or what comes next?"],
  ["wellbeing", "Wellbeing", "Want to look after yourself while everything else changes?"]
];
// topic colours
//   money = Fern Green #41AD49, work = Cyan Blue #00AEEF, housing = Tangerine #E97E28, relationships = Hot Pink #D92D8A,
//   social = Plum #802E83, education = Marigold #F2B705 (stand-in: replace with your real yellow),
//   wellbeing = Teal #00A99D (stand-in: replace with your real seventh colour)
const COL = { money: "#41AD49", work: "#00AEEF", housing: "#E97E28", relationships: "#D92D8A", social: "#802E83", education: "#F2B705", wellbeing: "#00A99D" };

// ------------------------------------------------------------
// CONTENT  (d = card blurb, i = short version (shown under the title), t = definitions,
//           k = worth knowing, r = reality, s = personal mini challenge, a = journal activity "D|P|W:prompt")
// ------------------------------------------------------------
const L = {
  money: {
    SPENDING: { d: "Where your money goes, and whether it matches what matters to you.",
      i: "Spending isn't good or bad. It's about knowing where your money goes and whether that matches what matters to you.",
      t: [["Fixed cost", "Costs about the same every time: rent, phone plan, subscriptions."], ["Variable cost", "Changes week to week: food, transport, going out, clothes."], ["Need vs want", "Needs keep you housed, fed and working. Wants make life better. The line is personal, and sometimes blurry."], ["Impulse buy", "Something bought on the spot without planning. Waiting 24 hours is a simple test."]],
      k: ["Small repeated purchases (coffee, delivery, apps) add up quietly.", "Noticing your spending for a week, without judging it, teaches more than any rule.", "Subscriptions renew automatically, so check which ones you still use."],
      r: "A budget isn't there to stop you spending. It's there to help you decide what you want your money to do.",
      s: "Think of the last thing you bought just for yourself. How did you feel about it a day later? Write it down.",
      a: "P:Stick in a receipt, screenshot or price tag from the last week. Circle one item and write beside it: WAS IT WORTH IT? Yes, no or only a bit, and why." },
    SAVING: { d: "Making space for future plans, big purchases and surprises.",
      i: "Saving is creating a little gap between what you have today and something you want or might need later.",
      t: [["Savings goal", "A specific thing you're saving for, with an amount and a date."], ["Emergency fund", "Money set aside for surprises like a broken phone or a car repair."], ["Interest", "Money a bank pays you for keeping savings with them. It's shown as a percentage per year."], ["Compound interest", "Interest that earns interest. Small amounts grow more the longer they sit."]],
      k: ["You don't need huge amounts for saving to be useful.", "Moving money to savings straight after payday works better than saving what's left over.", "Naming a goal (travel, car, moving out) makes it feel real."],
      r: "There will be months you save less than planned. That doesn't mean you've failed.",
      s: "Imagine one thing you'd love to have or do in a year. What does it look like when you get there?",
      a: "D:Draw one thing you want to save for. Label it with a name, a dollar amount and a date, then draw a little path of three steps to get there." },
    EARNING: { d: "Income, pay, and what actually reaches your account.",
      i: "Getting paid is more than the number on a job ad. Tax, super and deductions all sit between the advertised pay and your bank account.",
      t: [["Gross pay", "What you earn before tax is taken out."], ["Net (take-home) pay", "What actually lands in your bank account after tax."], ["Tax File Number (TFN)", "Your personal tax number from the ATO. It's free, and you give it to your employer."], ["Superannuation", "Money your employer pays into a retirement fund on top of your wages, currently 12% of ordinary earnings."]],
      k: ["In Australia the first $18,200 you earn in a financial year is tax-free for residents (check ato.gov.au).", "The financial year runs 1 July to 30 June.", "Your payslip shows how your pay was worked out."],
      r: "Asking someone to explain your pay isn't embarrassing. Understanding your money is part of being at work.",
      s: "Write about what you'd want your first pay to make possible for you. How would it feel to get it?",
      a: "D:Draw a pretend first payslip. Write gross pay, tax and take-home pay, then circle the first thing your take-home pay would cover." },
    "DEBT + CREDIT": { d: "Knowing what borrowing means before you agree to it.",
      i: "Borrowing lets you have something now, but you repay it later, usually with extra costs.",
      t: [["Interest", "The fee for borrowing money, charged as a percentage."], ["Credit card", "A card that lets you spend the bank's money. Unpaid balances are charged interest."], ["Buy now pay later", "Splitting a purchase into instalments. It's still debt, and late fees can apply."], ["Credit score", "A number showing how reliably you've repaid. It affects whether you can get loans or rentals later."], ["Minimum repayment", "The smallest amount you must pay. Paying only this can keep a debt going for years."]],
      k: ["Credit isn't free money. You repay more than you borrow.", "Before borrowing, check the total cost, the repayment schedule and what happens if you miss one.", "Missed payments can stay on your credit record."],
      r: "Something being affordable today doesn't mean it will be affordable every month.",
      s: "Write about how you feel when you owe someone something. Calm, nervous, or somewhere in between?",
      a: "W:Write three questions you'd ask a lender before borrowing $500. Include one about the total cost and one about what happens if you miss a payment." },
    BUDGETING: { d: "Giving your money a job without controlling every dollar.",
      i: "A budget is a plan for where your money can go. It shouldn't be complicated or restrictive.",
      t: [["Income", "Money coming in: wages, allowance, government payments."], ["Expense", "Money going out."], ["50/30/20 rule", "A rough guide: 50% needs, 30% wants, 20% savings or debt. Adjust it to your real life."], ["Zero-based budget", "Giving every dollar a job, including 'savings' and 'fun', until nothing is left unassigned."]],
      k: ["Start with the money you actually receive, not an ideal number.", "Regular bills come first, optional spending second.", "Leave room for surprises and things you enjoy."],
      r: "A budget you can't live with won't work. Your plan has to leave room for being a person.",
      s: "Spend five minutes writing what you'd want your money to do for you this month, in your own words.",
      a: "D:Draw a messy one-week budget. Put money in at the top, three must-pay costs in the middle and one small thing just for fun, each with a dollar amount." }
  },

  work: {
    "FINDING WORK": { d: "Where to look, what to apply for and how to get started.",
      i: "Finding work is part knowing what you want and part learning how workplaces recruit.",
      t: [["Resume (CV)", "A one to two page summary of your experience, skills and education."], ["Cover letter", "A short note explaining why you want this particular job."], ["Referee", "Someone who can vouch for you, like a teacher, coach or past boss. Ask them first."], ["Work experience", "Short placements, volunteering or school jobs. These all count as experience."]],
      k: ["You don't need to match every line of an ad to apply.", "Jobs value different things: reliability, communication, technical skills or willingness to learn.", "Your first job doesn't have to be your forever job."],
      r: "Applying is a skill. A rejection doesn't tell you what you're capable of.",
      s: "Write down three things you're proud of doing, big or small, that have nothing to do with a job.",
      a: "P:Find a real job ad that catches your eye and stick it in. Circle one requirement you already meet and draw a box around one you'd need to learn." },
    "TYPES OF WORK": { d: "Full-time, part-time, casual and what the differences mean.",
      i: "The type of job decides your hours, your pay rate and whether you get paid leave. Knowing the labels helps you compare offers.",
      t: [["Full-time", "Usually around 38 hours a week, ongoing, with paid leave like annual and sick leave."], ["Part-time", "Fewer hours than full-time, on regular set days. You still get paid leave, worked out proportionally."], ["Casual", "No guaranteed hours and no paid leave, but a higher hourly rate called casual loading (commonly 25%)."], ["Apprenticeship / traineeship", "A paid job combined with training towards a qualification."], ["Contractor", "You run your own small business, invoice for work, and handle your own tax and super."]],
      k: ["Casual doesn't mean temporary. Some casuals work regular hours for years.", "The Fair Work Ombudsman (fairwork.gov.au) has free info on pay and conditions.", "A higher casual rate can look better than it is if your hours are unpredictable."],
      r: "No type of job is automatically better. It depends on what you need right now.",
      s: "Picture your ideal week. How many hours of work feel good for you, and where do you want your free time?",
      a: "W:Choose full-time, part-time or casual for the next six months. Write your choice, the hours per week you'd want and two reasons." },
    PAY: { d: "Wages, penalty rates, payslips and tax returns.",
      i: "Your pay depends on your rate, your hours, the rules for your industry, and what's taken out before it reaches you.",
      t: [["Payslip", "A document each pay showing hours, rate, tax, super and take-home pay."], ["Award", "Legal minimum pay and conditions for an industry. Check which one covers your job."], ["Penalty rates", "Higher pay for nights, weekends and public holidays, set by many awards."], ["Minimum wage", "The lowest hourly rate allowed. The Fair Work Commission updates it each year, so look up the current figure."], ["Tax return", "A yearly report to the ATO. If too much tax was withheld, you get a refund."]],
      k: ["Check your payslip matches the hours you worked.", "If something doesn't make sense, you can ask your employer to explain.", "Keep your payslips. You'll need them for lots of things, including renting."],
      r: "You don't need to pretend you understand a payslip if you don't.",
      s: "What would 'enough' pay feel like for you right now? Write what you'd want it to give you.",
      a: "P:Find an example payslip and stick it in. Circle gross pay, net pay and super, and write one question beside anything you don't understand." },
    "WORKPLACE BASICS": { d: "Your rights, responsibilities and what to expect at work.",
      i: "Starting work means learning what your workplace expects of you and what you can reasonably expect from it.",
      t: [["Employment contract", "The agreement about your role, pay and conditions. Read it before you sign."], ["Probation", "A trial period at the start of a job, where either side can end things more easily."], ["Roster", "The schedule of when you work. Ask how far ahead you'll get it."], ["Work health and safety (WHS)", "Your employer must provide a safe workplace and train you to work safely."], ["Induction", "The first-day training that explains how things work."]],
      k: ["It's fine not to know everything on day one.", "Keep a note of your hours and pay.", "If something feels unsafe or unclear, ask early."],
      r: "Being professional doesn't mean never asking for help.",
      s: "Think of a time you started something new. What helped you settle in, and what would you need in a new place?",
      a: "W:Write five things you wish someone told you before a first day at work. Include one about people, one about money and one about safety." },
    "WHAT'S NEXT": { d: "Exploring paths without needing a whole career planned.",
      i: "You don't choose one career and stay on it forever. Work is something you can explore.",
      t: [["Transferable skills", "Skills that move between jobs: communication, reliability, problem-solving, using software."], ["Career pathway", "A series of steps from where you are to where you might want to be."], ["Networking", "Talking to people who do jobs you're curious about. It's mostly just asking questions."], ["Upskilling", "Learning something new to open options, like a short course or a certificate."]],
      k: ["People change jobs and industries for many reasons.", "Trying something teaches you what you like and what you don't.", "Asking someone about their job is a legitimate research method."],
      r: "Not knowing your career yet is a normal starting point.",
      s: "Write about a day you'd love to have in five years. Where are you, who's around, what are you doing?",
      a: "D:Draw three possible paths for the next two years. Give each path a name and one thing you'd learn on it." }
  },

  housing: {
    "MOVING OUT": { d: "The practical things to think about before living independently.",
      i: "Moving out isn't only about having your own space. It's taking on everything that keeps a home running.",
      t: [["Independent living", "Looking after your own home, bills, food and routines."], ["Utilities", "Electricity, gas, water and internet. These are usually billed on top of rent."], ["Cost of living", "What it costs overall to live: housing, food, transport, bills and everything else."], ["Set-up costs", "One-off costs in the first month: bond, furniture, kitchen basics."]],
      k: ["Housing costs include much more than rent.", "Living alone, with friends, with family or in a share house all feel very different.", "Your first month is usually the most expensive."],
      r: "You don't have to move out just because you feel like you're supposed to.",
      s: "Close your eyes and picture waking up in your own place. What's the first thing you see or hear?",
      a: "D:Draw the floor plan of your first place. Label three things you'd bring, three you'd need to buy and one you really don't care about." },
    RENTING: { d: "Rent, bonds, applications and agreements.",
      i: "Renting means agreeing to certain responsibilities in exchange for a place to live. The exact rules depend on your state.",
      t: [["Lease", "The written agreement with the landlord: rent, length of stay and rules."], ["Bond", "A deposit held as security. In Victoria it's usually up to four weeks' rent, held by the RTBA, not the landlord."], ["Condition report", "A record of the property's state when you move in. Take photos and keep a copy."], ["Rental application", "A form with ID, proof of income and references that you submit to an agent."], ["Inspection", "A viewing before you apply, or a routine check by the landlord during the lease."]],
      k: ["Read an agreement before signing.", "Keep records of payments, documents and messages.", "Rental rules vary by state. Consumer Affairs Victoria has the details for Victoria."],
      r: "A perfect listing doesn't tell you everything you need to know.",
      s: "Write about what makes a place feel like home to you. What would you need from a space?",
      a: "P:Find a real rental listing and stick it in. Circle everything that isn't clear (bond, lease length, what's included) and write three questions for the agent." },
    SHARING: { d: "Living with others, splitting costs and setting boundaries.",
      i: "Sharing a home means sharing space, costs and sometimes very different ideas about what 'clean' or 'quiet' means.",
      t: [["Co-tenant", "Your name is on the lease, and you're equally responsible for the rent."], ["Housemate agreement", "A written list of house rules. It's not legally required, but it prevents arguments."], ["Shared kitty", "A pooled fund for shared items like cleaning products."], ["Rent split", "How the rent is divided. It doesn't have to be equal if rooms differ."]],
      k: ["Talk about money before problems appear.", "Agree on cleaning, guests, food and shared items early.", "Boundaries are easier to discuss before everyone is annoyed."],
      r: "Being friends doesn't make someone an easy housemate, and that's okay.",
      s: "Think about the people you feel most relaxed around. What makes sharing space with someone easy for you?",
      a: "W:Write a housemate agreement with five rules. Cover cleaning, guests, shared food, noise and how you'd split the bills." },
    COSTS: { d: "The expenses that come with having your own place.",
      i: "Housing costs are nearly always bigger than the number written next to 'rent'.",
      t: [["Rent in advance", "Rent paid upfront. In Victoria you generally can't be asked for more than a month in advance."], ["Contents insurance", "Covers your belongings if they're stolen or damaged. Landlords insure the building, not your stuff."], ["Utility connection", "Setting up electricity, gas or internet. Some charge a fee."], ["Rent-to-income ratio", "Rent divided by income. About 30% is a common guide, not a rule."]],
      k: ["Groceries, transport, internet and household supplies all add up.", "Some costs are regular and some appear without warning.", "The cheapest-looking option isn't always cheapest once everything's included."],
      r: "Your first month can be much more expensive because you have to buy things you don't own yet.",
      s: "How do you feel when you think about paying for your own place? Write down the worries and the excitement.",
      a: "W:Write a shopping list for your first week in your own place with a price next to every item, then add it all up." },
    "WHERE TO START": { d: "Questions to ask before making a move.",
      i: "If moving out feels huge, break it into smaller questions instead of solving the whole thing at once.",
      t: [["Share house", "A rental where several unrelated people live together."], ["Studio", "A one-room home with its own kitchen and bathroom."], ["Boarding", "Renting a room in someone else's home, often with meals or shared facilities."], ["Affordability", "Whether you can pay for a place comfortably after all your other costs."]],
      k: ["Where do I want to live?", "What can I realistically afford?", "Who might I live with, and what would I need to organise first?"],
      r: "You can research housing long before you're ready to move.",
      s: "What's the one thing about moving out you're most curious about? Write it as a question to yourself.",
      a: "D:Draw a door. Behind it, sketch the suburb, the people and the kind of home you'd like, and label the first thing you'd need to organise." }
  },

  relationships: {
    FRIENDSHIPS: { d: "How relationships change as life changes.",
      i: "Friendships change after school because routines, locations, work and priorities change too.",
      t: [["Reciprocity", "Both people give and take, reach out and listen."], ["Acquaintance", "Someone you know a little. Many friendships start here."], ["Drifting apart", "Slowly seeing someone less. No one's at fault."], ["Check-in", "A short message to say you're thinking of someone."]],
      k: ["Some friendships get closer and some get less frequent.", "Less contact doesn't always mean less care.", "New friendships take repeated small interactions, not one big moment."],
      r: "You don't have to keep every friendship exactly as it was.",
      s: "Write about a friend who makes you feel like yourself. What do they do that helps?",
      a: "P:Stick in a photo, ticket or tiny object from a good friendship. Write what happened and what that friend did that made it good." },
    BOUNDARIES: { d: "What feels okay for you, and how to say it.",
      i: "A boundary says what you're comfortable with, what you're not, and what you'll do if that line is crossed.",
      t: [["Boundary", "A limit about your time, space, money, body or energy."], ["Consent", "A clear, freely given yes. It can be withdrawn at any time."], ["'I' statement", "A way to speak clearly: 'I feel ... when ... and I need ...'."], ["People-pleasing", "Saying yes to avoid conflict, even when you want to say no."]],
      k: ["You can hold a boundary even if someone disagrees with it.", "Saying it clearly beats expecting someone to guess.", "Boundaries can change over time."],
      r: "Saying no doesn't make you difficult.",
      s: "Think of a time you said yes when you wanted to say no. How did it feel in your body?",
      a: "W:Write one thing you want to say YES to and one thing you want to say NO to this month. Add the exact sentence you'd use for the no." },
    FAMILY: { d: "Changing expectations and becoming more independent.",
      i: "Growing up changes family relationships. You may want more independence and still want connection.",
      t: [["Expectations", "What each person assumes the others will do."], ["Compromise", "Each side gives a little so both can live with the result."], ["Contribution", "Helping at home with chores, costs or time."], ["Independence", "Making more of your own decisions, which doesn't mean cutting people off."]],
      k: ["Changing expectations takes time.", "Talk about specific practical things rather than everything at once.", "Families can need different boundaries as you get older."],
      r: "You can love your family and still need things to change.",
      s: "Write about something you appreciate about your family and one thing you'd like to be different.",
      a: "P:Find something that reminds you of home and stick it in. Write one thing that has changed between you and your family and one thing you'd like to ask for." },
    DATING: { d: "Communication, respect, consent and looking after yourself.",
      i: "Healthy dating means communication, respect, consent and staying yourself inside a relationship.",
      t: [["Consent", "Freely given, specific and can be withdrawn. No means no, and so does silence or pressure."], ["Healthy relationship", "Both people feel safe, respected and free to have their own friends and opinions."], ["Red flag", "A warning sign, like jealousy, guilt-tripping or ignoring your limits."], ["Coercive control", "A pattern of behaviour like monitoring, isolating or putting you down to dominate someone. It's abuse even without violence."]],
      k: ["You don't owe anyone your time, body, messages or attention.", "Respect includes accepting a no.", "1800RESPECT (1800 737 732) is a free confidential line if something doesn't feel right."],
      r: "A relationship can look different to everyone else's and still be good.",
      s: "What would feeling safe and respected look like for you? Describe it in a few lines.",
      a: "W:Write three things that make a relationship feel safe and respectful to you. Then write one sentence you'd say if someone crossed a line." },
    CHANGE: { d: "Making space for relationships that grow, change or end.",
      i: "Relationships change because people change. Some changes are exciting, some are hard, and some are both.",
      t: [["Growing apart", "When two people's lives or values move in different directions."], ["Closure", "A sense of an ending, which doesn't always need a conversation."], ["One-sided effort", "When one person does most of the reaching out."], ["Grief", "Missing a relationship that has changed or ended. It's normal."]],
      k: ["Not every relationship is meant to stay the same.", "It's healthy to notice when one no longer feels good.", "New connections don't erase old ones."],
      r: "Growing apart isn't always someone's fault.",
      s: "Think of someone who has changed in your life. Write what you miss and what you've learned.",
      a: "P:Find an old photo or object from a relationship that has changed. Stick it in and write what you miss and what you've learned." }
  },

  social: {
    FRIENDSHIPS: { d: "Building friendships and finding people you're comfortable around.",
      i: "After school, friendships need to be built more deliberately because everyone has different schedules.",
      t: [["Proximity effect", "We tend to befriend people we see regularly."], ["Third place", "Somewhere that isn't home, work or school where you hang out, like a cafe, club or gym."], ["Reaching out", "Making the first move by inviting someone to something small."], ["Acquaintance", "A friendly face you don't know well yet."]],
      k: ["Shared activities make meeting people easier.", "You don't need to become close friends immediately.", "Friendship usually grows through repeated contact."],
      r: "Feeling like everyone else already has their people can be misleading.",
      s: "Think about the last time you felt really comfortable around people. Where were you, and who was there?",
      a: "P:Photograph a place where you like being with people and stick it in. Write who you'd invite there this month and what you'd say." },
    "GOING OUT": { d: "Balancing social plans, money, time and everything else.",
      i: "Going out is part of life, but it also involves money, transport, time, safety and pressure.",
      t: [["FOMO", "Fear of missing out. The feeling you must go to everything."], ["Safe ride home plan", "Deciding how you'll get home, and who with, before you go."], ["RSA", "Responsible Service of Alcohol. Venues must refuse to serve people who've had too much. The legal drinking age is 18."], ["Buddy system", "Arriving and leaving with someone and checking in on each other."]],
      k: ["You can plan around your budget instead of spending to keep up.", "You don't have to do everything your friends do.", "Keep your phone charged and tell someone where you'll be."],
      r: "A good night doesn't have to be an expensive one.",
      s: "Describe your perfect night, whether it's out or at home. What makes it good for you?",
      a: "P:Stick in a ticket, receipt or screenshot from a good night. Write what it cost, who was there and what made it good." },
    "FINDING YOUR PEOPLE": { d: "Meeting people and finding communities that feel right.",
      i: "Finding your people usually takes trying things, turning up repeatedly and giving relationships time.",
      t: [["Interest-based community", "People who share a hobby, sport or cause."], ["Volunteering", "Giving your time unpaid, a good way to meet people with something in common."], ["Regulars", "The people who turn up every week. Becoming one is how friendships start."], ["Low-pressure setting", "Somewhere with something to do, so conversation comes naturally."]],
      k: ["Clubs, sport, volunteering, work, study and creative activities all create connection.", "You don't need to be instantly confident.", "Being interested in something gives you something to talk about."],
      r: "You can feel lonely while surrounded by people. That doesn't mean you're doing friendship wrong.",
      s: "Write down something you love doing that you'd like to share with other people.",
      a: "D:Draw a map of five places or groups near you where you might meet people you click with, like a club, a class or a volunteering spot. Mark the one you'd try first." },
    "SOCIAL PRESSURE": { d: "Handling expectations, comparison and keeping up.",
      i: "Social pressure is the feeling you need to act, spend, look or live a certain way because others seem to.",
      t: [["Peer pressure", "Influence from people your age to do or buy something."], ["Social comparison", "Measuring your life against someone else's."], ["Highlight reel", "Social media shows the best bits of people's lives, not the whole thing."], ["Say-no script", "A ready-made line like 'Not tonight, but have fun!'"]],
      k: ["Comparison makes other people's lives look more complete than they are.", "You can change your mind after saying yes.", "Knowing your limits makes pressure easier to spot."],
      r: "You don't have to keep up with someone else's version of a good life.",
      s: "Think of a moment this week when you did something because you thought you should. How did it feel?",
      a: "W:Write one thing you do because you love it and one thing you do because you feel expected to. Then write a say-no line you could use." },
    CHANGE: { d: "How your social life changes after high school.",
      i: "Your social life after school may look very different to what you imagined, and it can keep changing.",
      t: [["Life stage", "A phase of life, like study or first job, with its own routines."], ["Long-distance friendship", "A friendship kept going by calls, messages and the occasional visit."], ["Social battery", "How much time with people you can handle before you need to recharge."], ["Routine", "Regular habits that give your week a shape."]],
      k: ["Different life stages create different routines.", "Some friendships survive distance and some become less central.", "You can actively build the social life you want."],
      r: "There's no correct number of friends or one right way to spend free time.",
      s: "How do you want your social life to feel in a year? Write three words for it and why you picked them.",
      a: "P:Stick in an old photo of your social life. Write three things that are different now and one thing you'd like to bring back." }
  },

  education: {
    "FURTHER STUDY": { d: "Different ways to keep learning after high school.",
      i: "Further study can mean university, TAFE, apprenticeships, short courses, online learning or learning through work.",
      t: [["University", "Offers bachelor and postgraduate degrees, usually more theory and research. Victorian applications go through VTAC."], ["TAFE", "Technical and Further Education. Practical, job-focused courses and certificates."], ["Certificate / Diploma", "Qualification levels. A Certificate III or IV or a Diploma can lead on to a degree."], ["Apprenticeship", "Learn on the job while getting paid, with some formal training."], ["Short course", "A brief course for one skill, from weeks to months."]],
      k: ["There isn't one route into a career.", "Courses have different entry requirements, costs and time commitments.", "You can investigate without committing."],
      r: "Choosing not to study straight away doesn't mean you've stopped learning.",
      s: "What's something you'd love to learn just because it's interesting to you? Write down why.",
      a: "P:Find a real course that makes you curious and stick it in. Circle the entry requirement, the length and the cost." },
    "CHOOSING A PATH": { d: "You don't need to know your forever plan.",
      i: "Choosing what's next can feel enormous because it sounds like choosing your whole future. Usually you're choosing the next step.",
      t: [["Pathway", "A route between qualifications, like a diploma that gives credit toward a degree."], ["Prerequisite", "A subject or skill you must have before you can enrol."], ["ATAR", "Australian Tertiary Admission Rank. A ranking from Year 12 results used for some university entry. Many pathways don't need a high one."], ["Gap year / deferral", "Taking time out and starting later."]],
      k: ["Interests and priorities change.", "Compare options by what matters to you, not by what sounds impressive.", "You can collect information before deciding."],
      r: "You don't need to know your forever answer to choose a next step.",
      s: "Write what you want the next stage of your life to feel like. Forget the plan for now.",
      a: "D:Draw two possible paths after school. Under each, write one thing you'd learn, one cost and one reason it appeals to you." },
    APPLICATIONS: { d: "The practical side of applying for courses or programs.",
      i: "An application shows why you're interested and whether you meet the requirements. It doesn't have to prove you've got your life figured out.",
      t: [["VTAC", "Victorian Tertiary Admissions Centre. Where you apply for most Victorian university and many TAFE courses."], ["Entry requirement", "What you need to be considered: results, prerequisites, portfolio or interview."], ["Portfolio / audition", "Showing your work or skills directly, common in creative courses."], ["Offer", "The institution saying you've got a place. You can accept, defer or decline."]],
      k: ["Different programs ask for different information.", "Put closing dates somewhere you'll actually see them.", "Ask someone to check your application before you send it."],
      r: "An application is about one opportunity. It isn't a judgement on your whole future.",
      s: "Write a few lines about yourself, as if you're introducing yourself to someone who'll cheer you on.",
      a: "W:Pick one course you might apply for. Write its closing date, its entry requirements and three things you'd need to gather." },
    COSTS: { d: "Fees, living costs and financial support.",
      i: "Education costs more than the course fee. Transport, materials, equipment and living costs matter too.",
      t: [["HECS-HELP", "A government loan for university fees. You repay it through your tax only once you earn above a set income."], ["Scholarship", "Money for study that you don't repay, based on merit, need or circumstances."], ["Youth Allowance", "A Centrelink payment for eligible students and apprentices. Check the rules."], ["Fee-free TAFE", "Some Victorian TAFE courses are free. Check eligibility for your course."]],
      k: ["Look at the full cost, not just the advertised price.", "Support may be available depending on where you live and what you study.", "Knowing costs early gives you more choices."],
      r: "Cost is a practical factor. It's not a measure of your worth.",
      s: "How do you feel about money and study? Write what worries you and what already feels okay.",
      a: "W:Pick one study option and list every cost you can think of: fees, transport, equipment and living costs. Add a rough total at the bottom." },
    "CHANGING YOUR MIND": { d: "Your first choice doesn't have to be your final choice.",
      i: "Changing direction can be part of learning what suits you.",
      t: [["Deferral", "Pausing your place and starting later."], ["Census date", "The last day to drop a subject without paying for it. Check it each semester."], ["Credit transfer", "Counting past study toward a new course so you don't repeat it."], ["Recognition of prior learning (RPL)", "Getting credit for skills you gained through work or life."]],
      k: ["You sometimes learn what suits you only by trying.", "Gather information before you change course.", "Changing is a decision, not a failure."],
      r: "Starting something doesn't mean you have to finish it at any cost.",
      s: "Remember a time you changed your mind about something. What did it teach you about yourself?",
      a: "W:Write about a time you changed your mind about something. What made you change it, and what did you keep?" }
  },

  wellbeing: {
    "LOOKING AFTER YOURSELF": { d: "Small things that help when everything feels like a lot.",
      i: "Looking after yourself isn't a perfect routine. It's noticing what helps you cope, recover and feel more like you.",
      t: [["Self-care", "Anything that helps you stay well: sleep, food, movement, rest, connection."], ["Routine", "Regular habits that make days feel steadier."], ["Sleep hygiene", "Habits that help sleep: regular times, screens down, a dark room."], ["Burnout", "Exhaustion from too much for too long."]],
      k: ["Different people need different routines.", "Basics like sleep, food and movement affect how you feel.", "Small actions still count when you have little energy."],
      r: "You don't have to earn rest by being productive first.",
      s: "Make a list of five tiny things that make you feel a bit better. Then do one of them today.",
      a: "P:Stick in or photograph something small that makes your day better. Write when you'd use it and how you'd feel afterwards." },
    STRESS: { d: "Understanding stress and ways to manage it.",
      i: "Stress is your body's response to pressure. A little can help, but ongoing or overwhelming stress is hard to manage.",
      t: [["Stressor", "Anything that puts pressure on you: exams, money, conflict."], ["Stress response", "Your body's fight-or-flight reaction: racing heart, tension, restlessness."], ["Anxiety", "Worry that sticks around and feels hard to control. It's different to everyday stress."], ["Coping strategy", "Something you do to manage stress, like walking, talking to someone or writing a list."]],
      k: ["Stress shows up physically, emotionally and in behaviour.", "Noticing early signs lets you respond sooner.", "Different strategies work for different people."],
      r: "You don't need to wait until you're overwhelmed to ask for support.",
      s: "Notice where you feel stress in your body right now. Write down what it might be trying to tell you.",
      a: "D:Draw an outline of a body and mark where you feel stress, with arrows. Then draw two things that help it come back down." },
    BALANCE: { d: "Making space for work, study, people, rest and yourself.",
      i: "Balance doesn't mean equal time for everything. It means your life has room for what matters.",
      t: [["Priorities", "The things that matter most right now. They can change week to week."], ["Overcommitting", "Saying yes to more than you can do."], ["Rest", "Time to recover. It's part of how you do things well."], ["Time budget", "Planning your hours like you'd plan money."]],
      k: ["Some weeks will be more about work or study.", "Rest is part of the system, not a prize for finishing.", "Your priorities will shift."],
      r: "A balanced life can still be messy.",
      s: "Think about the last week. What gave you energy, and what drained it?",
      a: "D:Draw your last week as a messy map. Use one ink for what gave you energy and another for what drained it." },
    "ASKING FOR HELP": { d: "Knowing when and how to reach out.",
      i: "Asking for help is a practical skill. You don't have to wait for a crisis.",
      t: [["GP", "Your doctor. A good first stop. Ask about a mental health care plan for Medicare-subsidised sessions."], ["Lifeline", "24/7 crisis support on 13 11 14."], ["Beyond Blue", "Free 24/7 support for anxiety and depression on 1300 22 4636 (beyondblue.org.au)."], ["Suicide Call Back Service", "Free 24/7 phone counselling on 1300 659 467."]],
      k: ["You can ask friends, family, teachers, workplaces, services or health professionals.", "If the first person isn't right, try another.", "In an emergency or immediate danger, call 000."],
      r: "Needing help doesn't mean you've failed at being independent.",
      s: "Think of someone you trust. Write down what you'd want them to know about how you're doing.",
      a: "W:Write down three people or places you could turn to if things got difficult, and the first sentence you'd say to each one." },
    CHANGE: { d: "Looking after yourself while life is shifting.",
      i: "Change can be exciting and unsettling at once. Routines, relationships, work and identity can all shift after school.",
      t: [["Transition", "The in-between period when one stage ends and another begins."], ["Identity", "Your sense of who you are. It can change as your life does."], ["Anchor routine", "A familiar habit you keep during change, like a weekly walk."], ["Grieving what's gone", "Missing what came before even while you move forward."]],
      k: ["It takes time to adjust.", "Keeping a few familiar routines makes change less chaotic.", "You can miss what came before and still move on."],
      r: "You don't have to feel completely ready before something changes.",
      s: "Write a short letter to yourself a year from now about what's changing and what you hope stays.",
      a: "W:Write one thing you want to carry forward and one thing you're ready to leave behind. Add a reason for each." }
  }
};

// ------------------------------------------------------------
// STATE
// ------------------------------------------------------------
let screen = "welcome", area = "", topic = "", hist = [], hits = [];
let scroll = 0, endY = 0, t0 = 0, ci = 0, pressY = 0;
let store = { pages: {}, chal: {} };   // pages keyed "area|topic|n", challenges keyed "area|topic" ({done, note, think, minute})
let page = null, dirty = false, dirtyPg = false, dirtyT = 0, pn = 1, seed = 1, lastSig = "", taKey = "", tbKey = "", tcKey = "";
let mode = "pen", ink = INKS[0], pw = SIZES[1], curStroke = null, selPhoto = -1, drag = null, off = [0, 0];
let surf = null, paper, ta, tb, tc, fileIn;
let CX = null, LX = null, TC = null, NOIND = false;
let armKey = "", armT = 0, fMsg = "", fT = -9999, fBig = true;

const lab = a => (AREAS.find(x => x[0] === a) || [0, a])[1];
const ACT = () => L[area][topic].a;
const armed = k => armKey === k && millis() - armT < 3000;
const confirmThen = (k, fn) => { if (armed(k)) { armKey = ""; fn(); } else { armKey = k; armT = millis(); } };
const flash = (m, big = true) => { fMsg = m; fT = millis(); fBig = big; };
const inner = () => screen !== "welcome" && screen !== "home";
const psz = () => SZ_S + 2;
const rnd = i => { const f = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453; return f - Math.floor(f); };   // seeded random, changes each page
const pagesOf = (a, t) => Object.values(store.pages).filter(p => p.area === a && p.topic === t).sort((x, y) => x.n - y.n);
// all text takes the selected topic's colour (black on welcome / home)
const accent = () => (["topics", "learn", "journal", "kept"].includes(screen) && COL[area]) || BLACK;
const shapeCol = accent;

// layout
const W = () => min(width - 2 * max(20, width * 0.07), 900);
const M = () => (width - W()) / 2;
const u = () => constrain(width / 900, 0.42, 1);
const GUT = () => (width < 700 ? 10 : 24);
const cwid = () => (W() - 5 * GUT()) / 6;
const colx = i => M() + i * (cwid() + GUT());
const span = n => n * cwid() + (n - 1) * GUT();

// ------------------------------------------------------------
// STORAGE
// ------------------------------------------------------------
function load() {
  try { const d = JSON.parse(localStorage.getItem(KEY) || "null"); if (d && d.pages) store = d; } catch (e) {}
  store.chal = store.chal || {}; delete store.daily;
  Object.keys(store.pages).forEach(k => { if (k.split("|").length === 2) { const q = store.pages[k]; q.n = 1; store.pages[k + "|1"] = q; delete store.pages[k]; } });
  if (store.done) { Object.keys(store.done).forEach(k => { if (store.done[k] && !store.chal[k]) store.chal[k] = { done: true, note: "" }; }); delete store.done; }
}
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(store, (k, v) => (k === "img" ? undefined : v))); }
  catch (e) { flash("TOO FULL TO SAVE. TRY FEWER PHOTOS."); }
}
function queueSave(pg = true) { dirty = true; dirtyT = millis(); if (pg) dirtyPg = true; }
function commit() {
  if (!dirty) return;
  dirty = false;
  if (dirtyPg && page) {
    const k = area + "|" + topic + "|" + pn;
    if (!page.strokes.length && !page.photos.length && !page.note.trim()) delete store.pages[k];
    else { page.ts = Date.now(); page.area = area; page.topic = topic; page.n = pn; store.pages[k] = page; }
  }
  dirtyPg = false;
  persist(); flash("SAVED", false);
}

// ------------------------------------------------------------
// NAVIGATION
// ------------------------------------------------------------
function goTo(s) { commit(); hist.push(screen); screen = s; scroll = 0; t0 = millis(); }
function goBack() { commit(); screen = hist.pop() || "home"; scroll = 0; t0 = millis(); }
function back() { goBack(); }
function goHome() { commit(); hist = []; area = topic = ""; screen = "home"; scroll = 0; t0 = millis(); }
function goSection(s) { commit(); if (screen !== s) hist = [screen]; screen = s; scroll = 0; t0 = millis(); }
function resetAll() {
  confirmThen("reset", () => {
    try { localStorage.removeItem(KEY); } catch (e) {}
    store = { pages: {}, chal: {} }; page = null; taKey = tbKey = tcKey = ""; hist = []; area = topic = ""; screen = "welcome"; scroll = 0; t0 = millis();
  });
}
function openTopic(t) { topic = t; goTo("learn"); }
const defMode = () => (ACT()[0] === "P" ? "move" : "pen");
function openPage(a, t, n) {                     // open a specific page, or the latest page for the topic
  commit(); area = a; topic = t;
  const ex = pagesOf(a, t); pn = n || (ex.length ? ex[ex.length - 1].n : 1);
  page = store.pages[a + "|" + t + "|" + pn] || { strokes: [], photos: [], note: "", n: pn };
  selPhoto = -1; mode = defMode(); goTo("journal");
}
function newPage() {                             // blank extra page for the same topic
  commit();
  const ex = pagesOf(area, topic); pn = (ex.length ? ex[ex.length - 1].n : 0) + 1;
  page = { strokes: [], photos: [], note: "", n: pn }; selPhoto = -1; mode = defMode();
  if (hist[hist.length - 1] === "journal") hist.pop();
  screen = "journal"; scroll = 0; t0 = millis();
}

// ------------------------------------------------------------
// SETUP
// ------------------------------------------------------------
// writing areas have no box of their own: they sit inside the scribble box. Text uses Stefan, small, tight.
function mkTA(ph) {
  const e = createElement("textarea");
  e.attribute("placeholder", ph);
  e.elt.style.cssText = "position:fixed;background:transparent;font:" + SZ_B + "px/" + LEAD_B + "px Stefan;letter-spacing:" + (TRK_B / 1000) + "em;resize:none;outline:none;padding:0;box-sizing:border-box;border:none;overflow:auto;";
  e.hide(); return e;
}
function showTA(el, x, y, w, h, c) { el.show(); Object.assign(el.elt.style, { left: x + "px", top: y + "px", width: w + "px", height: h + "px", color: c, caretColor: c }); }
const chalOf = () => { const k = area + "|" + topic; return (store.chal[k] = store.chal[k] || { done: false, note: "", think: "", minute: "" }); };

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
  Promise.all(Object.keys(FONT_FILES).map(n => document.fonts.load("20px " + n))).then(() => { Object.keys(cwc).forEach(k => delete cwc[k]); Object.keys(hcache).forEach(k => delete hcache[k]); hfit.k = ""; hstack.k = ""; });
  frameRate(30); makePaper();
  c.drop(onFile);                                     // drag & drop photos onto the page
  fileIn = createFileInput(onFile, true);             // multiple photos
  fileIn.attribute("accept", "image/*"); fileIn.hide();
  ta = mkTA("Write, ramble, remember something…");
  tb = mkTA("A few words is fine…");
  tc = mkTA("What stood out? What do you want to find out more about?");
  ta.elt.addEventListener("input", () => {
    if (screen === "journal" && page) { page.note = ta.value(); queueSave(); }
    else if (screen === "learn") { chalOf().note = ta.value(); queueSave(false); }
  });
  tb.elt.addEventListener("input", () => { if (screen === "learn") { chalOf().think = tb.value(); queueSave(false); } });
  tc.elt.addEventListener("input", () => { if (screen === "learn") { chalOf().minute = tc.value(); queueSave(false); } });
  load();
}
function windowResized() { resizeCanvas(windowWidth, windowHeight); makePaper(); }

function makePaper() {
  if (!(width > 0 && height > 0)) return;
  paper = createGraphics(width, height); paper.pixelDensity(1); paper.background(PAPER); paper.noStroke();
  randomSeed(11);
  for (let i = 0; i < width * height / 500; i++) { paper.fill(70, 60, 40, random(14, 40)); paper.circle(random(width), random(height), random(0.6, 2)); }
  [[9000, 4, 14, 255, 255, 255, 25, 60], [14000, 3, 10, 90, 75, 50, 15, 35]].forEach(([n, l0, l1, r, g, b, a0, a1]) => {
    for (let i = 0; i < width * height / n; i++) {
      paper.stroke(r, g, b, random(a0, a1)); paper.strokeWeight(1);
      const x = random(width), y = random(height), a = random(TWO_PI), l = random(l0, l1);
      paper.line(x, y, x + cos(a) * l, y + sin(a) * l);
    }
  });
  randomSeed(millis());
}

// ------------------------------------------------------------
// TEXT ENGINE (tracked hand fonts, typewriter reveal)
// ------------------------------------------------------------
const trk = (f, sz) => TRK[f] / 1000 * sz;                 // tracking in px per character
const cwc = {};                                            // character width cache
function chw(ch, sz, f) {
  if (f === S && sz >= 23) f = MONO;                      // big Area text (headings) uses the Black file, body stays Extrabold
  const k = f + "|" + sz + "|" + ch; let v = cwc[k];
  if (v === undefined) { textFont(f); textSize(sz); v = cwc[k] = textWidth(ch) + trk(f, sz); }
  return v;
}
const tw = (s, sz, f) => { let t = 0; for (let i = 0; i < s.length; i++) t += chw(s[i], sz, f); return t; };

// every new sentence starts on its own line; every second sentence is indented (not in centred text or marker headlines)
const SENT = /(?<=[.!?])\s+(?=[A-Z0-9"'(“])/;
function lines(s, w, sz, f) {
  textFont(f); textSize(sz); textStyle(NORMAL);
  const out = [], ind = !NOIND && f !== D, nb = ind ? max(1, round(IND() / max(1, chw("\u00A0", sz, f)))) : 0;
  s.split("\n").forEach(p => {
    if (!p) { out.push(""); return; }
    p.split(SENT).forEach((sn, si) => {
      if (ind && si % 2 === 1) sn = "\u00A0".repeat(nb) + sn;
      let cur = "";
      sn.split(" ").forEach(wd => {
        const t = cur ? cur + " " + wd : wd;
        if (tw(t, sz, f) > w && cur) { out.push(cur); cur = wd; } else cur = t;
      });
      out.push(cur);
    });
  });
  return out;
}
const measure = (s, sz, f) => max(lines(s, 1e5, sz, f).map(l => tw(l, sz, f)));

// (glyph row helper, no longer used for underlines)
function gRow(x, y, w, sz, c, ch) {
  textFont(D); textSize(sz); textAlign(CENTER, CENTER); noStroke(); fill(c);
  const st = sz * 0.62, n = max(1, floor(w / st));
  for (let i = 0; i < n; i++) text(ch[i % ch.length], x + i * st + st / 2, y);
}
const gline = (x1, y, x2, c) => dline(x1, y, x2, y, c || accent());
// one tracked string with no reveal animation (header, small controls)
function raw(s, x, y, sz, f, c) {
  textFont(f); textSize(sz); textAlign(LEFT, TOP); noStroke(); fill(c);
  let px = x;
  for (let i = 0; i < s.length; i++) { if (s[i] !== " ") text(s[i], px, y); px += chw(s[i], sz, f); }
}

function txt(s, x, y, sz, f, w, hot, dry) {
  const fe = f === S && sz >= 23 ? MONO : f;
  const plain = f === S || f === MONO;
  const lh = sz * (f === B ? LEAD_B / SZ_B : plain ? (sz > 60 ? 0.98 : LEAD_S / SZ_S) : 0.98);
  const ls = lines(s, w, sz, f);
  if (!dry) {
    const left = LX !== null, cx = left ? LX : (CX === null ? width / 2 : CX), tick = floor(millis() / 160);
    const c = TC || color(accent());
    ls.forEach((ln, li) => {
      textFont(fe); textSize(sz); textStyle(NORMAL); textAlign(plain ? LEFT : CENTER, TOP); noStroke(); fill(c);
      const lw = tw(ln, sz, f), sx = left ? cx : cx - lw / 2, py = y + li * lh;
      let px = sx;
      for (let i = 0; i < ln.length; i++) {
        const ch = ln[i], cw = chw(ch, sz, f);
        if (ci++ > (millis() - t0) * 0.6) { px += cw; continue; }
        if (ch !== " " && ch !== "\u00A0") {
          if (plain) text(ch, px, py);
          else {
            const n1 = noise(i * 0.7 + li * 9 + x * 0.01, tick * 0.9, y * 0.01) - 0.5;
            const n2 = noise(i * 0.7 + 30, li * 5 + tick * 0.9, x * 0.01) - 0.5, a = sz * 0.04;
            push(); translate(px + cw / 2 + n1 * a, py + n2 * a); rotate(n1 * 0.1); text(ch, 0, 0); pop();
          }
        }
        px += cw;
      }
      if (hot) {                                             // wavy underline
        const uy = py + sz * (f === D ? 0.92 : f === B ? 1.08 : 1.06);
        stroke(c); strokeWeight(max(plain ? 1.5 : 3, sz * 0.07)); noFill(); strokeCap(ROUND);
        beginShape();
        for (let q = 0; q <= lw; q += 10) vertex(sx + q, uy + (noise(q * 0.05, tick * 0.9, li) - 0.5) * sz * 0.08);
        endShape(); noStroke(); fill(c);
      }
    });
  }
  return ls.length * lh;
}
// left-aligned text with optional colour (plain black is retinted to the chapter colour)
function tx(s, x, y, sz, f, w, hot, c, dry) {
  LX = x; TC = c ? color(c === BLACK ? accent() : c) : null;
  const h = txt(s, 0, y, sz, f, w, hot, dry);
  LX = TC = null; return h;
}
const small = (s, y, w) => tx(s.toUpperCase(), M(), y, SZ_B, B, w || min(W(), 620));
// same as small(), but set in Area Black (AreaTrialNormal-Black.otf)
const smallA = (s, y, w) => tx(s.toUpperCase(), M(), y, SZ_S + 1, MONO, w || min(W(), 620));

// REFERENCE-STYLE HEADLINE (HEAD_OPT.stack): chunky stacked lines, each scaled to fill the width, randomised.
// Builds 48 random layouts (random line groupings, word sizes, short lines, alignments, tilts) and keeps the one whose height best fits the window.
// Used for the welcome headline AND the big title on every page (see head()).
const hstack = { k: "", L: null };
const hcache = {};                                   // one cached layout per page title
function stackLayout(s, w, h, sd, o) {
  const words = s.split(" ").filter(Boolean).map(w0 => {
    const aud = AUD.includes(w0.toLowerCase().replace(/[^a-z]/g, ""));
    return { wd: w0.toUpperCase(), f: aud ? D : MONO, aud };                 // everything in CAPS: Stefan for reader words, Area Black for the rest
  });
  const rel = o.rel || [0.6, 0.85, 1, 1.25], lead = o.stackLead || 0.8, szCap = h * 0.5, gapK = 0.2, sizes = [1, 1, 2, 2, 2, 3];
  let best = null;
  for (let c = 0; c < 48; c++) {
    let n = 0; const rr = () => rnd(sd + c * 911 + (n++));
    const lines = []; let i = 0;
    while (i < words.length) {
      const g = Math.min(words.length - i, sizes[floor(rr() * sizes.length)]), last = i + g >= words.length;
      const its = words.slice(i, i + g).map(t => Object.assign({}, t, { rs: rel[floor(rr() * rel.length)] }));
      i += g;
      its.forEach(t => { t.u = measure(t.wd, 100 * t.rs, t.f); });
      const avg = its.reduce((a, t) => a + t.rs, 0) / g, tot = its.reduce((a, t) => a + t.u, 0) + (g - 1) * gapK * 100 * avg;
      const maxrs = Math.max(...its.map(t => t.rs)), fill = last ? 0.6 + rr() * 0.3 : rr() < 0.2 ? 0.78 + rr() * 0.2 : 1;
      const k = Math.min(w * fill / tot, szCap / (100 * maxrs)), lw = tot * k;
      const a = lw < w * 0.995 ? (o.center === false ? (last ? 0.6 + 0.4 * rr() : rr()) : 0.5) : 0;   // short lines are centred (HEAD_OPT.center = false for random placement)
      let px = (w - lw) * a;
      const maxsz = k * 100 * maxrs;
      its.forEach(t => {
        t.sz = k * 100 * t.rs; t.ww = measure(t.wd, t.sz, t.f); t.x = px;
        t.dy = (maxsz - t.sz) * 0.95 + (rr() - 0.5) * 0.06 * t.sz;               // shared baseline with a little wobble
        t.r = (rr() - 0.5) * (t.aud ? 0.12 : 0.05);                              // marker words tilt a bit more
        px += t.ww + gapK * k * 100 * avg;
      });
      lines.push({ its, maxsz, lw });
    }
    const H = lines.reduce((a, l) => a + l.maxsz * lead, 0) + lines[lines.length - 1].maxsz * 0.3;
    const shortN = lines.slice(0, -1).filter(l => l.lw < w * 0.7).length;
    const score = (H > h ? 10 + (H - h) / h : (h - H) / h) + 0.2 * shortN;      // must fit inside h; among those, the fullest layout wins
    if (!best || score < best.score) best = { lines, H, score };
  }
  if (best.H > h) {                                  // nothing fitted (very short window): shrink the best one so it still fits
    const f = h / best.H;
    best.lines.forEach(l => { l.maxsz *= f; l.lw *= f; l.its.forEach(t => { t.sz *= f; t.ww *= f; t.x *= f; t.dy *= f; }); });
    best.H = h;
  }
  return best;
}
function stackHead(s, x, y, w, h, c, sd, o, cache = hstack) {
  const k = [width, height, seed, sd, w, h, s].join();
  if (cache.k !== k) { cache.k = k; cache.L = stackLayout(s, w, h, sd, o); }
  const L2 = cache.L, lead = o.stackLead || 0.8; let cum = 0;
  L2.lines.forEach(l => {
    l.its.forEach(t => {
      const hb = t.sz * 0.95;
      push(); translate(x + t.x + t.ww / 2, y + cum + t.dy + hb / 2); rotate(t.r);
      tx(t.wd, -t.ww / 2, -hb / 2, t.sz, t.f, 1e5, 0, c); pop();
    });
    cum += l.maxsz * lead;
  });
  return cum + L2.lines[L2.lines.length - 1].maxsz * 0.3;
}

// NON-OVERLAPPING RANDOM HEADLINE (HEAD_OPT.clear): same random sizes as mix(), but every word sits in its own clear space.
// Words are packed into lines of random fill; each line's spare room is split randomly into an indent and gaps;
// every word floats to a random height inside its line band. Tilts are limited per word so rotated words never touch.
function mixClear(s, x, y, w, base, c, sd, dry, o) {
  const BH = 0.95, fillMin = o.fillMin !== undefined ? o.fillMin : 0.65, gap0 = base * (o.pad !== undefined ? o.pad : 0.1),
    rotK = o.rot !== undefined ? o.rot : 0.2, vgap = base * 0.06;
  const its = [];
  s.split(" ").filter(Boolean).forEach((w0, i) => {
    const aud = AUD.includes(w0.toLowerCase().replace(/[^a-z]/g, "")), wd = w0.toUpperCase(), f = aud ? D : (o.black ? MONO : S);
    const areaK = o.tiers ? o.tiers[floor(rnd(i + sd + 40) * o.tiers.length)] * (0.85 + rnd(i + sd + 70) * 0.3) : 0.55 + rnd(i + sd + 40) * 1.25;
    let sz = base * (aud ? 0.75 + rnd(i + sd) * 1.15 : areaK), ww = measure(wd, sz, f);
    if (ww > w) { sz *= (w / ww) * 0.96; ww = measure(wd, sz, f); }
    const hb = sz * BH, rl = Math.min(rotK / 2, 0.3 * hb / ww);       // a word can only tip by about a third of its own height
    const r = (rnd(i + sd + 110) - 0.5) * 2 * rl, sr = Math.abs(Math.sin(r));
    its.push({ wd, f, sz, ww, hb, r, ext: ww * sr, we: ww + hb * sr + 2 });
  });
  const lns = []; let cur = null;
  its.forEach(it => {
    if (!cur || cur.w + gap0 + it.we > cur.cap) {
      cur = { it: [], w: 0, cap: Math.max(it.we, w * (fillMin + rnd(lns.length + sd + 300) * (1 - fillMin))) }; lns.push(cur);
    }
    cur.w += (cur.it.length ? gap0 : 0) + it.we; cur.it.push(it);
  });
  let yy = 0;
  lns.forEach((l, li) => {
    const band = Math.max(...l.it.map(t => t.hb + t.ext)), slack = Math.max(0, w - l.w), wt = []; let tot = 0;
    for (let k = 0; k <= l.it.length; k++) { const v = 0.15 + rnd(li * 37 + k * 11 + sd + 400); wt.push(v); tot += v; }
    let px = slack * wt[0] / tot;
    l.it.forEach((t, k) => {
      const py = yy + t.ext / 2 + rnd(li * 53 + k * 7 + sd + 500) * (band - t.hb - t.ext);
      if (!dry) { push(); translate(x + px + t.we / 2, y + py + t.hb / 2); rotate(t.r); tx(t.wd, -t.ww / 2, -t.hb / 2, t.sz, t.f, 1e5, 0, c); pop(); }
      px += t.we + gap0 + slack * wt[k + 1] / tot;
    });
    yy += band + vgap;
  });
  return yy;
}

// MIXED-TYPE HEADLINE: every word gets its own random size (wide spread, none tiny), tilt, height and indent.
// Always ALL CAPS. Audience / action words (your, money, learn, pick, topic, make...) use the marker font; the rest use Area.
// dry = true only measures (returns the height) without drawing.
// o = optional looseness settings { lead, rot, dy, gap } (see HEAD_OPT). Defaults keep the tight, heavily overlapped look used on other pages.
function mix(s, x, y, w, base, c, sd = 0, dry = false, o = {}) {
  if (o.clear) return mixClear(s, x, y, w, base, c, sd, dry, o);
  const lead = o.lead !== undefined ? o.lead : 0.95, rotk = o.rot !== undefined ? o.rot : 0.4,
    dyk = o.dy !== undefined ? o.dy : 0.24, gapk = o.gap !== undefined ? o.gap : 1;
  const lns = []; let cur = null;
  s.split(" ").filter(Boolean).forEach((w0, i) => {
    const aud = AUD.includes(w0.toLowerCase().replace(/[^a-z]/g, "")), wd = w0.toUpperCase();
    const fx = !aud && !!o.fixed;                       // fixed = Area Black words are NOT random (same size, straight, same baseline)
    const f = aud ? D : (fx || o.black) ? MONO : S;
    const aMin = o.aMin !== undefined ? o.aMin : 0.55, aMax = o.aMax !== undefined ? o.aMax : 1.8;   // default size range of the Area words (x base)
    const areaK = o.tiers ? o.tiers[floor(rnd(i + sd + 40) * o.tiers.length)] * (0.85 + rnd(i + sd + 70) * 0.3) : aMin + rnd(i + sd + 40) * (aMax - aMin);
    let sz = fx ? base * (o.fixSz || 0.9) : base * (aud ? 0.75 + rnd(i + sd) * 1.15 : areaK), ww = measure(wd, sz, f);
    if (ww > w) { sz *= (w / ww) * 0.96; ww = measure(wd, sz, f); }
    const gap = base * (0.02 + rnd(i + sd + 130) * 0.06) * gapk;
    if (!cur || cur.w + ww > w - cur.ind) { cur = { it: [], w: 0, m: 0, ind: lns.length ? rnd(lns.length + sd + 20) * w * 0.2 : 0 }; lns.push(cur); }
    cur.it.push({ wd, f, sz, x: cur.w, al: fx ? 1 : rnd(i + sd + 150), dy: fx ? 0 : (rnd(i + sd + 90) - 0.5) * sz * dyk, r: fx ? 0 : (rnd(i + sd + 110) - 0.5) * rotk });
    cur.w += ww + gap; cur.m = max(cur.m, sz);
  });
  let yy = 0;
  lns.forEach(l => {
    if (!dry) l.it.forEach(t => {
      push(); translate(x + l.ind + t.x, y + yy + (l.m - t.sz) * (0.1 + 0.8 * t.al) + t.dy); rotate(t.r);
      tx(t.wd, 0, 0, t.sz, t.f, 1e5, 0, c); pop();
    });
    yy += l.m * lead;
  });
  return yy + (lns.length ? lns[lns.length - 1].m * 0.08 : 0);
}

// finds the biggest headline size that still fits inside w x h (re-runs only on resize or new page)
const hfit = { k: "", b: 100 };
function fitMix(s, w, h, sd, o = {}) {
  const k = [width, height, seed, sd].join();
  if (hfit.k !== k) {
    let lo = 40, hi = 700;
    for (let i = 0; i < 12; i++) { const m = (lo + hi) / 2; if (mix(s, 0, 0, w, m, BLACK, sd, true, o) < h) lo = m; else hi = m; }
    hfit.k = k; hfit.b = lo;
  }
  return hfit.b;
}

// a single Stefan glyph (* & ! + # ?) used as decoration
function gl(x, y, sz, c, i = 0, rot = 1) {
  push(); translate(x, y); rotate(sin(millis() / 900 + i) * 0.25 * rot);
  textFont(D); textSize(sz); textAlign(CENTER, CENTER); noStroke(); fill(c);
  text(GLY[floor(rnd(i + 5) * GLY.length)], 0, 0); pop();
}

// dotted line (the ruled lines on a journal page)
function dline(x1, y1, x2, y2, c, wt = 2.5) {
  const ctx = drawingContext;
  stroke(c || accent()); strokeWeight(wt); strokeCap(ROUND);
  ctx.setLineDash([0.1, wt * 3]); line(x1, y1, x2, y2); ctx.setLineDash([]);
  noStroke();
}

function reg(x, y, w, h, fn, fixed) {
  hits.push({ x, y, w, h, fn, fixed });
  const my = fixed ? mouseY : mouseY + scroll;
  return mouseX >= x && mouseX <= x + w && my >= y && my <= y + h;
}
const rule = y => gline(M(), y, M() + W(), accent());
const sec = (label, y) => { rule(y); return y + 14 + tx(label, M(), y + 14, max(32, 38 * u()), S, W(), 0, BLACK) + 28; };

// big page title: the SAME stacked, all-caps treatment as the welcome headline on EVERY page (+ small caps caption)
function head(title, y, sub) {
  const c = shapeCol(), h = max(150, 300 * u());      // height budget for the title (lower = smaller titles)
  hcache[title] = hcache[title] || { k: "", L: null };
  y += stackHead(title.toUpperCase(), M(), y, W(), h, c, 1, HEAD_OPT, hcache[title]) + 20;
  return y + small(sub, y, min(W(), 620)) + 34;
}

// centred 3-column grid used by the welcome, areas AND topics pages
function grid(items, y) {
  const wide = width >= 700, cols = wide ? 3 : 1, cw = wide ? span(2) : W(), gw = cw - 16, nlh = 30;
  const lsz0 = max(26, 44 * u());
  NOIND = true;
  const fit = it => { const mw = max(it.l.toUpperCase().split(" ").map(wd => measure(wd, lsz0, S))); return mw > gw ? lsz0 * gw / mw * 0.97 : lsz0; };
  for (let r = 0; r < items.length; r += cols) {
    const rowItems = items.slice(r, r + cols);
    const dz = it => (it.q ? SZ_B : SZ_S), df = it => (it.q ? B : S);
    const rh = max(rowItems.map(it => nlh + (it.l ? txt(it.l.toUpperCase(), 0, 0, fit(it), S, gw, 0, 1) + 4 : 0) + txt(it.d, 0, 0, dz(it), df(it), gw, 0, 1) + 14));
    const o = wide ? colx(3 - rowItems.length) : M();
    rowItems.forEach((it, j) => {
      const x0 = o + (wide ? j * (cw + GUT()) : 0), cx = x0 + cw / 2, my = y + rh / 2;
      const hot = it.fn ? reg(x0, y - 6, cw, rh + 6, it.fn) : false;
      push();
      if (hot) { translate(cx, my); rotate(sin(millis() / 170) * 0.007); translate(-cx, -my - 3); fill(17, 17, 17, 10); noStroke(); rect(x0, y - 8, cw, rh + 8, 8); }
      CX = cx;
      TC = it.c ? color(it.c) : null;
      txt("( " + it.n + " )", cx, y, SZ_B, B, gw);
      let yy = y + nlh;
      if (it.l) yy += txt(it.l.toUpperCase(), cx, yy, fit(it), S, gw, hot) + 4;
      txt(it.d, cx, yy, dz(it), df(it), gw);
      TC = null; CX = null;
      pop();
    });
    y += rh + 40;
  }
  NOIND = false;
  return y;
}

// hand-drawn square outline with an Area label and a body (S = Area explanations, B = Stefan questions)
function card(y, label, body, fs, c, bodyCol, f = S) {
  const lh = SZ_S + 10, w = W() - 48, bh = txt(body, 0, 0, fs, f, w, 0, 1), h = 22 + lh + 8 + bh + 22;
  scribbleRect(M(), y, W(), h, c);
  tx(label, M() + 24, y + 22, SZ_S + 4, S, w, 0, c);
  tx(body, M() + 24, y + 22 + lh + 8, fs, f, w, 0, bodyCol || BLACK);
  return h;
}

// ACTIVITY BOX: every write / think / challenge area is one scribble box: label, prompt, then the writing area
function actBox(y, label, prompt, el, taH, c, tailH = 0, tail) {
  const w = W(), iw = w - 48, fz = SZ_B + 2, pd = 22, lh = SZ_S + 10;
  const ph = txt(prompt, 0, 0, fz, B, iw, 0, 1);
  const H = pd + lh + 8 + ph + 10 + 14 + taH + 12 + tailH + pd - 8;
  scribbleRect(M(), y, w, H, c);
  let yy = y + pd;
  tx(label, M() + 24, yy, SZ_S + 4, S, iw, 0, c); yy += lh + 8;
  tx(prompt, M() + 24, yy, fz, B, iw, 0, BLACK); yy += ph + 10;
  gline(M() + 24, yy + 4, M() + w - 24, c, 9); yy += 14;
  const ty = yy - scroll;
  if (el && ty > HH && ty + taH < height) showTA(el, M() + 24, ty, iw, taH, c);
  yy += taH + 12;
  if (tail) tail(yy);
  return H;
}

// "( TITLE )" text link used for every small control
function pill(l, x, y, fn, o = {}) {
  const t = "( " + l + " )", sz = psz(), w = tw(t, sz, MONO);
  const px = o.right ? x - w : x, hot = reg(px - 4, y, w + 8, 30, fn, o.fixed), c = o.col || accent();
  raw(t, px, y + 16 - sz * 0.55, sz, MONO, c);
  if (hot || o.on) { stroke(c); strokeWeight(o.on ? 2 : 1.5); line(px, y + 27, px + w, y + 27); noStroke(); }
  return w;
}
const fitSz = (l, w, sz) => { const mw = measure(l, sz, D); return mw > w ? sz * w / mw * 0.97 : sz; };
const bigBtn = (l, y, fn, col) => { const bz = fitSz(l, W(), 60 * u()), hot = reg(M(), y, W(), bz * 1.25, fn); return tx(l, M(), y, bz, D, W() + 40, hot, col) + 14; };
const lnk = (l, x, y, w, fn) => { const h = reg(x, y, w, 38, fn); return tx("( " + l + " )", x, y, SZ_S + 2, MONO, w, h, BLACK) + 14; };
// a row of "( links )" laid out on the three-column grid; an item can name its column (0 = left, 2 = right)
function lnkRow(items, y) {
  const cw = (W() - 2 * GUT()) / 3; let mh = 0;
  items.forEach(([l, fn, col], i) => { mh = max(mh, lnk(l, M() + (col === undefined ? i : col) * (cw + GUT()), y, cw, fn)); });
  return mh;
}

// hand-drawn outline: the scribble "boils" slightly like a real pen
function scribbleRect(x, y, w, h, c) {
  const t = floor(millis() / 160) * 0.35, per = 2 * (w + h);
  noFill(); stroke(c); strokeWeight(1.8); strokeJoin(ROUND);
  for (let i = 0; i < 3; i++) {
    beginShape();
    for (let s = 0; s <= per * 1.02; s += 16) {
      const d = s % per; let px, py;
      if (d < w) { px = x + d; py = y; }
      else if (d < w + h) { px = x + w; py = y + d - w; }
      else if (d < 2 * w + h) { px = x + w - (d - w - h); py = y + h; }
      else { px = x; py = y + h - (d - 2 * w - h); }
      vertex(px + (noise(s * 0.03, i * 7, t) - 0.5) * 8, py + (noise(s * 0.03 + 50, i * 7, t) - 0.5) * 8);
    }
    endShape();
  }
  noStroke();
}
// random Stefan glyphs (# ! * ? & +) drifting in the side margins of wide screens
function bgGlyphs() {
  const m = M(); if (m < 44 || screen === "journal") return;
  const t = millis() / 1000, c = color(shapeCol());
  for (let i = 0; i < 10; i++) {
    const left = i % 2 === 0, x = left ? m * 0.5 : width - m * 0.5, y0 = HH + 120 + i * 210 + rnd(10 + i) * 140;
    if (y0 > endY) continue;
    push(); translate(x + sin(t * 0.6 + i * 2) * 3, y0 + sin(t * 0.8 + i) * 5);
    gl(0, 0, constrain(m * 0.7, 24, 46), color(red(c), green(c), blue(c), 190), 30 + i);
    pop();
  }
}
function tick(x, y, w, done, l, fn, c) {
  const hot = reg(x, y, w, 56, fn), bs = 46;
  const cc = color(c);
  if (done) { noStroke(); fill(red(cc), green(cc), blue(cc), 60); rect(x, y + 2, bs, bs, 8); }
  noFill(); stroke(c); strokeWeight(hot ? 5 : 4); rect(x, y + 2, bs, bs, 8);
  if (done) { stroke(c); strokeWeight(8); line(x + 9, y + 26, x + 21, y + 38); line(x + 21, y + 38, x + 56, y - 4); }
  noStroke(); tx(l, x + bs + 18, y + 10, SZ_B + 8, B, w - bs - 30, hot, c);
}

// ------------------------------------------------------------
// SCREENS
// ------------------------------------------------------------
let headSeed = 0;                                       // the welcome headline has its own seed, so reshuffling it leaves the rest of the page alone
function reshuffle() { headSeed = 1 + floor(random(1000)); hfit.k = ""; hstack.k = ""; }
function drawWelcome() {
  let y = 60;
  // the headline is sized to fill the first screen (nearly the full window width and height)
  // HEAD_OPT (top of file) controls how much the words overlap: still overlapping, but easier to read
  const HEAD = "You don't have to have your whole life figured out.";
  const st = HEAD_OPT.stack, hw = width * (st ? HEAD_FILL.stackWide : HEAD_FILL.wide), hx = (width - hw) / 2,
    hh = st ? max(240, (height - 60 - 24) * HEAD_FILL.stackTall) : max(360, height * HEAD_FILL.tall - 20);   // stack: whole headline fits on screen (60px top margin, 24px bottom)
  const hy = y, hsd = 2 + headSeed * 997;
  const mh = HEAD_OPT.stack ? stackHead(HEAD, hx, y, hw, hh, BLACK, hsd, HEAD_OPT)
    : mix(HEAD, hx, y, hw, fitMix(HEAD, hw, hh, hsd, HEAD_OPT), BLACK, hsd, false, HEAD_OPT);
  reg(hx, hy, hw, mh, reshuffle);                      // click / tap the headline to reshuffle it
  y += mh + 10;
  y += 26;
  y += smallA("Leaving high school can come with a lot of questions.\n\nWork. Money. Housing. Relationships. Education. Wellbeing. Independence. And everything in between.", y) + 20;
  y += smallA("This is your junk journal. Pick a topic, learn what feels useful, skip what doesn't, then draw, stick and write your way through it.", y, min(W(), 560)) + 30;
  y += tx("No right answers. No perfect plan.", M() + W() * 0.12 * u(), y, 34 * u(), D, W()) + 10;
  const bz = 60 * u(), hot = reg(M(), y, W(), bz * 1.2, goHome);
  y += tx(Object.keys(store.pages).length ? "OPEN MY JOURNAL →" : "START COLLECTING →", M(), y, bz, D, W(), hot) + 60;
  y = sec("A VERY SIMPLE PLAN", y);
  y = grid([
    { n: "1", l: "Pick what's on your mind", d: "Money, work, housing, people, study, wellbeing. Choose what's taking up space.", c: BLACK },
    { n: "2", l: "Learn something useful", d: "Real definitions and the basics, without needing to know what to ask.", c: BLACK },
    { n: "3", l: "Make the page yours", d: "Draw, add photos, write notes. Every topic gets its own page.", c: BLACK }
  ], y);
  endY = y;
}

function drawHome() {
  let y = head("WHAT'S ON YOUR MIND?", 110, "Pick whatever is taking up a little space in your head. You can change your mind later.");
  y = grid(AREAS.map((a, i) => ({ n: String(i + 1), l: a[1], d: a[2], q: true, c: COL[a[0]], fn: () => { area = a[0]; goTo("topics"); } })), y);
  endY = y + 30;
}

function drawPages() {
  const pages = Object.values(store.pages).sort((a, b) => b.ts - a.ts), all = [];
  AREAS.forEach(a => Object.keys(L[a[0]]).forEach(t => all.push([a[0], t])));
  const done = all.filter(([a, t]) => (store.chal[a + "|" + t] || {}).done);
  let y = head("MY PAGES.", 110, pages.length + (pages.length === 1 ? " PAGE" : " PAGES") + " KEPT  ·  " + done.length + " OF " + all.length + " CHALLENGES TRIED");
  y = sec("KEPT PAGES", y);
  if (!pages.length) {
    y += tx("Nothing kept yet. Pick a topic, learn something, then make your first page.", M(), y, SZ_B + 8, B, W(), 0, BLACK) + 24;
    y += bigBtn("PICK A TOPIC →", y, goHome) + 20;
  }
  const cols = width >= 700 ? 3 : 2, gap = GUT(), tw_ = (W() - gap * (cols - 1)) / cols, k = tw_ / SURF_W, th = SURF_H * k, cap = 56;
  for (let r = 0; r < pages.length; r += cols) {
    pages.slice(r, r + cols).forEach((p, j) => {
      const x = M() + j * (tw_ + gap), c = COL[p.area], hot = reg(x, y, tw_, th + cap, () => openPage(p.area, p.topic, p.n));
      push(); if (hot) translate(0, -4);
      renderPage(p, x, y, k, k * 1.5);
      noFill(); stroke(c); strokeWeight(hot ? 3 : 2); rect(x, y, tw_, th, 6); noStroke();
      const h1 = tx(p.topic + "  ·  PAGE " + p.n, x, y + th + 8, SZ_S + 2, S, tw_, hot, hot ? c : BLACK);
      tx(lab(p.area).toUpperCase(), x, y + th + 8 + h1, SZ_S, S, tw_, 0, "rgba(17,17,17,0.5)");
      pop();
    });
    y += th + cap + 18;
  }
  y = sec("MINI CHALLENGES", y + 10);
  if (!done.length) y += tx("None yet. Every topic ends with a mini challenge just for you. Tick one off and it shows up here with your notes.", M(), y, SZ_B + 6, B, W(), 0, BLACK) + 20;
  done.forEach(([a, t], idx) => {
    const ch = store.chal[a + "|" + t], c = COL[a], sz = SZ_S + 4, nt = (ch.note || "").trim().slice(0, 110), nz = SZ_S + 1;
    const head1 = "( " + (idx + 1) + " )  " + t + "  ·  " + lab(a);
    const h1 = txt(head1, 0, 0, sz, S, W() - 20, 0, 1), h2 = nt ? txt(nt, 0, 0, nz, S, W() - 20, 0, 1) + 6 : 0;
    const hot = reg(M(), y, W(), h1 + h2 + 14, () => { area = a; topic = t; goTo("learn"); });
    tx(head1, M(), y + 4, sz, S, W() - 20, hot, hot ? c : BLACK);
    if (nt) tx(nt, M(), y + 4 + h1 + 6, nz, S, W() - 20, 0, "rgba(17,17,17,0.7)");
    y += h1 + h2 + 22; rule(y - 8);
  });
  endY = y + 70;
}

function drawKept() {
  const c = COL[area], n = pagesOf(area, topic).length, w = W();
  let y = head("PAGE KEPT.", 110, topic + "  ·  " + lab(area) + "  ·  PAGE " + pn);
  const tw_ = min(w, 460), k = tw_ / SURF_W, sideBySide = width >= 900;
  renderPage(page, M(), y, k, k * 1.5);
  noFill(); stroke(c); strokeWeight(2); rect(M(), y, tw_, SURF_H * k, 6); noStroke();
  const sx = sideBySide ? M() + tw_ + 36 : M(), sw = sideBySide ? w - tw_ - 36 : w;
  let yy = sideBySide ? y : y + SURF_H * k + 28;
  yy += tx("You've made " + n + (n === 1 ? " page" : " pages") + " for this topic.", sx, yy, max(24, 34 * u()), B, sw, 0, BLACK) + 8;
  yy += tx("EVERY TOPIC CAN HAVE AS MANY PAGES AS YOU LIKE. DIFFERENT DAYS, DIFFERENT THOUGHTS.", sx, yy, SZ_B, B, sw, 0, BLACK) + 26;
  const btns = ["MAKE ANOTHER PAGE →", "SEE MY PAGES →", "ANOTHER TOPIC →"], bz = min(...btns.map(b => fitSz(b, sw, max(32, 46 * u())))), hot = reg(sx, yy, sw, bz * 1.25, newPage);
  yy += tx(btns[0], sx, yy, bz, D, sw + 40, hot, c) + 14;
  const hot2 = reg(sx, yy, sw, bz * 1.25, () => goSection("pages"));
  yy += tx(btns[1], sx, yy, bz, D, sw + 40, hot2, c) + 14;
  const hot3 = reg(sx, yy, sw, bz * 1.25, () => goTo("topics"));
  yy += tx(btns[2], sx, yy, bz, D, sw + 40, hot3, c) + 14;
  let y2 = max(yy, y + SURF_H * k) + 30;
  endY = y2 + 60;
}

function drawTopics() {
  const c = COL[area], keys = Object.keys(L[area]);
  let y = head("PICK A TOPIC.", 110, lab(area) + "  ·  pick something you want to understand. These aren't questions, they're little doors.");
  y = grid(keys.map((t, i) => ({ n: String(i + 1), l: t, d: L[area][t].d, q: true, c, fn: () => openTopic(t) })), y);
  endY = y + 20;
}

// same title / caption treatment as every other page; information first, the things to DO at the bottom
function drawLearn() {
  const c = COL[area], I = L[area][topic], w = W();
  const keys = Object.keys(L[area]), nx = keys[(keys.indexOf(topic) + 1) % keys.length];
  const row = [["BACK TO TOPICS", goBack, 0]];
  if (keys.length > 1) row.push(["NEXT: " + nx + " →", () => { commit(); topic = nx; scroll = 0; t0 = millis(); }, 2]);
  const topH = lnkRow(row, 78);
  let y = head(topic, 78 + topH + 14, I.d + " " + I.i);

  // --- INFORMATION: same centred ( 1 ) / big label / Stefan text treatment as the "what's on your mind" page ---
  y = sec("WORDS WORTH KNOWING", y);
  y = grid(I.t.map(([term, def], i) => ({ n: String(i + 1), l: term, d: def, q: true, c })), y);

  y = sec("THINGS WORTH KNOWING", y);
  y = grid(I.k.map((p, i) => ({ n: String(i + 1), l: "", d: p, q: true, c })), y);
  y += card(y, "PEOPLE DON'T ALWAYS TELL YOU", I.r, SZ_B + 4, c, c, B) + 30;

  // --- ACTIVITIES (bottom): each one is a scribble box with its own writing area ---
  y = sec("NOW IT'S YOUR TURN", y);
  y += actBox(y, "THINK FIRST  ·  10 SECONDS", "What do you already know about " + topic.toLowerCase() + "? Jot down a few words.", tb, 64, c) + 26;
  y += actBox(y, "TAKE A MINUTE", "Which part of this was new to you? And what would you like to find out more about?", tc, 80, c) + 26;
  const cs = store.chal[area + "|" + topic] || { done: false };
  y += actBox(y, "YOUR MINI CHALLENGE  ·  JUST FOR YOU  ·  ABOUT 5 MINUTES", I.s, ta, 100, c, 64, yy =>
    tick(M() + 24, yy, w - 48, cs.done, cs.done ? "I TRIED IT!" : "TICK WHEN YOU'VE TRIED IT", () => {
      const q = chalOf(); q.done = !q.done; persist(); flash(q.done ? "NICE ONE. CHALLENGE TRIED" : "UNTICKED");
    }, c)) + 34;

  y += bigBtn("START MY PAGE →", y, () => openPage(area, topic));
  endY = y + 30;
}

function drawJournal() {
  const c = COL[area], kind = ACT()[0], w = W(), k = w / SURF_W;
  const has = () => page.strokes.length || page.photos.length || page.note.trim();
  const topH = lnkRow([
    ["ANOTHER PAGE", () => { if (!has()) { flash("THIS PAGE IS STILL BLANK"); return; } queueSave(); commit(); newPage(); }],
    ["BACK TO LEARNING", goBack],
    ["ANOTHER TOPIC", () => goTo("topics")]
  ], 78);
  let y = head("MAKE IT YOUR PAGE.", 78 + topH + 14, topic + "  ·  " + lab(area) + "  ·  PAGE " + pn);
  y += card(y, "YOUR JUNK JOURNAL ACTIVITY  ·  " + KINDS[kind], ACT().slice(2), SZ_B + 3, c, null, B) + 26;

  // toolbar: three columns
  const cw3 = (w - 2 * GUT()) / 3, py0 = y; let ti = 0;
  const P = (l, fn, o = {}) => { pill(l, M() + (ti % 3) * (cw3 + GUT()), py0 + floor(ti / 3) * 34, fn, o); ti++; };
  P("PEN", () => (mode = "pen"), { on: mode === "pen" });
  P("ERASER", () => (mode = "erase"), { on: mode === "erase" });
  P("MOVE PHOTOS", () => (mode = "move"), { on: mode === "move" });
  P("ADD PHOTOS", () => fileIn.elt.click());
  P("UNDO", () => { page.strokes.pop(); queueSave(); });
  P(armed("clear") ? "SURE?" : "CLEAR", () => confirmThen("clear", () => { page.strokes = []; page.photos = []; selPhoto = -1; queueSave(); }));
  y = py0 + ceil(ti / 3) * 34 + 10;

  INKS.forEach((ic, i) => {
    const sx = M() + 14 + i * 32;
    reg(sx - 14, y, 28, 28, () => { ink = ic; mode = "pen"; });
    noStroke(); fill(ic); circle(sx, y + 14, 20);
    if (ink === ic && mode === "pen") { noFill(); stroke(accent()); strokeWeight(2); circle(sx, y + 14, 27); noStroke(); }
  });
  SIZES.forEach((sz, i) => {
    const sx = M() + 14 + INKS.length * 32 + 20 + i * 30;
    reg(sx - 14, y, 28, 28, () => { pw = sz; mode = "pen"; });
    noFill(); stroke(accent()); strokeWeight(1); if (pw === sz) fill(accent()); circle(sx, y + 14, 5 + sz); noStroke();
  });
  y += 38;
  y += tx(mode === "move" ? "DRAG A PHOTO TO MOVE IT. CORNER DOT RESIZES. × REMOVES IT." : mode === "erase" ? "RUB OVER A LINE TO ERASE IT." : "DRAW WITH YOUR MOUSE OR FINGER. IT SAVES AS YOU GO.", M(), y, SZ_S, S, w, 0, BLACK) + 14;

  const sh = SURF_H * k;
  surf = { x: M(), y, w, h: sh, k };
  renderPage(page, surf.x, y, k, 1);
  scribbleRect(surf.x, y, w, sh, c);
  if (!page.strokes.length && !page.photos.length)
    tx(kind === "P" ? "ADD PHOTOS, THEN DOODLE ON THEM." : "DRAW HERE. OR ADD PHOTOS.", surf.x + 24, y + 24, SZ_B + 8, B, w - 48, 0, "rgba(17,17,17,0.35)");
  if (mode === "move" && selPhoto >= 0 && page.photos[selPhoto]) {
    const r = photoRect(page.photos[selPhoto]);
    noFill(); stroke(c); strokeWeight(2); rect(r.x - 7, r.y - 7, r.w + 14, r.h + 30);
    noStroke(); fill(ORANGE); circle(r.x + r.w + 7, r.y - 7, 24);
    fill(255); textFont(MONO); textSize(15); textAlign(CENTER, CENTER); text("×", r.x + r.w + 7, r.y - 8);
    fill(c); circle(r.x + r.w + 7, r.y + r.h + 23, 20);
  }
  if (inSurf()) {
    cursor(mode === "move" ? MOVE : CROSS);
    if (mode === "erase") { noFill(); stroke(accent()); strokeWeight(1); circle(mouseX, mouseY + scroll, 44 * k); noStroke(); }
  }
  y += sh + 30;

  y += actBox(y, "WRITE / RAMBLE", "In your own words: what's one thing about " + topic.toLowerCase() + " you now know, and one thing you still want to ask someone?", ta, 120, c) + 30;
  rule(y); y += 34;

  y += bigBtn("ADD TO MY JOURNAL →", y, () => { if (!has()) { flash("ADD SOMETHING FIRST"); return; } queueSave(); commit(); goTo("kept"); });
  endY = y + 30;
}

// ------------------------------------------------------------
// PHOTOS + DRAWING
// ------------------------------------------------------------
const prect = (p, x, y, k) => ({ x: x + p.x * k, y: y + p.y * k, w: p.w * k, h: p.w * p.a * k });
const photoRect = p => prect(p, surf.x, surf.y, surf.k);
// draws a whole journal page (paper, dotted ruled lines, photos, then pen strokes) at scale k; f scales the photo frames
function renderPage(pg, x, y, k, f = 1) {
  const w = SURF_W * k, sh = SURF_H * k;
  noStroke();
  for (let ly = 34 * k; ly < sh; ly += 34 * k) dline(x + 10 * k, y + ly, x + w - 10 * k, y + ly, color(17, 17, 17, 70), max(1, 2 * k));
  const ctx = drawingContext; ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, sh); ctx.clip();
  pg.photos.forEach(p => {
    if (!p.img) p.img = loadImage(p.src);
    const r = prect(p, x, y, k);
    noStroke(); fill(17, 17, 17, 25); rect(r.x - 3, r.y - 2, r.w + 14 * f, r.h + 30 * f);
    fill(255); rect(r.x - 7 * f, r.y - 7 * f, r.w + 14 * f, r.h + 30 * f);
    if (p.img.width > 1) image(p.img, r.x, r.y, r.w, r.h);
  });
  noFill(); strokeCap(ROUND); strokeJoin(ROUND);
  pg.strokes.forEach(s => {
    stroke(s.c); strokeWeight(max(1, s.w * k));
    if (s.p.length === 1) point(x + s.p[0][0] * k, y + s.p[0][1] * k);
    else { beginShape(); s.p.forEach(q => vertex(x + q[0] * k, y + q[1] * k)); endShape(); }
  });
  ctx.restore(); noStroke();
}
const inSurf = () => surf && screen === "journal" && mouseY > HH && mouseY < height - FH && mouseX >= surf.x && mouseX <= surf.x + surf.w && mouseY + scroll >= surf.y && mouseY + scroll <= surf.y + surf.h;
const clampPhoto = p => { p.x = constrain(p.x, 0, max(0, SURF_W - p.w)); p.y = constrain(p.y, 0, max(0, SURF_H - p.w * p.a)); };

function onFile(f) {
  if (screen !== "journal" || !page || !f || !String(f.type).startsWith("image")) return;
  loadImage(f.data, img => {
    if (img.width > 600) img.resize(600, 0);
    const n = page.photos.length, a = img.height / img.width, w = min(270, 360 / a);
    const p = { src: img.canvas.toDataURL("image/jpeg", 0.8), img, w, a, x: 40 + (n * 45) % 300, y: 40 + (n * 45) % 240 };
    clampPhoto(p); page.photos.push(p); selPhoto = page.photos.length - 1; mode = "move"; queueSave();
  });
}
function eraseAt(x, y) { page.strokes = page.strokes.filter(s => !s.p.some(q => dist(q[0], q[1], x, y) < 22)); }

function moveDrag() {
  if (!drag || !page || !surf) return;
  const x = (mouseX - surf.x) / surf.k, y = (mouseY + scroll - surf.y) / surf.k;
  if (drag === "draw") { const l = curStroke.p[curStroke.p.length - 1]; if (dist(l[0], l[1], x, y) > 2) curStroke.p.push([round(x), round(y)]); }
  else if (drag === "erase") eraseAt(x, y);
  else {
    const p = page.photos[selPhoto]; if (!p) return;
    if (drag === "move") { p.x = x - off[0]; p.y = y - off[1]; clampPhoto(p); }
    else { p.w = constrain(x - p.x, 50, SURF_W - p.x); if (p.y + p.w * p.a > SURF_H) p.w = (SURF_H - p.y) / p.a; }
  }
}

// ------------------------------------------------------------
// CHROME (header): everything sits in the left column
// ------------------------------------------------------------
function chrome() {
  const wide = width >= 760, py = (HH - 30) / 2, g = width < 500 ? 10 : 18;
  if (screen !== "welcome") {
  noStroke(); fill(221, 215, 196, 248); rect(0, 0, width, HH);
  gline(0, HH, width, color(17, 17, 17, 150), 10);
  if (inner()) {
    let x = M();
    [["BACK", back], ["HOME", goHome]].forEach(([l, fn]) => { x += pill(l, x, py, fn, { fixed: true }) + g; });
  }
  let rx = width - M();
  [[armed("reset") ? (wide ? "SURE? TAP AGAIN" : "SURE?") : wide ? "START AGAIN" : "RESET", resetAll, false],
   [wide ? "MY PAGES" : "PAGES", () => goSection("pages"), screen === "pages"]
  ].forEach(([l, fn, on]) => { rx -= pill(l, rx, py, fn, { right: true, fixed: true, on }) + g; });
  }
  if (millis() - fT < 2500) {
    if (fBig) {                                      // big message in the middle of the screen
      const t = fMsg.toUpperCase(); let sz = 40, w0 = tw(t, sz, B);
      if (w0 > width - 140) { sz *= (width - 140) / w0; w0 = tw(t, sz, B); }
      const bw = w0 + 70, bh = sz + 64, e = 1 - pow(1 - constrain((millis() - fT) / 220, 0, 1), 3);
      push(); translate(width / 2, height / 2); scale(0.8 + 0.2 * e);
      noStroke(); fill(221, 215, 196, 252); rect(-bw / 2, -bh / 2, bw, bh, 12);
      scribbleRect(-bw / 2, -bh / 2, bw, bh, accent());
      raw(t, -w0 / 2, -sz * 0.55, sz, B, accent());
      pop();
    } else {                                         // quiet autosave note under the header
      const t = "( " + fMsg + " )", sz = SZ_S + 1, w = tw(t, sz, MONO) + 16;
      noStroke(); fill(221, 215, 196, 235); rect(M(), HH + 8, w, 22);
      raw(t, M() + 8, HH + 12, sz, MONO, accent());
    }
  }
}

// ------------------------------------------------------------
// MAIN LOOP + INPUT
// ------------------------------------------------------------
// keeps the three textareas in sync with whichever screen is showing
function taSync() {
  let k = "", v = "", ph = "Write, ramble, remember something…", k2 = "", v2 = "", k3 = "", v3 = "";
  if (screen === "journal" && page) { k = "j" + area + topic + pn; v = page.note; }
  else if (screen === "learn") {
    const q = store.chal[area + "|" + topic] || {};
    k = "c" + area + topic; v = q.note || ""; ph = "How did it go? What did you notice about yourself?";
    k2 = "t" + area + topic; v2 = q.think || "";
    k3 = "m" + area + topic; v3 = q.minute || "";
  }
  if (k !== taKey) { taKey = k; ta.value(v); ta.attribute("placeholder", ph); }
  if (k2 !== tbKey) { tbKey = k2; tb.value(v2); }
  if (k3 !== tcKey) { tcKey = k3; tc.value(v3); }
}

function draw() {
  paper ? image(paper, 0, 0) : background(PAPER);
  const sig = screen + area + topic; if (sig !== lastSig) { lastSig = sig; seed = floor(random(1e6)); }
  hits = []; ci = 0; ta.hide(); tb.hide(); tc.hide(); cursor(ARROW); taSync();
  if (dirty && millis() - dirtyT > 700) commit();
  scroll = constrain(scroll, 0, max(0, endY - height + HH + FH + 20));
  push(); translate(0, -scroll);
  ({ welcome: drawWelcome, home: drawHome, pages: drawPages, kept: drawKept, topics: drawTopics, learn: drawLearn, journal: drawJournal })[screen]();
  pop();
  chrome();
}

function mousePressed() {
  pressY = mouseY; drag = null;
  if (screen !== "journal" || !page || !surf || mouseY < HH || mouseY > height - FH) return;
  const x = (mouseX - surf.x) / surf.k, y = (mouseY + scroll - surf.y) / surf.k, mx = mouseX, my = mouseY + scroll;
  if (mode === "move") {
    if (selPhoto >= 0 && page.photos[selPhoto]) {
      const r = photoRect(page.photos[selPhoto]);
      if (dist(mx, my, r.x + r.w + 7, r.y - 7) < 14) { page.photos.splice(selPhoto, 1); selPhoto = -1; queueSave(); return false; }
      if (dist(mx, my, r.x + r.w + 7, r.y + r.h + 23) < 14) { drag = "resize"; return false; }
    }
    for (let i = page.photos.length - 1; i >= 0; i--) {
      const r = photoRect(page.photos[i]);
      if (mx >= r.x - 7 && mx <= r.x + r.w + 7 && my >= r.y - 7 && my <= r.y + r.h + 23) {
        const p = page.photos.splice(i, 1)[0]; page.photos.push(p);        // bring to front
        selPhoto = page.photos.length - 1; off = [x - p.x, y - p.y]; drag = "move"; return false;
      }
    }
    if (inSurf()) selPhoto = -1;
  } else if (inSurf()) {
    if (mode === "pen") { curStroke = { c: ink, w: pw, p: [[round(x), round(y)]] }; page.strokes.push(curStroke); drag = "draw"; }
    else { drag = "erase"; eraseAt(x, y); }
    return false;
  }
}
function mouseDragged() { if (drag) { moveDrag(); return false; } }
function touchMoved() { if (drag) { moveDrag(); return false; } scroll -= mouseY - pmouseY; return false; }
function mouseReleased() {
  if (drag) { drag = null; curStroke = null; queueSave(); return false; }
  if (abs(mouseY - pressY) > 10) return;
  for (let i = hits.length - 1; i >= 0; i--) {
    const h = hits[i], my = h.fixed ? mouseY : mouseY + scroll;
    if (mouseX >= h.x && mouseX <= h.x + h.w && my >= h.y && my <= h.y + h.h) { h.fn(); return; }
  }
}
function mouseWheel(e) { if (!drag) scroll += e.delta; return false; }
function keyPressed() {
  const ae = document.activeElement;
  if (ae === ta.elt || ae === tb.elt || ae === tc.elt) return;
  if (keyCode === ESCAPE && inner()) back();
}
