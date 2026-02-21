import type { LearningModule } from '@/types/learning';

export const launchMarketing: LearningModule = {
  id: 'launch-marketing',
  title: 'Launch & Marketing',
  description: 'Get the word out — activate your inner circle, use social media safely, create stunning visuals, and keep backers engaged.',
  icon: 'Megaphone',
  colour: 'pink',
  sectionNumber: 5,
  lessons: [
    {
      id: 'activating-inner-circle',
      title: 'Activating the Inner Circle',
      readingTime: 4,
      content: `## Activating the Inner Circle

Your "inner circle" is the group of people closest to you — family, friends, teachers, and classmates. They're your first backers, your biggest cheerleaders, and the foundation of your campaign's success.

### Why the inner circle matters

Most crowdfunding campaigns follow a pattern:

1. **First 48 hours** — Inner circle backs you (family, close friends)
2. **First week** — Extended network sees it (friends of friends, teachers)
3. **Week 2-4** — Wider audience discovers it through shares and social media

If your inner circle doesn't back you, the wider audience never sees your project. First momentum is everything.

### The "tell 10" strategy

Before you launch, personally tell 10 people about your project:

1. Mum/Dad/Guardian
2. Grandparents
3. Aunt/Uncle
4. Family friend
5. Best friend
6. Two more friends
7. Your teacher mentor
8. Another teacher who knows you
9. A neighbour

Don't just send a link — **tell them the story**. "I'm launching a project to [what] because [why]. Would you take a look and maybe back it?"

### Social proof and momentum

People are more likely to back a project that already has backers. This is called **social proof** — "if others believe in this, maybe I should too."

Getting your first 5-10 backers quickly creates a snowball effect:
- Friends see "12 backers" and think "this must be good"
- The funding bar shows progress, which builds confidence
- Early backers leave comments, adding credibility

### Making it easy for people to help

Don't just ask people to back you. Give them options:
- **Can't donate?** "Could you share the link with 3 people?"
- **Not sure?** "Just take a look at my page and let me know what you think"
- **Want to help more?** "Share it on your social media?"

### The personal message template

When reaching out individually:

> "Hi [name]! I'm really excited — I just launched my project on Futurepreneurs. I'm raising [amount] to [what you're doing]. I'd love for you to check it out: [link]. Even sharing the link with someone else would mean the world. Thank you! 💚"

### Top tip

Launch on a Tuesday, Wednesday, or Thursday. Weekends have lower engagement because people are busy, and Mondays are hectic. Midweek launches perform best!`,
      quiz: [
        {
          question: 'What is the "inner circle" in crowdfunding?',
          options: [
            { text: 'A VIP group of wealthy investors', isCorrect: false },
            { text: 'Your closest contacts — family, friends, teachers who back you first', isCorrect: true },
            { text: 'A secret group chat for backers', isCorrect: false },
            { text: 'The Futurepreneurs team', isCorrect: false },
          ],
          explanation: 'Your inner circle is the people closest to you — family, friends, teachers, classmates. They\'re your first backers and the foundation of your campaign\'s success.',
        },
        {
          question: 'What is "social proof"?',
          options: [
            { text: 'Posting on social media', isCorrect: false },
            { text: 'When people are more likely to do something because others have done it already', isCorrect: true },
            { text: 'Proving that your social media account is real', isCorrect: false },
            { text: 'Getting a celebrity endorsement', isCorrect: false },
          ],
          explanation: 'Social proof means people trust something more when they see others have already backed it. Getting your first 5-10 backers quickly creates a snowball effect!',
        },
        {
          question: 'How many people should you personally tell about your project before launching?',
          options: [
            { text: '1-2 people', isCorrect: false },
            { text: '10 people minimum', isCorrect: true },
            { text: '100+ people', isCorrect: false },
            { text: 'Only your teacher', isCorrect: false },
          ],
          explanation: 'Personally tell at least 10 people. Don\'t just send a link — tell them the story. Personal connections are much more likely to back you than cold messages.',
        },
        {
          question: 'What should you ask people who can\'t donate money?',
          options: [
            { text: 'Nothing — if they can\'t donate, they can\'t help', isCorrect: false },
            { text: 'To donate a smaller amount', isCorrect: false },
            { text: 'To share the link with 3 people', isCorrect: true },
            { text: 'To leave a comment', isCorrect: false },
          ],
          explanation: 'Even if someone can\'t donate, sharing your link with others is incredibly valuable. One share can reach someone who will donate. Always offer alternative ways to help!',
        },
        {
          question: 'When is the best day to launch a crowdfunding campaign?',
          options: [
            { text: 'Friday evening', isCorrect: false },
            { text: 'Saturday morning', isCorrect: false },
            { text: 'Tuesday, Wednesday, or Thursday', isCorrect: true },
            { text: 'Monday morning', isCorrect: false },
          ],
          explanation: 'Midweek launches (Tuesday-Thursday) perform best. Weekends have lower engagement because people are busy with other activities, and Mondays are typically hectic.',
        },
      ],
      tasks: [
        {
          id: 'tell-ten',
          title: 'Create Your "Tell 10" List',
          description: 'Write a list of 10 people you\'ll personally tell about your project before or on launch day. Include their name and how you\'ll reach them (in person, text, call).',
          type: 'exercise',
        },
        {
          id: 'personal-message',
          title: 'Draft Your Personal Message',
          description: 'Write a personalised message you can adapt for different people in your inner circle. Make it warm, specific, and include a clear ask.',
          type: 'exercise',
        },
      ],
    },
    {
      id: 'authentic-social-media',
      title: 'Authentic Social Media Marketing',
      readingTime: 4,
      content: `## Authentic Social Media Marketing

Social media is a powerful (and free!) tool for promoting your project. But as a young entrepreneur, you need to be smart and safe about how you use it.

### Platform-specific strategies

**Instagram:**
- Use Stories for behind-the-scenes content (making products, packing orders)
- Post Reels showing your process in 15-30 seconds
- Use 5-10 relevant hashtags (#studentbusiness #youngentrepreneur #futurepreneurs)
- Post 3-4 times per week during your campaign

**TikTok:**
- Show personality! People follow people, not brands
- "A day in the life of a student entrepreneur" format works brilliantly
- Use trending sounds with your own content
- Keep videos under 30 seconds for best engagement

**WhatsApp:**
- Share your project link in family groups
- Send personalised messages, not bulk forwards
- Update groups when you hit milestones
- Don't spam — one message per week maximum

### Content ideas (10 ready-to-use)

1. "I just launched my project!" — Share your project page
2. Behind the scenes — Making your product or preparing
3. "Here's why I started this" — Your personal story
4. Customer reactions — Friends trying your product
5. Progress update — "We're 40% funded!"
6. Fun fact — Something interesting about your product or market
7. Milestone celebration — "10 backers! Thank you!"
8. Q&A — Answer common questions about your project
9. Day in the life — Show your routine as a student entrepreneur
10. Thank you post — Gratitude for your backers

### Safety rules (non-negotiable!)

- **Use your display name**, not your real name
- **Never share your address**, phone number, or school name
- **Don't DM strangers** — If someone's interested, direct them to your Futurepreneurs page
- **Get parent approval** before posting
- **Set accounts to private** if you're uncomfortable with public attention
- **Never meet anyone** you've only spoken to online
- **Screenshot and report** any uncomfortable messages to your parent/teacher

### Timing your posts

Best posting times for student audiences:
- **Before school:** 7:30-8:15am
- **Lunch break:** 12:00-1:00pm
- **After school:** 3:30-5:00pm
- **Evening:** 7:00-9:00pm

### Top tip

Be yourself! The most successful student entrepreneurs on social media are authentic and genuine. Show the real journey — including the challenges and mistakes. People connect with honesty.`,
      quiz: [
        {
          question: 'What type of Instagram content works best for student entrepreneurs?',
          options: [
            { text: 'Professional studio photography', isCorrect: false },
            { text: 'Behind-the-scenes Stories and short Reels showing your process', isCorrect: true },
            { text: 'Only text posts with no images', isCorrect: false },
            { text: 'Reposting content from other businesses', isCorrect: false },
          ],
          explanation: 'Behind-the-scenes content and short Reels showing your real process are the most engaging. People love seeing the authentic journey of a young entrepreneur!',
        },
        {
          question: 'What is the most important social media safety rule?',
          options: [
            { text: 'Post at least once every day', isCorrect: false },
            { text: 'Never share personal details like your address, school name, or phone number', isCorrect: true },
            { text: 'Only use Instagram, not TikTok', isCorrect: false },
            { text: 'Always use your real name for credibility', isCorrect: false },
          ],
          explanation: 'Safety comes first! Never share personal details online. Use your display name, don\'t mention your school, and direct all interested people to your Futurepreneurs page.',
        },
        {
          question: 'How often should you post on social media during your campaign?',
          options: [
            { text: 'Once a month', isCorrect: false },
            { text: '3-4 times per week', isCorrect: true },
            { text: '10 times per day', isCorrect: false },
            { text: 'Only when you feel like it', isCorrect: false },
          ],
          explanation: '3-4 times per week keeps you visible without overwhelming your audience. Consistency matters more than frequency — a steady rhythm is better than posting 10 times one day then nothing for a week.',
        },
        {
          question: 'What should you do if a stranger DMs you about your project?',
          options: [
            { text: 'Share your phone number so they can text you', isCorrect: false },
            { text: 'Arrange to meet them in person', isCorrect: false },
            { text: 'Direct them to your Futurepreneurs page and don\'t share personal details', isCorrect: true },
            { text: 'Ignore them completely', isCorrect: false },
          ],
          explanation: 'Never share personal details with strangers online. Politely direct them to your Futurepreneurs page where they can back your project safely. If anything feels uncomfortable, tell your parent or teacher.',
        },
        {
          question: 'What makes social media content "authentic"?',
          options: [
            { text: 'Using expensive camera equipment', isCorrect: false },
            { text: 'Showing the real journey including challenges and mistakes', isCorrect: true },
            { text: 'Only sharing perfect results', isCorrect: false },
            { text: 'Copying what other entrepreneurs do', isCorrect: false },
          ],
          explanation: 'Authentic content shows the real journey — not just the highlights. Sharing challenges, mistakes, and behind-the-scenes moments makes you relatable and builds genuine connection with your audience.',
        },
      ],
      tasks: [
        {
          id: 'content-plan',
          title: 'Plan Your First Week of Posts',
          description: 'Create a content plan for your first 5 social media posts. For each, write: the platform, the content idea, and when you\'ll post it.',
          type: 'exercise',
        },
        {
          id: 'safety-review',
          title: 'Social Media Safety Review',
          description: 'Review your social media profiles. Is your display name used? Is your school name hidden? Are your privacy settings appropriate? Make changes if needed.',
          type: 'reflection',
        },
      ],
    },
    {
      id: 'visual-presentation',
      title: 'Visual Presentation',
      readingTime: 3,
      content: `## Visual Presentation

People process images 60,000 times faster than text. Great visuals make the difference between someone scrolling past and someone clicking to learn more about your project.

### The photos your project needs

1. **Hero image** — The main image on your project card. This is the MOST important image
2. **Product photos** — Your product or prototype from different angles
3. **Behind the scenes** — You working on your project
4. **Scale shots** — Your product held in hand or next to something familiar
5. **Lifestyle shots** — Your product being used in real life

### Phone photography tips

**Lighting:**
- Natural light near a window is best
- Overcast days = soft, even lighting
- Avoid harsh shadows (no direct sunlight)
- Never use flash — it flattens everything

**Composition:**
- Rule of thirds — imagine a 3x3 grid over your photo, place your subject where lines cross
- Fill the frame — get close to your subject
- Clean background — plain walls, wooden tables, or fabric backdrops
- Multiple shots — take 20, pick the best 3

**Editing (free tools):**
- Phone's built-in editor for brightness and crop
- Canva for adding text and graphics
- Remove.bg for removing backgrounds

### Safety rules for photos

- No school uniforms with visible logos
- No location-identifying landmarks
- No personal information visible in background
- Get permission before including other people

### Your hero image

Your project card hero image gets the most views. Make it count:

- Show your product clearly
- Use bright, clean lighting
- Include a person (you or a friend) holding/using it for context
- Keep it simple — one clear focal point
- Make sure it works as a small thumbnail AND full-size

### Top tip

Spend extra time on your hero image — it's your shopfront window. A brilliant hero image can double your click-through rate compared to a mediocre one.`,
      quiz: [
        {
          question: 'Which image is the MOST important on your project page?',
          options: [
            { text: 'The behind-the-scenes photo', isCorrect: false },
            { text: 'Your hero image — the main project card photo', isCorrect: true },
            { text: 'Your avatar', isCorrect: false },
            { text: 'A photo of your receipts', isCorrect: false },
          ],
          explanation: 'Your hero image is the first thing people see when browsing projects. It appears on your project card and determines whether people click to learn more. Make it count!',
        },
        {
          question: 'What is the "rule of thirds" in photography?',
          options: [
            { text: 'Take 3 photos of everything', isCorrect: false },
            { text: 'Place your subject where grid lines cross on an imaginary 3x3 grid', isCorrect: true },
            { text: 'Use 3 different light sources', isCorrect: false },
            { text: 'Edit photos 3 times before publishing', isCorrect: false },
          ],
          explanation: 'The rule of thirds means imagining a 3x3 grid over your photo and placing your subject where the lines cross. This creates a more dynamic and visually pleasing composition than centering everything.',
        },
        {
          question: 'What type of lighting is best for product photography?',
          options: [
            { text: 'Camera flash', isCorrect: false },
            { text: 'Direct sunlight', isCorrect: false },
            { text: 'Natural light near a window, especially on overcast days', isCorrect: true },
            { text: 'Coloured LED lights', isCorrect: false },
          ],
          explanation: 'Natural light near a window is best, especially on overcast days which give soft, even lighting. Avoid flash (it flattens everything) and direct sunlight (creates harsh shadows).',
        },
        {
          question: 'How many photos should you take to get 3 good ones?',
          options: [
            { text: '3 — one take for each', isCorrect: false },
            { text: '5-6', isCorrect: false },
            { text: '20 or more', isCorrect: true },
            { text: 'It depends on the camera', isCorrect: false },
          ],
          explanation: 'Take at least 20 photos and pick the best 3-5. Professional photographers often take hundreds to get a few perfect shots. More options means better final results!',
        },
        {
          question: 'What should you check in the background of your photos?',
          options: [
            { text: 'That it\'s colorful and busy to attract attention', isCorrect: false },
            { text: 'That there\'s no personal information, school logos, or identifying landmarks', isCorrect: true },
            { text: 'That other people are visible for social proof', isCorrect: false },
            { text: 'That your brand logo is visible', isCorrect: false },
          ],
          explanation: 'Always check your background for safety! No school uniforms with logos, no location-identifying landmarks, no personal info like letters or screens. Keep it clean and safe.',
        },
      ],
      tasks: [
        {
          id: 'hero-photo',
          title: 'Take Your Hero Image',
          description: 'Using the tips from this lesson, take at least 10 photos of your product or concept. Pick the best one as your hero image. Check it works as both a small thumbnail and full-size.',
          type: 'exercise',
        },
      ],
    },
    {
      id: 'local-sponsorships',
      title: 'Securing Local Sponsorships',
      readingTime: 4,
      content: `## Securing Local Sponsorships

Local businesses can be powerful allies. A sponsorship or partnership doesn't always mean money — it could mean materials, expertise, space, or promotion.

### What is a sponsorship?

A sponsorship is an agreement where a local business supports your project in exchange for something valuable to them. It's a win-win arrangement.

### What local businesses can offer

| Type of Support | Example |
|----------------|---------|
| Materials | A bakery donates flour; a craft shop offers discount materials |
| Space | A cafe lets you sell on Saturdays; a shop gives you window space |
| Expertise | A graphic designer helps with your logo; an accountant reviews your budget |
| Promotion | A business shares your project on their social media or puts up your poster |
| Money | Direct financial sponsorship (less common for students, but possible) |

### What you offer in return

Businesses sponsor because they get something too:
- **Community goodwill** — "We support young entrepreneurs!"
- **Social media mention** — Tag them in your posts
- **Logo on your materials** — Printed on flyers, packaging
- **Project update thanks** — Name them in backer updates
- **Customer referral** — Direct your customers their way

### How to approach a local business

**Step 1: Research** — Find businesses connected to your project (a bakery for a food business, a tech shop for a coding club)

**Step 2: Prepare a one-page proposal** including:
- What your project is (2-3 sentences)
- What you're asking for (specific and reasonable)
- What's in it for them (the benefits you'll provide)
- Your Futurepreneurs project link

**Step 3: Make contact** — Visit in person with your teacher/parent or send an email. Be professional but friendly.

**Step 4: Follow up** — If you don't hear back in a week, send one polite follow-up.

### The approach email template

> Subject: Student Business Partnership — [Your Business Name]
>
> Dear [Name/Manager],
>
> I'm a student running a [type of business] project through Futurepreneurs, a safe crowdfunding platform for young entrepreneurs.
>
> I was wondering if [specific request — e.g., "you might be able to offer a small discount on baking supplies" or "you'd be willing to share our project on your social media"].
>
> In return, I'd love to [specific benefit — e.g., "mention your shop in all our social media posts and project updates"].
>
> Here's my project: [Futurepreneurs link]
>
> I'd be happy to come in with my teacher to discuss this further.
>
> Thank you for your time!
> [Display name]

### Top tip

Start small. Don't ask for £500 sponsorship — ask for a 10% discount, a shared social media post, or 30 minutes of advice. Small asks lead to bigger relationships over time.`,
      quiz: [
        {
          question: 'What is a sponsorship?',
          options: [
            { text: 'A business giving you money for nothing in return', isCorrect: false },
            { text: 'A win-win arrangement where a business supports you in exchange for something valuable', isCorrect: true },
            { text: 'A type of loan from a local bank', isCorrect: false },
            { text: 'A government grant for young people', isCorrect: false },
          ],
          explanation: 'A sponsorship is a mutually beneficial arrangement. The business supports you (with materials, space, promotion, or money) and you provide value in return (social media mentions, logo placement, goodwill).',
        },
        {
          question: 'What should you include in a sponsorship proposal?',
          options: [
            { text: 'Just your project link', isCorrect: false },
            { text: 'What your project is, what you\'re asking for, and what\'s in it for them', isCorrect: true },
            { text: 'A long essay about your business dreams', isCorrect: false },
            { text: 'How much money you need in total', isCorrect: false },
          ],
          explanation: 'A good proposal covers: what your project is, what specific support you\'re asking for, and what benefits the business gets in return. Keep it one page, clear and professional.',
        },
        {
          question: 'What is the best way to approach a local business?',
          options: [
            { text: 'Send a DM on social media', isCorrect: false },
            { text: 'Visit in person with your teacher or parent, or send a professional email', isCorrect: true },
            { text: 'Call them during their busiest hour', isCorrect: false },
            { text: 'Ask a friend to ask for you', isCorrect: false },
          ],
          explanation: 'Either visit in person (with a parent or teacher for credibility and safety) or send a professional email. Both approaches show you\'re serious and prepared.',
        },
        {
          question: 'What is the best first ask from a local business?',
          options: [
            { text: 'A large cash donation', isCorrect: false },
            { text: 'Something small like a discount, shared social media post, or advice', isCorrect: true },
            { text: 'Full sponsorship of your entire project', isCorrect: false },
            { text: 'Free products to sell', isCorrect: false },
          ],
          explanation: 'Start small! Ask for a discount, a social media share, or advice. Small asks are easy for businesses to say yes to, and they can lead to bigger relationships over time.',
        },
        {
          question: 'Why would a local business want to sponsor a student project?',
          options: [
            { text: 'They\'re legally required to support students', isCorrect: false },
            { text: 'Community goodwill, positive social media exposure, and supporting young entrepreneurs', isCorrect: true },
            { text: 'They expect to make a profit from your business', isCorrect: false },
            { text: 'They get a tax break', isCorrect: false },
          ],
          explanation: 'Businesses benefit from community goodwill ("We support young entrepreneurs!"), social media mentions, and positive PR. Supporting a student project makes them look great in the community.',
        },
      ],
      tasks: [
        {
          id: 'sponsor-research',
          title: 'Identify 3 Potential Sponsors',
          description: 'Research 3 local businesses that connect to your project. For each, note: what they sell, what you could ask for, and what you could offer in return.',
          type: 'research',
        },
        {
          id: 'write-proposal',
          title: 'Draft a Sponsorship Email',
          description: 'Using the template, write a sponsorship approach email to one of your identified businesses. Have your teacher or parent review it before sending.',
          type: 'exercise',
        },
      ],
    },
    {
      id: 'updates-that-engage',
      title: 'Updates That Engage',
      readingTime: 3,
      content: `## Updates That Engage

Once your project is live, posting updates keeps backers excited and can attract new supporters. Updates show your project is active and your money is being well spent.

### When to post updates

- **Launch day** — Thank early backers and share excitement
- **25% funded** — Show momentum building
- **50% funded** — "Halfway there!" is a big milestone
- **75% funded** — Create urgency to reach the goal
- **Fully funded** — Celebrate and thank everyone!
- **Each milestone completed** — Show what you did with the money
- **Weekly** during active campaign — Keep momentum going

### The 4-part update formula

Every update should include:

1. **Progress** — What's happened since the last update?
2. **Gratitude** — Thank your backers (use display names only)
3. **Next steps** — What are you working on next?
4. **Visual** — A photo or video as proof of progress

### Example update

> **"We're 60% funded — first ingredient order placed!"** 🎉
>
> Thanks to 15 amazing backers, we've reached £90! This week I used our first milestone to order flour, sugar, and baking equipment from Tesco.
>
> [Photo of ingredients on the kitchen counter]
>
> Next milestone: packaging! Once we hit £120, I'll order our custom cake boxes with our logo.
>
> Huge thank you to BrightStar22, EcoWarrior7, and all our backers — you're making this happen!
>
> **Just £60 to go. Know someone who might support us? Share the link!**

### Keeping backers informed after funding

Don't go silent once funded! Post updates showing:
- Purchases being made
- Products being created
- First sales happening
- Lessons learned along the way

This transforms backers from one-time donors into long-term supporters.

### Update mistakes to avoid

- Going weeks without posting
- Only asking for more shares/donations
- Posting without a photo or video
- Being negative without offering solutions
- Revealing personal information

### Top tip

Set a reminder every Sunday: "Write Monday update." Consistency builds trust. Even a quick 3-sentence update with a photo shows your project is alive and well.`,
      quiz: [
        {
          question: 'What are the 4 parts of a good project update?',
          options: [
            { text: 'Title, body, links, hashtags', isCorrect: false },
            { text: 'Progress, gratitude, next steps, and a visual', isCorrect: true },
            { text: 'Introduction, problem, solution, conclusion', isCorrect: false },
            { text: 'Budget, timeline, risks, ask', isCorrect: false },
          ],
          explanation: 'Every great update includes: Progress (what\'s happened), Gratitude (thanking backers), Next Steps (what\'s coming), and a Visual (photo or video as proof). This formula keeps backers engaged!',
        },
        {
          question: 'How often should you post updates during an active campaign?',
          options: [
            { text: 'Only when you hit your goal', isCorrect: false },
            { text: 'Weekly, plus at each major funding milestone', isCorrect: true },
            { text: 'Three times per day', isCorrect: false },
            { text: 'Once at the start and once at the end', isCorrect: false },
          ],
          explanation: 'Weekly updates plus posts at major milestones (25%, 50%, 75%, 100% funded) keep your project visible and backers engaged. Consistency is more important than frequency.',
        },
        {
          question: 'Why should you continue posting updates AFTER your project is fully funded?',
          options: [
            { text: 'To ask for more donations', isCorrect: false },
            { text: 'To show backers how their money is being used and turn them into long-term supporters', isCorrect: true },
            { text: 'Because Futurepreneurs requires it', isCorrect: false },
            { text: 'To show off your success', isCorrect: false },
          ],
          explanation: 'Post-funding updates show backers their money is being used well. This builds trust and can transform one-time donors into long-term supporters of your future projects!',
        },
        {
          question: 'What is the biggest update mistake?',
          options: [
            { text: 'Posting too many photos', isCorrect: false },
            { text: 'Going weeks without any update', isCorrect: true },
            { text: 'Thanking too many backers', isCorrect: false },
            { text: 'Being too excited about progress', isCorrect: false },
          ],
          explanation: 'Going silent is the worst thing you can do. Backers start to worry their money isn\'t being used properly. Even a quick update shows your project is alive and you\'re working hard.',
        },
        {
          question: 'What should you avoid sharing in updates?',
          options: [
            { text: 'Photos of your product being made', isCorrect: false },
            { text: 'Personal information like your school name or address', isCorrect: true },
            { text: 'Your funding progress', isCorrect: false },
            { text: 'Thank-you messages to backers', isCorrect: false },
          ],
          explanation: 'Never share personal information in updates — no school names, addresses, or real names. Use display names only. Safety rules apply to updates just as much as to your main project page.',
        },
      ],
      tasks: [
        {
          id: 'first-update',
          title: 'Draft Your Launch Update',
          description: 'Write your launch day update using the 4-part formula: progress, gratitude, next steps, and what photo/video you\'ll include.',
          type: 'exercise',
        },
        {
          id: 'update-schedule',
          title: 'Create an Update Schedule',
          description: 'Plan when you\'ll post updates during your campaign. Write the date and topic for at least 4 updates (launch day, 25%, 50%, 75%).',
          type: 'exercise',
        },
      ],
    },
  ],
};
