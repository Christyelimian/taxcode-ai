import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/openrouter-client";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { success: false, error: "Query is required" },
        { status: 400 }
      );
    }
    
    // Use AI to understand user intent and extract search parameters
    const systemPrompt = `You are a search assistant for a tax consultant directory covering Nigeria and other countries.

Available consultant specialties include:
- Tax Compliance, Tax Planning, Tax Disputes, Tax Litigation
- VAT, PAYE, Withholding Tax, Corporate Tax, Personal Income Tax
- Audit & Assurance, Accounting, Bookkeeping
- Transfer Pricing, International Tax, Cross-border Tax
- Tax Registration, Tax Filing, Tax Refunds
- FIRS Audits, TAT Appeals, Taxpayer Rights

Available industries include:
- Corporate, Professional Services, E-commerce, Fintech
- Oil & Gas, Energy, Manufacturing, Retail
- SMEs, Startups, Individual Taxpayers
- Real Estate, Construction, Hospitality, Logistics

Analyze the user's query and extract:
1. Location (city, state, or country - default to "any" if not specified)
2. Specialty/topic (match to available specialties above)
3. Industry (match to available industries above)
4. Budget preference ("low" for ≤₦20k, "mid" for ₦20k-₦50k, "high" for ₦50k+, or "any")
5. Urgency ("today", "this_week", or "any")
6. Pro bono need (true/false)

Return ONLY valid JSON with this shape:
{"location": string, "specialty": string, "industry": string, "budget": "low"|"mid"|"high"|"any", "urgency": "today"|"this_week"|"any", "proBono": boolean}

Examples:
- "I need help with VAT filing in Lagos urgently" -> {"location": "Lagos", "specialty": "VAT", "industry": "", "budget": "any", "urgency": "today", "proBono": false}
- "Looking for free tax help for my small business" -> {"location": "any", "specialty": "Tax Compliance", "industry": "SMEs", "budget": "any", "urgency": "any", "proBono": true}
- "Tax dispute lawyer in Abuja for oil company" -> {"location": "Abuja", "specialty": "Tax Disputes", "industry": "Oil & Gas", "budget": "any", "urgency": "any", "proBono": false}
- "Need someone for FIRS audit response" -> {"location": "any", "specialty": "FIRS Audits", "industry": "", "budget": "any", "urgency": "any", "proBono": false}`;

    const { text } = await chatCompletion({
      model: process.env.OPENROUTER_MODEL || "anthropic/claude-3.5-sonnet",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
      temperature: 0.2,
      maxTokens: 200,
    });
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { success: false, error: "Failed to parse AI response" },
        { status: 500 }
      );
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return NextResponse.json({
      success: true,
      data: {
        location: parsed.location || "any",
        specialty: parsed.specialty || "",
        industry: parsed.industry || "",
        budget: parsed.budget || "any",
        urgency: parsed.urgency || "any",
        proBono: parsed.proBono || false,
      },
    });
  } catch (error: any) {
    console.error("Error in AI search:", error);
    return NextResponse.json(
      { success: false, error: error.message || "AI search failed" },
      { status: 500 }
    );
  }
}




