import type { LearningModule } from '@/types/learning';

export const managingBusiness: LearningModule = {
  id: 'managing-business',
  title: 'Managing Your Business',
  description: 'Navigate your dashboard, master the dual-approval drawdown system, and learn to thank supporters and complete your campaign with impact.',
  icon: 'Wallet',
  colour: 'indigo',
  sectionNumber: 6,
  lessons: [
    {
      id: 'mastering-dashboard',
      title: 'Mastering Your Digital Dashboard',
      readingTime: 4,
      content: `## Mastering Your Digital Dashboard

Your Futurepreneurs dashboard is your business command centre. It shows everything you need to run your project effectively — from funding progress to milestone status.

### Your dashboard at a glance

When you log in, your student dashboard shows:

- **Your projects** — All the projects you've created, with their current status
- **Funding progress** — How much you've raised vs. your goal
- **Milestones** — Which milestones are pending, approved, or completed
- **Notifications** — New supporters, teacher approvals, messages
- **Learning progress** — How many modules and lessons you've completed

### Understanding project statuses

| Status | What It Means |
|--------|--------------|
| Draft | You're still working on it — not visible to the public |
| Pending Verification | Submitted to your teacher for review |
| Live | Approved and visible on the platform — accepting supporters |
| Funded | You've reached your goal! Time to start your milestones |
| Completed | All milestones done, project wrapped up |

### Reading your funding progress

The funding bar shows:
- **Amount raised** — How much money supporters have pledged
- **Percentage** — How close you are to your goal
- **Number of supporters** — How many people support you
- **Days active** — How long your project has been live

### Key actions from your dashboard

**Check daily:**
- New supporters and notifications
- Any teacher messages or questions

**Check weekly:**
- Overall funding progress
- Whether it's time to submit a drawdown request
- Social media engagement on shared links

**Check monthly:**
- Long-term progress towards goals
- Whether your strategy needs adjusting
- If you need to update your project description or images

### Mobile access

Your dashboard works on your phone too! This is especially useful for:
- Checking funding progress on the go
- Responding to notifications quickly
- Sharing your project link from anywhere

### Troubleshooting common issues

**"My project is still pending"** — Your teacher hasn't reviewed it yet. Send them a polite reminder. Teachers are busy!

**"My funding isn't moving"** — Check your marketing. Have you told your inner circle? Posted on social media? Consider posting an engaging update.

**"I can't submit a drawdown"** — You can only request drawdowns once your project is fully funded and for the correct milestone amount.

### Top tip

Set a daily reminder to check your dashboard for 5 minutes. Staying on top of notifications and funding progress helps you respond quickly and keep momentum going.`,
      quiz: [
        {
          question: 'What status means your project is visible to the public and accepting supporters?',
          options: [
            { text: 'Draft', isCorrect: false },
            { text: 'Pending Verification', isCorrect: false },
            { text: 'Live', isCorrect: true },
            { text: 'Completed', isCorrect: false },
          ],
          explanation: '"Live" means your project has been approved by your teacher and is now visible on the platform. Anyone can see it and back it. This is the exciting bit!',
        },
        {
          question: 'How often should you check your dashboard?',
          options: [
            { text: 'Once a month', isCorrect: false },
            { text: 'Daily for quick checks, weekly for deeper review', isCorrect: true },
            { text: 'Every hour', isCorrect: false },
            { text: 'Only when you get a notification', isCorrect: false },
          ],
          explanation: 'A quick daily check (5 minutes) for notifications and new supporters, plus a deeper weekly review of progress and strategy, is the ideal routine.',
        },
        {
          question: 'What should you do if your project has been "Pending Verification" for too long?',
          options: [
            { text: 'Create a new project', isCorrect: false },
            { text: 'Send your teacher a polite reminder', isCorrect: true },
            { text: 'Contact Futurepreneurs support', isCorrect: false },
            { text: 'Delete the project and start over', isCorrect: false },
          ],
          explanation: 'Teachers are busy! If your project has been pending for a while, send a polite reminder. They may have missed the notification or need more time to review.',
        },
        {
          question: 'When can you submit a drawdown request?',
          options: [
            { text: 'Any time after creating your project', isCorrect: false },
            { text: 'Only after your project is fully funded', isCorrect: true },
            { text: 'Before your project goes live', isCorrect: false },
            { text: 'Only on weekdays', isCorrect: false },
          ],
          explanation: 'Drawdown requests can only be submitted after your project is fully funded. This ensures all the money is available before you start spending it.',
        },
        {
          question: 'What should you do if your funding progress has stalled?',
          options: [
            { text: 'Give up and close the project', isCorrect: false },
            { text: 'Review your marketing strategy — tell more people, post updates, share on social media', isCorrect: true },
            { text: 'Lower your funding goal', isCorrect: false },
            { text: 'Wait patiently — it will happen eventually', isCorrect: false },
          ],
          explanation: 'If funding stalls, take action! Have you told your inner circle? Posted on social media? Created engaging updates? Active promotion is what drives funding forward.',
        },
      ],
      tasks: [
        {
          id: 'dashboard-tour',
          title: 'Explore Your Dashboard',
          description: 'Log into your Futurepreneurs dashboard. Write down 3 things you can see and 2 actions you can take from the dashboard.',
          type: 'exercise',
        },
        {
          id: 'daily-routine',
          title: 'Create Your Check-in Routine',
          description: 'Set a daily reminder on your phone to check your dashboard. Decide what time works best and what you\'ll check each day.',
          type: 'reflection',
        },
      ],
    },
    {
      id: 'dual-approval-system',
      title: 'The Dual-Approval System',
      readingTime: 4,
      content: `## The Dual-Approval System

Futurepreneurs uses a dual-approval system to keep your money safe and your spending on track. Here's how it works and why it matters.

### What is dual-approval?

"Dual-approval" means two people must agree before money is released:

1. **You (the student)** submit a drawdown request
2. **Your teacher/mentor** reviews and approves it

Your parent/guardian can see all drawdown activity but doesn't need to approve each one (they gave consent when the project was created).

### The drawdown process step by step

**Step 1: You submit a request**
- Go to your project → Milestones
- Select the milestone you want to draw down
- Enter the amount (up to the milestone total)
- Write a clear reason: what you're buying, where, and why

**Step 2: Your teacher reviews it**
Your teacher sees the request and checks:
- Does the amount match the milestone?
- Is the reason clear and specific?
- Has the student researched the best price?
- Does this align with the project plan?

**Step 3: Approval or questions**
- **Approved** → Money is released to your project account
- **Questions** → Teacher asks for more detail before approving

**Step 4: You make the purchase**
- Buy the items specified in your request
- Keep the receipt
- Update your spending tracker

**Step 5: Visible to parents**
Your parent can see:
- Every drawdown request you've made
- Whether each was approved or pending
- The total amount drawn down so far
- The purpose of each withdrawal

### Writing a strong drawdown request

**Weak:** "I need money for my project"

**Strong:** "I need £28.50 for: 5kg self-raising flour (£5.75, Tesco), 2kg caster sugar (£1.78, Tesco), 30 free-range eggs (£5.70, Tesco), 50 cake boxes (£8.99, Amazon), and custom labels (£6.28, Vistaprint). Links/screenshots attached."

### Why this system exists

The dual-approval system:
- **Protects you** — Ensures money is spent wisely
- **Protects supporters** — Their money goes where promised
- **Teaches skills** — You learn to justify spending decisions
- **Builds trust** — Everyone can see the process is transparent

### Top tip

Before submitting a drawdown, prepare your research. Have links to the products, compare prices, and know exactly what you're buying. A well-prepared request gets approved faster!`,
      quiz: [
        {
          question: 'What does "dual-approval" mean in the Futurepreneurs system?',
          options: [
            { text: 'Two students must agree on spending', isCorrect: false },
            { text: 'The student submits a request and the teacher must approve it', isCorrect: true },
            { text: 'Two teachers must approve every purchase', isCorrect: false },
            { text: 'The student and a supporter must both agree', isCorrect: false },
          ],
          explanation: 'Dual-approval means the student submits a drawdown request, and their teacher/mentor reviews and approves it. Two people involved means better oversight and safer spending.',
        },
        {
          question: 'What should a drawdown request include?',
          options: [
            { text: 'Just the amount you need', isCorrect: false },
            { text: 'Specific items, prices, quantities, and where you\'ll buy them', isCorrect: true },
            { text: 'A promise to spend it wisely', isCorrect: false },
            { text: 'Only the milestone name', isCorrect: false },
          ],
          explanation: 'A good drawdown request lists exactly what you\'re buying, specific prices, quantities, and where you found them. Links and screenshots make approval faster!',
        },
        {
          question: 'What role do parents play in the drawdown process?',
          options: [
            { text: 'They must approve every drawdown', isCorrect: false },
            { text: 'They can view all drawdown activity but don\'t need to approve each one', isCorrect: true },
            { text: 'They have no involvement', isCorrect: false },
            { text: 'They submit drawdowns on behalf of the student', isCorrect: false },
          ],
          explanation: 'Parents gave consent when the project was created. They can see all drawdown activity — every request, approval, and amount — but don\'t need to approve each individual one.',
        },
        {
          question: 'What should you do if your teacher asks questions about your drawdown request?',
          options: [
            { text: 'Submit a new request without answering', isCorrect: false },
            { text: 'Answer honestly and provide additional details like price comparisons or screenshots', isCorrect: true },
            { text: 'Ask another teacher to approve it instead', isCorrect: false },
            { text: 'Cancel the request and skip that milestone', isCorrect: false },
          ],
          explanation: 'Teachers ask questions to help, not to block you. Answer honestly, provide links or screenshots of prices, and show you\'ve done your research. A well-explained request gets approved quickly.',
        },
        {
          question: 'Why does the dual-approval system exist?',
          options: [
            { text: 'To make the process slower and more difficult', isCorrect: false },
            { text: 'To protect students, supporters, and ensure money is spent wisely', isCorrect: true },
            { text: 'Because Futurepreneurs doesn\'t trust students', isCorrect: false },
            { text: 'To generate more work for teachers', isCorrect: false },
          ],
          explanation: 'The system protects everyone — students learn to justify spending, supporters see money used as promised, and the process teaches real financial responsibility. It\'s a feature, not a barrier!',
        },
      ],
      tasks: [
        {
          id: 'practice-drawdown',
          title: 'Write a Practice Drawdown Request',
          description: 'Write a drawdown request for your first milestone. Include specific items, quantities, prices, and links to where you found them.',
          type: 'exercise',
        },
        {
          id: 'understand-process',
          title: 'Map the Full Process',
          description: 'Draw or write out the full drawdown process from your perspective: request → teacher review → approval → purchase → receipt → tracking. What happens at each step?',
          type: 'reflection',
        },
      ],
    },
    {
      id: 'circle-of-gratitude',
      title: 'Completing the Circle of Gratitude',
      readingTime: 4,
      content: `## Completing the Circle of Gratitude

Your project doesn't end when you reach your funding goal or finish spending. The final — and often most impactful — step is thanking your supporters and sharing what you achieved.

### Why gratitude matters

Your supporters took a chance on you. They believed in your idea before it existed. Showing gratitude:

- **Honours their trust** — They took a real risk supporting you
- **Builds your reputation** — Grateful entrepreneurs attract future support
- **Creates connections** — Supporters become advocates for your next project
- **Feels amazing** — Expressing thanks is genuinely rewarding

### The thank-you timeline

| When | What to Do |
|------|-----------|
| After first supporter | Send a personal thank-you update |
| At each milestone | Thank supporters and show progress |
| When fully funded | Post a celebration update naming all supporters |
| When first purchase made | Show what their money bought |
| When project completes | Share an impact report |
| 1 month after | Final update: what you learned and what's next |

### Writing an impact report

At the end of your project, share a final report with supporters:

**1. The numbers:**
- Total raised: £XXX
- Number of supporters: XX
- Milestones completed: X/X

**2. What was achieved:**
- "Sold 200 cupcakes at 4 school markets"
- "Taught 15 students basic coding"
- "Recycled 150 school uniform items"

**3. What you learned:**
- "I learned that vanilla outsells chocolate 3 to 1"
- "I discovered that Tuesday markets get 2x more customers than Fridays"

**4. What's next:**
- Are you continuing the business?
- Planning a second campaign?
- Passing it on to other students?

### Turning donors into supporters

Supporters who feel appreciated become:
- **Repeat supporters** for your next project
- **Ambassadors** who tell others about you
- **Mentors** who offer advice and connections

Keep them engaged by:
- Tagging them (display names) in social media celebrations
- Sending a group thank-you when the project wraps up
- Sharing updates even after the campaign ends

### Closing your campaign gracefully

When your project is complete:

1. Post a final update summarising everything
2. Thank every supporter by display name
3. Share 2-3 key learnings
4. Tell people what's next for you
5. Celebrate! You did something incredible!

### Top tip

A handwritten "thank you" note (photographed and posted as an update) is incredibly powerful. It shows genuine care and stands out in a digital world.`,
      quiz: [
        {
          question: 'When should you start thanking your supporters?',
          options: [
            { text: 'Only after the project is fully funded', isCorrect: false },
            { text: 'After your very first supporter', isCorrect: true },
            { text: 'At the end of the project', isCorrect: false },
            { text: 'You don\'t need to — the platform thanks them automatically', isCorrect: false },
          ],
          explanation: 'Start thanking from your very first supporter! Early gratitude shows you care and encourages others to back you too. Don\'t wait until the end.',
        },
        {
          question: 'What should an impact report include?',
          options: [
            { text: 'Only financial numbers', isCorrect: false },
            { text: 'Numbers, what was achieved, what you learned, and what\'s next', isCorrect: true },
            { text: 'A list of things that went wrong', isCorrect: false },
            { text: 'Just a thank-you message', isCorrect: false },
          ],
          explanation: 'A good impact report includes: the numbers (raised, supporters), what was achieved (concrete results), what you learned (insights), and what\'s next (future plans). It tells the full story!',
        },
        {
          question: 'How can you turn one-time donors into long-term supporters?',
          options: [
            { text: 'Ask them to donate more money', isCorrect: false },
            { text: 'Keep them engaged with updates, gratitude, and sharing your progress even after the campaign', isCorrect: true },
            { text: 'Add them to a mailing list without asking', isCorrect: false },
            { text: 'You can\'t — once the project ends, the relationship ends', isCorrect: false },
          ],
          explanation: 'Keep supporters engaged by thanking them, sharing post-campaign progress, and including them in your journey. Appreciated supporters become repeat supporters and ambassadors.',
        },
        {
          question: 'What is the final step when closing a campaign?',
          options: [
            { text: 'Delete your project page', isCorrect: false },
            { text: 'Post a final update thanking everyone, sharing learnings, and telling people what\'s next', isCorrect: true },
            { text: 'Ask for reviews and ratings', isCorrect: false },
            { text: 'Start a new project immediately', isCorrect: false },
          ],
          explanation: 'Close gracefully with a final update that thanks every supporter, summarises what you achieved, shares key learnings, and tells people what\'s next. End on a high note!',
        },
        {
          question: 'Why does a photographed handwritten thank-you note work so well?',
          options: [
            { text: 'Because handwriting is faster than typing', isCorrect: false },
            { text: 'Because it shows genuine personal care and stands out in a digital world', isCorrect: true },
            { text: 'Because it\'s required by Futurepreneurs', isCorrect: false },
            { text: 'Because supporters can frame it', isCorrect: false },
          ],
          explanation: 'In a world of automated emails and template messages, a handwritten note shows real effort and genuine care. It makes supporters feel truly valued and special.',
        },
      ],
      tasks: [
        {
          id: 'thank-you-plan',
          title: 'Plan Your Thank-You Strategy',
          description: 'Create a timeline of when and how you\'ll thank supporters at each stage: first supporter, milestones, fully funded, project complete.',
          type: 'exercise',
        },
        {
          id: 'impact-reflection',
          title: 'Draft Your Impact Report',
          description: 'Even before your project launches, draft a template impact report. What numbers will you track? What learnings do you hope to share?',
          type: 'reflection',
        },
      ],
    },
  ],
};
