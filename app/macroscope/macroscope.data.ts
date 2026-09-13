export type MediaAsset = {
  src: string;
  width: number;
  height: number;
  alt: string;
  source: string;
};

export const navGroups = [
  {
    label: "Products",
    links: [
      ["Murmur", "#murmur"],
      ["Code Review", "#code-review"],
      ["Status", "#status"],
    ],
  },
  {
    label: "Company",
    links: [
      ["Blog", "https://macroscope.com/blog"],
      ["About", "https://macroscope.com/about"],
      ["Careers", "https://jobs.ashbyhq.com/macroscope"],
      ["Contact us", "mailto:contact@macroscope.com"],
    ],
  },
] as const;

export const mobileMenuLinks = [
  ["Murmur", "#murmur"],
  ["Code Review", "#code-review"],
  ["Status", "#status"],
  ["Pricing", "#pricing"],
  ["Blog", "https://macroscope.com/blog"],
  ["Docs", "https://docs.macroscope.com/"],
  ["About", "https://macroscope.com/about"],
  ["Careers", "https://jobs.ashbyhq.com/macroscope"],
  ["Contact us", "mailto:contact@macroscope.com"],
] as const;

export const heroPillars = [
  {
    title: "Murmur",
    badge: "beta",
    body: "Orchestrate cloud agents that write code and verify their work in isolated sandboxes.",
    href: "#murmur",
  },
  {
    title: "Code Review",
    body: "Review every change for correctness, security, tests, and regressions before it lands.",
    href: "#code-review",
  },
  {
    title: "Status",
    body: "See what changed, why it changed, and what needs attention across every repo and team.",
    href: "#status",
  },
] as const;

export const customerLogos: MediaAsset[] = [
  { src: "/assets/macroscope/customers/cars24.png", width: 146, height: 30, alt: "Cars24", source: "https://macroscope.com/assets/customer-logos/customer-logo-cars24.png" },
  { src: "/assets/macroscope/customers/lightfield.png", width: 130, height: 24, alt: "Lightfield", source: "https://macroscope.com/assets/customer-logos/customer-logo-lightfield.png" },
  { src: "/assets/macroscope/customers/pydantic.svg", width: 108, height: 22, alt: "Pydantic", source: "https://macroscope.com/assets/customer-logos/customer-logo-pydantic.svg" },
  { src: "/assets/macroscope/customers/parallel.svg", width: 112, height: 24, alt: "Parallel", source: "https://macroscope.com/assets/customer-logos/customer-logo06.svg" },
  { src: "/assets/macroscope/customers/tilt.svg", width: 52, height: 30, alt: "Tilt", source: "https://macroscope.com/assets/customer-logos/customer-logo-tilt.svg" },
  { src: "/assets/macroscope/customers/casa.png", width: 84, height: 28, alt: "Casa", source: "https://macroscope.com/assets/customer-logos/customer-logo01.png" },
  { src: "/assets/macroscope/customers/particle.png", width: 110, height: 22, alt: "Particle", source: "https://macroscope.com/assets/customer-logos/customer-logo10.png" },
  { src: "/assets/macroscope/customers/imprint.webp", width: 106, height: 28, alt: "Imprint", source: "https://macroscope.com/assets/customer-logos/customer-logo-imprint.webp" },
  { src: "/assets/macroscope/customers/unitedmasters.png", width: 112, height: 30, alt: "UnitedMasters", source: "https://macroscope.com/assets/customer-logos/customer-logo15.png" },
  { src: "/assets/macroscope/customers/customer-16.png", width: 112, height: 30, alt: "Customer", source: "https://macroscope.com/assets/customer-logos/customer-logo16.png" },
];

export const murmurEvents = [
  ["PR Opened", "#13868"],
  ["PR Comment", "Changes requested"],
  ["Checkrun Failure", "theme-store"],
  ["Merge Conflict", "ThemeProvider.tsx"],
] as const;

export const murmurFaq = [
  ["Are there any pre-requisites to using Murmur?", "We currently only support GitHub source control. We also recommend investing time to make your development environment sandbox-ready (so agents can use/modify/break services without disrupting your staging and production environments) to maximize your mileage with Murmur."],
  ["Is Murmur multiplayer or single player?", "See what your teammates are doing with Murmur, follow their agents and prompts, and steer tasks together. Visibility and steering are fully configurable."],
  ["How does pricing work?", "Our pricing model is usage based (no seat based charges) and based on your resource usage, including compute and storage costs. We will publish detailed pricing once Murmur is generally available."],
  ["How do access controls work?", "Use role bindings and service profiles to give every person and service account only the permissions and keys they need."],
] as const;

export const statusPoints = [
  { day: "22", pushed: 3800, landed: 494 },
  { day: "23", pushed: 5200, landed: 2184 },
  { day: "24", pushed: 8600, landed: 3440 },
  { day: "25", pushed: 7200, landed: 4032 },
  { day: "26", pushed: 5800, landed: 1160 },
  { day: "27", pushed: 6800, landed: 3264 },
  { day: "28", pushed: 9600, landed: 2496 },
  { day: "29", pushed: 4400, landed: 1716 },
] as const;

export const commitFeed = [
  ["AR", "Alex Rivera", "just now", "Added webhook support for payment retries and failed deliveries.", "3h 30m"],
  ["AN", "Angie Nunez", "20m ago", "Implemented streaming chatbot responses with inline fallback handling.", "2h 10m"],
  ["JM", "Jordan Mills", "46m ago", "Integrated Stripe usage billing with invoice finalization webhooks.", "5h 40m"],
  ["HW", "Helen Winstonship", "1h 12m ago", "Moved notifications to a queue-based delivery system.", "3h 50m"],
  ["MD", "Marco Devlin", "2h 05m ago", "Added cursor pagination and indexes for audit logs.", "1h 25m"],
] as const;

export const sprintItems = [
  ["Session middleware refactor", "Consolidated auth checks into a single middleware layer and removed deprecated token handlers from the request path."],
  ["Ledger reconciliation", "Matched payment events against ledger entries and tightened retry handling for disputed or delayed transactions."],
  ["Observability stack", "Expanded service traces and dashboards around CI, secrets rotation, and queue reliability work."],
  ["Onboarding funnel", "Improved the first-run workspace path and referral surfaces for new growth experiments."],
] as const;

export const videoCards = [
  { title: "Introducing Murmur", ariaLabel: "Play Introducing Murmur", youtubeId: "hiaZOuF4mIg", poster: "/assets/macroscope/videos/introducing-murmur.jpg" },
  { title: "Macroscope overview", ariaLabel: "Play Macroscope overview", youtubeId: "C0U14FH0okc", poster: "/assets/macroscope/videos/macroscope-overview.jpg" },
  { title: "Macroscope team workflow", ariaLabel: "Play Macroscope team workflow", youtubeId: "9TsxHfKjRqg", poster: "/assets/macroscope/videos/team-workflow.jpg" },
] as const;

export const securityClaims = [
  ["SOC 2 Type II compliant", "Visit our Trust Center to request copies of our audited documentation."],
  ["Encrypted in transit and at rest", "All customer data is encrypted at rest and in transit."],
  ["Architecturally isolated", "Customer Code is architecturally isolated and secured by design."],
  ["Zero model training", "Macroscope does not train models using your source code, and our agreements with model providers ensure they do not train using your IP."],
] as const;

export const pricingProducts = [
  {
    name: "Agent",
    tagline: "An engine for answers and actions",
    price: "$0.01",
    unit: "per credit",
    note: "1,000 credits/month included",
    features: ["Writes code and ships PRs", "Available via Slack, GitHub, API", "Connects to your tools"],
  },
  {
    name: "Code Review",
    tagline: "Catch bugs before you ship",
    price: "$0.05",
    unit: "per KB reviewed",
    note: "(10KB min per review) · varies by mode",
    features: ["Best-in-class bug detection", "Auto-fixes issues", "Auto-approves safe PRs", "Custom review rules"],
    modes: [["Budget", "$0.025"], ["Balanced · default", "$0.05"], ["Precise", "$0.06"], ["Ultra", "$0.20"]],
  },
  {
    name: "Status",
    tagline: "Understand what's changing",
    price: "$0.05",
    unit: "per commit",
    features: ["Commit summaries", "Sprint reports and weekly digests", "Project classification", "Productivity stats for devs and agents"],
  },
] as const;

export const murmurPricing = {
  title: "Murmur pricing",
  body: "Pricing is based on the compute and storage your agents use. Reach out for details.",
  cta: "Contact us",
  href: "mailto:enterprise@macroscope.com?subject=Murmur%20pricing",
} as const;

export const pricingPlans = [
  {
    name: "Teams",
    price: "$100 Free Usage",
    cta: "Get Started for Free",
    href: "https://app.macroscope.com/",
    features: ["Code Review: Catch bugs before you ship", "Status: Understand what's changing", "Agent: An engine for answers and actions", "Usage-based pricing", "Customize your spend controls"],
  },
  {
    name: "Enterprise",
    price: "enterprise@macroscope.com",
    cta: "Contact Us",
    href: "mailto:enterprise@macroscope.com",
    features: ["Everything in Teams", "Discounted pricing for longer commitments", "Priority support", "Custom MSA & DPA agreements", "SOC 2 Type II Report"],
  },
] as const;

export const spendControls = [
  ["Cap spend per review", "Limit cost on a single review or PR"],
  ["Set monthly budget limits", "Enforce a monthly spend ceiling"],
  ["Choose what gets reviewed", "Turn off auto-review by repo or label"],
  ["Specify what to ignore", "Exclude files from review"],
] as const;

export const pricingFaq = [
  ["Is there a free trial?", "Every new workspace receives $100 in free usage to get started."],
  ["What are credits?", "Credits are a usage-based billing unit for Macroscope's Agent features: Slack queries, Macros, Webhooks, and Check Run Agents. 1 credit = $0.01. Credit usage is calculated by taking the raw LLM cost of each agent run (based on your prompts and parameters), then adding a 5% markup, then dividing by the value of each credit ($0.01). Every workspace includes 1,000 free credits per month."],
  ["How does billing work?", "Macroscope uses a prepaid usage model. Each workspace has a single balance that covers Code Review, Status, and Agent, and decreases with usage. Enable Auto-refill to have your balance top up automatically when it falls below a threshold you configure, so there's no disruption."],
  ["How is diff size measured?", "Diff size is the raw byte size of the git diff that Macroscope reviews. Any files Macroscope doesn't review are excluded from the measurement."],
  ["How can I control my costs?", "You can set a monthly spend limit, per-review caps, and per-PR caps. You can also disable automatic code review on specific repos, trigger reviews on-demand, or specify which files Macroscope should ignore. Controls are configurable in settings."],
  ["Why usage-based instead of per-seat?", "Coding agents are changing how much code gets produced. Seats are no longer a useful proxy for how much code gets reviewed and processed. Usage-based pricing means your costs reflect the actual work Macroscope does for you."],
] as const;

export const testimonials = [
  { name: "Parag Agrawal", role: "CEO, Parallel", quote: "We are huge fans. It's the best code review tool we've tested and I personally love that we can avoid unnecessary status update meetings.", portrait: "/assets/macroscope/testimonials/parag-agrawal.jpg", width: 400, height: 400, source: "https://macroscope.com/assets/customers/parag.jpg" },
  { name: "Scott Belsky", role: "Cofounder of Behance @ Founder A24 Labs", quote: "Macroscope has become a core part of our engineering team, bringing some new superpowers in productivity and keeping us all aligned and up to speed on what's getting done every day.", portrait: "/assets/macroscope/testimonials/scott-belsky.jpeg", width: 800, height: 800, source: "https://macroscope.com/assets/customers/scottbelsky.jpeg" },
  { name: "Kaz Nejatian", role: "CEO, Opendoor", quote: "I filed a minor bug with @Macroscope at 9 am London time. By 3 pm London time (7 am SF time!) @kayvz personally responded and was fixing it. Founder mode.", portrait: "/assets/macroscope/testimonials/kaz-nejatian.jpg", width: 200, height: 200, source: "https://macroscope.com/assets/customers/kaz-nejatian.jpg" },
  { name: "Logan Fisher", role: "CPO & CTO, Parkhub", quote: "Macroscope just gets it. They've cracked the code on turning huge amounts of complex data into clear, actionable insights-and they've made it effortless for us to make smarter decisions, faster.", portrait: "/assets/macroscope/testimonials/logan-fisher.jpeg", width: 400, height: 400, source: "https://macroscope.com/assets/customers/logan%20fisher.jpeg" },
  { name: "Shane Mac", role: "CEO, XMTP Labs", quote: "Rarely do I see a product that helps everyone in the org save time and do more without asking us to do more. The team does less updating while leadership can see what's actually happening - and even ask questions about it - all without distracting anyone.", portrait: "/assets/macroscope/testimonials/shane-mac.jpeg", width: 400, height: 400, source: "https://macroscope.com/assets/customers/Shane%20Mac.jpeg" },
  { name: "Michael York", role: "CEO, Casa", quote: "Macroscope's commit summaries – drawing from their deep understanding of our projects and codebase – are the beating heart of our engineering organization. The kind of upgrade you can never imagine working without.", portrait: "/assets/macroscope/testimonials/michael-york.jpeg", width: 400, height: 400, source: "https://macroscope.com/assets/customers/Michael%20York.jpeg" },
  { name: "Nick Molnar", role: "CTO, XMTP Labs", quote: "We've used just about every AI-driven PR assistant out there: the signal to noise from Macroscope is the best I've seen. The PR descriptions are better than what we would have written by hand, and when it flags an issue it's almost always a real bug.", portrait: "/assets/macroscope/testimonials/nick-molnar.jpg", width: 400, height: 400, source: "https://macroscope.com/assets/customers/Nick%20Molnar.jpg" },
  { name: "Hardik Patil", role: "Product Lead at Anon", quote: "Macroscope makes it easy for me to stay on top of engineering progress and developer productivity, even as a solo product lead working with 8 engineers. Their support is ridiculously responsive, and they're super fast at shipping new features I requested.", portrait: "/assets/macroscope/testimonials/hardik-patil.jpeg", width: 800, height: 800, source: "https://macroscope.com/assets/customers/Hardik%20Patil.jpeg" },
  { name: "Marcel Molina", role: "CTO & Cofounder, Particle", quote: "Macroscope is like having a distinguished engineer tech lead who's read every diff, understands every project, and can answer any question about your codebase instantly. We can finally focus on shipping instead of process.", portrait: "/assets/macroscope/testimonials/marcel-molina.jpeg", width: 800, height: 800, source: "https://macroscope.com/assets/customers/Marcel%20Molina.jpeg" },
] as const;

export const footerGroups = [
  { label: "Products", links: [["Murmur", "#murmur"], ["Code Review", "#code-review"], ["Status", "#status"], ["Pricing", "#pricing"]] },
  { label: "Company", links: [["Blog", "https://macroscope.com/blog"], ["About", "https://macroscope.com/about"], ["Careers", "https://jobs.ashbyhq.com/macroscope"], ["Docs", "https://docs.macroscope.com/"], ["Brand Kit", "https://macroscope.com/brand-kit"]] },
] as const;

export const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/macroscopeai/", icon: "/assets/macroscope/social/linkedin.svg" },
  { label: "X", href: "https://x.com/macroscope", icon: "/assets/macroscope/social/x.svg" },
] as const;

export const pricingConstants = {
  averageReviewKb: 19,
  minimumReviewCost: 0.5,
  codeReviewPerKb: 0.05,
  statusPerCommit: 0.05,
  agentPerCredit: 0.01,
  includedAgentCredits: 1000,
} as const;
