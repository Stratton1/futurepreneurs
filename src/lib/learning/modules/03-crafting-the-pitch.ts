import type { LearningModule } from '@/types/learning';

export const craftingThePitch: LearningModule = {
  id: 'crafting-the-pitch',
  title: 'Crafting the Perfect Pitch',
  description: 'Write a pitch that grabs attention, tells your story, shows your numbers, and inspires people to back you.',
  icon: 'Presentation',
  colour: 'purple',
  sectionNumber: 3,
  lessons: [
    {
      id: 'anatomy-of-a-pitch',
      title: 'The Anatomy of a Winning Pitch',
      readingTime: 5,
      content: `## The Anatomy of a Winning Pitch

A great pitch follows a proven structure. Whether you're writing your project page, presenting to your class, or recording a video — this framework works every time.

### The 5-part pitch structure

**1. The Hook (5-10 seconds)**
Grab attention immediately. Ask a question, share a surprising fact, or paint a vivid picture.

> "What if every student in our school could buy fresh, healthy snacks for just £1.50?"

**2. The Problem (15-20 seconds)**
Explain the problem you've discovered. Make your audience feel it.

> "Right now, the only food available at break is crisps, chocolate, and sugary drinks. 80% of students I surveyed said they wish there were healthier options."

**3. The Solution (20-30 seconds)**
Present your idea as the answer. Be specific about what you're creating.

> "I'm launching FreshBites — a weekly healthy snack stall selling homemade flapjacks, fruit pots, and smoothies. All made with real ingredients, all under £2."

**4. Why You (10-15 seconds)**
Tell them why YOU are the right person to make this happen.

> "I've been cooking since I was 10, I've already tested my recipes with 20 classmates, and my food tech teacher Mrs. Patel is mentoring me."

**5. The Ask (10 seconds)**
Be clear about what you need and what supporters' money will do.

> "I'm raising £180 on Futurepreneurs to buy ingredients, packaging, and a market stall. Your £5 buys enough ingredients for 15 flapjacks."

### The complete pitch (under 90 seconds)

When you string these together, you get a complete pitch that takes under 90 seconds. That's all you need!

### Common pitch mistakes

| Mistake | Better Approach |
|---------|----------------|
| Starting with "Hi, I want money for..." | Start with a hook that creates interest |
| Talking about yourself too much | Focus on the problem and your audience |
| Being vague ("I need money for stuff") | Be specific with numbers and details |
| No call to action | Always end with a clear ask |
| Reading from a script robotically | Know your key points and speak naturally |

### Practice makes progress

The first time you pitch, you'll probably stumble. That's completely normal! Practice your pitch:

1. In front of a mirror
2. To a family member
3. To a friend
4. Record yourself and watch it back
5. Revise and repeat

Each time, it gets easier and more natural.

### Top tip

Your pitch should feel like you're having a conversation, not giving a lecture. Imagine you're telling an excited friend about your idea over lunch.`,
      quiz: [
        {
          question: 'What are the 5 parts of a winning pitch in order?',
          options: [
            { text: 'Introduction, Product, Price, Team, Conclusion', isCorrect: false },
            { text: 'Hook, Problem, Solution, Why You, The Ask', isCorrect: true },
            { text: 'Greeting, Idea, Budget, Timeline, Thank You', isCorrect: false },
            { text: 'Story, Numbers, Team, Vision, Close', isCorrect: false },
          ],
          explanation: 'The 5-part structure is: Hook (grab attention), Problem (what\'s wrong), Solution (your idea), Why You (your credibility), The Ask (what you need). This framework works every time!',
        },
        {
          question: 'How long should a pitch ideally take?',
          options: [
            { text: 'Under 30 seconds', isCorrect: false },
            { text: 'Under 90 seconds', isCorrect: true },
            { text: '5-10 minutes', isCorrect: false },
            { text: 'As long as it takes to explain everything', isCorrect: false },
          ],
          explanation: 'A great pitch takes under 90 seconds. That\'s enough time to cover all 5 parts without losing your audience\'s attention. Short, punchy, and memorable!',
        },
        {
          question: 'What is the most common pitch mistake?',
          options: [
            { text: 'Using too many numbers', isCorrect: false },
            { text: 'Being too specific about costs', isCorrect: false },
            { text: 'Starting with "I want money for..." instead of a compelling hook', isCorrect: true },
            { text: 'Practising too much', isCorrect: false },
          ],
          explanation: 'The biggest mistake is jumping straight to asking for money. Start with a hook that makes people curious, then present the problem, solution, and ask. Build interest before you ask for support!',
        },
        {
          question: 'What should the "Why You" section include?',
          options: [
            { text: 'Your school grades and achievements', isCorrect: false },
            { text: 'Why you\'re the right person — your experience, testing, and mentor support', isCorrect: true },
            { text: 'A list of famous entrepreneurs you admire', isCorrect: false },
            { text: 'Your age and location', isCorrect: false },
          ],
          explanation: 'The "Why You" section should convince people you can deliver. Share relevant experience, any testing you\'ve done, and that you have a teacher mentor supporting you.',
        },
        {
          question: 'Why should a pitch feel like a conversation, not a lecture?',
          options: [
            { text: 'Because lectures are boring', isCorrect: false },
            { text: 'Because conversations create connection and make people want to help', isCorrect: true },
            { text: 'Because you shouldn\'t prepare what to say', isCorrect: false },
            { text: 'Because formal language sounds more professional', isCorrect: false },
          ],
          explanation: 'People connect with authenticity. A conversational tone makes you relatable and approachable — which makes supporters more likely to support you. Be natural, not robotic!',
        },
      ],
      tasks: [
        {
          id: 'write-hook',
          title: 'Write 3 Different Hooks',
          description: 'Write 3 different opening hooks for your project: one that asks a question, one that shares a surprising fact, and one that tells a mini-story. Which one grabs attention best?',
          type: 'exercise',
        },
        {
          id: 'full-pitch',
          title: 'Write Your 90-Second Pitch',
          description: 'Using the 5-part framework, write out your complete pitch. Time yourself reading it aloud — it should be under 90 seconds.',
          type: 'exercise',
        },
      ],
    },
    {
      id: 'tell-your-story',
      title: 'Tell Your Story',
      readingTime: 4,
      content: `## Tell Your Story

People don't just back projects — they back **people**. Your personal story is what connects supporters to you emotionally and makes them want to help.

### The problem → solution → impact structure

Every great campaign story follows this arc:

**Problem:** "Our school throws away 50 perfectly good items of uniform every term because there's no system to pass them on."

**Solution:** "I'm creating a student-run uniform swap shop where families can donate and collect secondhand uniform for free."

**Impact:** "This will save families money, reduce waste, and give every student access to uniform that fits."

### Making it personal

Supporters want to know WHY this matters to **you**. Share your personal connection:

- "I noticed this problem when my younger brother needed new PE kit and we couldn't afford it"
- "I've always loved cooking and I want to share that with my school"
- "I started coding at 11 and nobody at my school does it — I want to change that"

### Storytelling techniques

**Show, don't tell:**
- Bad: "I'm passionate about helping people"
- Good: "Last month, I spent every Saturday teaching my neighbours' kids to code"

**Use specific details:**
- Bad: "It affects lots of students"
- Good: "I surveyed 45 students and 38 said they'd use this service"

**Create a picture in their mind:**
- Bad: "We need equipment"
- Good: "Imagine 10 students sitting around Raspberry Pi computers every Thursday, building their first websites"

### Emotional triggers that work

People back projects because of:
- **Hope** — "This could really help people"
- **Empathy** — "I understand that struggle"
- **Inspiration** — "This young person is amazing"
- **Community** — "This benefits our school/area"
- **Fun** — "This sounds brilliant, I want to be part of it"

### Writing your project description

Structure your project page description like this:

1. **Opening hook** (1-2 sentences)
2. **The problem** (1 paragraph)
3. **Your personal story** (1 paragraph)
4. **Your solution** (1-2 paragraphs)
5. **How the money will be used** (milestone breakdown)
6. **The impact** (what changes when this succeeds)
7. **Call to action** (ask for support)

### Top tip

Read your story out loud to someone who doesn't know your project. If they look bored, the story needs work. If they lean in and ask questions — you've nailed it!`,
      quiz: [
        {
          question: 'What is the three-part story structure for campaign pitches?',
          options: [
            { text: 'Beginning, Middle, End', isCorrect: false },
            { text: 'Problem, Solution, Impact', isCorrect: true },
            { text: 'Hook, Body, Close', isCorrect: false },
            { text: 'Idea, Budget, Timeline', isCorrect: false },
          ],
          explanation: 'The three-part structure is Problem (what\'s wrong), Solution (how you\'ll fix it), and Impact (what changes when you succeed). This arc creates a compelling narrative!',
        },
        {
          question: 'What does "Show, don\'t tell" mean in storytelling?',
          options: [
            { text: 'Always use photos instead of words', isCorrect: false },
            { text: 'Use specific examples and details instead of vague claims', isCorrect: true },
            { text: 'Present a slideshow instead of writing', isCorrect: false },
            { text: 'Let someone else tell your story', isCorrect: false },
          ],
          explanation: '"Show, don\'t tell" means using concrete examples rather than vague statements. Instead of "I\'m passionate about coding," say "I spent every Saturday teaching kids to code." Specific details are more convincing!',
        },
        {
          question: 'Why should your story include a personal connection to the problem?',
          options: [
            { text: 'To make people feel sorry for you', isCorrect: false },
            { text: 'Because supporters connect with real people and authentic motivations', isCorrect: true },
            { text: 'Because teachers require a personal statement', isCorrect: false },
            { text: 'To fill up space on your project page', isCorrect: false },
          ],
          explanation: 'Sharing why this matters to you personally makes your story authentic and relatable. Supporters want to support real people with genuine motivations — not just ideas.',
        },
        {
          question: 'Which emotional trigger is LEAST effective for crowdfunding?',
          options: [
            { text: 'Hope — "this could really help people"', isCorrect: false },
            { text: 'Guilt — "you should feel bad if you don\'t donate"', isCorrect: true },
            { text: 'Inspiration — "this young person is amazing"', isCorrect: false },
            { text: 'Community — "this benefits our school"', isCorrect: false },
          ],
          explanation: 'Guilt is not an effective motivator for crowdfunding. People want to feel good about supporting you — not pressured. Focus on positive emotions like hope, inspiration, and community.',
        },
        {
          question: 'How can you test if your story is engaging?',
          options: [
            { text: 'Count the word count — longer is always better', isCorrect: false },
            { text: 'Read it aloud to someone and watch their reaction', isCorrect: true },
            { text: 'Use AI to rate it', isCorrect: false },
            { text: 'Compare it to professional fundraising pages', isCorrect: false },
          ],
          explanation: 'The best test is reading your story to a real person. If they lean in and ask questions, you\'ve nailed it. If they look bored, revise and try again.',
        },
      ],
      tasks: [
        {
          id: 'personal-connection',
          title: 'Write Your Personal Connection',
          description: 'In 3-5 sentences, explain why this project matters to you personally. What experience, observation, or frustration inspired you to take action?',
          type: 'reflection',
        },
        {
          id: 'project-description',
          title: 'Draft Your Project Description',
          description: 'Write a full project description using the 7-part structure: hook, problem, personal story, solution, budget breakdown, impact, and call to action.',
          type: 'exercise',
        },
      ],
    },
    {
      id: 'show-your-numbers',
      title: 'Show Your Numbers',
      readingTime: 4,
      content: `## Show Your Numbers

Numbers build credibility. When supporters see real figures — researched prices, survey data, and clear budgets — they trust you more and feel confident their money is in good hands.

### Types of numbers that impress

**Research numbers:**
- "I surveyed 35 students and 80% said they'd buy this"
- "There are 950 students at my school"
- "The average student spends £2.50 on snacks per day"

**Budget numbers:**
- "Each cupcake costs me £0.52 to make"
- "I need exactly £147.50 for materials"
- "Your £10 buys ingredients for 20 cupcakes"

**Impact numbers:**
- "This will serve 50 students per week"
- "We'll reduce uniform waste by 200 items per year"
- "10 students will learn to code every term"

### Making financial data visual

Don't just list numbers — make them easy to understand:

**The milestone breakdown:**
Show supporters exactly where their money goes with clear milestones. Each milestone should have a purpose and a specific amount.

**The "your £X buys" statement:**
This makes donations feel tangible:
- "£5 buys a bag of flour for 30 flapjacks"
- "£15 buys a Raspberry Pi kit for one student"
- "£25 covers one month of market stall fees"

**Progress indicators:**
Share exciting numbers as they happen:
- "We're 62% funded with 23 supporters!"
- "Just £45 to go — that's less than 10 supporters at £5 each"

### Realistic projections

If you're showing potential revenue, keep it realistic:

**Too optimistic:** "We'll make £10,000 in our first month!"
**Realistic:** "If we sell 25 items per week at £1.50, that's £37.50 per week or £150 per month"

Show your working — supporters respect transparency:

> **Revenue projection:**
> 25 items/week × £1.50 = £37.50/week
> Cost: £12/week (ingredients) + £5/week (packaging) = £17/week
> **Weekly profit: £20.50**

### The credibility check

Before publishing, ask yourself:
- Are all prices from real, current sources?
- Can I explain every number if asked?
- Have I included my research evidence?
- Are my projections conservative and honest?

### Top tip

Under-promise and over-deliver. If you think you'll sell 30 items per week, say 20. When you exceed expectations, supporters are delighted. When you fall short of wild promises, they're disappointed.`,
      quiz: [
        {
          question: 'Why are numbers important in your pitch?',
          options: [
            { text: 'They make your page look more professional', isCorrect: false },
            { text: 'They build credibility and help supporters trust that their money is in good hands', isCorrect: true },
            { text: 'Futurepreneurs requires a minimum number of statistics', isCorrect: false },
            { text: 'They fill space on your project page', isCorrect: false },
          ],
          explanation: 'Real numbers show you\'ve done your homework. Research data, specific costs, and clear budgets build trust — which is the most important factor in convincing people to back you.',
        },
        {
          question: 'What is a "your £X buys" statement?',
          options: [
            { text: 'A minimum donation requirement', isCorrect: false },
            { text: 'A tangible description of what a specific donation amount achieves', isCorrect: true },
            { text: 'A refund policy for supporters', isCorrect: false },
            { text: 'A pricing strategy for your products', isCorrect: false },
          ],
          explanation: '"Your £X buys..." statements make donations feel real and tangible. "£5 buys enough flour for 30 flapjacks" helps supporters visualise exactly what their support achieves.',
        },
        {
          question: 'What does "under-promise and over-deliver" mean?',
          options: [
            { text: 'Set a very low funding goal', isCorrect: false },
            { text: 'Make conservative projections so you can exceed expectations', isCorrect: true },
            { text: 'Promise less than competitors', isCorrect: false },
            { text: 'Deliver products late to build suspense', isCorrect: false },
          ],
          explanation: 'It means setting realistic (even slightly conservative) expectations. If you predict 20 sales but achieve 30, supporters are thrilled. If you predict 50 but get 30, they\'re disappointed — even though you sold the same amount!',
        },
        {
          question: 'A student plans to sell 25 items per week at £1.50 each, with weekly costs of £17. What is their weekly profit?',
          options: [
            { text: '£37.50', isCorrect: false },
            { text: '£17.00', isCorrect: false },
            { text: '£20.50', isCorrect: true },
            { text: '£54.50', isCorrect: false },
          ],
          explanation: 'Revenue: 25 × £1.50 = £37.50. Costs: £17.00. Profit = £37.50 - £17.00 = £20.50 per week. Being able to calculate profit is an essential business skill!',
        },
        {
          question: 'Where should your budget prices come from?',
          options: [
            { text: 'Your best estimate', isCorrect: false },
            { text: 'Real, current prices from actual shops and websites', isCorrect: true },
            { text: 'Last year\'s prices', isCorrect: false },
            { text: 'The cheapest prices you can imagine', isCorrect: false },
          ],
          explanation: 'Always use real, current prices from actual shops and websites. Include links or screenshots as proof. This shows supporters your budget is based on reality, not guesswork.',
        },
      ],
      tasks: [
        {
          id: 'budget-breakdown',
          title: 'Create Your Budget Breakdown',
          description: 'List every item you need with real prices from actual websites. Calculate your total, add a buffer, and group items into milestones.',
          type: 'exercise',
        },
        {
          id: 'donation-statements',
          title: 'Write "Your £X Buys" Statements',
          description: 'Create 3 statements showing what specific donation amounts achieve for your project (e.g., "Your £5 buys...").',
          type: 'exercise',
        },
      ],
    },
    {
      id: 'power-of-video',
      title: 'The Power of Video',
      readingTime: 4,
      content: `## The Power of Video

Projects with video raise significantly more than those without. A short video puts a face to your project and lets your passion shine through in a way text simply can't.

### The 60-second video structure

Keep it tight — 60 seconds is the sweet spot:

| Section | Time | What to Say |
|---------|------|-------------|
| Intro | 5 sec | "Hi! I'm [display name] from [city]" |
| Problem | 10 sec | What problem you noticed |
| Solution | 15 sec | What you're building/creating |
| Show it | 15 sec | Hold up a prototype or demo |
| The ask | 10 sec | How much you need and what it'll do |
| CTA | 5 sec | "Back my project today!" |

### Recording tips

**Lighting:**
- Face a window — natural light is best
- Never have a bright window behind you (you'll be a silhouette)
- Overcast days give the softest, most flattering light

**Audio:**
- Record in a quiet room
- Close windows and turn off fans/TV
- Speak clearly and slightly louder than normal
- Modern phone microphones work brilliantly in quiet spaces

**Camera setup:**
- Turn your phone sideways (landscape mode)
- Prop it at eye level (stack some books!)
- Make sure the background is clean and tidy
- Keep the camera still — no hand-holding if possible

### Multiple takes

Nobody gets it right first time. Here's the process:

1. Write your key bullet points (don't memorise word-for-word)
2. Do a practice run without recording
3. Record 3-5 takes
4. Watch them all and pick the best
5. Simple phone editing to trim the start/end

### Safety rules for video (critical!)

- **Use your display name only** — never your full real name
- **Don't mention your school name** — say your city or area instead
- **Don't show school uniform** with logos
- **Check the background** — no personal info visible (letters, screens, addresses)
- **Get parent/guardian permission** before uploading
- **Upload as "Unlisted" on YouTube** so only people with the link can watch

### Uploading

1. Upload to YouTube (Unlisted) or Vimeo (Password-protected)
2. Copy the video link
3. Paste it into your Futurepreneurs project video field
4. It'll embed on your page in privacy-enhanced mode

### Top tip

Don't aim for perfection — aim for authenticity. A slightly imperfect but genuine video is 10x more compelling than a slick but emotionless one. Let your real enthusiasm show!`,
      quiz: [
        {
          question: 'Why do projects with video raise more money?',
          options: [
            { text: 'Because video is more expensive to produce', isCorrect: false },
            { text: 'Because video creates a personal connection and lets passion shine through', isCorrect: true },
            { text: 'Because Futurepreneurs promotes video projects more', isCorrect: false },
            { text: 'Because text is too difficult to read', isCorrect: false },
          ],
          explanation: 'Video creates a personal connection that text can\'t match. Supporters can see and hear the real person behind the project, which builds trust and emotional connection.',
        },
        {
          question: 'What is the ideal length for a project pitch video?',
          options: [
            { text: '10-15 seconds', isCorrect: false },
            { text: '60 seconds', isCorrect: true },
            { text: '5 minutes', isCorrect: false },
            { text: '10 minutes', isCorrect: false },
          ],
          explanation: '60 seconds is the sweet spot — long enough to cover your introduction, problem, solution, demo, and ask, but short enough to hold attention from start to finish.',
        },
        {
          question: 'Which safety rule is MOST important when recording a project video?',
          options: [
            { text: 'Use professional lighting equipment', isCorrect: false },
            { text: 'Never mention your school name or show identifying information', isCorrect: true },
            { text: 'Wear formal clothes', isCorrect: false },
            { text: 'Record in a studio', isCorrect: false },
          ],
          explanation: 'Safety is the top priority! Never mention your school name (say your city instead), don\'t show school uniform logos, and check there\'s no personal info visible in the background.',
        },
        {
          question: 'How should you upload your project video?',
          options: [
            { text: 'Post it publicly on TikTok', isCorrect: false },
            { text: 'Upload to YouTube as Unlisted or Vimeo with password protection', isCorrect: true },
            { text: 'Email it directly to supporters', isCorrect: false },
            { text: 'Upload it to your school\'s website', isCorrect: false },
          ],
          explanation: 'Upload to YouTube as "Unlisted" (only people with the link can watch) or Vimeo with password protection. Then paste the link into your Futurepreneurs project page.',
        },
        {
          question: 'What is more important in a pitch video — perfection or authenticity?',
          options: [
            { text: 'Perfection — every word must be scripted', isCorrect: false },
            { text: 'Authenticity — genuine enthusiasm beats polish', isCorrect: true },
            { text: 'Neither — the content doesn\'t matter as much as the video quality', isCorrect: false },
            { text: 'Both equally — you can\'t have one without the other', isCorrect: false },
          ],
          explanation: 'Authenticity wins every time! A slightly imperfect but genuine video where your real enthusiasm shows is far more compelling than a polished but emotionless one.',
        },
      ],
      tasks: [
        {
          id: 'video-script',
          title: 'Write Your Video Script',
          description: 'Using the 60-second structure, write bullet points for each section of your video. Practice reading it aloud and time yourself.',
          type: 'exercise',
          downloadUrl: '/resources/video-storyboard-template.pdf',
        },
        {
          id: 'safety-checklist',
          title: 'Video Safety Checklist',
          description: 'Before recording, check: Will I use my display name? Is my school name hidden? Is the background clear of personal info? Do I have parent permission?',
          type: 'reflection',
        },
      ],
    },
    {
      id: 'safe-brand-identity',
      title: 'Creating a Safe Brand Identity',
      readingTime: 4,
      content: `## Creating a Safe Brand Identity

Your brand is how people recognise and remember you. On Futurepreneurs, branding must be safe for young entrepreneurs — that means zero personal information, just creativity!

### What is a brand?

A brand is more than a logo. It's the overall impression people have of your business:

- **Name** — What's your business called?
- **Visual style** — Colours, fonts, logo
- **Voice** — How you write and talk (fun? serious? quirky?)
- **Values** — What does your business stand for?
- **Experience** — How do people feel when they interact with you?

### Safe branding for young entrepreneurs

On Futurepreneurs, your brand identity should:

- **Use a business name** — Not your personal name
- **Use your display handle** — The username we assign (e.g., "BrightSpark42")
- **Use your avatar** — Our built-in avatar builder, never real photos
- **Avoid location specifics** — Say your city, not your school or street
- **Keep it age-appropriate** — Fun, professional, and suitable

### Creating your business name

Great business names are:
- **Memorable** — Easy to say and remember
- **Descriptive** — Gives a hint about what you do
- **Unique** — Doesn't sound like an existing brand
- **Simple** — Easy to spell and search for

**Naming techniques:**
- **Descriptive:** FreshBites, QuickFix, CodeCraft
- **Playful:** The Cupcake Crew, ByteSize Learning, Green Machine
- **Initials:** K&E Candles, JMB Tutoring
- **Mashup:** Snacktastic, Craftopia, TechWhiz

### Design basics with free tools

You don't need expensive software. These free tools are brilliant:

- **Canva** (canva.com) — Logos, posters, social graphics
- **Coolors** (coolors.co) — Pick a colour palette
- **Google Fonts** (fonts.google.com) — Find free fonts
- **Futurepreneurs Avatar Builder** — Your personal avatar

### Choosing your colours

Pick 2-3 colours that match your brand's personality:

| Colour | Feeling |
|--------|---------|
| Blue | Trust, calm, professional |
| Green | Nature, health, growth |
| Orange | Energy, fun, affordable |
| Purple | Creative, luxury, unique |
| Red | Bold, exciting, urgent |
| Yellow | Happy, friendly, optimistic |

### Your brand voice

Decide how your business "talks":
- **Fun and friendly:** "Hey there! Check out our amazing new flavours!"
- **Professional but warm:** "We're excited to share our latest collection with you"
- **Quirky and bold:** "Warning: these cookies are dangerously delicious"

Keep your voice consistent across your project page, updates, and social media.

### Top tip

Your brand doesn't need to be perfect on day one. Start simple with a name, 2-3 colours, and a consistent tone of voice. You can refine it as your business grows!`,
      quiz: [
        {
          question: 'What is a "brand" in business?',
          options: [
            { text: 'Just a logo and business name', isCorrect: false },
            { text: 'The overall impression people have — name, visuals, voice, values, and experience', isCorrect: true },
            { text: 'A stamp you put on your products', isCorrect: false },
            { text: 'Your personal identity', isCorrect: false },
          ],
          explanation: 'A brand is much more than a logo! It\'s the complete impression people have of your business — including your name, visual style, how you communicate, your values, and the experience you create.',
        },
        {
          question: 'Why should young entrepreneurs avoid using their real name in branding?',
          options: [
            { text: 'Because real names aren\'t catchy enough', isCorrect: false },
            { text: 'To protect personal privacy and safety', isCorrect: true },
            { text: 'Because teachers don\'t allow it', isCorrect: false },
            { text: 'Because business names sound more professional', isCorrect: false },
          ],
          explanation: 'Using a business name instead of your personal name protects your privacy and safety. On Futurepreneurs, you use a display handle and avatar — never your real full name or photo.',
        },
        {
          question: 'Which colour is most associated with trust and professionalism?',
          options: [
            { text: 'Red', isCorrect: false },
            { text: 'Yellow', isCorrect: false },
            { text: 'Blue', isCorrect: true },
            { text: 'Orange', isCorrect: false },
          ],
          explanation: 'Blue is most commonly associated with trust, calm, and professionalism. That\'s why banks, tech companies, and healthcare brands often use blue. Choose colours that match the feeling you want your brand to create.',
        },
        {
          question: 'What makes a good business name?',
          options: [
            { text: 'As many words as possible to be descriptive', isCorrect: false },
            { text: 'Memorable, descriptive, unique, and simple', isCorrect: true },
            { text: 'Using only your initials', isCorrect: false },
            { text: 'Copying a famous brand\'s name', isCorrect: false },
          ],
          explanation: 'A great business name is memorable (easy to remember), descriptive (hints at what you do), unique (doesn\'t copy others), and simple (easy to spell and search for).',
        },
        {
          question: 'What is "brand voice"?',
          options: [
            { text: 'The accent you use when speaking to customers', isCorrect: false },
            { text: 'The consistent tone and style of how your business communicates', isCorrect: true },
            { text: 'A recorded message for voicemail', isCorrect: false },
            { text: 'The loudness of your marketing', isCorrect: false },
          ],
          explanation: 'Brand voice is the consistent tone and style of all your communications — fun and friendly, professional, or quirky. Keeping it consistent across your project page, updates, and social media builds recognition.',
        },
      ],
      tasks: [
        {
          id: 'name-brainstorm',
          title: 'Brainstorm Business Names',
          description: 'Come up with 10 potential names for your business using different techniques: descriptive, playful, initials, and mashup. Ask 3 people which they like best.',
          type: 'exercise',
        },
        {
          id: 'brand-basics',
          title: 'Define Your Brand Basics',
          description: 'Choose your business name, 2-3 brand colours, and write a one-sentence description of your brand voice (e.g., "Fun and friendly, never boring").',
          type: 'reflection',
        },
      ],
    },
  ],
};
