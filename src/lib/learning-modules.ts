import type { LearningModule } from '@/types/learning';

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'business-plan',
    title: 'Business Plan Basics',
    description: 'Learn how to plan your business idea from scratch — who it\'s for, what you need, and how to make it work.',
    icon: 'Lightbulb',
    colour: 'amber',
    lessons: [
      {
        id: 'what-is-a-business-plan',
        title: 'What Is a Business Plan?',
        readingTime: 3,
        content: `## What Is a Business Plan?

A business plan is simply a written description of your business idea and how you're going to make it happen. Think of it as a roadmap — it helps you figure out where you're going and how to get there.

### Why do you need one?

- **Clarity:** Writing things down helps you think through your idea properly
- **Confidence:** When you explain your plan clearly, teachers, parents, and backers trust you more
- **Direction:** A good plan stops you from getting lost or spending money on the wrong things

### What goes in a business plan?

At its simplest, a business plan answers five questions:

1. **What** is your product or service?
2. **Who** is it for? (your audience)
3. **Why** would people want it?
4. **How** will you make it happen?
5. **How much** will it cost?

Don't worry — you don't need a 50-page document. On Futurepreneurs, your project page IS your business plan. We'll help you fill in each part step by step.

### Top tip

The best business plans are **simple and honest**. You don't need fancy words — just tell people what you want to do and why it matters to you.`,
        quiz: {
          question: 'What is the main purpose of a business plan?',
          options: [
            { text: 'To impress adults with big words', isCorrect: false },
            { text: 'To help you think through your idea and show others how it works', isCorrect: true },
            { text: 'To guarantee your business will succeed', isCorrect: false },
            { text: 'To make your project look professional even if you haven\'t thought it through', isCorrect: false },
          ],
          explanation: 'A business plan helps you think clearly about your idea and shows others (backers, teachers, parents) that you\'ve planned it properly. It doesn\'t guarantee success, but it gives you the best chance!',
        },
      },
      {
        id: 'know-your-audience',
        title: 'Know Your Audience',
        readingTime: 3,
        content: `## Know Your Audience

Your audience is the group of people who will want to buy your product or use your service. Understanding them is one of the most important parts of building a business.

### Why does your audience matter?

Imagine you're making friendship bracelets. If your audience is 8-year-olds, you'd use bright, fun colours. If your audience is adults, you might use more elegant designs. Knowing your audience changes everything about how you make and sell your product.

### How to figure out your audience

Ask yourself these questions:

1. **Who has the problem I'm solving?** (e.g. "People who want unique, handmade gifts")
2. **How old are they?** (Kids? Teens? Adults? Everyone?)
3. **Where do they live?** (Your school? Your town? Online?)
4. **How much would they pay?** (50p? £5? £20?)
5. **Where do they hang out?** (School? Social media? Local markets?)

### A quick exercise

Try filling in this sentence:

> "My product/service is for **[who]** who want **[what]** because **[why]**."

For example: "My product is for **students at my school** who want **healthy snacks** because **the school canteen doesn't sell many healthy options**."

### Top tip

Talk to real people! Ask friends, family, or classmates if they'd be interested in your idea. Their honest feedback is worth more than any guess.`,
        quiz: {
          question: 'Why is it important to know your audience?',
          options: [
            { text: 'So you can charge them the highest possible price', isCorrect: false },
            { text: 'So you can design your product and marketing to match what they actually want', isCorrect: true },
            { text: 'You don\'t really need to — just make something cool and people will come', isCorrect: false },
            { text: 'So your teacher gives you a better grade', isCorrect: false },
          ],
          explanation: 'Knowing your audience helps you create something people actually want, price it right, and tell them about it in the right way. It\'s the foundation of a good business!',
        },
      },
      {
        id: 'setting-goals',
        title: 'Setting Realistic Goals',
        readingTime: 3,
        content: `## Setting Realistic Goals

A goal is what you want to achieve. In business, the most important goal is your **funding goal** — how much money you need to get started.

### How to set the right funding goal

Setting your goal too high means you might never reach it. Setting it too low means you won't have enough money to do what you planned. Here's how to get it right:

1. **List everything you need** — Write down every single thing you'll need to spend money on
2. **Research prices** — Look up real prices online or in shops. Don't guess!
3. **Add a small buffer** — Things often cost a bit more than expected. Add 10-15% extra
4. **Be honest** — Only ask for what you genuinely need

### Example: Bake Sale Business

| Item | Cost |
|------|------|
| Ingredients (first batch) | £30 |
| Packaging (boxes, labels) | £15 |
| Market stall fee (2 weeks) | £20 |
| Flyers and signs | £10 |
| **Total** | **£75** |
| Buffer (15%) | £11 |
| **Funding goal** | **£86** |

You might round this up to **£90** for a clean number.

### Common mistakes

- **Asking for too much** — "I need £5,000 for a lemonade stand" won't convince anyone
- **Forgetting hidden costs** — Packaging, transport, and marketing add up
- **Not researching** — Guessing prices leads to problems later

### Top tip

On Futurepreneurs, your maximum goal is £10,000 — but most successful student projects are between £50 and £500. Start small, prove your idea works, and you can always do a second campaign later!`,
        quiz: {
          question: 'What\'s the best way to set your funding goal?',
          options: [
            { text: 'Pick the highest number you can because more money is always better', isCorrect: false },
            { text: 'List everything you need, research real prices, and add a small buffer', isCorrect: true },
            { text: 'Just pick a round number that sounds good', isCorrect: false },
            { text: 'Copy the goal from a similar project', isCorrect: false },
          ],
          explanation: 'The best funding goals are based on real research. List your costs, look up actual prices, and add a small buffer for unexpected expenses. This shows backers you\'ve thought it through!',
        },
      },
      {
        id: 'budgeting-basics',
        title: 'Budgeting Basics',
        readingTime: 3,
        content: `## Budgeting Basics

A budget is a plan for how you'll spend your money. It's one of the most important skills you'll learn — not just for your business, but for life!

### The golden rule of budgeting

**Never spend money you haven't planned for.**

When your project gets funded, you'll receive money through milestones. Each milestone has a set amount for a specific purpose. Stick to the plan!

### How milestones work on Futurepreneurs

When you create your project, you set milestones like:

- **Milestone 1:** Buy ingredients — £30
- **Milestone 2:** Buy packaging — £15
- **Milestone 3:** Pay for market stall — £20

Once your project is funded, you request a drawdown for each milestone. Your teacher checks it and approves the spending. This keeps everything safe and organised.

### Tracking your spending

Keep a simple record of every penny you spend:

| Date | What | Amount | Milestone |
|------|------|--------|-----------|
| 1 March | Flour and sugar | £12.50 | Ingredients |
| 1 March | Eggs and butter | £8.00 | Ingredients |
| 3 March | Cake boxes (x50) | £14.50 | Packaging |

### Tips for staying on budget

1. **Compare prices** — Check at least 2-3 shops or websites before buying
2. **Keep receipts** — You'll need to show your teacher what you spent
3. **Don't impulse buy** — If it's not in your milestone plan, don't buy it
4. **Ask for help** — Your teacher mentor is there to guide you

### Top tip

If something costs more than expected, talk to your teacher before spending. They can help you find alternatives or adjust your plan.`,
        quiz: {
          question: 'What should you do if something costs more than you budgeted?',
          options: [
            { text: 'Just spend the extra money and hope nobody notices', isCorrect: false },
            { text: 'Give up on the whole project', isCorrect: false },
            { text: 'Talk to your teacher and find alternatives or adjust the plan', isCorrect: true },
            { text: 'Ask backers for more money', isCorrect: false },
          ],
          explanation: 'Your teacher mentor is there to help! If costs change, talk to them. They can help you find cheaper alternatives or adjust your milestones. Communication is key.',
        },
      },
      {
        id: 'putting-it-together',
        title: 'Putting It All Together',
        readingTime: 3,
        content: `## Putting It All Together

You now know the four building blocks of a business plan:

1. **Your idea** — what you're making or doing
2. **Your audience** — who it's for
3. **Your goals** — what you want to achieve
4. **Your budget** — how you'll spend the money

### Your Futurepreneurs project page

When you create a project on Futurepreneurs, you're actually building your business plan! Here's how each part maps:

| Business Plan Element | Futurepreneurs Field |
|----------------------|---------------------|
| Your idea | Title + Description |
| Your audience | Short description + Category |
| Your goals | Funding goal |
| Your budget | Milestones |
| Your story | Images + Video |
| Your credibility | Teacher mentor + School |

### Before you start your project

Run through this quick checklist:

- [ ] I can explain my idea in one sentence
- [ ] I know who my audience is
- [ ] I've researched real prices for everything I need
- [ ] My funding goal matches my actual costs
- [ ] I've broken my budget into clear milestones
- [ ] I've talked to at least 3 people about my idea
- [ ] I have a teacher who's willing to mentor me

### You're ready!

If you can tick all those boxes, you're ready to create your project. Remember — your first project doesn't have to be perfect. The most important thing is to **start, learn, and improve**.

Good luck, future entrepreneur! 🚀`,
        quiz: {
          question: 'What are the four building blocks of a business plan?',
          options: [
            { text: 'Logo, website, social media, and a cool name', isCorrect: false },
            { text: 'Your idea, your audience, your goals, and your budget', isCorrect: true },
            { text: 'Money, time, a team, and luck', isCorrect: false },
            { text: 'Research, development, marketing, and sales', isCorrect: false },
          ],
          explanation: 'The four building blocks are: your idea (what you\'re doing), your audience (who it\'s for), your goals (what you want to achieve), and your budget (how you\'ll spend the money). Simple!',
        },
      },
    ],
  },
  {
    id: 'pitch-writing',
    title: 'Pitch Writing',
    description: 'Write a campaign pitch that makes people want to support you — hook them, tell your story, and inspire action.',
    icon: 'PenLine',
    colour: 'blue',
    lessons: [
      {
        id: 'hook-your-audience',
        title: 'Hook Your Audience',
        readingTime: 3,
        content: `## Hook Your Audience

You have about 5 seconds to grab someone's attention on your project page. That's it. If your opening line is boring, people will scroll past.

### What makes a great hook?

A hook is your opening line — the very first thing people read. Great hooks do one of these things:

- **Ask a question** — "Have you ever wanted fresh cookies delivered to your classroom?"
- **State a surprising fact** — "Every year, 400 million plastic bottles end up in UK landfills"
- **Tell a mini-story** — "Last summer, I couldn't find anywhere to get my bike fixed. So I decided to learn how to do it myself."
- **Show the problem** — "Our school doesn't have a single recycling bin in the canteen"

### Examples of good vs bad hooks

| Bad hook ❌ | Good hook ✅ |
|------------|------------|
| "I want to start a business" | "What if your school had its own student-run cafe?" |
| "Please give me money for my project" | "I'm on a mission to plant 100 trees in our town by summer" |
| "Hello, my name is..." | "Did you know most students throw away 2 perfectly good pens every week?" |

### Your short description

On Futurepreneurs, your **short description** is your hook. It appears on your project card in the browse page. Keep it:

- **Under 150 characters** (about one sentence)
- **Exciting and clear**
- **Focused on the benefit** or the problem you're solving

### Top tip

Read your hook out loud. If it doesn't make YOU excited, rewrite it until it does!`,
        quiz: {
          question: 'Which of these is the best hook for a project page?',
          options: [
            { text: 'Hi, my name is Alex and I want some money for my business', isCorrect: false },
            { text: 'What if your school canteen served fresh smoothies made by students — every single day?', isCorrect: true },
            { text: 'I am going to make smoothies and sell them', isCorrect: false },
            { text: 'Please donate to my smoothie project, thank you', isCorrect: false },
          ],
          explanation: 'The best hook asks an exciting question that makes the reader imagine the outcome. It\'s specific, visual, and makes you want to know more!',
        },
      },
      {
        id: 'tell-your-story',
        title: 'Tell Your Story',
        readingTime: 4,
        content: `## Tell Your Story

People don't just back projects — they back **people**. Your story is what connects backers to you and makes them want to help.

### The story structure

Every great campaign story follows this simple pattern:

1. **The Problem** — What's wrong? What's missing? What needs to change?
2. **Your Solution** — What are you going to do about it?
3. **Why You** — Why are YOU the right person to do this?
4. **The Plan** — How exactly will you make it happen?
5. **The Ask** — What do you need from backers?

### Example story

> **The Problem:** "Our school doesn't have any after-school clubs for students interested in coding. Most of us can't afford expensive coding courses outside school."
>
> **The Solution:** "I want to start a free weekly coding club using Raspberry Pi computers that any student can join."
>
> **Why Me:** "I've been learning to code since I was 11 and I've already built three apps. I want to share what I've learned with others."
>
> **The Plan:** "With £200, I'll buy 10 Raspberry Pi kits, a monitor, and cables. My computer science teacher, Mr Williams, has agreed to let us use his classroom on Thursdays after school."
>
> **The Ask:** "Back this project to help us buy the equipment. Every £20 funds one Raspberry Pi kit for a student to learn on."

### Writing tips

- **Be specific** — "10 Raspberry Pi kits" is better than "some equipment"
- **Be personal** — Share why this matters to YOU
- **Be honest** — Don't exaggerate or make promises you can't keep
- **Use short paragraphs** — Big blocks of text are hard to read
- **Add images** — A photo of you, your prototype, or your team makes it real

### Top tip

Imagine you're explaining your project to a friendly adult who's never heard of it before. That's the tone you want — clear, enthusiastic, and honest.`,
        quiz: {
          question: 'What\'s the most important thing about telling your story?',
          options: [
            { text: 'Using the longest and most impressive words you can find', isCorrect: false },
            { text: 'Making up exciting details to sound more impressive', isCorrect: false },
            { text: 'Being specific, personal, and honest about your idea and why it matters to you', isCorrect: true },
            { text: 'Keeping it as short as possible — one sentence is enough', isCorrect: false },
          ],
          explanation: 'The best stories are specific (real details, real numbers), personal (why it matters to you), and honest (no exaggeration). People connect with authenticity!',
        },
      },
      {
        id: 'show-your-numbers',
        title: 'Show Your Numbers',
        readingTime: 3,
        content: `## Show Your Numbers

Backers want to know their money will be spent wisely. Showing clear numbers builds trust and makes people more likely to support you.

### What numbers should you share?

1. **Your funding goal** — How much you need in total
2. **Your milestone breakdown** — What each chunk of money is for
3. **Specific costs** — Real prices you've researched
4. **What each backing amount buys** — "£10 pays for one week's ingredients"

### Making numbers easy to understand

Don't just say "I need £300." Break it down:

> **£300 will buy:**
> - £120 — Ingredients for 200 cupcakes (4 weeks)
> - £60 — Professional packaging and labels
> - £50 — A folding table for the school market
> - £40 — Marketing materials (flyers, posters)
> - £30 — Buffer for unexpected costs

This is much more convincing because backers can see exactly where their money goes.

### The power of "your £10 buys..."

Tell backers what their specific contribution achieves:

- "**£5** buys enough flour for 20 cupcakes"
- "**£10** pays for one student's Raspberry Pi kit"
- "**£25** covers a month of market stall fees"
- "**£50** funds our entire packaging design"

This makes the donation feel real and tangible.

### Top tip

Always round your milestone amounts to nice numbers. "£50 for ingredients" is clearer than "£47.63 for ingredients." Use the buffer milestone to absorb the rounding.`,
        quiz: {
          question: 'Why should you break down your funding goal into specific costs?',
          options: [
            { text: 'Because Futurepreneurs forces you to', isCorrect: false },
            { text: 'Because it shows backers exactly where their money goes, which builds trust', isCorrect: true },
            { text: 'Because it makes your page look longer and more impressive', isCorrect: false },
            { text: 'It doesn\'t really matter — just pick a number', isCorrect: false },
          ],
          explanation: 'Breaking down costs shows backers you\'ve done your research and planned carefully. It builds trust — which is the most important thing when asking people to fund your idea.',
        },
      },
      {
        id: 'call-to-action',
        title: 'Call to Action',
        readingTime: 3,
        content: `## Call to Action

A "call to action" (CTA) is the part of your pitch where you ask people to do something specific. Without it, people might read your whole story and then... do nothing.

### What makes a great call to action?

Your CTA should be:

- **Clear** — Tell people exactly what to do
- **Urgent** — Give them a reason to act now
- **Personal** — Make them feel their contribution matters
- **Grateful** — Show appreciation in advance

### Examples

**Weak CTA:** "Please donate if you can."

**Strong CTA:** "Back this project today and help us bring fresh smoothies to 500 students this term. Every pound gets us closer to our first blender!"

**Even stronger:** "We're 60% of the way there with just 2 weeks to go! Your £10 today could be the push that gets us over the finish line. Will you help?"

### Where to put your call to action

1. **At the end of your description** — After telling your story, ask for support
2. **In your short description** — A mini-CTA in your project card hook
3. **In project updates** — Remind backers to share with friends

### Sharing is powerful too

Not everyone can donate money, but everyone can share. Add a line like:

> "Can't back us right now? Sharing this project with one friend makes a huge difference too!"

### Top tip

Thank people BEFORE they donate. Something like "Thank you for even reading this far — it means the world to us" makes backers feel valued and more likely to contribute.`,
        quiz: {
          question: 'What makes a strong call to action?',
          options: [
            { text: 'Being vague so people don\'t feel pressured', isCorrect: false },
            { text: 'Being clear about what you want people to do and why it matters', isCorrect: true },
            { text: 'Asking for money as many times as possible', isCorrect: false },
            { text: 'Saying "please" a lot', isCorrect: false },
          ],
          explanation: 'A strong call to action is clear (tells people exactly what to do), shows why their support matters, and creates a sense of urgency. Be specific and grateful!',
        },
      },
      {
        id: 'recording-a-video-pitch',
        title: 'How to Record a Video Pitch',
        readingTime: 4,
        content: `## How to Record a Video Pitch

A video pitch is one of the most powerful tools you can add to your project page. Projects with video raise significantly more than those without. Here's how to create a great one — using just your phone.

### Why video works

- **Personal connection** — Backers see the real person behind the project
- **Show, don't tell** — Demonstrate your product or prototype
- **Energy and passion** — Your excitement comes through in a way text can't capture
- **Trust** — A real person on camera builds confidence

### What to include in your video

Keep it short — **60 to 90 seconds** is ideal. Here's a simple structure:

1. **Introduce yourself** (5 seconds) — "Hi, I'm [display name] and I'm a student at [city, not school name]"
2. **The problem** (10 seconds) — What problem are you solving?
3. **Your solution** (15 seconds) — What's your product or service?
4. **Show it** (15 seconds) — Hold up a prototype, demo it, or show your workspace
5. **The ask** (10 seconds) — "I'm raising £[amount] on Futurepreneurs to make this happen"
6. **Call to action** (5 seconds) — "Back my project today and help me get started!"

### Recording tips

- **Use your phone** — Modern phone cameras are great. No fancy equipment needed
- **Horizontal mode** — Turn your phone sideways (landscape) for best results
- **Good lighting** — Face a window so natural light falls on your face. Never have a window behind you
- **Quiet space** — Record somewhere without background noise
- **Eye contact** — Look at the camera lens, not the screen
- **Multiple takes** — Record 3-5 takes and pick the best one

### Safety rules for video

- **Use your display name**, not your real full name
- **Don't mention your school name** — Say your city or area instead
- **Don't show your school uniform** or any identifying logos
- **Don't show personal info** in the background (letters, screens, addresses)
- **Get parent permission** before recording and uploading

### Uploading your video

1. Upload your video to **YouTube** (set it to "Unlisted" so only people with the link can watch)
2. Or upload to **Vimeo** (also supports privacy settings)
3. Paste the link into your project's video field on Futurepreneurs
4. Your video will be embedded directly on your project page in privacy-enhanced mode

### Top tip

Practice your script 5 times before recording. You don't need to memorise it word-for-word — just know the key points. The best video pitches feel natural and enthusiastic, not rehearsed.`,
        quiz: {
          question: 'What\'s the ideal length for a project video pitch?',
          options: [
            { text: '5-10 seconds — keep it super short', isCorrect: false },
            { text: '60-90 seconds — long enough to explain, short enough to hold attention', isCorrect: true },
            { text: '5-10 minutes — cover everything in detail', isCorrect: false },
            { text: 'Length doesn\'t matter at all', isCorrect: false },
          ],
          explanation: '60 to 90 seconds is the sweet spot. It\'s long enough to introduce yourself, explain your idea, and make the ask — but short enough that people watch the whole thing. Attention spans are short!',
        },
      },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing Your Project',
    description: 'Get the word out about your campaign — from social media to good old word of mouth.',
    icon: 'Megaphone',
    colour: 'purple',
    lessons: [
      {
        id: 'social-media-basics',
        title: 'Social Media Basics',
        readingTime: 3,
        content: `## Social Media Basics

Social media is one of the best (and free!) ways to spread the word about your project. But you need to be smart about it.

### Which platforms work best?

- **Instagram** — Great for visual projects (food, crafts, fashion). Use Stories and Reels
- **TikTok** — Perfect for behind-the-scenes videos and showing your personality
- **WhatsApp** — Share your project link in family and school groups
- **Facebook** — Good for reaching parents, family friends, and local community groups

### Safety first!

Since you're under 18, follow these rules:

- **Never share personal details** — No home address, phone number, or school name
- **Use your Futurepreneurs display name** — Not your real name
- **Ask your parent/teacher** before posting anything publicly
- **Don't respond to strangers** in DMs — If someone wants to help, point them to your Futurepreneurs page

### What to post

1. **Launch day** — "I just launched my project on Futurepreneurs! Link in bio"
2. **Behind the scenes** — Photos/videos of you working on your idea
3. **Progress updates** — "We're 50% funded! Thank you!!"
4. **Milestone celebrations** — Share when you hit funding milestones
5. **Thank yous** — Shout out your supporters (without revealing personal info)

### Top tip

The share buttons on your Futurepreneurs project page make this easy — one tap to share on Twitter, Facebook, or WhatsApp with a pre-written message and link.`,
        quiz: {
          question: 'What\'s the most important safety rule when promoting your project on social media?',
          options: [
            { text: 'Post as often as possible to get maximum views', isCorrect: false },
            { text: 'Never share personal details like your home address, phone number, or school name', isCorrect: true },
            { text: 'Accept all friend requests to grow your audience', isCorrect: false },
            { text: 'Use your real name so people trust you more', isCorrect: false },
          ],
          explanation: 'Safety always comes first! Never share personal details online. Use your Futurepreneurs display name and point people to your project page for everything else.',
        },
      },
      {
        id: 'word-of-mouth',
        title: 'Word of Mouth',
        readingTime: 3,
        content: `## Word of Mouth

Word of mouth is the oldest and most powerful form of marketing. It's when people tell other people about your project. It's free, trusted, and incredibly effective.

### Why word of mouth works

People trust recommendations from friends and family more than any advert. If your mate tells you about an amazing student project, you're much more likely to check it out than if you saw a random post online.

### How to get people talking

1. **Tell everyone you know** — Friends, family, neighbours, your parents' friends
2. **Ask your school** — Can your teacher mention it in assembly? Can you put up a poster?
3. **Make it easy to share** — Give people a simple link to send to others
4. **Create a one-liner** — Have a quick sentence that explains your project (your "elevator pitch")
5. **Ask for shares, not just donations** — "Even if you can't donate, could you send the link to 3 people?"

### Your elevator pitch

An elevator pitch is a 10-second explanation of your project. Practice this:

> "I'm raising £[amount] on Futurepreneurs to [what you're doing]. It's [why it matters]. You can check it out at [your project link]."

Example: "I'm raising £150 on Futurepreneurs to start a bike repair service at school. Loads of students have broken bikes and can't afford repairs. You can check it out at futurepreneurs.co/my-project."

### Top tip

The best time to ask someone to share your project is right after you've told them about it and they look interested. Don't wait — ask while they're excited!`,
        quiz: {
          question: 'What is the most effective thing to ask people who can\'t donate money?',
          options: [
            { text: 'Nothing — they can\'t help if they can\'t donate', isCorrect: false },
            { text: 'To share your project link with 3 other people', isCorrect: true },
            { text: 'To donate a smaller amount instead', isCorrect: false },
            { text: 'To follow you on social media', isCorrect: false },
          ],
          explanation: 'Sharing is incredibly valuable! One share can reach someone who does want to donate. Asking people to share with even 3 friends can create a chain reaction that brings in new backers.',
        },
      },
      {
        id: 'visual-presentation',
        title: 'Visual Presentation',
        readingTime: 3,
        content: `## Visual Presentation

People process images 60,000 times faster than text. Great visuals can make the difference between someone scrolling past your project and someone clicking to learn more.

### What images to include

1. **A hero image** — The main photo that appears on your project card. Make it eye-catching!
2. **Product photos** — If you're making something, show it (or a prototype)
3. **Behind the scenes** — You working on your project, your workspace, materials
4. **Your team** — If it's a group project, show the team (but remember — use display names, not real names)

### Tips for great photos

- **Good lighting** — Natural light (near a window) is best. Avoid harsh shadows
- **Clean background** — A messy background distracts from your subject
- **Get close** — Fill the frame with your subject. Don't stand too far away
- **Show scale** — If your product is small, hold it in your hand so people can see the size
- **Take many, choose few** — Take 20 photos, pick the best 3-5

### Image safety rules

- **No school uniforms** with visible school logos or names
- **No location-identifying landmarks** that could reveal your school or home
- **No personal information** visible in the background (letters, screens, etc.)
- **Get permission** before including other people in photos

### Free tools for better images

- **Canva** (canva.com) — Free graphic design with templates
- **Remove.bg** — Remove photo backgrounds for free
- Your phone's built-in **crop and brightness** tools

### Top tip

Your project card image is the FIRST thing people see when browsing. Spend extra time making it perfect — it's the most important image on your entire campaign.`,
        quiz: {
          question: 'What\'s the most important image on your project page?',
          options: [
            { text: 'A selfie of you smiling', isCorrect: false },
            { text: 'Your hero image — the main photo on your project card', isCorrect: true },
            { text: 'A logo', isCorrect: false },
            { text: 'A photo of money', isCorrect: false },
          ],
          explanation: 'Your hero image (the main project card photo) is what people see first when browsing. An eye-catching hero image is the single biggest factor in getting people to click on your project!',
        },
      },
      {
        id: 'engaging-updates',
        title: 'Updates That Engage',
        readingTime: 3,
        content: `## Updates That Engage

Once your project is live, posting updates keeps backers excited and can attract new supporters. Think of updates as mini-stories that show your progress.

### When to post updates

- **Launch day** — Thank early backers, share your excitement
- **25% funded** — Show momentum, thank supporters
- **50% funded** — "Halfway there!" is a big milestone
- **75% funded** — Create urgency — "Almost there, help us cross the finish line!"
- **Fully funded!** — Celebrate and thank everyone
- **When you hit milestones** — Show what you're doing with the money

### What makes a great update

Every update should include:

1. **Progress** — Where are you now? What's happened since last time?
2. **Gratitude** — Thank your backers by name (display names only!)
3. **What's next** — What are you working on? What's the next milestone?
4. **A photo or video** — Visual proof of progress

### Example update

> **"We're 60% funded — first batch of ingredients ordered!"**
>
> Amazing news! Thanks to 12 incredible backers, we've hit £90 of our £150 goal. This week, I used our first milestone funds to order flour, sugar, and baking equipment from our local supplier.
>
> [Photo of ingredients laid out]
>
> Next up: packaging! Once we hit £120, I'll order our custom cake boxes with our logo on them.
>
> Thank you to everyone who's backed us so far — you're making this happen!

### Top tip

Consistent updates show backers their money is being used well. Even a quick "Here's what we did this week" goes a long way.`,
        quiz: {
          question: 'What are the key ingredients of a good project update?',
          options: [
            { text: 'Just asking for more donations', isCorrect: false },
            { text: 'Progress, gratitude, what\'s next, and a photo or video', isCorrect: true },
            { text: 'A long essay about your business plans', isCorrect: false },
            { text: 'Complaining about things that went wrong', isCorrect: false },
          ],
          explanation: 'Great updates show progress (what\'s happened), express gratitude (thank backers), preview what\'s next, and include a visual. This keeps backers engaged and attracts new supporters!',
        },
      },
    ],
  },
  {
    id: 'managing-money',
    title: 'Managing Your Money',
    description: 'Learn how milestones, drawdowns, and responsible spending work — skills you\'ll use for life.',
    icon: 'PiggyBank',
    colour: 'emerald',
    lessons: [
      {
        id: 'what-are-milestones',
        title: 'What Are Milestones?',
        readingTime: 3,
        content: `## What Are Milestones?

Milestones are the building blocks of your project budget. Instead of getting all your money at once, you break your funding goal into smaller chunks — each tied to a specific purpose.

### Why milestones matter

Imagine you raised £200 and got it all at once. It would be tempting to spend it quickly, and you might not track where it goes. Milestones prevent that by:

- **Keeping you organised** — Each milestone has a clear purpose
- **Building trust** — Backers can see exactly what their money is for
- **Teaching responsibility** — You learn to plan and manage spending
- **Protecting you** — Your teacher reviews each spending request

### How milestones work on Futurepreneurs

1. **You set them** when creating your project (e.g., "Buy ingredients — £50")
2. **They must add up** to your total funding goal
3. **Once funded**, you request drawdowns against each milestone
4. **Your teacher approves** each drawdown before you get the money

### Example milestones

For a £200 student bakery project:

| Milestone | Amount | Purpose |
|-----------|--------|---------|
| Ingredients | £60 | Flour, sugar, eggs, butter for first 3 batches |
| Equipment | £40 | Baking trays, mixing bowls, cake tins |
| Packaging | £50 | Boxes, labels, ribbon |
| Marketing | £30 | Flyers, posters, sample giveaways |
| Buffer | £20 | Unexpected costs |

### Tips for great milestones

- **Be specific** — "Buy 50 cake boxes from CakeCraft" is better than "Buy stuff"
- **Order them logically** — What do you need first? Put that first
- **Include a buffer** — Things always cost a bit more than expected
- **Keep them reasonable** — 3-6 milestones is ideal. Too many gets confusing

### Top tip

Your milestones tell backers a story about HOW you'll build your business. Well-planned milestones show maturity and planning — which makes people more likely to support you.`,
        quiz: {
          question: 'What\'s the main benefit of breaking your budget into milestones?',
          options: [
            { text: 'It makes your project look more professional', isCorrect: false },
            { text: 'It keeps your spending organised, builds trust, and teaches responsibility', isCorrect: true },
            { text: 'It lets you hide some money for yourself', isCorrect: false },
            { text: 'It\'s just a rule — it doesn\'t really help', isCorrect: false },
          ],
          explanation: 'Milestones keep your spending organised, show backers where their money goes, and teach you real budgeting skills. They\'re one of the most important features of Futurepreneurs!',
        },
      },
      {
        id: 'requesting-drawdowns',
        title: 'Requesting Drawdowns',
        readingTime: 3,
        content: `## Requesting Drawdowns

A drawdown is when you request to use some of your funded money. It's like asking your teacher to unlock a specific amount from your project budget so you can make a purchase.

### How the drawdown process works

1. **You make a request** — Go to your project, choose a milestone, enter the amount and reason
2. **Your teacher reviews it** — They check it makes sense for your project
3. **Teacher approves or asks questions** — If approved, the money is released
4. **You make the purchase** — Buy what you planned
5. **Keep the receipt** — You'll need it for your records

### When to request a drawdown

- When you're **ready to make a specific purchase** (not in advance)
- When the amount matches your milestone plan
- When you've **researched the best price**

### Writing a good drawdown reason

Your teacher needs to understand what you're buying and why. Be clear:

**Bad:** "I need money for stuff"
**Good:** "I need £30 to buy 5kg flour, 2kg sugar, and 30 eggs from Tesco for our first batch of 100 cupcakes"

### What if your teacher asks questions?

That's normal and healthy! They might ask:

- "Can you find it cheaper somewhere else?"
- "Is this the right quantity?"
- "Does this match your milestone plan?"

Answer honestly and provide links or screenshots of prices if you can.

### Top tip

Don't request all your milestone money at once. Request what you need now, make the purchase, then request the next amount when you need it. This shows great financial discipline!`,
        quiz: {
          question: 'When is the best time to request a drawdown?',
          options: [
            { text: 'As soon as your project is funded — get all the money quickly', isCorrect: false },
            { text: 'When you\'re ready to make a specific purchase and you\'ve researched the best price', isCorrect: true },
            { text: 'At the end of the project when you\'ve finished everything', isCorrect: false },
            { text: 'Whenever you feel like it', isCorrect: false },
          ],
          explanation: 'Request drawdowns when you\'re actually ready to buy something specific. Research the price first, write a clear reason, and only request what you need right now. This shows great financial responsibility!',
        },
      },
      {
        id: 'tracking-spending',
        title: 'Tracking Your Spending',
        readingTime: 3,
        content: `## Tracking Your Spending

Keeping track of how you spend your project money is one of the most important skills you'll learn. It's not just about following rules — it's about building a habit that will help you throughout your life.

### Why track spending?

- **Accountability** — Your backers trusted you with their money
- **Proof** — You can show exactly how funds were used
- **Learning** — You'll discover patterns in your spending
- **Planning** — Tracking helps you predict future costs better

### Simple spending tracker

You can use a notebook, a spreadsheet, or even your phone's notes app:

| Date | Item | Shop/Supplier | Amount | Milestone | Receipt? |
|------|------|---------------|--------|-----------|----------|
| 5 Mar | Flour (5kg) | Tesco | £3.50 | Ingredients | Yes |
| 5 Mar | Sugar (2kg) | Tesco | £1.80 | Ingredients | Yes |
| 7 Mar | Cake boxes x50 | Amazon | £12.99 | Packaging | Yes |

### The receipt rule

**Always keep your receipts.** Whether it's a paper receipt or a digital one:

- Take a photo of every paper receipt immediately (they fade!)
- Save email receipts in a dedicated folder
- Write on each receipt what it was for and which milestone it belongs to

### What happens with leftover money?

If a milestone costs less than planned, the leftover stays in your project budget. You might:

- Use it for another milestone that went over budget
- Return it to backers (rare, but shows integrity)
- Discuss with your teacher about the best use

### Top tip

Check your spending tracker every week. It only takes 5 minutes and keeps everything fresh in your mind. Don't let receipts pile up — log them on the same day you make a purchase.`,
        quiz: {
          question: 'What should you do with every receipt?',
          options: [
            { text: 'Throw it away — the bank tracks everything anyway', isCorrect: false },
            { text: 'Take a photo immediately, note what it\'s for, and which milestone it belongs to', isCorrect: true },
            { text: 'Give it to your teacher and forget about it', isCorrect: false },
            { text: 'Keep it but don\'t worry about organising it', isCorrect: false },
          ],
          explanation: 'Receipts are your proof of spending! Take a photo right away (paper receipts fade), note what the purchase was for, and link it to the correct milestone. This keeps you organised and accountable.',
        },
      },
      {
        id: 'being-responsible',
        title: 'Being Responsible with Money',
        readingTime: 3,
        content: `## Being Responsible with Money

Managing someone else's money is a big responsibility. Your backers believed in you enough to give you their hard-earned money. Here's how to honour that trust.

### The responsibility mindset

When you spend project funds, ask yourself three questions:

1. **"Is this what I promised?"** — Does this purchase match my milestones?
2. **"Is this the best value?"** — Have I checked prices and found a good deal?
3. **"Would I be proud to explain this?"** — Could I tell my backers about this purchase and feel good about it?

If you answer "yes" to all three, go ahead!

### Common mistakes to avoid

- **Impulse buying** — Seeing something cool and buying it without planning
- **Brand loyalty** — Buying the expensive brand when a cheaper one works just as well
- **Scope creep** — Adding extra things that weren't in your original plan
- **Forgetting hidden costs** — Delivery fees, packaging, taxes

### What to do if things go wrong

Sometimes things don't go to plan. That's OK! Here's what to do:

- **Overspent on a milestone?** Talk to your teacher. They can help you adjust the remaining milestones
- **Product isn't what you expected?** Check the return policy and act quickly
- **Need to change your plan?** Update your milestones and explain the change to your backers in an update
- **Made a mistake?** Own it, learn from it, and move forward. Everyone makes mistakes — it's how you handle them that matters

### Skills you're building

By managing a funded project, you're learning:

- **Budgeting** — Planning how to use limited resources
- **Decision-making** — Choosing between options based on value
- **Accountability** — Being responsible to others
- **Communication** — Explaining your decisions clearly
- **Problem-solving** — Adapting when things don't go to plan

These are skills that adults use every day — and you're learning them now!

### Top tip

The best entrepreneurs aren't the ones who never make mistakes. They're the ones who learn from every mistake and keep going. You've got this!`,
        quiz: {
          question: 'What three questions should you ask before spending project funds?',
          options: [
            { text: 'Is it cool? Is it trendy? Will people be impressed?', isCorrect: false },
            { text: 'Is this what I promised? Is this the best value? Would I be proud to explain this?', isCorrect: true },
            { text: 'Can I afford it? Do I want it? Is it on sale?', isCorrect: false },
            { text: 'Has my teacher approved it? Is it urgent? Is it cheap?', isCorrect: false },
          ],
          explanation: 'Before every purchase, ask: Is this what I promised my backers? Is this the best value I can find? Would I be proud to tell my backers about this? Three yes answers means you\'re spending wisely!',
        },
      },
    ],
  },
];

/** Get a module by ID */
export function getModuleById(moduleId: string): LearningModule | undefined {
  return LEARNING_MODULES.find((m) => m.id === moduleId);
}

/** Get a lesson by module and lesson ID */
export function getLessonById(moduleId: string, lessonId: string) {
  const mod = getModuleById(moduleId);
  if (!mod) return undefined;
  const lesson = mod.lessons.find((l) => l.id === lessonId);
  if (!lesson) return undefined;
  return { module: mod, lesson };
}

/** Get the total number of lessons across all modules */
export function getTotalLessonCount(): number {
  return LEARNING_MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
}
