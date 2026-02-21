import type { LearningModule } from '@/types/learning';

export const entrepreneurialMindset: LearningModule = {
  id: 'entrepreneurial-mindset',
  title: 'The Entrepreneurial Mindset',
  description: 'Discover what makes an entrepreneur tick — growth mindset, creative problem solving, and spotting opportunities others miss.',
  icon: 'Lightbulb',
  colour: 'amber',
  sectionNumber: 1,
  lessons: [
    {
      id: 'think-like-a-founder',
      title: 'Think Like a Founder',
      readingTime: 4,
      content: `## Think Like a Founder

What makes an entrepreneur different from everyone else? It's not about being the smartest person in the room — it's about how you **think**.

### What is an entrepreneur?

An entrepreneur is someone who spots a problem or opportunity and takes action to do something about it. They don't wait for someone else to fix things — they roll up their sleeves and get started.

### The growth mindset

Psychologist Carol Dweck discovered that people tend to think in one of two ways:

- **Fixed mindset:** "I'm either good at something or I'm not. If I fail, it means I can't do it."
- **Growth mindset:** "I can get better at anything with effort and practice. Failure is just a step towards success."

Entrepreneurs almost always have a **growth mindset**. They see challenges as opportunities to learn, not reasons to give up.

### Traits of successful young entrepreneurs

1. **Curiosity** — They ask "why?" and "what if?" constantly
2. **Resilience** — They bounce back from setbacks instead of giving up
3. **Initiative** — They start things without being told to
4. **Empathy** — They understand what other people need
5. **Resourcefulness** — They find creative solutions with limited resources

### Busting the myths

| Myth | Reality |
|------|---------|
| You need lots of money to start | Many businesses start with £0-50 |
| You need to be an adult | Some of the best ideas come from young people |
| You need a unique, never-seen-before idea | Most successful businesses improve on existing ideas |
| Entrepreneurs are born, not made | Entrepreneurial skills can be learned by anyone |
| You have to do everything alone | The best entrepreneurs build teams and ask for help |

### Opportunity spotting

Entrepreneurs see opportunities everywhere. Try this exercise:

Look around your school for 5 minutes. What problems do you notice? Maybe the vending machine only sells unhealthy snacks. Maybe students struggle to find revision resources. Maybe there's nowhere to charge phones at lunchtime.

Every problem is a potential business idea!

### Top tip

Start a "problem diary." Every time you notice something annoying, inconvenient, or missing — write it down. After a week, you'll have a list of potential business ideas.`,
      quiz: [
        {
          question: 'What is a "growth mindset"?',
          options: [
            { text: 'Believing you\'re either naturally talented or you\'re not', isCorrect: false },
            { text: 'Believing you can improve at anything with effort and practice', isCorrect: true },
            { text: 'Focusing on growing your business as fast as possible', isCorrect: false },
            { text: 'Only working on things you\'re already good at', isCorrect: false },
          ],
          explanation: 'A growth mindset means believing you can get better at anything through effort and practice. Entrepreneurs use this mindset to push through challenges and learn from failure.',
        },
        {
          question: 'Which of these is a myth about entrepreneurship?',
          options: [
            { text: 'Entrepreneurs need empathy and curiosity', isCorrect: false },
            { text: 'Entrepreneurs can learn their skills over time', isCorrect: false },
            { text: 'You need lots of money to start a business', isCorrect: true },
            { text: 'Problems can be turned into business opportunities', isCorrect: false },
          ],
          explanation: 'Many successful businesses started with little or no money. You don\'t need to be rich to be an entrepreneur — you need a good idea and the determination to make it happen.',
        },
        {
          question: 'What is "opportunity spotting"?',
          options: [
            { text: 'Copying what successful businesses do', isCorrect: false },
            { text: 'Waiting for the perfect business idea to come to you', isCorrect: false },
            { text: 'Noticing everyday problems that could become business ideas', isCorrect: true },
            { text: 'Looking for supporters who want to fund your idea', isCorrect: false },
          ],
          explanation: 'Opportunity spotting means paying attention to problems, frustrations, and unmet needs around you. Every problem is a potential business idea waiting to be solved!',
        },
        {
          question: 'Which trait is most important for bouncing back from setbacks?',
          options: [
            { text: 'Intelligence', isCorrect: false },
            { text: 'Resilience', isCorrect: true },
            { text: 'Popularity', isCorrect: false },
            { text: 'Wealth', isCorrect: false },
          ],
          explanation: 'Resilience — the ability to bounce back from failure — is one of the most important traits of successful entrepreneurs. Every setback is a learning opportunity.',
        },
        {
          question: 'What is a good way to start finding business ideas?',
          options: [
            { text: 'Wait for inspiration to strike', isCorrect: false },
            { text: 'Copy the most popular business you can find', isCorrect: false },
            { text: 'Keep a "problem diary" noting everyday frustrations', isCorrect: true },
            { text: 'Ask an adult to give you an idea', isCorrect: false },
          ],
          explanation: 'A problem diary helps you actively notice opportunities. Write down problems you see every day — after a week, you\'ll have a list of potential business ideas to explore!',
        },
      ],
      tasks: [
        {
          id: 'problem-diary',
          title: 'Start a Problem Diary',
          description: 'Spend one day writing down every problem, frustration, or inconvenience you notice at school or at home. Try to spot at least 5.',
          type: 'exercise',
        },
        {
          id: 'mindset-reflection',
          title: 'Growth Mindset Reflection',
          description: 'Think about a time you failed at something. Write 2-3 sentences about what you learned from it and how you could try differently next time.',
          type: 'reflection',
        },
      ],
    },
    {
      id: 'creative-problem-solving',
      title: 'Creative Problem Solving & Design Thinking',
      readingTime: 5,
      content: `## Creative Problem Solving & Design Thinking

The best business ideas don't come from thin air — they come from deeply understanding a problem and creatively finding solutions. Design thinking is a powerful framework used by companies like Apple, Google, and IKEA.

### What is Design Thinking?

Design thinking is a 5-step process for solving problems creatively:

1. **Empathise** — Understand the people who have the problem
2. **Define** — Clearly describe what the problem actually is
3. **Ideate** — Come up with as many solutions as possible
4. **Prototype** — Build a quick, simple version to test
5. **Test** — Try it out, get feedback, and improve

### Step 1: Empathise

Before you can solve a problem, you need to truly understand the people experiencing it. This means:

- **Talking to people** — Ask open questions like "What frustrates you about...?"
- **Observing** — Watch how people behave (not just what they say)
- **Experiencing it yourself** — Try to experience the problem firsthand

### Step 2: Define

Turn your research into a clear problem statement:

> "[Who] needs [what] because [why]."

Example: "Year 10 students at my school need affordable healthy snacks because the canteen only sells crisps and chocolate."

### Step 3: Ideate

Now brainstorm as many solutions as possible. Rules of brainstorming:

- **No bad ideas** — Write everything down, even silly ones
- **Go for quantity** — Aim for 20+ ideas in 10 minutes
- **Build on others** — "Yes, and..." instead of "No, but..."
- **Think wild** — The craziest idea might lead to the best one

### Step 4: Prototype

A prototype is a quick, cheap version of your solution. It doesn't need to be perfect — it just needs to help you test the idea:

- A sketch on paper
- A sample of your product
- A mockup made from cardboard
- A simple survey or sign-up sheet

### Step 5: Test

Show your prototype to real people and ask:

- "Would you use this?"
- "How much would you pay?"
- "What would make it better?"

Use their feedback to improve, then test again. This cycle of build → test → improve is how great products are made.

### Customer-centric thinking

The most important rule: **your customer is not you**. What you like might not be what your audience likes. Always test your assumptions with real people.

### Top tip

You don't need to get it right first time. The whole point of design thinking is to test quickly, learn from feedback, and improve. Fail fast, learn faster!`,
      quiz: [
        {
          question: 'What are the 5 steps of Design Thinking in order?',
          options: [
            { text: 'Plan, Build, Sell, Review, Repeat', isCorrect: false },
            { text: 'Empathise, Define, Ideate, Prototype, Test', isCorrect: true },
            { text: 'Research, Design, Develop, Launch, Market', isCorrect: false },
            { text: 'Think, Create, Sell, Measure, Improve', isCorrect: false },
          ],
          explanation: 'The 5 steps are: Empathise (understand the user), Define (clarify the problem), Ideate (brainstorm solutions), Prototype (build a quick version), and Test (get feedback and improve).',
        },
        {
          question: 'What is the main goal of the "Empathise" step?',
          options: [
            { text: 'To feel sorry for people who have problems', isCorrect: false },
            { text: 'To deeply understand the people experiencing the problem', isCorrect: true },
            { text: 'To decide what product to build', isCorrect: false },
            { text: 'To calculate how much money you need', isCorrect: false },
          ],
          explanation: 'Empathise means deeply understanding the people who have the problem. Talk to them, observe them, and experience the problem yourself if possible.',
        },
        {
          question: 'What is a prototype?',
          options: [
            { text: 'The finished, polished version of your product', isCorrect: false },
            { text: 'A detailed business plan', isCorrect: false },
            { text: 'A quick, cheap version of your idea used for testing', isCorrect: true },
            { text: 'A professional presentation for supporters', isCorrect: false },
          ],
          explanation: 'A prototype is a quick, cheap version of your solution — it could be a sketch, a sample, or a cardboard mockup. The goal is to test your idea before investing lots of time and money.',
        },
        {
          question: 'What is the most important rule of brainstorming?',
          options: [
            { text: 'Only suggest ideas you\'re sure will work', isCorrect: false },
            { text: 'Let the smartest person lead the discussion', isCorrect: false },
            { text: 'No bad ideas — go for quantity and build on each other\'s ideas', isCorrect: true },
            { text: 'Keep it to exactly 5 ideas', isCorrect: false },
          ],
          explanation: 'During brainstorming, there are no bad ideas! The goal is quantity — even seemingly silly ideas can lead to breakthrough solutions. Say "yes, and..." instead of "no, but...".',
        },
        {
          question: 'Why is "your customer is not you" an important principle?',
          options: [
            { text: 'Because you shouldn\'t use your own products', isCorrect: false },
            { text: 'Because what you like might not be what your audience wants', isCorrect: true },
            { text: 'Because entrepreneurs should only focus on profit', isCorrect: false },
            { text: 'Because customers are always right about everything', isCorrect: false },
          ],
          explanation: 'Your personal preferences might be very different from your target audience\'s. Always test your assumptions with real people instead of assuming everyone thinks like you do.',
        },
      ],
      tasks: [
        {
          id: 'design-thinking-exercise',
          title: 'Design Thinking Challenge',
          description: 'Pick one problem from your problem diary. Write a problem statement in the format: "[Who] needs [what] because [why]." Then brainstorm at least 10 possible solutions in 5 minutes.',
          type: 'exercise',
        },
        {
          id: 'empathy-interview',
          title: 'Conduct an Empathy Interview',
          description: 'Ask 3 friends or family members: "What\'s something that annoys you about [your topic area]?" Write down their answers. What patterns do you notice?',
          type: 'research',
        },
      ],
    },
    {
      id: 'needs-vs-wants',
      title: 'Understanding Needs vs. Wants',
      readingTime: 4,
      content: `## Understanding Needs vs. Wants

Every successful business either fulfils a need or satisfies a want. Understanding the difference — and knowing which one your business targets — is essential.

### Needs vs. wants

- **Needs** are things people must have: food, water, shelter, clothing, education, healthcare
- **Wants** are things people would like to have: the latest phone, designer trainers, sweets, gaming subscriptions

Most student businesses focus on **wants** — and that's perfectly fine! People happily spend money on things that make them happy, save them time, or solve small daily frustrations.

### Goods vs. services

Your business will sell either **goods** (physical products) or **services** (things you do for people):

| Goods (Products) | Services |
|-------------------|----------|
| Handmade candles | Bike repair |
| Baked cakes | Tutoring |
| Printed T-shirts | Dog walking |
| Custom phone cases | Social media management |
| Friendship bracelets | Event photography |

Some businesses sell both! A bakery sells cakes (goods) and might also offer cake-decorating classes (service).

### Finding your target audience

Your target audience is the specific group of people most likely to buy from you. To find them, create a **customer persona**:

**Name:** "Sporty Sam"
**Age:** 15
**Interests:** Football, fitness, healthy eating
**Problem:** Wants healthy protein snacks but can only find junk food at school
**Budget:** £2-5 per week on snacks
**Where they hang out:** Sports clubs, school canteen, Instagram

### Why personas matter

A persona helps you make better decisions:

- **Product:** Sam wants healthy snacks → you make protein flapjacks, not cupcakes
- **Price:** Sam spends £2-5/week → you price flapjacks at £1.50 each
- **Marketing:** Sam uses Instagram → you promote there, not on Facebook
- **Messaging:** Sam cares about fitness → you highlight protein and energy, not taste alone

### Market size

Ask yourself: how many "Sams" are there? If your school has 1,000 students and 200 are into sport, that's 200 potential customers. If 10% buy from you weekly, that's 20 customers × £1.50 = **£30 per week**.

This simple calculation is called "sizing your market" — and it's exactly what real businesses do.

### Top tip

Talk to 5 people who match your target audience. Ask them: "Would you buy this? How much would you pay? What would make it better?" Their answers are more valuable than any guess.`,
      quiz: [
        {
          question: 'What is the difference between a need and a want?',
          options: [
            { text: 'Needs are expensive and wants are cheap', isCorrect: false },
            { text: 'Needs are essential for survival; wants are nice-to-have extras', isCorrect: true },
            { text: 'Needs come from adults and wants come from children', isCorrect: false },
            { text: 'There is no real difference between needs and wants', isCorrect: false },
          ],
          explanation: 'Needs are essentials like food, water, and shelter. Wants are nice-to-have items like sweets, games, or designer clothes. Most student businesses successfully sell wants!',
        },
        {
          question: 'What is a customer persona?',
          options: [
            { text: 'A fake review written to promote your business', isCorrect: false },
            { text: 'A detailed profile of your ideal customer including their age, interests, and habits', isCorrect: true },
            { text: 'A person who invests money in your business', isCorrect: false },
            { text: 'The name you use for your business', isCorrect: false },
          ],
          explanation: 'A customer persona is a fictional but realistic profile of your ideal customer. It includes their age, interests, problems, budget, and habits — helping you make better business decisions.',
        },
        {
          question: 'What is the difference between goods and services?',
          options: [
            { text: 'Goods are expensive and services are cheap', isCorrect: false },
            { text: 'Goods are physical products; services are things you do for people', isCorrect: true },
            { text: 'Goods are sold online and services are sold in person', isCorrect: false },
            { text: 'Goods are for businesses and services are for individuals', isCorrect: false },
          ],
          explanation: 'Goods are physical products you can touch (like cakes or candles). Services are actions you perform for others (like tutoring or dog walking). Some businesses sell both!',
        },
        {
          question: 'Why should you talk to people who match your target audience?',
          options: [
            { text: 'To convince them to buy before your product exists', isCorrect: false },
            { text: 'Because their real feedback is more valuable than your guesses', isCorrect: true },
            { text: 'To get free marketing through word of mouth', isCorrect: false },
            { text: 'Because your teacher requires it', isCorrect: false },
          ],
          explanation: 'Real feedback from potential customers is incredibly valuable. Their answers about pricing, preferences, and improvements will help you build something people actually want to buy.',
        },
        {
          question: 'If your school has 800 students and 15% might buy your product weekly at £2 each, what is your weekly revenue potential?',
          options: [
            { text: '£120', isCorrect: false },
            { text: '£240', isCorrect: true },
            { text: '£800', isCorrect: false },
            { text: '£160', isCorrect: false },
          ],
          explanation: '800 students × 15% = 120 potential customers. 120 × £2 = £240 per week. This is called "sizing your market" — estimating how many people might buy from you and how much they would spend.',
        },
      ],
      tasks: [
        {
          id: 'build-persona',
          title: 'Build a Customer Persona',
          description: 'Create a customer persona for your business idea. Include: name, age, interests, the problem they have, their budget, and where they hang out.',
          type: 'exercise',
        },
        {
          id: 'market-size',
          title: 'Size Your Market',
          description: 'Estimate how many people at your school might buy your product or service. Calculate: total students × percentage interested × price = weekly revenue potential.',
          type: 'research',
        },
      ],
    },
  ],
};
