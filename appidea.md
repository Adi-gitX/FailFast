# Premortem: AI-Powered Startup Failure Intelligence Platform

> **"Learn from others' failures before they become yours."**

---

## 🎯 Vision

Premortem is an AI-powered failure-intelligence platform that helps entrepreneurs, founders, and investors analyze startup ideas by learning from the failures of thousands of startups that came before. Instead of the traditional optimistic approach to startup validation, Premortem flips the script by performing a "premortem" — systematically identifying how and why your startup might fail before you invest time, money, and emotional energy into it.

---

## 💡 Core Problem

**90% of startups fail**, yet most founders approach their ideas with blind optimism. The information about why startups fail exists — buried in post-mortems, news articles, investment databases, and founder interviews — but it's:

- **Scattered** across thousands of sources
- **Unstructured** and hard to search
- **Time-consuming** to research manually
- **Not personalized** to your specific idea

Founders typically discover these failure patterns only after experiencing them firsthand, often when it's too late to pivot.

---

## 🚀 Solution

Premortem provides an **intelligent, AI-driven analysis pipeline** that:

1. **Decomposes** your startup idea into core components (value proposition, target market, business model, key assumptions)
2. **Retrieves** relevant failure patterns from a curated database of 5,000+ failed startups
3. **Synthesizes** insights by matching your idea against historical failure modes
4. **Scores** your risk across multiple dimensions with confidence levels

---

## ✨ Key Features

### 1. **Premortem Analysis Engine**
- Submit your startup idea in natural language
- AI breaks down your idea into testable components
- Receive a comprehensive risk assessment report in minutes

### 2. **Startup Graveyard**
- Explore 5,000+ documented startup failures
- Filter by industry, failure reason, funding stage, and year
- Learn from detailed post-mortems and founder insights

### 3. **Risk Scoring Dashboard**
- **Overall Risk Level**: CRITICAL / ELEVATED / MODERATE / LOW
- **Category Breakdown**:
  - Market Risk
  - Timing Risk
  - Regulatory Risk
  - Competition Risk
  - Execution Risk
- **Confidence Score**: How certain is the assessment (0-100%)

### 4. **Failure Modes Library**
- Pattern-matched failure scenarios specific to your idea
- Historical probability of each failure mode
- Typical timeframes when these failures occur
- Specific triggers and early warning signs
- Proven mitigation strategies

### 5. **Comparable Companies**
- Similar startups that failed (with reasons)
- Similar startups that survived (with key differences)
- Startups that pivoted successfully
- Funding amounts burned before failure

### 6. **Actionable Improvement Levers**
- Specific recommendations to reduce risk
- Impact vs. Effort prioritization matrix
- Step-by-step action items for each lever
- Categorized by: Product, Market, Business Model, Team, Timing

### 7. **Early Warning System**
- Signals to monitor after launch
- Thresholds that indicate trouble
- Recommended monitoring methods
- Urgency levels for each signal

### 8. **Collaboration Workspaces**
- Invite co-founders and advisors
- Assign tasks related to identified risks
- Role-based perspectives (CTO, CMO, CFO, Advisor, Investor)
- Real-time collaboration on mitigation plans

### 9. **Public Ideas Marketplace**
- Share your analyzed ideas publicly
- Discover validated ideas from the community
- Collaborate with others on promising concepts

---

## 🔧 Technical Architecture

### Frontend
- **Framework**: Next.js 16+ with App Router
- **Styling**: Modern CSS with design tokens
- **Animations**: Framer Motion
- **State Management**: Zustand
- **UI Components**: Custom components with dark mode support

### Backend/AI Pipeline
- **API**: Next.js API Routes
- **AI Provider**: Perplexity AI for grounded, citation-backed analysis
- **Database**: Supabase (PostgreSQL + Auth)
- **Pipeline Stages**:
  1. Decomposition (idea parsing)
  2. Retrieval (failure pattern matching)
  3. Synthesis (insight generation)
  4. Scoring (risk calculation)

### Data Sources
- `failedstartupdocs.md` - Curated database of 5,000+ startup failures
- `startupuideas.md` - Community-submitted startup ideas
- Real-time web search for current market conditions
- Citation-backed responses ensuring accuracy

---

## 💰 Business Model

### Subscription Tiers

| Tier | Price | Features |
|------|-------|----------|
| **FREE** | $0/mo | 2 analyses/month, Basic report, Graveyard access |
| **FOUNDER** | $29/mo | 15 analyses/month, Full reports, Export, Comparables |
| **TEAM** | $79/mo | 50 analyses/month, Workspaces, Team collaboration |
| **ACCELERATOR** | Custom | Unlimited, API access, White-label, Priority support |

---

## 🎯 Target Users

1. **First-time Founders** - Validate ideas before quitting their jobs
2. **Serial Entrepreneurs** - Pattern-match against their experience
3. **VCs & Angel Investors** - Quick due diligence on pitch decks
4. **Accelerators & Incubators** - Screen applications at scale
5. **Corporate Innovation Teams** - Internal venture validation
6. **Business School Students** - Learn from real failure examples

---

## 🏆 Competitive Advantage

| Feature | Premortem | Competitors |
|---------|-----------|-------------|
| Failure-focused analysis | ✅ | ❌ (mostly optimistic) |
| Citation-backed insights | ✅ | ❌ |
| 5,000+ failure database | ✅ | ❌ |
| Historical probability data | ✅ | ❌ |
| Comparable company matching | ✅ | Limited |
| Actionable mitigation steps | ✅ | Generic |

---

## 📈 Growth Strategy

### Phase 1: Build (Current)
- Core analysis engine ✅
- Startup Graveyard database ✅
- User authentication ✅
- Basic collaboration ✅

### Phase 2: Launch
- Public beta launch
- Content marketing (failure case studies)
- Partner with accelerators
- SEO for "startup validation" keywords

### Phase 3: Scale
- API access for integration
- Mobile app
- Browser extension for pitch deck analysis
- Investment firm partnerships

### Phase 4: Expand
- Pivot suggestion engine
- Success probability scoring
- Market timing recommendations
- Team composition analysis

---

## 🔮 Future Roadmap

- [ ] **Pivot Recommender**: When an idea is high-risk, suggest viable pivots
- [ ] **Founder Matching**: Connect with founders who tried similar ideas
- [ ] **Live Market Data**: Real-time competitive landscape analysis
- [ ] **Investor Network**: Match validated ideas with interested investors
- [ ] **AI Advisor**: Ongoing chat-based guidance throughout startup journey
- [ ] **Post-Mortem Submission**: Founders can contribute their own failures
- [ ] **Success Predictor**: ML model trained on both failures AND successes

---

## 📊 Key Metrics (Goals)

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Monthly Active Users | 5,000 | 25,000 | 100,000 |
| Paid Subscribers | 500 | 3,000 | 15,000 |
| MRR | $15K | $100K | $500K |
| Analyses Generated | 50,000 | 300,000 | 1.5M |
| Partnership Deals | 10 | 50 | 200 |

---

## 💬 Taglines & Messaging

- **"Fail Fast. In Theory."**
- **"Your startup's risk assessment, before day one."**
- **"Learn from 5,000+ failures. Avoid becoming #5,001."**
- **"The anti-optimism startup validator."**
- **"Premortem: Because hindsight is 20/20, but foresight is priceless."**

---

## 🛡️ Disclaimer Philosophy

Premortem explicitly frames all predictions as **non-deterministic**. Every report includes:

> *"This analysis is based on historical patterns and AI interpretation. It cannot predict the future with certainty. Many successful companies defied conventional wisdom. Use this as one input among many in your decision-making process."*

This honest framing builds trust and manages expectations while providing genuine value.

---

## 👥 Team Requirements

- **Founder/Product**: Vision, strategy, user experience
- **ML/AI Engineer**: Pipeline optimization, model fine-tuning
- **Full-Stack Developer**: Platform development, API design
- **Data Analyst**: Failure database curation, pattern identification
- **Content/Marketing**: Case studies, growth, community

---

## 📝 Summary

Premortem flips traditional startup validation on its head. Instead of asking "why will this succeed?", we ask "why will this fail?" — and more importantly, "how can we prevent it?"

By combining the collective wisdom of thousands of startup failures with cutting-edge AI analysis, Premortem gives founders the insight they need to either:

1. **Proceed with confidence** — understanding and mitigating key risks
2. **Pivot early** — before wasting resources on a flawed approach
3. **Walk away** — saving time and money for a better opportunity

**The best time to kill a bad idea is before you start building it.**

---

*Built with ❤️ for founders who want to succeed by learning from failure.*
