import type { LearningModule } from '@/types/learning';

export const resourceLibrary: LearningModule = {
  id: 'resource-library',
  title: 'Resource Library & Toolkits',
  description: 'Downloadable templates, toolkits, and guides for students, parents, and educators — everything you need in one place.',
  icon: 'BookOpen',
  colour: 'slate',
  sectionNumber: 7,
  lessons: [
    {
      id: 'student-resources',
      title: 'Student Resources & Templates',
      readingTime: 3,
      content: `## Student Resources & Templates

This page collects all the key templates and tools you need to plan, launch, and run your Futurepreneurs project. Download them, print them, and use them!

### Available templates

**1. Lean Canvas Template**
A one-page business plan template with all 9 blocks ready to fill in. Print it, grab a pencil, and map out your entire business idea.

**2. Video Storyboard Template**
Plan your 60-second video pitch scene by scene. Includes timing guides, what to say, and what to show for each section.

**3. Budget Planning Template**
A structured spreadsheet template for listing your materials, prices, quantities, and totals. Includes milestone grouping and buffer calculation.

**4. Pitch Script Outline**
A fill-in-the-blank template for writing your 5-part pitch: Hook, Problem, Solution, Why You, and The Ask.

### How to use these templates

1. **Download** the template you need
2. **Print it** (or fill in digitally)
3. **Fill in your details** — use pencil for print versions so you can revise
4. **Review with your teacher** — share your completed templates for feedback
5. **Revise and improve** — your first draft won't be your final version!

### Online tools for students

| Tool | What It Does | Cost |
|------|-------------|------|
| Canva (canva.com) | Design logos, posters, social graphics | Free |
| Google Forms | Create customer surveys | Free |
| Google Sheets | Track spending and sales | Free |
| Remove.bg | Remove photo backgrounds | Free |
| Coolors (coolors.co) | Generate colour palettes | Free |
| Unsplash (unsplash.com) | Free stock photos (for presentations) | Free |

### Essential skills checklist

Before launching your project, make sure you can:

- [ ] Explain your idea in one sentence
- [ ] Name your target audience
- [ ] List all items you need with real prices
- [ ] Calculate your funding goal accurately
- [ ] Write a compelling hook
- [ ] Record a 60-second video pitch
- [ ] Set up social media for safe promotion
- [ ] Write a drawdown request

### Top tip

Don't try to do everything at once. Work through the templates in order: Lean Canvas first (your plan), then Budget (your numbers), then Pitch Script (your story), and finally the Video Storyboard (your presentation).`,
      quiz: [
        {
          question: 'What order should you complete the templates in?',
          options: [
            { text: 'Video first, then pitch, then budget, then canvas', isCorrect: false },
            { text: 'Lean Canvas, Budget, Pitch Script, Video Storyboard', isCorrect: true },
            { text: 'It doesn\'t matter — do them in any order', isCorrect: false },
            { text: 'Budget first, then everything else', isCorrect: false },
          ],
          explanation: 'Start with the Lean Canvas (your overall plan), then Budget (your numbers), then Pitch Script (your story), and finally the Video Storyboard (your presentation). Each builds on the previous one!',
        },
        {
          question: 'Why should you use pencil when filling in printed templates?',
          options: [
            { text: 'Because pen is too expensive', isCorrect: false },
            { text: 'So you can revise and improve as you learn more', isCorrect: true },
            { text: 'Because teachers prefer pencil', isCorrect: false },
            { text: 'Because pencil looks more professional', isCorrect: false },
          ],
          explanation: 'Your first draft won\'t be perfect — and it shouldn\'t be! Using pencil lets you easily revise as you talk to customers, do more research, and refine your plan.',
        },
        {
          question: 'Which free tool is best for creating customer surveys?',
          options: [
            { text: 'Canva', isCorrect: false },
            { text: 'Coolors', isCorrect: false },
            { text: 'Google Forms', isCorrect: true },
            { text: 'Remove.bg', isCorrect: false },
          ],
          explanation: 'Google Forms is the best free tool for creating customer surveys. It\'s easy to use, collects responses automatically, and gives you simple charts to understand your data.',
        },
        {
          question: 'What should you do after completing a template?',
          options: [
            { text: 'File it away and forget about it', isCorrect: false },
            { text: 'Review it with your teacher for feedback, then revise and improve', isCorrect: true },
            { text: 'Post it on social media', isCorrect: false },
            { text: 'Start your project immediately', isCorrect: false },
          ],
          explanation: 'Always share your completed templates with your teacher for feedback. Their experience and perspective will help you improve your plan before launching.',
        },
        {
          question: 'How many of the listed tools cost money?',
          options: [
            { text: 'All of them have a paid tier', isCorrect: false },
            { text: 'None — they\'re all free to use', isCorrect: true },
            { text: 'Half of them cost money', isCorrect: false },
            { text: 'Only Canva charges', isCorrect: false },
          ],
          explanation: 'All the tools listed are free! Canva, Google Forms, Google Sheets, Remove.bg, Coolors, and Unsplash all have free versions that are perfectly adequate for student projects.',
        },
      ],
      tasks: [
        {
          id: 'download-lean-canvas',
          title: 'Download the Lean Canvas Template',
          description: 'Download and print the Lean Canvas template. Keep it handy as you work through the Blueprint module.',
          type: 'download',
          downloadUrl: '/resources/lean-canvas-template.pdf',
        },
        {
          id: 'download-storyboard',
          title: 'Download the Video Storyboard Template',
          description: 'Download the video storyboard template to plan your 60-second pitch video.',
          type: 'download',
          downloadUrl: '/resources/video-storyboard-template.pdf',
        },
        {
          id: 'download-budget',
          title: 'Download the Budget Template',
          description: 'Download the budget planning template to list all your materials, prices, and milestone groups.',
          type: 'download',
          downloadUrl: '/resources/budget-template.pdf',
        },
        {
          id: 'download-pitch',
          title: 'Download the Pitch Script Outline',
          description: 'Download the pitch script template with fill-in-the-blank sections for your 5-part pitch.',
          type: 'download',
          downloadUrl: '/resources/pitch-script-outline.pdf',
        },
      ],
    },
    {
      id: 'parent-resources',
      title: 'Parent & Guardian Resources',
      readingTime: 4,
      content: `## Parent & Guardian Resources

This section is for parents and guardians who want to understand how Futurepreneurs works and how they can best support their child's entrepreneurial journey.

### Understanding the platform

Futurepreneurs is a safe crowdfunding platform specifically designed for under-18s. Here's what makes it different from adult platforms:

**Safety features:**
- All students use display names (like "BrightSpark42") instead of real names
- Customisable avatars replace photos
- School email verification confirms student identity
- Teacher mentors verify every project before it goes live
- Parental consent is required before projects launch

**Financial safeguards:**
- Maximum funding goal: £10,000
- All-or-nothing funding (money only collected when goal is reached)
- Milestone-based drawdowns (money released in chunks, not all at once)
- Teacher approval required for every spending request
- Full audit trail of all financial activity

### Your role as a parent/guardian

**Before the project:**
- Give consent for your child to create and publish a project
- Review the project plan with them (great learning opportunity!)
- Help them research prices and plan their budget

**During the campaign:**
- Monitor funding progress through your parent dashboard
- Encourage and support (but let them lead — it's their project!)
- Help share the project link with your own network

**After funding:**
- View all drawdown requests and approvals
- Discuss spending decisions with your child
- Celebrate milestones together

### Navigating your parent dashboard

When you log in, your dashboard shows:
- Your child's projects and their status
- Funding progress for each project
- All drawdown activity (what's been requested, approved, and spent)
- Notifications about key events

### What consent means

When you give consent, you're agreeing that:
- Your child can publish a project on the platform
- Their display name and avatar will be publicly visible
- Backers can donate to their project via Stripe
- Their teacher will oversee spending through the drawdown system
- You'll monitor activity through your parent dashboard

You can withdraw consent at any time by contacting support.

### Frequently asked questions from parents

**"Is my child's personal information safe?"**
Yes. Students use display names, avatars (not photos), and never share school names publicly. No personal contact details are visible.

**"What happens if the project doesn't reach its goal?"**
Nothing — backers are only charged when the full goal is reached (all-or-nothing model). No money changes hands until the target is hit.

**"Can my child spend the money on anything?"**
No. Every penny must go through the milestone drawdown system, approved by their teacher. The money can only be used for what was planned.

**"What if something goes wrong?"**
Contact your child's teacher mentor first, or reach out to Futurepreneurs support. Every activity is logged and auditable.

### Top tip

Futurepreneurs is designed to teach real entrepreneurial skills in a safe environment. The best thing you can do is be an enthusiastic supporter while letting your child take ownership. Ask questions, celebrate wins, and let them learn from mistakes — just like real business!`,
      quiz: [
        {
          question: 'What safety feature protects student identity on Futurepreneurs?',
          options: [
            { text: 'Students must be over 16 to participate', isCorrect: false },
            { text: 'Students use display names and avatars instead of real names and photos', isCorrect: true },
            { text: 'Projects are hidden from the public', isCorrect: false },
            { text: 'Only parents can see the projects', isCorrect: false },
          ],
          explanation: 'Students are protected by using display names (like "BrightSpark42") and customisable avatars instead of real names and photos. Their personal identity is never publicly visible.',
        },
        {
          question: 'What happens to money if a project doesn\'t reach its funding goal?',
          options: [
            { text: 'The student keeps whatever was raised', isCorrect: false },
            { text: 'Backers are charged and the money is donated to charity', isCorrect: false },
            { text: 'Nothing — backers are only charged when the full goal is reached', isCorrect: true },
            { text: 'The platform keeps the money as a fee', isCorrect: false },
          ],
          explanation: 'Futurepreneurs uses an all-or-nothing model. Backers are only charged if the project reaches its full funding goal. If it falls short, no money changes hands.',
        },
        {
          question: 'Who must approve every spending request?',
          options: [
            { text: 'The parent/guardian', isCorrect: false },
            { text: 'The teacher/mentor', isCorrect: true },
            { text: 'Futurepreneurs support staff', isCorrect: false },
            { text: 'The student\'s classmates', isCorrect: false },
          ],
          explanation: 'The teacher/mentor reviews and approves every drawdown request. This ensures money is spent wisely and according to the project plan. Parents can view all activity but don\'t need to approve each request.',
        },
        {
          question: 'What is the best way for parents to support their child\'s project?',
          options: [
            { text: 'Take over the project and manage it for them', isCorrect: false },
            { text: 'Be an enthusiastic supporter while letting them take ownership', isCorrect: true },
            { text: 'Don\'t get involved at all', isCorrect: false },
            { text: 'Only provide financial support', isCorrect: false },
          ],
          explanation: 'The best approach is being an enthusiastic supporter while letting your child lead. Ask questions, celebrate wins, help with research, but let them make decisions and learn from the experience.',
        },
        {
          question: 'Can a parent withdraw consent after giving it?',
          options: [
            { text: 'No — once given, consent is permanent', isCorrect: false },
            { text: 'Yes — by contacting support at any time', isCorrect: true },
            { text: 'Only within the first 24 hours', isCorrect: false },
            { text: 'Only if the project hasn\'t received any backers', isCorrect: false },
          ],
          explanation: 'Parents can withdraw consent at any time by contacting Futurepreneurs support. We take parental rights seriously and ensure parents always have control over their child\'s participation.',
        },
      ],
      tasks: [
        {
          id: 'parent-dashboard-tour',
          title: 'Show Your Parent the Dashboard',
          description: 'If your parent/guardian has an account, show them the parent dashboard. Walk them through what they can see and how to monitor your activity.',
          type: 'exercise',
        },
        {
          id: 'parent-conversation',
          title: 'Have the "Project Conversation"',
          description: 'Sit down with your parent/guardian and explain your project idea. Discuss the safety features, your budget, and your plan. Get their feedback and support.',
          type: 'reflection',
        },
      ],
    },
    {
      id: 'educator-resources',
      title: 'Mentor & Educator Resources',
      readingTime: 4,
      content: `## Mentor & Educator Resources

This section is for teachers, mentors, and educators who guide students through their Futurepreneurs journey. Your role as a mentor is central to every project's success.

### Your role as a teacher mentor

As a mentor on Futurepreneurs, you:

1. **Verify projects** — Review and approve student projects before they go live
2. **Approve spending** — Review and approve drawdown requests
3. **Guide learning** — Help students develop their business plans and pitches
4. **Ensure safety** — Make sure all content is appropriate and safe
5. **Provide feedback** — Help students improve through constructive advice

### Evaluating student business plans

When a student submits a project for verification, assess:

**Viability:**
- Is there a real demand for this product/service?
- Is the pricing realistic?
- Can the student realistically deliver this?

**Budget:**
- Are costs based on real research?
- Is the funding goal appropriate (not too high, not too low)?
- Are milestones logical and well-structured?

**Safety:**
- No personal information exposed (real name, address, school name)
- Age-appropriate content and products
- Safe marketing plans

**Quality:**
- Clear description and compelling story
- Good images (following safety guidelines)
- Reasonable timeline

### Integrating with curriculum

Futurepreneurs projects align with multiple curriculum areas:

| Subject | How It Connects |
|---------|----------------|
| Business Studies | Market research, business plans, finance, marketing |
| Maths | Budgeting, percentages, profit margins, data analysis |
| English | Persuasive writing, storytelling, presentation skills |
| ICT/Computing | Website use, social media, digital literacy |
| PSHE | Financial literacy, responsibility, community |
| Art/Design | Branding, photography, visual presentation |

### Approving drawdown requests safely

When reviewing a drawdown request, check:

1. **Does it match the milestone?** — Amount and purpose align with the plan
2. **Are prices reasonable?** — Based on real research, not inflated
3. **Is it appropriate?** — Items are suitable for the student and project
4. **Is there documentation?** — Links, screenshots, or quotes provided
5. **Best value?** — Has the student compared prices?

### Managing multiple student projects

If you mentor several students:
- Set regular check-in times (weekly 10-minute catch-ups)
- Use your teacher dashboard to track all pending actions
- Create a simple spreadsheet to monitor progress across projects
- Encourage peer support between student entrepreneurs

### The mentorship balance

Your goal is to **guide without doing it for them**:

- Ask questions instead of giving answers
- Point them towards resources instead of solving problems
- Celebrate effort, not just results
- Let them experience small failures safely
- Build their confidence through incremental challenges

### Top tip

The most impactful thing you can do is be available and responsive. Students are most motivated right after launching — quick turnaround on verifications and approvals keeps that energy going.`,
      quiz: [
        {
          question: 'What is the primary role of a teacher mentor on Futurepreneurs?',
          options: [
            { text: 'To run the student\'s business for them', isCorrect: false },
            { text: 'To verify projects, approve spending, and guide students through the process', isCorrect: true },
            { text: 'To invest money in student projects', isCorrect: false },
            { text: 'To grade the student\'s work', isCorrect: false },
          ],
          explanation: 'A teacher mentor verifies projects (ensures they\'re safe and viable), approves drawdown requests (ensures responsible spending), and guides students through the entrepreneurial process.',
        },
        {
          question: 'What should a mentor check when reviewing a drawdown request?',
          options: [
            { text: 'Only that the amount is within budget', isCorrect: false },
            { text: 'Amount matches milestone, prices are reasonable, items are appropriate, and documentation is provided', isCorrect: true },
            { text: 'Just that the student asked politely', isCorrect: false },
            { text: 'Whether the items are available in the school shop', isCorrect: false },
          ],
          explanation: 'A thorough review checks: Does it match the milestone? Are prices researched and reasonable? Are items appropriate? Has the student provided links, screenshots, or quotes as documentation?',
        },
        {
          question: 'Which curriculum subject does Futurepreneurs NOT directly connect to?',
          options: [
            { text: 'Business Studies', isCorrect: false },
            { text: 'Maths', isCorrect: false },
            { text: 'Physical Education', isCorrect: true },
            { text: 'English', isCorrect: false },
          ],
          explanation: 'Futurepreneurs connects to Business Studies, Maths, English, ICT, PSHE, and Art/Design. While it builds transferable skills, it doesn\'t directly connect to Physical Education.',
        },
        {
          question: 'What is the best mentorship approach?',
          options: [
            { text: 'Do everything for the student to ensure quality', isCorrect: false },
            { text: 'Leave the student completely alone to figure it out', isCorrect: false },
            { text: 'Ask questions, point to resources, and let students learn by doing', isCorrect: true },
            { text: 'Only step in when there\'s a crisis', isCorrect: false },
          ],
          explanation: 'The best mentors guide without doing it for the student. Ask questions instead of giving answers, point to resources, celebrate effort, and let them learn through experience — including small failures.',
        },
        {
          question: 'Why is quick turnaround on verifications and approvals important?',
          options: [
            { text: 'Because Futurepreneurs has strict deadlines', isCorrect: false },
            { text: 'Because students are most motivated right after launching and delays kill momentum', isCorrect: true },
            { text: 'Because parents expect instant responses', isCorrect: false },
            { text: 'It\'s not important — take as long as you need', isCorrect: false },
          ],
          explanation: 'Students are most excited and motivated right after creating their project. Quick verification keeps that energy going. Delays can cause students to lose interest or momentum.',
        },
      ],
      tasks: [
        {
          id: 'share-with-mentor',
          title: 'Share This Section With Your Mentor',
          description: 'Send this lesson link to your teacher mentor so they can learn about the platform too. Discuss any questions they have.',
          type: 'exercise',
        },
        {
          id: 'mentor-checkin',
          title: 'Schedule Your First Check-in',
          description: 'Arrange a 10-minute weekly check-in time with your teacher mentor. Decide what day and time works best for both of you.',
          type: 'exercise',
        },
      ],
    },
  ],
};
