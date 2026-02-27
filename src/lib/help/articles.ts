export interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  roles: ('student' | 'teacher' | 'parent' | 'investor' | 'all')[];
  tags: string[];
  relatedArticles: string[];
}

export const helpArticles: HelpArticle[] = [
  // ── Getting Started ──
  {
    id: 'gs-1', slug: 'what-is-futurepreneurs', title: 'What is Futurepreneurs?', category: 'getting-started',
    summary: 'A quick introduction to the platform and what it does.',
    roles: ['all'],
    tags: ['introduction', 'overview', 'platform'],
    relatedArticles: ['gs-2', 'gs-3'],
    content: `Futurepreneurs is a crowdfunding platform designed specifically for young people under 18 in the United Kingdom. It helps students raise money for their business ideas in a safe, supervised environment.\n\n**How it works:**\n- Students create a project with a funding goal and milestones\n- A teacher at their school verifies the project\n- A parent or guardian gives consent\n- The project goes live and the public can support it\n- Once funded, students can draw down money against milestones with teacher approval\n\n**Key features:**\n- All-or-nothing funding — backers are only charged if the project reaches its goal\n- Teacher verification ensures every project is legitimate\n- Parental consent keeps parents informed and in control\n- Milestone-based drawdowns teach financial responsibility\n- Maximum funding goal of £10,000`,
  },
  {
    id: 'gs-2', slug: 'creating-an-account', title: 'Creating an Account', category: 'getting-started',
    summary: 'How to sign up for Futurepreneurs as a student, teacher, parent, or supporter.',
    roles: ['all'],
    tags: ['signup', 'register', 'account', 'school email'],
    relatedArticles: ['gs-1', 'gs-3', 'ap-1'],
    content: `**Students:** You need a school-issued email address to sign up. Personal emails (Gmail, Outlook, etc.) are not accepted. During signup, select "Student" as your role and enter your school email.\n\n**Teachers:** Sign up with your school email address and select "Teacher" as your role. Your school domain will be verified.\n\n**Parents:** Select "Parent" as your role. You'll be able to link to your child's account and give consent for their projects.\n\n**Supporters:** Anyone over 18 can create a supporter account with any email address. You can also back projects as a guest without creating an account.\n\n**Steps:**\n1. Go to the Sign Up page\n2. Choose your role\n3. Enter your details and email\n4. Verify your email address\n5. Complete your profile`,
  },
  {
    id: 'gs-3', slug: 'navigating-the-dashboard', title: 'Navigating Your Dashboard', category: 'getting-started',
    summary: 'An overview of the dashboard and what each section does.',
    roles: ['all'],
    tags: ['dashboard', 'navigation', 'overview'],
    relatedArticles: ['gs-2', 'ap-1'],
    content: `Your dashboard is your home base on Futurepreneurs. What you see depends on your role:\n\n**Students see:**\n- My Projects — all your created projects\n- Create New Project — start a new funding campaign\n- Trophy Room — badges and achievements\n- Learning Hub — business lessons and modules\n- Notifications — updates on your projects\n\n**Teachers see:**\n- Project Verification — projects waiting for your approval\n- Drawdown Requests — fund release requests to review\n- My Students' Projects — all projects you mentor\n\n**Parents see:**\n- Parent Hub — overview of your child's activity\n- Consent Requests — projects needing your consent\n- Wallet — manage your child's spending card\n- Activity Timeline — everything that's happened\n\n**Supporters see:**\n- Projects I've Backed — track your contributions\n- Project Updates — news from projects you support`,
  },
  {
    id: 'gs-4', slug: 'school-email-verification', title: 'School Email Verification', category: 'getting-started',
    summary: 'Why we require a school email and how to get verified.',
    roles: ['student', 'teacher'],
    tags: ['school', 'email', 'verification', 'domain'],
    relatedArticles: ['gs-2', 'st-1'],
    content: `We require school-issued email addresses for students and teachers to verify your identity and school affiliation. This is a key safety measure.\n\n**Why school emails?**\n- Confirms you are a real student or teacher\n- Links you to a verified UK school\n- Prevents fake accounts\n- Enables teacher-student connections within the same school\n\n**What if my school email doesn't work?**\nWe maintain a list of verified UK school email domains. If your school isn't listed, contact us at hello@futurepreneurs.co.uk and we'll add it.\n\n**What counts as a school email?**\nEmails from domains like .sch.uk, .ac.uk, or custom school domains (e.g., @myschool.org.uk) are typically accepted. Personal email providers are not accepted.`,
  },
  // ── Account & Profile ──
  {
    id: 'ap-1', slug: 'updating-your-profile', title: 'Updating Your Profile', category: 'account-profile',
    summary: 'How to change your name, avatar, and profile settings.',
    roles: ['all'],
    tags: ['profile', 'settings', 'avatar', 'name'],
    relatedArticles: ['ap-2', 'gs-3'],
    content: `You can update your profile from the Dashboard:\n\n1. Click your avatar in the top-right corner (or navigate to Dashboard → Profile)\n2. Update your full name, display name, or bio\n3. Upload or change your avatar image\n4. Click Save\n\n**What's public?**\n- Students: Your name appears on your project pages\n- Teachers: Your name appears as the mentor on verified projects\n- Supporters: Your name appears in backer lists (unless you choose to back anonymously)\n\n**Can I change my email?**\nYour email is linked to your account authentication. To change it, contact us at hello@futurepreneurs.co.uk.`,
  },
  {
    id: 'ap-2', slug: 'managing-notifications', title: 'Managing Notifications', category: 'account-profile',
    summary: 'How to control what notifications you receive.',
    roles: ['all'],
    tags: ['notifications', 'email', 'alerts'],
    relatedArticles: ['ap-1'],
    content: `Futurepreneurs sends notifications for important events related to your account.\n\n**On-platform notifications:**\n- View all notifications from the bell icon in your dashboard\n- Mark individual notifications as read\n- Notifications cover: project updates, funding milestones, drawdown approvals, consent requests, and more\n\n**Email notifications:**\nWe send emails for critical events such as:\n- Account verification\n- Project approval/rejection\n- Funding milestones reached\n- Drawdown requests and approvals\n- Parental consent requests\n\nThese transactional emails cannot be turned off as they contain essential information about your account activity.`,
  },
  // ── Projects ──
  {
    id: 'pj-1', slug: 'creating-a-project', title: 'Creating a Project', category: 'projects',
    summary: 'Step-by-step guide to creating your first crowdfunding project.',
    roles: ['student'],
    tags: ['create', 'project', 'new', 'form', 'milestones'],
    relatedArticles: ['pj-2', 'pj-3', 'pj-4'],
    content: `**Before you start:**\n- Have a clear business idea\n- Know how much money you need (up to £10,000)\n- Plan your milestones (how you'll spend the money)\n- Know which teacher will mentor your project\n\n**Steps:**\n1. From your dashboard, click "Create New Project"\n2. Enter your project title and choose a category\n3. Write a compelling description — explain your idea, why it matters, and what you'll do with the funding\n4. Set your funding goal (the total amount you need)\n5. Add milestones — break your goal into specific spending items (e.g., "Buy materials — £200")\n6. Upload images or a video to showcase your idea\n7. Select your teacher/mentor from the dropdown\n8. Review everything and submit\n\n**What happens next?**\nYour project goes to your teacher for verification, then to your parent for consent. Once both approve, it goes live!`,
  },
  {
    id: 'pj-2', slug: 'project-verification', title: 'How Project Verification Works', category: 'projects',
    summary: 'Understanding the teacher verification and parental consent process.',
    roles: ['student', 'teacher', 'parent'],
    tags: ['verification', 'approval', 'consent', 'teacher', 'parent'],
    relatedArticles: ['pj-1', 'ft-1', 'fp-1'],
    content: `Every project goes through a two-step approval process before going live:\n\n**Step 1: Teacher Verification**\n- Your selected teacher reviews your project\n- They check that it's a genuine business idea, the content is appropriate, the goal is realistic, and the milestones make sense\n- The teacher can approve, request changes, or reject\n\n**Step 2: Parental Consent**\n- Once the teacher approves, your parent/guardian is notified\n- They review the project details and milestones\n- They can approve or decline\n\n**Once both approve:**\n- Your project status changes to "Live"\n- It appears on the browse page for supporters to find\n- Supporters can start backing your project\n\n**How long does it take?**\nThis depends on your teacher and parent. We recommend talking to both before submitting so they know to expect it.`,
  },
  {
    id: 'pj-3', slug: 'editing-a-project', title: 'Editing Your Project', category: 'projects',
    summary: 'What you can and can\'t change after submitting your project.',
    roles: ['student'],
    tags: ['edit', 'update', 'modify', 'change'],
    relatedArticles: ['pj-1', 'pj-4'],
    content: `**Before going live:**\nYou can edit most aspects of your project while it's in draft or pending verification. Changes made after teacher approval may require re-verification.\n\n**After going live:**\nSome fields can still be updated:\n- Project description and images\n- Project updates (to keep backers informed)\n\nYou cannot change:\n- Funding goal (once live)\n- Milestones (once live)\n- Category\n\n**Posting updates:**\nOnce your project is live, you can post updates to keep your backers informed about your progress. This is a great way to build trust and encourage more support.`,
  },
  {
    id: 'pj-4', slug: 'project-categories', title: 'Project Categories', category: 'projects',
    summary: 'Understanding the available categories for your project.',
    roles: ['student'],
    tags: ['category', 'type', 'classification'],
    relatedArticles: ['pj-1'],
    content: `When creating your project, you'll choose a category that best describes your business idea:\n\n- **Technology** — apps, websites, gadgets, software\n- **Food & Drink** — bakeries, catering, food products\n- **Arts & Crafts** — handmade products, artwork, design\n- **Services** — tutoring, cleaning, pet care, events\n- **Fashion** — clothing, accessories, jewellery\n- **Social Enterprise** — projects with a social or environmental mission\n- **Media & Content** — podcasts, videos, publications\n- **Other** — anything that doesn't fit the above\n\nChoose the category that's the closest match. This helps supporters find projects they're interested in.`,
  },
  // ── Funding & Payments ──
  {
    id: 'fp-1', slug: 'how-funding-works', title: 'How Funding Works', category: 'funding-payments',
    summary: 'Understanding the all-or-nothing funding model.',
    roles: ['all'],
    tags: ['funding', 'all-or-nothing', 'goal', 'backers'],
    relatedArticles: ['fp-2', 'fp-3'],
    content: `Futurepreneurs uses an **all-or-nothing funding model**:\n\n- Supporters pledge money to your project\n- Their card is **not charged** at the time of pledging\n- If your project reaches its funding goal, all backers are charged and you receive the funds (minus the platform fee)\n- If your project does **not** reach its goal, no one is charged and no money changes hands\n\n**Why all-or-nothing?**\nThis protects students from receiving partial funding that isn't enough to execute their business plan. It also protects backers — they know the project will only go ahead if it's fully funded.\n\n**Is there a time limit?**\nThere is no time limit on campaigns. Your project stays live until it reaches its goal or you choose to cancel it.`,
  },
  {
    id: 'fp-2', slug: 'payment-methods', title: 'Payment Methods', category: 'funding-payments',
    summary: 'What payment methods are accepted for backing projects.',
    roles: ['investor', 'all'],
    tags: ['payment', 'card', 'apple pay', 'google pay', 'stripe'],
    relatedArticles: ['fp-1', 'fp-3'],
    content: `We accept the following payment methods through our secure payment partner, Stripe:\n\n- **Debit and credit cards** (Visa, Mastercard, American Express)\n- **Apple Pay** (on supported devices)\n- **Google Pay** (on supported devices)\n\n**Is it safe?**\nAll payments are processed by Stripe, a PCI DSS Level 1 certified payment processor. We never see or store your card details. Your payment information goes directly to Stripe over an encrypted connection.\n\n**Guest checkout:**\nYou can support a project without creating an account. Guest backers receive email confirmations and updates about the project they've supported.`,
  },
  {
    id: 'fp-3', slug: 'platform-fees', title: 'Platform Fees', category: 'funding-payments',
    summary: 'How much does Futurepreneurs charge?',
    roles: ['all'],
    tags: ['fees', 'cost', 'percentage', 'platform fee'],
    relatedArticles: ['fp-1'],
    content: `**Platform fee: 2.5%**\n\nFuturepreneurs charges a 2.5% platform fee on successfully funded projects. This fee is only charged when a project reaches its funding goal.\n\n**Example:**\n- Funding goal: £1,000\n- Platform fee (2.5%): £25\n- Student receives: £975\n- (Standard payment processing fees from Stripe also apply)\n\n**What does the fee cover?**\n- Platform hosting and maintenance\n- Payment processing infrastructure\n- Safety and moderation systems\n- Customer support\n\n**When is the fee charged?**\nOnly when a project reaches its goal. If a project doesn't reach its goal, there are no fees at all.`,
  },
  // ── Drawdowns & Spending ──
  {
    id: 'ds-1', slug: 'requesting-a-drawdown', title: 'Requesting a Drawdown', category: 'drawdowns-spending',
    summary: 'How to request money from your funded project.',
    roles: ['student'],
    tags: ['drawdown', 'withdrawal', 'milestone', 'request'],
    relatedArticles: ['ds-2', 'pj-1'],
    content: `Once your project is fully funded, you can request to withdraw money against your milestones:\n\n1. Go to your project in the dashboard\n2. Click on the milestone you want to draw down\n3. Click "Request Drawdown"\n4. Your teacher/mentor will be notified\n5. Once your teacher approves, the funds are released\n\n**Important:**\n- You can only draw down against milestones you defined when creating the project\n- Each drawdown must be approved by your teacher\n- Parents can see all drawdown activity\n- A full audit trail is maintained\n\n**How long does approval take?**\nThis depends on your teacher. Talk to them beforehand so they know to expect the request.`,
  },
  {
    id: 'ds-2', slug: 'drawdown-approval-process', title: 'The Drawdown Approval Process', category: 'drawdowns-spending',
    summary: 'How teachers approve drawdown requests and what happens next.',
    roles: ['student', 'teacher'],
    tags: ['approval', 'teacher', 'drawdown', 'process'],
    relatedArticles: ['ds-1', 'ft-2'],
    content: `When a student requests a drawdown:\n\n1. **Student submits** a drawdown request against a specific milestone\n2. **Teacher is notified** via email and dashboard notification\n3. **Teacher reviews** the request — checking it matches the milestone purpose\n4. **Teacher approves or rejects** with optional feedback\n5. If approved, **funds are released** to the student's wallet\n6. **Parent is notified** of the approved drawdown\n\n**Teachers can reject** a drawdown if:\n- The request doesn't match the milestone purpose\n- They need more information from the student\n- There are concerns about how funds will be used\n\nRejected requests include feedback so the student can address the concerns and resubmit.`,
  },
  // ── Wallet & Card ──
  {
    id: 'wc-1', slug: 'how-the-wallet-works', title: 'How the Wallet Works', category: 'wallet-card',
    summary: 'Understanding the digital wallet and spending card system.',
    roles: ['student', 'parent'],
    tags: ['wallet', 'card', 'spending', 'digital'],
    relatedArticles: ['wc-2', 'wc-3'],
    content: `The Futurepreneurs wallet is a secure digital wallet that holds funds from approved drawdowns:\n\n**How it works:**\n- When a drawdown is approved, funds move to your wallet\n- You can request to spend from your wallet using the spending card\n- Spending requests go through a dual-approval process (parent + teacher)\n- Once approved, your card is funded for a 30-minute spending window\n- After the window closes, the card is automatically refrozen\n\n**Velocity limits:**\n- Per transaction: £100 maximum\n- Daily: £50 maximum\n- Weekly: £200 maximum\n\nThese limits are in place to teach responsible spending and protect young users.`,
  },
  {
    id: 'wc-2', slug: 'spending-approval-flow', title: 'Spending Approval Flow', category: 'wallet-card',
    summary: 'The dual-approval process for spending from your wallet.',
    roles: ['student', 'parent', 'teacher'],
    tags: ['spending', 'approval', 'dual-approval', 'parent', 'teacher'],
    relatedArticles: ['wc-1', 'wc-3'],
    content: `Spending from the wallet follows a dual-approval process:\n\n1. **Student requests** to spend a specific amount for a specific purpose\n2. **Parent reviews and approves** the spending request\n3. **Teacher/mentor reviews and approves** the spending request\n4. **Cooling-off period** — a brief wait before the card is activated\n5. **Card is funded** and active for a 30-minute spending window\n6. **Card auto-refreezes** after the window closes\n\n**Why dual approval?**\nThis ensures both the parent and teacher agree the spending is appropriate and aligned with the project milestones. It's a safety measure that teaches responsible financial management.`,
  },
  {
    id: 'wc-3', slug: 'velocity-limits', title: 'Spending Limits', category: 'wallet-card',
    summary: 'Understanding the daily, weekly, and per-transaction spending limits.',
    roles: ['student', 'parent'],
    tags: ['limits', 'velocity', 'spending', 'maximum'],
    relatedArticles: ['wc-1', 'wc-2'],
    content: `To protect young users and teach responsible spending, we have velocity limits:\n\n| Limit | Amount |\n|-------|--------|\n| Per transaction | £100 |\n| Daily limit | £50 |\n| Weekly limit | £200 |\n\n**What happens if I hit a limit?**\nYou won't be able to make further spending requests until the limit resets. Daily limits reset at midnight, weekly limits reset on Monday.\n\n**Can limits be changed?**\nThese limits are set by the platform and cannot be changed for individual users. They are designed to be appropriate for young people managing business expenses.`,
  },
  // ── Safety & Trust ──
  {
    id: 'st-1', slug: 'how-we-keep-you-safe', title: 'How We Keep You Safe', category: 'safety-trust',
    summary: 'An overview of all safety measures on the platform.',
    roles: ['all'],
    tags: ['safety', 'protection', 'safeguarding', 'security'],
    relatedArticles: ['st-2', 'st-3'],
    content: `Safety is built into every part of Futurepreneurs:\n\n**For students:**\n- School email verification confirms your identity\n- Teacher oversight on every project\n- Parental consent required before going live\n- Milestone-based drawdowns prevent misuse of funds\n- No direct messaging between users\n\n**For everyone:**\n- Content moderation by admin team\n- Reporting system for inappropriate content\n- Stripe handles all payment security\n- HTTPS encryption on all connections\n- UK GDPR and GDPR-K compliant data handling\n\n**Safeguarding:**\nWe have a dedicated Designated Safeguarding Lead (DSL) and a comprehensive child protection policy. See our Safeguarding Policy for full details.`,
  },
  {
    id: 'st-2', slug: 'reporting-content', title: 'Reporting Inappropriate Content', category: 'safety-trust',
    summary: 'How to report content that concerns you.',
    roles: ['all'],
    tags: ['report', 'flag', 'inappropriate', 'content', 'moderation'],
    relatedArticles: ['st-1', 'st-3'],
    content: `If you see content that concerns you, please report it:\n\n**On the platform:**\n1. Go to the project page with the concerning content\n2. Click the "Report" button\n3. Select the reason for your report\n4. Add any additional details\n5. Submit\n\n**By email:**\nEmail safety@futurepreneurs.co.uk with details of the content and why you're concerned.\n\n**What happens next?**\n- Reports are reviewed by a platform administrator within 24 hours\n- The content may be removed or the account suspended\n- You will not be identified to the person you reported\n- Safeguarding concerns are escalated immediately to our DSL\n\n**False reports:**\nPlease only report genuine concerns. Malicious or repeated false reports may be treated as a violation of our community guidelines.`,
  },
  {
    id: 'st-3', slug: 'data-privacy-safety', title: 'Your Data & Privacy', category: 'safety-trust',
    summary: 'How we handle your personal data and keep it secure.',
    roles: ['all'],
    tags: ['privacy', 'data', 'GDPR', 'security'],
    relatedArticles: ['st-1'],
    content: `We take your privacy seriously, especially for under-18 users:\n\n- We never sell your data to third parties\n- We don't use advertising cookies or tracking\n- Payment data is handled by Stripe — we never see your card details\n- We comply with UK GDPR and the ICO's Age-Appropriate Design Code\n- Parents can view and request deletion of their child's data\n\nFor full details, see our Privacy Policy and Cookie Policy.`,
  },
  // ── For Teachers ──
  {
    id: 'ft-1', slug: 'verifying-student-projects', title: 'Verifying Student Projects', category: 'for-teachers',
    summary: 'How to review and approve your students\' projects.',
    roles: ['teacher'],
    tags: ['verify', 'approve', 'review', 'student', 'project'],
    relatedArticles: ['ft-2', 'pj-2'],
    content: `As a teacher, you're the first line of quality control and safeguarding:\n\n**When a student selects you as their mentor:**\n1. You'll receive an email and dashboard notification\n2. Go to Dashboard → Project Verification\n3. Review the project details:\n   - Is this a genuine business idea?\n   - Is the content appropriate?\n   - Is the funding goal realistic?\n   - Do the milestones make sense?\n4. Click "Approve" or "Request Changes" with feedback\n\n**What to look for:**\n- Original, legitimate business idea by the student\n- Appropriate content (no offensive, misleading, or inappropriate material)\n- Realistic and achievable funding goal\n- Well-defined milestones that match the goal amount\n- No safety concerns`,
  },
  {
    id: 'ft-2', slug: 'approving-drawdowns', title: 'Approving Drawdown Requests', category: 'for-teachers',
    summary: 'How to handle student drawdown requests.',
    roles: ['teacher'],
    tags: ['drawdown', 'approve', 'funds', 'milestone'],
    relatedArticles: ['ft-1', 'ds-2'],
    content: `When a student requests a drawdown from a funded project:\n\n1. You'll receive a notification\n2. Go to Dashboard → the relevant project\n3. Review the drawdown request:\n   - Does it match the milestone purpose?\n   - Is the amount correct?\n   - Are there any concerns about fund usage?\n4. Approve or reject with feedback\n\n**If you reject:**\nProvide clear feedback so the student understands what needs to change. They can resubmit after addressing your concerns.\n\n**Your responsibility:**\nAs the mentor, you're responsible for ensuring funds are used for their intended purpose. If you have concerns at any point, you can contact the platform team.`,
  },
  {
    id: 'ft-3', slug: 'teacher-best-practices', title: 'Best Practices for Teacher Mentors', category: 'for-teachers',
    summary: 'Tips for effectively mentoring your students on the platform.',
    roles: ['teacher'],
    tags: ['mentor', 'best practices', 'tips', 'guidance'],
    relatedArticles: ['ft-1', 'ft-2'],
    content: `**Before the project:**\n- Discuss the business idea with your student before they submit\n- Help them set realistic goals and milestones\n- Explain the verification and drawdown process\n\n**During the campaign:**\n- Encourage regular project updates to build backer confidence\n- Check in with the student periodically\n- Be responsive to drawdown requests — students may have time-sensitive purchases\n\n**After funding:**\n- Review drawdown requests promptly\n- Help the student track spending against milestones\n- Celebrate their achievements!\n\n**If you have concerns:**\n- Flag any issues to the platform admin team immediately\n- Contact safeguarding@futurepreneurs.co.uk for safeguarding concerns\n- You can pause a project at any time if you have serious concerns`,
  },
  // ── For Parents ──
  {
    id: 'fp-p1', slug: 'giving-consent', title: 'Giving Consent for Your Child\'s Project', category: 'for-parents',
    summary: 'How the parental consent process works.',
    roles: ['parent'],
    tags: ['consent', 'parent', 'approval', 'permission'],
    relatedArticles: ['fp-p2', 'fp-p3', 'pj-2'],
    content: `When your child's project has been verified by their teacher, you'll be asked to give consent:\n\n1. You'll receive an email notification\n2. Log in and go to Dashboard → Consent Requests\n3. Review the project: title, description, funding goal, milestones, and who the teacher mentor is\n4. Click "Approve" to give consent, or "Decline" if you have concerns\n\n**What you're consenting to:**\n- The project going live and being publicly visible\n- Your child's name appearing on the project page\n- Supporters being able to fund the project\n- The teacher overseeing all fund releases\n\n**You can withdraw consent** at any time by contacting us. This will take the project offline.`,
  },
  {
    id: 'fp-p2', slug: 'parent-hub-overview', title: 'Using the Parent Hub', category: 'for-parents',
    summary: 'Your central place for monitoring your child\'s activity.',
    roles: ['parent'],
    tags: ['parent hub', 'monitoring', 'overview', 'activity'],
    relatedArticles: ['fp-p1', 'fp-p3'],
    content: `The Parent Hub is your central dashboard for staying informed about your child's activity on Futurepreneurs:\n\n**What you can see:**\n- **Projects** — all of your child's projects and their status\n- **Funding progress** — how much has been raised\n- **Drawdown activity** — every fund release request and its status\n- **Wallet balance** — how much is in their digital wallet\n- **Spending activity** — spending requests and card usage\n- **Activity timeline** — a chronological feed of all events\n\n**Notifications:**\nYou'll receive email notifications for major events like new consent requests, funding milestones, and drawdown approvals.`,
  },
  {
    id: 'fp-p3', slug: 'managing-wallet-as-parent', title: 'Managing Your Child\'s Wallet', category: 'for-parents',
    summary: 'How to approve spending requests and monitor the wallet.',
    roles: ['parent'],
    tags: ['wallet', 'spending', 'approval', 'card', 'parent'],
    relatedArticles: ['fp-p2', 'wc-1', 'wc-2'],
    content: `As a parent, you're part of the dual-approval process for spending:\n\n**When your child requests to spend:**\n1. You'll receive a notification\n2. Review the spending request: amount, purpose, and which milestone it relates to\n3. Approve or decline\n4. If you approve, the teacher must also approve before the card is activated\n\n**Spending limits:**\n- Per transaction: £100\n- Daily: £50\n- Weekly: £200\n\n**Your visibility:**\n- You can see all wallet transactions\n- You can see when the card is active and when it refreezes\n- You can see the full spending history\n\nThese safeguards ensure you always know how your child's project funds are being used.`,
  },
  // ── For Supporters ──
  {
    id: 'fs-1', slug: 'backing-a-project', title: 'How to Back a Project', category: 'for-supporters',
    summary: 'Step-by-step guide to supporting a young entrepreneur.',
    roles: ['investor', 'all'],
    tags: ['back', 'support', 'donate', 'fund', 'contribute'],
    relatedArticles: ['fs-2', 'fp-1'],
    content: `Supporting a young entrepreneur is easy:\n\n1. **Browse** projects on the platform\n2. **Find** a project that inspires you\n3. **Click "Back This Project"** on the project page\n4. **Choose** your contribution amount\n5. **Select** a reward tier (if available)\n6. **Enter** your payment details\n7. **Confirm** your support\n\n**Remember:** Your card is not charged immediately. It's only charged if the project reaches its funding goal (all-or-nothing funding).\n\n**Guest checkout:** You can support projects without creating an account. You'll receive email updates about the project.`,
  },
  {
    id: 'fs-2', slug: 'tracking-your-contributions', title: 'Tracking Your Contributions', category: 'for-supporters',
    summary: 'How to see what you\'ve supported and get updates.',
    roles: ['investor'],
    tags: ['track', 'contributions', 'backed', 'updates'],
    relatedArticles: ['fs-1'],
    content: `If you have a supporter account:\n\n1. Go to Dashboard → Projects I've Backed\n2. See all projects you've supported\n3. Track their funding progress\n4. Read updates from the student\n\n**Project updates:**\nStudents can post updates about their progress. You'll see these in your dashboard and may receive email notifications.\n\n**What if a project doesn't reach its goal?**\nYour card is not charged and no money changes hands. You'll be notified if a project you supported doesn't reach its goal.`,
  },
  // ── Troubleshooting ──
  {
    id: 'ts-1', slug: 'cant-log-in', title: 'I Can\'t Log In', category: 'troubleshooting',
    summary: 'Common login issues and how to resolve them.',
    roles: ['all'],
    tags: ['login', 'password', 'reset', 'locked', 'error'],
    relatedArticles: ['ts-2', 'gs-2'],
    content: `**Common login issues:**\n\n**Wrong password:**\nDouble-check your password. Passwords are case-sensitive.\n\n**Forgotten password:**\nClick "Forgot password?" on the login page. You'll receive an email with a reset link.\n\n**Email not recognised:**\nMake sure you're using the same email you signed up with. Students must use their school email.\n\n**Account not verified:**\nCheck your email (including spam/junk folders) for a verification link. Click it to activate your account.\n\n**Still stuck?**\nContact us at hello@futurepreneurs.co.uk and we'll help you get back in.`,
  },
  {
    id: 'ts-2', slug: 'payment-issues', title: 'Payment Issues', category: 'troubleshooting',
    summary: 'Troubleshooting problems with payments and backing.',
    roles: ['investor', 'all'],
    tags: ['payment', 'error', 'declined', 'failed', 'stripe'],
    relatedArticles: ['ts-1', 'fp-2'],
    content: `**Card declined:**\n- Check your card details are entered correctly\n- Ensure your card hasn't expired\n- Check you have sufficient funds\n- Some banks block online payments by default — contact your bank if needed\n\n**Payment processing error:**\n- Try again in a few minutes\n- Try a different payment method\n- Clear your browser cache and cookies\n\n**Charged but don't see my backing:**\nPayments can take a few moments to process. Refresh the page. If it still doesn't appear after 15 minutes, contact us.\n\n**Refund issues:**\nIf a project doesn't reach its goal, no charge is made. For funded project refunds, see our Terms of Service or contact hello@futurepreneurs.co.uk.`,
  },
  {
    id: 'ts-3', slug: 'school-not-listed', title: 'My School Isn\'t Listed', category: 'troubleshooting',
    summary: 'What to do if your school email domain isn\'t recognised.',
    roles: ['student', 'teacher'],
    tags: ['school', 'domain', 'not listed', 'missing', 'registration'],
    relatedArticles: ['gs-4', 'gs-2'],
    content: `If your school email domain isn't recognised during registration:\n\n1. Double-check you're using your school-issued email (not a personal email)\n2. Make sure you've typed the email correctly\n3. If your school email genuinely isn't recognised, email us at hello@futurepreneurs.co.uk with:\n   - Your school name\n   - Your school's website URL\n   - The email domain (e.g., @myschool.sch.uk)\n\nWe'll verify the school and add the domain within 1-2 working days. We'll email you when it's been added so you can complete your registration.`,
  },
];

export function getArticlesByCategory(categorySlug: string): HelpArticle[] {
  return helpArticles.filter((a) => a.category === categorySlug);
}

export function getArticleBySlug(slug: string): HelpArticle | undefined {
  return helpArticles.find((a) => a.slug === slug);
}

export function getArticleById(id: string): HelpArticle | undefined {
  return helpArticles.find((a) => a.id === id);
}

export function getRelatedArticles(article: HelpArticle): HelpArticle[] {
  return article.relatedArticles
    .map((id) => getArticleById(id))
    .filter((a): a is HelpArticle => !!a);
}
