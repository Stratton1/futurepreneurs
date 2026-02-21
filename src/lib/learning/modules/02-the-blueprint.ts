import type { LearningModule } from '@/types/learning';

export const theBlueprint: LearningModule = {
  id: 'the-blueprint',
  title: 'The Blueprint',
  description: 'Build a solid business plan from scratch — the Lean Canvas, MVPs, revenue models, market research, and goal setting.',
  icon: 'Lightbulb',
  colour: 'blue',
  sectionNumber: 2,
  lessons: [
    {
      id: 'lean-model-canvas',
      title: 'The Lean Model Canvas',
      readingTime: 5,
      content: `## The Lean Model Canvas

The Lean Model Canvas is a one-page business plan. Instead of writing a long document, you fill in 9 boxes that cover everything about your business. It was created by Ash Maurya and is used by startups worldwide.

### The 9 blocks

| Block | Question It Answers |
|-------|--------------------|
| 1. Problem | What problem are you solving? (List top 3) |
| 2. Customer Segments | Who has this problem? |
| 3. Unique Value Proposition | Why would someone choose YOU? |
| 4. Solution | How does your product/service fix the problem? |
| 5. Channels | How will customers find out about you? |
| 6. Revenue Streams | How will you make money? |
| 7. Cost Structure | What will you need to spend money on? |
| 8. Key Metrics | How will you measure success? |
| 9. Unfair Advantage | What do you have that nobody can easily copy? |

### Example: Student Bakery

**Problem:** Students want affordable, freshly baked treats but the school canteen only sells pre-packaged snacks.

**Customer Segments:** Students aged 11-16 at Greenfield School who buy snacks at break and lunch.

**Unique Value Proposition:** Freshly baked cupcakes and flapjacks made that morning, using local ingredients, at canteen prices.

**Solution:** Weekly bake sale at the school market with rotating flavours and seasonal specials.

**Channels:** School posters, Instagram, word of mouth, teacher announcements.

**Revenue Streams:** Direct sales of baked goods (£1-3 per item).

**Cost Structure:** Ingredients (£15/week), packaging (£5/week), market stall fee (£5/week).

**Key Metrics:** Number of items sold per week, revenue per week, repeat customers.

**Unfair Advantage:** Access to school market, established customer base, teacher mentor support.

### How to fill in your canvas

1. Start with **Problem** — this is the foundation
2. Then **Customer Segments** — who has this problem?
3. Then **Solution** — how do you fix it?
4. Fill in the rest in any order
5. Keep revising — your canvas should evolve as you learn

### Top tip

Print the Lean Canvas template and fill it in with pencil — you'll want to revise it as you learn more about your customers and market. Nothing is set in stone!`,
      quiz: [
        {
          question: 'How many blocks does the Lean Model Canvas have?',
          options: [
            { text: '5', isCorrect: false },
            { text: '7', isCorrect: false },
            { text: '9', isCorrect: true },
            { text: '12', isCorrect: false },
          ],
          explanation: 'The Lean Model Canvas has 9 blocks covering: Problem, Customer Segments, Unique Value Proposition, Solution, Channels, Revenue Streams, Cost Structure, Key Metrics, and Unfair Advantage.',
        },
        {
          question: 'Which block should you fill in first?',
          options: [
            { text: 'Revenue Streams — money matters most', isCorrect: false },
            { text: 'Problem — it\'s the foundation of your business', isCorrect: true },
            { text: 'Solution — start with what you want to build', isCorrect: false },
            { text: 'Unfair Advantage — know what makes you special', isCorrect: false },
          ],
          explanation: 'Start with the Problem block. If you don\'t understand the problem clearly, nothing else will work. The problem is the foundation that everything else builds on.',
        },
        {
          question: 'What does "Unique Value Proposition" mean?',
          options: [
            { text: 'The unique price you set for your product', isCorrect: false },
            { text: 'Why someone would choose your product over alternatives', isCorrect: true },
            { text: 'A special discount you offer', isCorrect: false },
            { text: 'The patent on your idea', isCorrect: false },
          ],
          explanation: 'Your Unique Value Proposition (UVP) explains why customers would choose YOU over other options. What makes your product or service special and different?',
        },
        {
          question: 'What are "Key Metrics"?',
          options: [
            { text: 'The measurements used to build your product', isCorrect: false },
            { text: 'Your social media follower count', isCorrect: false },
            { text: 'The numbers you track to measure if your business is succeeding', isCorrect: true },
            { text: 'The size of your market', isCorrect: false },
          ],
          explanation: 'Key Metrics are the important numbers you track to know if your business is doing well — like items sold per week, revenue, or repeat customers. What gets measured gets improved!',
        },
        {
          question: 'Should your Lean Canvas stay the same forever?',
          options: [
            { text: 'Yes — once written, stick to the plan', isCorrect: false },
            { text: 'No — you should revise it as you learn more about your customers and market', isCorrect: true },
            { text: 'Only change it if your teacher tells you to', isCorrect: false },
            { text: 'Rewrite it completely every week', isCorrect: false },
          ],
          explanation: 'Your Lean Canvas is a living document! As you talk to customers, test your ideas, and learn what works, update your canvas. The best entrepreneurs constantly refine their plans.',
        },
      ],
      tasks: [
        {
          id: 'download-canvas',
          title: 'Download the Lean Canvas Template',
          description: 'Download and print the Lean Canvas template. Fill in all 9 blocks for your business idea using pencil (so you can revise later!).',
          type: 'download',
          downloadUrl: '/resources/lean-canvas-template.pdf',
        },
        {
          id: 'fill-canvas',
          title: 'Complete Your Lean Canvas',
          description: 'Fill in all 9 blocks of the Lean Canvas for your business idea. Start with Problem, then Customer Segments, then Solution.',
          type: 'exercise',
        },
      ],
    },
    {
      id: 'building-your-mvp',
      title: 'Building Your MVP',
      readingTime: 4,
      content: `## Building Your MVP

MVP stands for **Minimum Viable Product** — the simplest version of your idea that lets you test whether people actually want it. It's about learning, not perfection.

### Why build an MVP?

Imagine spending months and £500 building the perfect product... only to find out nobody wants it. An MVP prevents this by letting you test with a tiny investment.

### The MoSCoW Method

Prioritise your features using MoSCoW:

- **Must have** — Without these, your product doesn't work at all
- **Should have** — Important but not essential for day one
- **Could have** — Nice extras if you have time and money
- **Won't have (yet)** — Future features, not for now

### Example: Student Bakery MVP

| Category | Features |
|----------|----------|
| **Must have** | 3 cupcake flavours, basic packaging, a price list |
| **Should have** | Custom labels, a menu board, seasonal specials |
| **Could have** | An Instagram page, loyalty stamps, gift boxes |
| **Won't have yet** | Online ordering, delivery, multiple locations |

### Testing your MVP

Once you have your simplest version, test it:

1. **Make a small batch** — Don't make 200 cupcakes. Make 20
2. **Sell to friends and family** — Your inner circle first
3. **Ask for honest feedback** — "What would make this better?"
4. **Watch behaviour** — Did they come back? Did they tell friends?
5. **Iterate** — Improve based on what you learned

### The build-measure-learn loop

This is the heart of lean thinking:

1. **Build** — Make your MVP
2. **Measure** — Track what happens (sales, feedback, interest)
3. **Learn** — What worked? What didn't?
4. **Repeat** — Improve and test again

Each cycle makes your product better and your understanding deeper.

### Common MVP mistakes

- **Too perfect** — Spending months polishing before testing
- **Too many features** — Adding everything at once
- **Not testing** — Building without getting feedback
- **Ignoring feedback** — Hearing what you want to hear

### Top tip

Your MVP might feel embarrassingly simple — and that's fine! The goal isn't to impress people; it's to learn whether your idea has potential. Start small, learn fast, improve constantly.`,
      quiz: [
        {
          question: 'What does MVP stand for?',
          options: [
            { text: 'Most Valuable Product', isCorrect: false },
            { text: 'Minimum Viable Product', isCorrect: true },
            { text: 'Maximum Volume Production', isCorrect: false },
            { text: 'Most Visible Promotion', isCorrect: false },
          ],
          explanation: 'MVP stands for Minimum Viable Product — the simplest version of your idea that lets you test whether people actually want it. Start simple, learn fast!',
        },
        {
          question: 'In the MoSCoW method, what does "Must have" mean?',
          options: [
            { text: 'Features that would be nice but aren\'t necessary', isCorrect: false },
            { text: 'Features without which your product doesn\'t work at all', isCorrect: true },
            { text: 'The most expensive features', isCorrect: false },
            { text: 'Features your competitors have', isCorrect: false },
          ],
          explanation: '"Must have" means features that are absolutely essential — without them, your product doesn\'t function. Everything else can be added later.',
        },
        {
          question: 'What is the correct order of the build-measure-learn loop?',
          options: [
            { text: 'Learn → Build → Measure', isCorrect: false },
            { text: 'Measure → Build → Learn', isCorrect: false },
            { text: 'Build → Measure → Learn → Repeat', isCorrect: true },
            { text: 'Plan → Build → Sell → Rest', isCorrect: false },
          ],
          explanation: 'Build your MVP, Measure what happens (sales, feedback), Learn from the results, then Repeat. Each cycle makes your product better!',
        },
        {
          question: 'Why should your MVP feel "embarrassingly simple"?',
          options: [
            { text: 'Because simple products are always better', isCorrect: false },
            { text: 'Because the goal is learning, not perfection', isCorrect: true },
            { text: 'Because customers prefer simple things', isCorrect: false },
            { text: 'Because you can\'t afford to make it good', isCorrect: false },
          ],
          explanation: 'An MVP\'s job is to test your idea quickly and cheaply. If you spend months perfecting it first, you might discover the idea doesn\'t work — wasting all that effort. Start simple, then improve!',
        },
        {
          question: 'What should you do after selling your first small batch?',
          options: [
            { text: 'Immediately scale up to maximum production', isCorrect: false },
            { text: 'Ask for honest feedback and watch how people behave', isCorrect: true },
            { text: 'Celebrate and stop working on it', isCorrect: false },
            { text: 'Lower your prices to attract more customers', isCorrect: false },
          ],
          explanation: 'After your first test, collect feedback! Ask "What would make this better?" and watch behaviour (did they come back? tell friends?). Use this to improve before scaling up.',
        },
      ],
      tasks: [
        {
          id: 'moscow-exercise',
          title: 'MoSCoW Your Features',
          description: 'List all the features and components of your business idea. Sort each one into Must have, Should have, Could have, or Won\'t have yet.',
          type: 'exercise',
        },
        {
          id: 'mvp-reflection',
          title: 'Define Your MVP',
          description: 'Write a one-paragraph description of the simplest version of your product or service that you could test this week with minimal cost.',
          type: 'reflection',
        },
      ],
    },
    {
      id: 'revenue-models',
      title: 'Exploring Revenue Models',
      readingTime: 4,
      content: `## Exploring Revenue Models

A revenue model is simply how your business makes money. Understanding different models helps you choose the best one for your idea.

### Common revenue models for young entrepreneurs

**1. Direct Sales (Product)**
You make something and sell it directly.
- Cupcakes at a school market
- Handmade jewellery online
- Custom phone cases

**2. Direct Sales (Service)**
You provide a service and charge for it.
- Tutoring (£5/hour)
- Bike repair (£3-10 per job)
- Dog walking (£5 per walk)

**3. Subscription / Regular**
Customers pay on a regular basis.
- Weekly snack box delivery
- Monthly craft kit
- Weekly car wash

**4. Freemium**
Give away something for free, charge for premium extras.
- Free basic study notes, charge for detailed revision guides
- Free social media tips, charge for custom graphics
- Free coding tutorials, charge for one-to-one help

**5. Commission / Marketplace**
Connect buyers and sellers and take a percentage.
- Student marketplace taking 10% of each sale
- Booking platform for student tutors

### Choosing the right model

Ask yourself:

- **What's easiest to start?** → Direct sales usually
- **What gives predictable income?** → Subscriptions
- **What has the lowest risk?** → Services (no upfront product cost)
- **What can scale?** → Digital products and subscriptions

### Pricing your product or service

Three simple approaches:

1. **Cost-plus:** Add up your costs and add a profit margin. If a cupcake costs £0.50 to make, sell it for £1.50 (200% markup)
2. **Competitor-based:** What do others charge? Price similarly or justify why yours is different
3. **Value-based:** What would customers happily pay? Test different prices and see what sells

### Top tip

Don't overthink pricing at the start. Pick a reasonable price, test it, and adjust based on real sales data. You can always change your prices later!`,
      quiz: [
        {
          question: 'What is a revenue model?',
          options: [
            { text: 'A mathematical formula for calculating profit', isCorrect: false },
            { text: 'How your business makes money', isCorrect: true },
            { text: 'A graph showing your income over time', isCorrect: false },
            { text: 'The total amount of money your business earns', isCorrect: false },
          ],
          explanation: 'A revenue model describes how your business makes money. Different models include direct sales, subscriptions, freemium, and commission-based approaches.',
        },
        {
          question: 'What is "cost-plus" pricing?',
          options: [
            { text: 'Charging more than your competitors', isCorrect: false },
            { text: 'Adding up your costs and adding a profit margin on top', isCorrect: true },
            { text: 'Setting the lowest price possible', isCorrect: false },
            { text: 'Charging whatever customers are willing to pay', isCorrect: false },
          ],
          explanation: 'Cost-plus pricing means calculating what each item costs you to make, then adding a profit margin. If cupcakes cost £0.50 each, selling at £1.50 gives you a £1 profit per cupcake.',
        },
        {
          question: 'Which revenue model gives the most predictable income?',
          options: [
            { text: 'One-time product sales', isCorrect: false },
            { text: 'Subscriptions', isCorrect: true },
            { text: 'Marketplace commissions', isCorrect: false },
            { text: 'Freemium', isCorrect: false },
          ],
          explanation: 'Subscriptions provide the most predictable income because customers pay regularly (weekly, monthly). You can forecast how much money you\'ll make each period.',
        },
        {
          question: 'What is the "freemium" model?',
          options: [
            { text: 'Giving everything away for free', isCorrect: false },
            { text: 'Offering a free basic version and charging for premium extras', isCorrect: true },
            { text: 'Charging a one-time fee for lifetime access', isCorrect: false },
            { text: 'Letting customers pay whatever they want', isCorrect: false },
          ],
          explanation: 'Freemium means offering a basic version for free and charging for premium features or extras. This lets people try before they buy, which can attract more customers.',
        },
        {
          question: 'Which revenue model has the lowest upfront risk for a young entrepreneur?',
          options: [
            { text: 'Manufacturing products in bulk', isCorrect: false },
            { text: 'Services — no upfront product costs', isCorrect: true },
            { text: 'Buying wholesale and reselling', isCorrect: false },
            { text: 'Opening a physical shop', isCorrect: false },
          ],
          explanation: 'Services have the lowest risk because you don\'t need to buy materials or make products upfront. Your time and skills are the product — so there\'s minimal financial risk to get started.',
        },
      ],
      tasks: [
        {
          id: 'revenue-model-pick',
          title: 'Choose Your Revenue Model',
          description: 'Decide which revenue model fits your business best. Write down why you chose it and how it works for your specific idea.',
          type: 'reflection',
        },
        {
          id: 'pricing-exercise',
          title: 'Price Your Product',
          description: 'Calculate your cost per item, then try all 3 pricing methods (cost-plus, competitor-based, value-based). Which price would you set and why?',
          type: 'exercise',
        },
      ],
    },
    {
      id: 'school-based-enterprise',
      title: 'Running a School-Based Enterprise',
      readingTime: 4,
      content: `## Running a School-Based Enterprise

A School-Based Enterprise (SBE) is a real business run by students within a school setting. It's one of the best ways to learn entrepreneurship because you have a built-in customer base and support system.

### Types of school-based enterprises

**Retail Operations:**
- School shop selling stationery, snacks, or merchandise
- Pop-up market stalls at break/lunchtime
- Online store for school-branded items

**Food Operations:**
- Bake sales and cake stalls
- Healthy snack boxes
- Student-run tuck shop or cafe corner

**Service Operations:**
- Tutoring service connecting older and younger students
- Tech support desk for fixing minor device issues
- Photography service for school events

**Creative Operations:**
- Custom artwork and design commissions
- Event planning for school activities
- Content creation for school social media

### The SBE checklist

Before launching your school-based enterprise:

- [ ] School permission obtained from head teacher/business department
- [ ] Teacher mentor identified and confirmed
- [ ] Location secured (classroom, canteen corner, outdoor space)
- [ ] Operating schedule agreed (which days, which breaks)
- [ ] Health & safety requirements understood (especially for food!)
- [ ] Cash handling plan agreed with school
- [ ] Stock storage arrangement made
- [ ] Opening day marketing planned

### Working with your school

Schools are usually very supportive of student enterprises, but you need to follow their rules:

1. **Get formal permission** — Ask the right person (usually head of department or head teacher)
2. **Follow food safety rules** — If selling food, understand allergen labelling and hygiene requirements
3. **Agree on times and places** — When and where can you operate?
4. **Handle money safely** — Use a cash box, count everything, and record all transactions
5. **Clean up after yourself** — Leave your space better than you found it

### Advantages of school-based enterprises

- **Built-in customers** — Hundreds of potential buyers every day
- **Low overhead** — No rent or utility costs
- **Support system** — Teachers, school staff, and parents to help
- **Safe environment** — Familiar, supervised setting
- **Learning opportunity** — Real business experience with training wheels

### Top tip

Start by talking to your business studies or enterprise teacher. Most schools have enterprise programmes, and your teacher can help you navigate the approval process much faster.`,
      quiz: [
        {
          question: 'What is a School-Based Enterprise (SBE)?',
          options: [
            { text: 'A business that sells products to schools', isCorrect: false },
            { text: 'A real business run by students within a school setting', isCorrect: true },
            { text: 'A classroom exercise about business', isCorrect: false },
            { text: 'A school that teaches only business subjects', isCorrect: false },
          ],
          explanation: 'A School-Based Enterprise is a real, functioning business operated by students within their school. It gives authentic business experience in a safe, supported environment.',
        },
        {
          question: 'What is the FIRST thing you should do before starting a school-based enterprise?',
          options: [
            { text: 'Start selling immediately to test your idea', isCorrect: false },
            { text: 'Get formal permission from the school', isCorrect: true },
            { text: 'Order all your stock', isCorrect: false },
            { text: 'Create a social media page', isCorrect: false },
          ],
          explanation: 'Always get formal permission from the school first. Talk to your teacher, head of department, or head teacher. They\'ll help you understand the rules and support your venture.',
        },
        {
          question: 'What is a major advantage of running a business at school?',
          options: [
            { text: 'You don\'t need a business plan', isCorrect: false },
            { text: 'Built-in customers — hundreds of potential buyers every day', isCorrect: true },
            { text: 'You can charge whatever you want', isCorrect: false },
            { text: 'There are no rules to follow', isCorrect: false },
          ],
          explanation: 'One of the biggest advantages of a school-based enterprise is having a built-in customer base. Hundreds of students pass by every day — you don\'t have to find customers, they\'re already there!',
        },
        {
          question: 'If you\'re selling food at school, what must you understand?',
          options: [
            { text: 'Only organic ingredients are allowed', isCorrect: false },
            { text: 'Allergen labelling and food hygiene requirements', isCorrect: true },
            { text: 'You need a professional chef qualification', isCorrect: false },
            { text: 'All food must be pre-packaged from a shop', isCorrect: false },
          ],
          explanation: 'Food safety is critical! You need to understand allergen labelling (declaring ingredients like nuts, gluten, dairy), basic food hygiene, and your school\'s specific food handling rules.',
        },
        {
          question: 'Why should you clean up after yourself when running an SBE?',
          options: [
            { text: 'Because the school will fine you if you don\'t', isCorrect: false },
            { text: 'It shows responsibility and helps you keep permission to operate', isCorrect: true },
            { text: 'Because other students will complain', isCorrect: false },
            { text: 'It\'s not really necessary if you\'re in a rush', isCorrect: false },
          ],
          explanation: 'Cleaning up shows maturity and responsibility — essential traits for any entrepreneur. If you leave a mess, you might lose permission to operate. Leave your space better than you found it!',
        },
      ],
      tasks: [
        {
          id: 'sbe-checklist',
          title: 'Complete the SBE Checklist',
          description: 'Go through the School-Based Enterprise checklist. For each item, write down what you need to do and who you need to talk to.',
          type: 'exercise',
        },
        {
          id: 'talk-to-teacher',
          title: 'Speak to Your Teacher',
          description: 'Have a conversation with your business/enterprise teacher about running a school-based enterprise. What advice do they give? What permissions do you need?',
          type: 'research',
        },
      ],
    },
    {
      id: 'example-business-plan',
      title: 'Example Business Plan Walkthrough',
      readingTime: 5,
      content: `## Example Business Plan Walkthrough

Let's walk through a complete business plan for a real student business: **"Glow Candles" — a handmade soy candle business.** This will show you exactly how all the pieces fit together.

### The Idea

Emma (15) loves making candles and wants to sell handmade soy candles at her school Christmas market and online through Futurepreneurs.

### Problem Statement

> "Students and parents at my school want unique, affordable Christmas gifts but struggle to find anything personal or handmade locally."

### Customer Persona

**Name:** "Gift-Giving Grace" (Parent, age 35-45)
**Problem:** Wants meaningful, affordable stocking fillers for teachers, friends, and family
**Budget:** £5-15 per gift
**Where she shops:** School events, local markets, Instagram
**What she values:** Handmade, local, eco-friendly

### Product Range (MVP)

| Product | Price | Cost to Make |
|---------|-------|-------------|
| Small candle (100ml) | £5 | £1.80 |
| Medium candle (200ml) | £8 | £2.90 |
| Gift set (2 small + 1 medium) | £15 | £6.50 |

Three scents to start: Vanilla, Lavender, Christmas Spice.

### Lean Canvas Summary

- **Problem:** Lack of unique, affordable handmade gifts
- **Customers:** Parents and students buying Christmas gifts
- **UVP:** Handmade soy candles, eco-friendly, beautifully packaged
- **Solution:** Made-to-order candles with custom labels
- **Channels:** School market, Futurepreneurs page, Instagram
- **Revenue:** Direct product sales (£5-15 per item)
- **Costs:** Soy wax, fragrance oils, wicks, jars, labels
- **Key Metrics:** Units sold/week, revenue/week, return customers
- **Unfair Advantage:** Access to school market, handmade quality

### Budget & Milestones

**Funding Goal: £150**

| Milestone | Amount | Items |
|-----------|--------|-------|
| Raw Materials | £55 | 5kg soy wax (£18), fragrance oils x3 (£15), 50 wicks (£8), dye blocks (£6), thermometer (£8) |
| Containers | £35 | 50x glass jars 100ml (£20), 25x glass jars 200ml (£15) |
| Packaging | £30 | Custom labels (£12), gift boxes (£10), ribbon/tissue (£8) |
| Marketing | £15 | Business cards (£8), poster printing (£7) |
| Buffer | £15 | Unexpected costs |

### Marketing Plan

**Week 1-2 (Pre-launch):**
- Create Futurepreneurs project page with photos and video
- Share with family and close friends
- Post "coming soon" teasers on Instagram

**Week 3-4 (Launch):**
- Go live on Futurepreneurs
- Share project link widely
- Post behind-the-scenes candle-making videos
- Reach out to school newsletter

**Week 5-8 (Campaign active):**
- Post weekly updates showing progress
- Share funding milestones
- Create urgency as market date approaches

### Financial Projection

If Emma sells at the school Christmas market:
- 30 small candles × £5 = £150
- 15 medium candles × £8 = £120
- 10 gift sets × £15 = £150
- **Total revenue: £420**
- **Total costs: ~£150**
- **Profit: ~£270**

### What Emma learned

"Writing it all down made me realise I needed less money than I thought. The hardest part was pricing — I kept wanting to charge too little because I was nervous. My teacher helped me see that handmade is worth more."

### Top tip

Use Emma's plan as a template, but make it YOUR own. Change the numbers, products, and details to match your real business idea.`,
      quiz: [
        {
          question: 'What was Emma\'s Unique Value Proposition for Glow Candles?',
          options: [
            { text: 'The cheapest candles in town', isCorrect: false },
            { text: 'Handmade soy candles, eco-friendly, beautifully packaged', isCorrect: true },
            { text: 'The biggest candles available', isCorrect: false },
            { text: 'Celebrity-endorsed candles', isCorrect: false },
          ],
          explanation: 'Emma\'s UVP was handmade quality, eco-friendly materials, and beautiful packaging. A UVP tells customers why they should choose YOUR product over alternatives.',
        },
        {
          question: 'How did Emma decide on her pricing?',
          options: [
            { text: 'She picked the lowest possible price', isCorrect: false },
            { text: 'She calculated costs and added a profit margin, with help from her teacher', isCorrect: true },
            { text: 'She copied prices from a large candle company', isCorrect: false },
            { text: 'She let customers decide what to pay', isCorrect: false },
          ],
          explanation: 'Emma calculated her actual costs per candle and added a profit margin. Her teacher helped her understand that handmade products deserve a fair price — don\'t undervalue your work!',
        },
        {
          question: 'What percentage of Emma\'s funding goal was allocated to the buffer?',
          options: [
            { text: '5% (£7.50)', isCorrect: false },
            { text: '10% (£15)', isCorrect: true },
            { text: '20% (£30)', isCorrect: false },
            { text: '25% (£37.50)', isCorrect: false },
          ],
          explanation: 'Emma allocated £15 out of £150 as a buffer — that\'s 10%. A buffer of 10-15% is recommended to cover unexpected costs.',
        },
        {
          question: 'What did Emma say was the hardest part of planning?',
          options: [
            { text: 'Finding a teacher mentor', isCorrect: false },
            { text: 'Making the candles', isCorrect: false },
            { text: 'Pricing — she kept wanting to charge too little', isCorrect: true },
            { text: 'Writing the project description', isCorrect: false },
          ],
          explanation: 'Many young entrepreneurs undervalue their work! Emma wanted to charge too little because she was nervous. Remember: handmade, quality products deserve a fair price.',
        },
        {
          question: 'If Emma sold 30 small candles (£5 each) and 15 medium candles (£8 each), what would her total revenue be?',
          options: [
            { text: '£225', isCorrect: false },
            { text: '£270', isCorrect: true },
            { text: '£300', isCorrect: false },
            { text: '£420', isCorrect: false },
          ],
          explanation: '30 × £5 = £150, plus 15 × £8 = £120. Total = £270. Being able to calculate revenue quickly is an essential entrepreneurial skill!',
        },
      ],
      tasks: [
        {
          id: 'plan-template',
          title: 'Create Your Own Business Plan',
          description: 'Using Emma\'s Glow Candles as a template, write a business plan for YOUR idea. Include: problem statement, customer persona, product/service, pricing, budget, and marketing plan.',
          type: 'exercise',
        },
      ],
    },
    {
      id: 'market-research',
      title: 'Market Research',
      readingTime: 5,
      content: `## Market Research

Market research is how you find out if your idea will work BEFORE you invest time and money. It's about gathering real information — not guessing.

### Why research matters

Without research, you're guessing. With research, you're making informed decisions. Research helps you:

- Prove there's demand for your product
- Understand your competition
- Set the right price
- Find the best way to reach customers
- Convince backers your plan is solid

### Primary research (you collect it yourself)

**Surveys:**
- Use Google Forms or SurveyMonkey (free)
- Ask 20+ people from your target audience
- Keep it short (5-10 questions)
- Mix closed questions ("Would you buy this? Yes/No") with open ones ("What would make it better?")

**Interviews:**
- Talk to 5-10 potential customers face-to-face
- Ask open questions: "Tell me about the last time you..."
- Listen more than you talk (80/20 rule)
- Take notes or record (with permission)

**Observation:**
- Watch how people behave in the setting where you'd sell
- Count potential customers at different times
- Note what they're currently buying and how much they spend

### Secondary research (already published data)

Here are 10+ useful UK websites for research:

| Resource | What It's For | URL |
|----------|--------------|-----|
| Google Trends | See if interest in your market is growing | trends.google.co.uk |
| Companies House | Check existing businesses in your space | gov.uk/government/organisations/companies-house |
| ONS (Office for National Statistics) | UK population and spending data | ons.gov.uk |
| Statista | Market size and industry statistics | statista.com |
| YouGov | Consumer attitudes and preferences | yougov.co.uk |
| Mintel | Detailed market reports (check your library for free access) | mintel.com |
| Local council data | Local business and demographic info | Your council's website |
| Social media insights | See what people talk about and what's trending | Instagram, TikTok, Reddit |
| SurveyMonkey | Create and distribute your own surveys | surveymonkey.com |
| School surveys | Built-in access to hundreds of potential respondents | Your school |

### What to collect

For your Futurepreneurs project, gather:

1. **Market size** — How many people might buy your product?
2. **Competition** — Who else sells something similar? What do they charge?
3. **Customer feedback** — Do people want what you're planning?
4. **Price sensitivity** — How much are people willing to pay?
5. **Trends** — Is demand for your product growing or shrinking?

### Presenting your research

Include research findings in your project description. For example:

> "I surveyed 35 students at my school and 28 (80%) said they would buy healthy snacks at break time. The average they'd pay is £1.50. Currently, 0 healthy options are available in our canteen."

Numbers make your pitch credible!

### Top tip

Start with your school. You have access to hundreds of potential customers every day. A simple Google Form shared in registration can give you brilliant data in 24 hours.`,
      quiz: [
        {
          question: 'What is the difference between primary and secondary research?',
          options: [
            { text: 'Primary is more important than secondary', isCorrect: false },
            { text: 'Primary is data you collect yourself; secondary is already published data', isCorrect: true },
            { text: 'Primary uses the internet; secondary uses books', isCorrect: false },
            { text: 'Primary is done first; secondary is done second', isCorrect: false },
          ],
          explanation: 'Primary research is data you collect yourself (surveys, interviews, observations). Secondary research uses data that already exists (websites, statistics, reports). Both are valuable!',
        },
        {
          question: 'How many people should you aim to survey minimum?',
          options: [
            { text: '2-3 close friends', isCorrect: false },
            { text: '20 or more from your target audience', isCorrect: true },
            { text: 'Exactly 100 people', isCorrect: false },
            { text: '1 expert in the field', isCorrect: false },
          ],
          explanation: 'Aim for at least 20 people from your target audience. This gives you enough responses to spot patterns and make your findings credible for backers.',
        },
        {
          question: 'Which of these is a primary research method?',
          options: [
            { text: 'Reading market reports on Statista', isCorrect: false },
            { text: 'Checking Google Trends data', isCorrect: false },
            { text: 'Conducting face-to-face interviews with potential customers', isCorrect: true },
            { text: 'Looking up competitor prices online', isCorrect: false },
          ],
          explanation: 'Face-to-face interviews are primary research because you\'re collecting original data directly from potential customers. Websites and reports are secondary research.',
        },
        {
          question: 'Why should you include research findings in your project description?',
          options: [
            { text: 'To make your page longer and more detailed', isCorrect: false },
            { text: 'Because numbers and evidence make your pitch credible to backers', isCorrect: true },
            { text: 'Because Futurepreneurs requires a minimum word count', isCorrect: false },
            { text: 'To show off how much work you\'ve done', isCorrect: false },
          ],
          explanation: 'Real data makes your pitch credible. Saying "80% of 35 surveyed students would buy this" is far more convincing than "I think people will like it."',
        },
        {
          question: 'What is the "80/20 rule" for customer interviews?',
          options: [
            { text: 'Interview 80 people and survey 20', isCorrect: false },
            { text: 'Listen 80% of the time and talk 20% of the time', isCorrect: true },
            { text: 'Ask 80% closed questions and 20% open questions', isCorrect: false },
            { text: '80% of your customers will come from 20% of your marketing', isCorrect: false },
          ],
          explanation: 'In customer interviews, listen 80% of the time and talk 20% of the time. You\'re there to learn from them, not to pitch your idea. Their honest feedback is gold!',
        },
      ],
      tasks: [
        {
          id: 'create-survey',
          title: 'Create a Customer Survey',
          description: 'Design a 5-7 question survey about your business idea using Google Forms. Include a mix of yes/no questions and open-ended questions. Share it with at least 20 people.',
          type: 'exercise',
        },
        {
          id: 'competitor-research',
          title: 'Research 3 Competitors',
          description: 'Find 3 businesses that sell something similar to your idea. For each, note: what they sell, their prices, their strengths, and their weaknesses.',
          type: 'research',
        },
      ],
    },
    {
      id: 'goal-setting-tracking',
      title: 'Goal Setting & Performance Tracking',
      readingTime: 4,
      content: `## Goal Setting & Performance Tracking

Setting goals is one thing. Tracking whether you're hitting them is another. Real entrepreneurs measure their progress constantly — and you should too.

### SMART goals recap

Every goal should be:
- **S**pecific — "Sell 20 cupcakes at the school market on Friday"
- **M**easurable — You can count it
- **A**chievable — Realistic given your resources
- **R**elevant — Connected to your business success
- **T**ime-bound — Has a deadline

### Short, medium, and long-term goals

| Timeframe | Example |
|-----------|---------|
| Daily | Make 10 cupcakes, reply to 2 backer messages |
| Weekly | Sell 30 items, post 1 social media update |
| Monthly | Reach 75% funded, complete 2 milestones |
| Termly | Fully funded + first profit, expand product range |
| Yearly | Sustainable business, train a successor, start new project |

### Key Performance Indicators (KPIs)

KPIs are the numbers that tell you how your business is doing. Here are the most useful ones for young entrepreneurs:

**Sales KPIs:**
- Units sold per week
- Revenue per week
- Average order value
- Best-selling product

**Funding KPIs:**
- Percentage funded
- Number of backers
- Average backing amount
- Days since last backer

**Growth KPIs:**
- New customers this week vs. last week
- Repeat customers
- Social media followers
- Project page views

### A simple tracking template

| Week | Units Sold | Revenue | New Customers | Repeat Customers | Funding % |
|------|-----------|---------|---------------|-----------------|-----------|
| 1 | 15 | £22.50 | 15 | 0 | 25% |
| 2 | 22 | £33.00 | 12 | 10 | 40% |
| 3 | 28 | £42.00 | 8 | 20 | 55% |
| 4 | 35 | £52.50 | 10 | 25 | 72% |

### What your numbers tell you

- **Units growing?** → Your product is in demand
- **Revenue growing faster than units?** → Your average price is increasing (good!)
- **Repeat customers growing?** → People like what you're selling
- **Repeat higher than new?** → Great loyalty, but you need more marketing to find new customers

### Weekly review checklist

Every Sunday, spend 15 minutes reviewing your week:

1. Did I hit my goals? (yes/no for each)
2. What went well?
3. What didn't go well?
4. What will I do differently next week?
5. What are my goals for next week?

### Top tip

Track your numbers from day one — even if they're small. Looking back at your growth over time is incredibly motivating, and the data helps you make better decisions.`,
      quiz: [
        {
          question: 'What is a KPI?',
          options: [
            { text: 'A type of business plan', isCorrect: false },
            { text: 'A Key Performance Indicator — a number that shows how your business is doing', isCorrect: true },
            { text: 'A marketing strategy for social media', isCorrect: false },
            { text: 'A financial report for investors', isCorrect: false },
          ],
          explanation: 'KPI stands for Key Performance Indicator. KPIs are the important numbers you track to see how well your business is performing — like units sold, revenue, and customer growth.',
        },
        {
          question: 'If your repeat customers are growing but new customers are declining, what does this suggest?',
          options: [
            { text: 'Your business is failing', isCorrect: false },
            { text: 'Existing customers love your product, but you need more marketing to find new ones', isCorrect: true },
            { text: 'You should raise your prices', isCorrect: false },
            { text: 'You have too many products', isCorrect: false },
          ],
          explanation: 'Growing repeat customers means great product satisfaction! But declining new customers means you need to increase marketing efforts to reach people who haven\'t discovered you yet.',
        },
        {
          question: 'How often should you review your business performance?',
          options: [
            { text: 'Once a term', isCorrect: false },
            { text: 'Only when something goes wrong', isCorrect: false },
            { text: 'Weekly — spend 15 minutes every Sunday', isCorrect: true },
            { text: 'Every day for at least an hour', isCorrect: false },
          ],
          explanation: 'A weekly review of about 15 minutes is ideal. It\'s frequent enough to spot problems early but not so frequent that it becomes a burden. Consistency is key!',
        },
        {
          question: 'What should a weekly review include?',
          options: [
            { text: 'Only the things that went well', isCorrect: false },
            { text: 'Goal results, what went well, what didn\'t, lessons learned, and next week\'s goals', isCorrect: true },
            { text: 'Only financial numbers', isCorrect: false },
            { text: 'A comparison with competitors', isCorrect: false },
          ],
          explanation: 'A good weekly review covers: Did I hit my goals? What went well? What didn\'t? What will I change? What are next week\'s goals? This cycle of reflection drives improvement.',
        },
        {
          question: 'Why should you start tracking numbers from day one?',
          options: [
            { text: 'Because your teacher requires it', isCorrect: false },
            { text: 'Because looking back at growth is motivating and data helps you make better decisions', isCorrect: true },
            { text: 'Because investors always ask for historical data', isCorrect: false },
            { text: 'Because you need it for tax purposes', isCorrect: false },
          ],
          explanation: 'Tracking from day one lets you see your growth over time (very motivating!) and gives you real data to make better decisions about pricing, marketing, and product changes.',
        },
      ],
      tasks: [
        {
          id: 'set-goals',
          title: 'Set Your First Goals',
          description: 'Write one SMART goal for each timeframe: daily, weekly, monthly, and termly. Make sure each one is specific, measurable, achievable, relevant, and time-bound.',
          type: 'exercise',
        },
        {
          id: 'tracking-template',
          title: 'Create a Tracking Sheet',
          description: 'Set up a simple spreadsheet or notebook page to track your weekly KPIs: units sold, revenue, new customers, repeat customers, and funding percentage.',
          type: 'exercise',
        },
      ],
    },
  ],
};
