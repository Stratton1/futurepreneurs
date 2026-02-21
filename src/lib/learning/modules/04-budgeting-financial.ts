import type { LearningModule } from '@/types/learning';

export const budgetingFinancial: LearningModule = {
  id: 'budgeting-financial',
  title: 'Budgeting & Financial Literacy',
  description: 'Master the art of budgeting, setting micro-goals, and planning stretch rewards — real skills you\'ll use for life.',
  icon: 'PiggyBank',
  colour: 'emerald',
  sectionNumber: 4,
  lessons: [
    {
      id: 'materials-not-cash-budget',
      title: 'Building a "Materials, Not Cash" Budget',
      readingTime: 4,
      content: `## Building a "Materials, Not Cash" Budget

On Futurepreneurs, you don't raise cash to put in your pocket — you raise money for **specific materials, supplies, and services** your business needs. This is what makes crowdfunding safe and trustworthy.

### Why "materials, not cash"?

When supporters support your project, they want to know exactly what their money buys. A budget that lists specific items builds trust:

**Vague (bad):** "I need £200 for my business"
**Specific (good):** "I need £200 to buy: 5kg flour (£15), baking trays (£25), 100 cake boxes (£40), food-safe labels (£20), a folding table (£45), market stall fee 4 weeks (£40), flyers (£15)"

### How to build your materials budget

Follow these steps:

1. **List every item** you need to get started
2. **Research real prices** — check actual shops and websites
3. **Include links** — paste the URL where you found the price
4. **Note quantities** — how many of each thing do you need?
5. **Factor in shipping** — delivery costs add up!
6. **Don't forget tax** — UK prices usually include VAT, but check

### Example budget breakdown

| Item | Quantity | Unit Price | Total | Where |
|------|----------|------------|-------|-------|
| Self-raising flour 1.5kg | 4 | £1.15 | £4.60 | Tesco |
| Caster sugar 1kg | 3 | £0.89 | £2.67 | Tesco |
| Free-range eggs (15 pack) | 2 | £2.85 | £5.70 | Tesco |
| Cake boxes (pack of 50) | 2 | £8.99 | £17.98 | Amazon |
| Custom sticker labels (100) | 1 | £12.99 | £12.99 | Vistaprint |
| Folding table | 1 | £34.99 | £34.99 | Argos |
| School market fee (per week) | 4 | £5.00 | £20.00 | School |
| A5 colour flyers (50) | 1 | £11.99 | £11.99 | Vistaprint |
| **Total** | | | **£110.92** | |
| **Buffer (15%)** | | | **£16.64** | |
| **Funding Goal** | | | **£128** | |

### The 15% buffer rule

Things often cost more than expected — prices change, delivery fees surprise you, or you need a bit more than planned. Adding a 15% buffer protects you.

### Turning your budget into milestones

Group your items into logical milestones:

- **Milestone 1: Ingredients** — £13 (flour, sugar, eggs)
- **Milestone 2: Packaging** — £31 (boxes, labels)
- **Milestone 3: Equipment** — £35 (folding table)
- **Milestone 4: Marketing & Stall** — £32 (flyers, market fees)
- **Milestone 5: Buffer** — £17 (unexpected costs)

### Top tip

Screenshot the prices you find online and include them in your project description. This shows supporters you've done real research — not just guessed!`,
      quiz: [
        {
          question: 'Why does Futurepreneurs use a "materials, not cash" approach?',
          options: [
            { text: 'Because cash is illegal for minors', isCorrect: false },
            { text: 'Because specific item budgets build trust and show supporters exactly where money goes', isCorrect: true },
            { text: 'Because it\'s easier than budgeting', isCorrect: false },
            { text: 'Because you can\'t buy materials online', isCorrect: false },
          ],
          explanation: 'Listing specific materials shows supporters you\'ve done your research and planned carefully. It builds trust — the most important thing when asking people to support your project.',
        },
        {
          question: 'What should you include when listing an item in your budget?',
          options: [
            { text: 'Just the total cost', isCorrect: false },
            { text: 'Item name, quantity, unit price, total, and where you found it', isCorrect: true },
            { text: 'The brand name and a photo', isCorrect: false },
            { text: 'Only the cheapest option available', isCorrect: false },
          ],
          explanation: 'A detailed budget entry includes what you\'re buying, how many, the price per item, the total, and where you found it. Links to the actual products are even better!',
        },
        {
          question: 'Why should you add a 15% buffer to your budget?',
          options: [
            { text: 'So you have extra money to spend on fun things', isCorrect: false },
            { text: 'Because things often cost more than expected and prices can change', isCorrect: true },
            { text: 'Because Futurepreneurs requires exactly 15%', isCorrect: false },
            { text: 'To make your funding goal look bigger', isCorrect: false },
          ],
          explanation: 'Prices change, delivery fees pop up, and you might need slightly more materials than planned. A 15% buffer protects you from these surprises without over-asking.',
        },
        {
          question: 'What is the best way to research prices for your budget?',
          options: [
            { text: 'Guess based on what feels right', isCorrect: false },
            { text: 'Ask a friend what they think it costs', isCorrect: false },
            { text: 'Check real prices on actual websites and shops, and save screenshots', isCorrect: true },
            { text: 'Use last year\'s prices from a textbook', isCorrect: false },
          ],
          explanation: 'Real price research means checking current prices on actual websites (Tesco, Amazon, Argos etc.) and saving screenshots or links. This proves to supporters that your budget is based on reality.',
        },
        {
          question: 'How should you organise your items into milestones?',
          options: [
            { text: 'Put everything into one big milestone', isCorrect: false },
            { text: 'Group related items logically (e.g. all ingredients together, all packaging together)', isCorrect: true },
            { text: 'Create a separate milestone for every single item', isCorrect: false },
            { text: 'Order them from cheapest to most expensive', isCorrect: false },
          ],
          explanation: 'Group related items into 3-6 logical milestones. For example: ingredients, packaging, equipment, marketing. This makes your budget easy to understand and manage.',
        },
      ],
      tasks: [
        {
          id: 'item-list',
          title: 'Create Your Materials List',
          description: 'List every item your business needs to get started. For each item, find the real price online and note the website. Include quantity and delivery cost.',
          type: 'exercise',
        },
        {
          id: 'price-research',
          title: 'Compare Prices',
          description: 'For your 3 most expensive items, compare prices from at least 2 different shops or websites. Which offers the best value?',
          type: 'research',
        },
      ],
    },
    {
      id: 'scaffolded-micro-goals',
      title: 'Setting Scaffolded Micro-Goals',
      readingTime: 4,
      content: `## Setting Scaffolded Micro-Goals

Big goals can feel overwhelming. The secret? Break them into tiny, achievable steps called **micro-goals**. Each small win builds momentum and keeps you motivated.

### What are micro-goals?

Micro-goals are small, specific targets that lead towards your bigger goal. Instead of "raise £200," you might set:

1. Get your project approved by your teacher ✓
2. Share with 5 family members ✓
3. Reach £20 (first 10%) ✓
4. Get 5 supporters ✓
5. Reach £50 (25%) ✓
6. Share on social media ✓
7. Reach £100 (halfway!) ✓
8. Post your first project update ✓
9. Reach £150 (75%) ✓
10. Hit your £200 goal! 🎉

### Why micro-goals work

- **Dopamine hits** — Each small achievement gives you a burst of motivation
- **Visible progress** — You can see yourself moving forward
- **Less overwhelming** — "Get 5 supporters" feels doable; "raise £200" feels huge
- **Course correction** — If you're stuck on step 4, you know exactly where to focus

### SMART goals

Make each micro-goal SMART:

- **S**pecific — "Get 5 family members to back my project" not "Get some supporters"
- **M**easurable — You can count it (5 supporters, £50, 3 shares)
- **A**chievable — Realistic for this week
- **R**elevant — Directly connected to your project's success
- **T**ime-bound — "By Friday" not "eventually"

### Short, medium, and long-term goals

| Timeframe | Example Goals |
|-----------|---------------|
| This week | Share project with family, get first 3 supporters |
| This month | Reach 50% funding, post 2 updates |
| This term | Fully funded, first milestone complete, first sales |
| This year | Profitable business, second campaign, mentor others |

### The Futurepreneurs milestone system

On Futurepreneurs, your milestones are built-in micro-goals! Each milestone represents a stage of your project. When you complete one, you unlock the next. This scaffolded approach means you're always working towards something specific.

### Celebrating small wins

Don't wait until your project is fully funded to celebrate. Acknowledge every achievement:

- First supporter? Amazing — someone believes in you!
- 25% funded? Quarter of the way there!
- First drawdown approved? You're actually building your business!

### Top tip

Write your micro-goals on sticky notes and put them on your wall. Cross each one off as you achieve it. Seeing your progress visually is incredibly motivating!`,
      quiz: [
        {
          question: 'What are micro-goals?',
          options: [
            { text: 'Very small businesses that don\'t need much money', isCorrect: false },
            { text: 'Small, specific targets that lead towards your bigger goal', isCorrect: true },
            { text: 'Goals that you set for other people', isCorrect: false },
            { text: 'Goals that don\'t really matter', isCorrect: false },
          ],
          explanation: 'Micro-goals are small, achievable steps that break down a big goal into manageable pieces. Each small win builds momentum and keeps you motivated.',
        },
        {
          question: 'What does SMART stand for in goal-setting?',
          options: [
            { text: 'Simple, Manageable, Attractive, Realistic, Trackable', isCorrect: false },
            { text: 'Specific, Measurable, Achievable, Relevant, Time-bound', isCorrect: true },
            { text: 'Strategic, Motivated, Active, Responsible, Thoughtful', isCorrect: false },
            { text: 'Small, Medium, Average, Regular, Tiny', isCorrect: false },
          ],
          explanation: 'SMART stands for Specific, Measurable, Achievable, Relevant, and Time-bound. Making goals SMART helps ensure they\'re clear and you can track your progress.',
        },
        {
          question: 'Why do micro-goals help with motivation?',
          options: [
            { text: 'They make you feel like you have less work to do', isCorrect: false },
            { text: 'Each small achievement gives a burst of motivation and shows visible progress', isCorrect: true },
            { text: 'They impress your teacher', isCorrect: false },
            { text: 'They make your project look more complex', isCorrect: false },
          ],
          explanation: 'Each time you complete a micro-goal, your brain releases dopamine — the "feel-good" chemical. This creates a positive cycle of achievement and motivation.',
        },
        {
          question: 'Which of these is a well-formed SMART goal?',
          options: [
            { text: 'Get lots of supporters soon', isCorrect: false },
            { text: 'Be successful with my project', isCorrect: false },
            { text: 'Get 5 family members to back my project by Friday at £10 each', isCorrect: true },
            { text: 'Raise as much money as possible', isCorrect: false },
          ],
          explanation: 'This goal is Specific (5 family members, £10 each), Measurable (you can count), Achievable (realistic), Relevant (directly helps funding), and Time-bound (by Friday).',
        },
        {
          question: 'What should you do when you achieve a micro-goal?',
          options: [
            { text: 'Ignore it and focus on the next one immediately', isCorrect: false },
            { text: 'Celebrate it and use the momentum to tackle the next goal', isCorrect: true },
            { text: 'Take a long break', isCorrect: false },
            { text: 'Set a harder goal to punish yourself', isCorrect: false },
          ],
          explanation: 'Celebrating small wins keeps you motivated! Acknowledge your achievement, then use that positive energy to tackle the next micro-goal.',
        },
      ],
      tasks: [
        {
          id: 'micro-goals-list',
          title: 'Create 10 Micro-Goals',
          description: 'Write 10 small, specific steps that will take you from project creation to fully funded. Make sure each one is SMART.',
          type: 'exercise',
        },
        {
          id: 'smart-goal-reflection',
          title: 'SMART Goal Check',
          description: 'Take your main funding goal and check it against each SMART criteria. Is it Specific? Measurable? Achievable? Relevant? Time-bound? Adjust it if needed.',
          type: 'reflection',
        },
      ],
    },
    {
      id: 'stretch-goals-safe-rewards',
      title: 'Stretch Goals & Safe Rewards',
      readingTime: 4,
      content: `## Stretch Goals & Safe Rewards

What happens if your project raises MORE than your goal? That's a stretch goal! And how do you thank your supporters? With rewards — but they need to be safe and deliverable.

### What are stretch goals?

A stretch goal is an extra target above your original funding goal. For example:

- **Original goal:** £200 for a student bakery
- **Stretch goal 1 (£250):** Add a second flavour range
- **Stretch goal 2 (£300):** Create branded packaging with custom stickers
- **Stretch goal 3 (£400):** Set up a weekly stall at the local farmers' market

Stretch goals give supporters a reason to keep sharing even after you've hit your target!

### Planning safe rewards

Rewards are how you thank supporters. On Futurepreneurs, rewards must be:

- **Safe** — No personal information exchanged
- **Deliverable** — You can actually provide them
- **Age-appropriate** — Suitable for both you and your supporters
- **Budget-friendly** — Don't spend all your funding on rewards!

### Great reward ideas for young entrepreneurs

| Reward Tier | Cost to You | Example |
|-------------|-------------|---------|
| Free | £0 | Digital thank-you card, name on project update |
| Low (£5-10 supporters) | £0-1 | Personalised digital artwork, behind-the-scenes video |
| Medium (£15-25 supporters) | £2-5 | Small sample of your product, custom sticker pack |
| High (£50+ supporters) | £5-15 | Full product, branded merchandise, VIP early access |

### Rewards to AVOID

- **Anything requiring home addresses** — Safety concern
- **Expensive items** that eat into your budget
- **Promises you can't keep** — Be realistic about delivery
- **Physical items requiring shipping** — Complex and costly for young entrepreneurs
- **Food to strangers** — Allergy and safety concerns with unknown recipients

### The "digital-first" approach

The safest rewards are digital:
- **Thank-you video** — Record a personal thank-you
- **Project diary** — Share your weekly journey
- **Name on the wall** — List supporter display names in a project update
- **Early access** — Let top supporters see updates first
- **Custom digital art** — Create something unique using tools like Canva

### Budget your rewards

Never spend more than 10-15% of your funding on rewards. If you raise £200, spend no more than £20-30 on all rewards combined.

### Top tip

The best reward is actually keeping supporters updated! People who support young entrepreneurs mostly want to see you succeed. Regular updates showing your progress are more valuable than any physical reward.`,
      quiz: [
        {
          question: 'What is a stretch goal?',
          options: [
            { text: 'A goal that requires physical exercise', isCorrect: false },
            { text: 'An extra funding target above your original goal', isCorrect: true },
            { text: 'A goal that is impossible to achieve', isCorrect: false },
            { text: 'A goal set by your teacher', isCorrect: false },
          ],
          explanation: 'A stretch goal is an additional target beyond your original funding goal. For example, if your goal is £200, a stretch goal at £300 might unlock a new product line or feature.',
        },
        {
          question: 'Which of these is the SAFEST type of supporter reward?',
          options: [
            { text: 'Posting products to supporters\' home addresses', isCorrect: false },
            { text: 'A personalised digital thank-you card or video', isCorrect: true },
            { text: 'Homemade food sent in the post', isCorrect: false },
            { text: 'Meeting supporters in person', isCorrect: false },
          ],
          explanation: 'Digital rewards like thank-you cards, videos, or behind-the-scenes content are the safest option. They don\'t require sharing personal information and cost almost nothing to create.',
        },
        {
          question: 'What percentage of your funding should you spend on rewards maximum?',
          options: [
            { text: '50% — half for rewards, half for the business', isCorrect: false },
            { text: '10-15% maximum', isCorrect: true },
            { text: '0% — never spend anything on rewards', isCorrect: false },
            { text: '25-30% to make supporters happy', isCorrect: false },
          ],
          explanation: 'Keep reward costs to 10-15% of your total funding. Your priority is building your business, not spending your budget on thank-you gifts. Most supporters support you because they want to see you succeed!',
        },
        {
          question: 'Why should you avoid rewards that require home addresses?',
          options: [
            { text: 'Because postage is expensive', isCorrect: false },
            { text: 'Because it\'s a safety concern — you shouldn\'t exchange personal information', isCorrect: true },
            { text: 'Because digital rewards are trendier', isCorrect: false },
            { text: 'Because Futurepreneurs doesn\'t allow physical mail', isCorrect: false },
          ],
          explanation: 'As a young entrepreneur, exchanging personal information like home addresses creates safety risks. Digital-first rewards keep everyone safe while still showing your gratitude.',
        },
        {
          question: 'What do most supporters of young entrepreneurs actually want?',
          options: [
            { text: 'Expensive physical products', isCorrect: false },
            { text: 'Their money back with interest', isCorrect: false },
            { text: 'To see you succeed — regular updates showing your progress', isCorrect: true },
            { text: 'To be famous for supporting you', isCorrect: false },
          ],
          explanation: 'Most people who back young entrepreneurs are motivated by wanting to see you succeed. Regular updates showing your progress, challenges, and wins are the most meaningful reward you can give.',
        },
      ],
      tasks: [
        {
          id: 'reward-tiers',
          title: 'Design Your Reward Tiers',
          description: 'Create 3-4 reward tiers for your project. Make sure they\'re all safe (digital-first), deliverable, and cost less than 15% of your total budget.',
          type: 'exercise',
        },
        {
          id: 'stretch-goal-plan',
          title: 'Plan Stretch Goals',
          description: 'If your project raises 125%, 150%, and 200% of your goal, what would you do with the extra? Write one stretch goal for each level.',
          type: 'reflection',
        },
      ],
    },
  ],
};
