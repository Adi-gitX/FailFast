import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are StartupCheck, an unflinching startup analysis AI that gives founders the brutal truth about their ideas.

## Your Core Mission
Analyze startup ideas against historical failure patterns, current market data, and success factors. Never sugarcoat. Never encourage blindly. Always explain why with SPECIFIC examples and data.

## Analysis Framework - You MUST provide ALL sections:

### 🔴 BRUTAL REALITY CHECK (Why This Will Likely Fail)
- Compare to SPECIFIC failed startups with similar models
- Name exact companies that failed doing this
- Cite specific failure patterns and statistics
- Identify market timing issues
- Calculate rough unit economics challenges

### 🟡 COMPETITIVE LANDSCAPE (Why This Is Not Unique)  
- List SPECIFIC existing competitors by name with their websites
- What are competitors doing better
- Market saturation analysis
- Moat potential (or lack thereof)

### 🟢 SUCCESS PATHWAYS (How This Could Succeed)
- Specific conditions required for success
- Which exact niches might work better
- Timing considerations
- Required resources and milestones

### 🔄 PIVOT SUGGESTIONS (Better Versions)
- 2-3 specific alternative approaches
- Adjacent markets with better dynamics
- Different business models for same core idea

### 📊 PROBABILITY ASSESSMENT
Provide specific percentages:
- Success Likelihood: X%
- Failure Risk: X%  
- Time-to-Failure Estimate: X-X months (if failure seems likely)

### 🔗 RESOURCES & LINKS
- Relevant YC companies in this space (with links to ycombinator.com/companies/)
- Competitor websites
- Market research sources
- Relevant reading/case studies

## Output Rules:
- NO hype language or motivational phrases
- ALWAYS cite specific company examples
- ALWAYS provide actual statistics when available
- Format with clear markdown headers
- Be brutally honest but constructive
- Include real URLs and resources when mentioning companies`;

export async function POST(request: NextRequest) {
    try {
        const { idea, failedStartups } = await request.json();

        if (!idea) {
            return NextResponse.json({ error: 'Idea is required' }, { status: 400 });
        }

        // Check if Gemini API key is configured
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({
                analysis: generateMockAnalysis(idea, failedStartups),
            });
        }

        // Build context from failed startups
        const failedContext = failedStartups
            ?.slice(0, 30)
            .map((s: { name: string; category: string; description: string; money_burned: string }) =>
                `- ${s.name} (${s.category}): ${s.description.slice(0, 150)}... Burned: ${s.money_burned}`
            )
            .join('\n') || '';

        const userPrompt = `
## STARTUP IDEA TO ANALYZE:
${idea}

## CONTEXT - RELEVANT FAILED STARTUPS FROM DATABASE:
${failedContext}

## YOUR TASK:
1. Search the web for current competitors, market data, and YC companies in this space
2. Analyze against the failed startups provided
3. Provide a comprehensive analysis following ALL sections in your instructions
4. Include specific company names, URLs, and statistics
5. Be brutally honest but provide actionable insights

Remember: The founder needs TRUTH with SPECIFIC DATA, not comfort.`;

        // Use Gemini with Google Search grounding for real-time data
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 4000,
            },
        });

        const result = await model.generateContent({
            contents: [
                { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\n' + userPrompt }] }
            ],
            // Enable Google Search grounding for real-time data
            tools: [{
                googleSearch: {}
            }],
        });

        const response = result.response;
        const analysis = response.text();

        return NextResponse.json({ analysis });
    } catch (error) {
        console.error('Analysis error:', error);

        // Return mock on error
        return NextResponse.json({
            analysis: generateMockAnalysis(
                (await request.clone().json()).idea,
                (await request.clone().json()).failedStartups
            ),
            error: 'Gemini API error, using fallback analysis'
        });
    }
}

// Enhanced mock analysis
function generateMockAnalysis(idea: string, failedStartups?: Array<{ name: string; category: string; money_burned: string }>) {
    const ideaLower = idea.toLowerCase();

    // Detect category from keywords
    let category = 'TECH';
    let specificFailures: string[] = [];

    if (ideaLower.includes('fitness') || ideaLower.includes('health') || ideaLower.includes('workout')) {
        category = 'HEALTH/FITNESS';
        specificFailures = ['Pact (shut down 2017)', 'Aaptiv (struggled)', 'ClassPass (multiple pivots)'];
    } else if (ideaLower.includes('food') || ideaLower.includes('meal') || ideaLower.includes('delivery')) {
        category = 'FOOD DELIVERY';
        specificFailures = ['Munchery ($125M burned)', 'Sprig ($60M burned)', 'Maple (shut down)'];
    } else if (ideaLower.includes('ai') || ideaLower.includes('artificial intelligence')) {
        category = 'AI/ML';
        specificFailures = ['Anki ($200M raised, bankrupt)', 'Kirobo', 'several AI chatbot startups'];
    } else if (ideaLower.includes('social') || ideaLower.includes('community')) {
        category = 'SOCIAL';
        specificFailures = ['Path ($80M raised)', 'Ello', 'Peach', 'Vine (acquired then shut)'];
    } else if (ideaLower.includes('crypto') || ideaLower.includes('blockchain') || ideaLower.includes('web3')) {
        category = 'CRYPTO/WEB3';
        specificFailures = ['FTX', 'Luna/Terra', 'Celsius', 'BlockFi'];
    }

    const relevantFailures = failedStartups?.slice(0, 5) || [];

    return `## 🔴 BRUTAL REALITY CHECK - Why This Will Likely Fail

### Pattern Match with Failed Startups
Your idea shares characteristics with these failed companies:
${specificFailures.map(f => `- **${f}**`).join('\n')}
${relevantFailures.map(f => `- **${f.name}** - Burned ${f.money_burned}`).join('\n')}

### Key Failure Risks
1. **Market Saturation** - The ${category} space has seen 200+ startups attempt similar models since 2015
2. **Unit Economics** - Customer acquisition in this space averages $80-150 per user
3. **Retention Challenges** - Industry average 30-day retention is only 15-25%
4. **Competition** - Well-funded incumbents have $100M+ war chests

### Historical Failure Rate
- **90%** of startups in ${category} fail within 3 years
- **Average runway before failure**: 18-24 months
- **Median capital burned**: $2-5M before shutdown

---

## 🟡 COMPETITIVE LANDSCAPE - Why This Is Not Unique

### Direct Competitors
| Company | Funding | Status |
|---------|---------|--------|
| Competitor A | $50M+ | Growing |
| Competitor B | $30M+ | Pivoted |
| Competitor C | $20M+ | Struggling |

### What They're Doing Better
- Established brand recognition and trust
- Existing user base and network effects
- Better unit economics through scale
- Deeper integration partnerships

### Your Differentiation Gap
- Value proposition needs 10x improvement, not 2x
- "AI-powered" is no longer a differentiator
- Feature parity is table stakes, not competitive advantage

---

## 🟢 SUCCESS PATHWAYS - How This Could Succeed

### Required Conditions
For this to work, you would need:

1. **Niche Dominance** - Own one specific vertical completely before expanding
2. **Unique Distribution** - Find a channel competitors aren't using (e.g., partnerships, embedded)
3. **10x Better UX** - Not marginally better, genuinely transformative
4. **Unfair Advantage** - Proprietary data, exclusive partnerships, or technical moat

### Specific Winning Strategies
- **Strategy 1**: Focus on enterprise B2B instead of consumer (3x higher LTV)
- **Strategy 2**: Geographic focus - dominate one city/region first
- **Strategy 3**: Become a platform/API rather than end-user product

### Success Timeline
- Month 1-3: Validate with 50 paying customers
- Month 4-6: Achieve $10K MRR
- Month 7-12: Reach product-market fit signals
- Year 2: Scale or die

---

## 🔄 PIVOT SUGGESTIONS - Better Versions

### Pivot Option 1: Go B2B Enterprise
Instead of consumer focus, sell to businesses. Higher margins (80%+ gross margins), stickier customers, and more predictable revenue.

### Pivot Option 2: Build the Picks & Shovels
Instead of being a player in the ${category} space, build tools that serve ALL players. Platform play is often more defensible.

### Pivot Option 3: Vertical SaaS
Pick one specific industry vertical and solve ALL their problems, not one problem for all industries.

---

## 📊 PROBABILITY ASSESSMENT

| Metric | Value | Reasoning |
|--------|-------|-----------|
| **Success Likelihood** | 8-12% | Based on ${category} historical rates |
| **Failure Risk** | 88-92% | Industry average |
| **Time-to-Failure** | 18-24 months | If fundamentals not addressed |
| **Funding Probability** | 20-30% | Seed round with strong team |

### Key Metrics to Improve Odds
- ✅ Pre-revenue validation with 100+ user interviews
- ✅ $10K+ MRR before raising
- ✅ <$50 CAC or unique distribution channel
- ✅ >40% monthly retention

---

## 🔗 RESOURCES & LINKS

### YC Companies in This Space
- Search on https://www.ycombinator.com/companies for competitors
- Review YC's startup advice library

### Market Research
- CB Insights for funding data
- Crunchbase for competitor analysis  
- ProductHunt for similar launches

### Recommended Reading
- "The Mom Test" - Customer validation
- "Zero to One" - Competition vs creation
- Review failed startup post-mortems on https://www.failory.com

---

*⚠️ This is a demo analysis. Add your Gemini API key in \`.env.local\` for real-time web search and personalized analysis.*

**Bottom Line**: The idea has elements that could work, but requires significant refinement. Focus on finding genuine differentiation and validating with paying customers before building.`;
}
