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
    
    // AI to understand tax-related legal issues
    const systemPrompt = `You are a legal issue classifier for TaxCode's tax lawyer directory in Nigeria.

Your role is to analyze user queries and identify TAX-RELATED legal issues that require a lawyer (not just a tax consultant).

TAX-RELATED LEGAL PRACTICE AREAS:
- Tax Litigation (court cases against FIRS, state tax authorities)
- Tax Appeal Tribunal (TAT) matters
- Tax Disputes & Controversies
- FIRS Audits & Investigations (legal representation)
- Tax Compliance Issues (when legal action is needed)
- Tax Planning (complex legal structures)
- Transfer Pricing Disputes
- VAT Disputes (legal proceedings)
- Withholding Tax Issues (legal disputes)
- Corporate Tax Litigation
- Personal Income Tax Appeals
- Tax Fraud Defense
- Tax-related Contract Disputes
- Tax-related Employment Issues

NOT TAX LEGAL ISSUES (these go to tax consultants):
- General tax filing
- Tax calculations
- Basic compliance questions
- Tax registration
- Routine tax advice

Analyze the user's query and extract:
1. Practice Area (match to tax legal practice areas above, or "General Tax Law" if unclear)
2. Urgency Level ("emergency" for arrests/detention, "urgent" for court dates soon, "standard" otherwise)
3. Complexity ("simple" for straightforward, "moderate" for typical, "complex" for high-stakes)
4. Estimated Cost Range ("low" for ≤₦100k, "mid" for ₦100k-₦500k, "high" for ₦500k+)
5. Location (city, state, or "any")
6. Pro Bono Need (true/false - for low-income individuals)

Return ONLY valid JSON:
{"practiceArea": string, "urgency": "emergency"|"urgent"|"standard", "complexity": "simple"|"moderate"|"complex", "costRange": "low"|"mid"|"high", "location": string, "proBono": boolean, "description": string}

Examples:
- "FIRS is investigating my company for tax evasion" → {"practiceArea": "Tax Fraud Defense", "urgency": "urgent", "complexity": "complex", "costRange": "high", "location": "any", "proBono": false, "description": "FIRS investigation requiring legal defense"}
- "I need to appeal a TAT decision" → {"practiceArea": "Tax Appeal Tribunal", "urgency": "standard", "complexity": "moderate", "costRange": "mid", "location": "any", "proBono": false, "description": "TAT appeal filing and representation"}
- "FIRS locked my business for unpaid taxes" → {"practiceArea": "Tax Disputes & Controversies", "urgency": "urgent", "complexity": "moderate", "costRange": "mid", "location": "any", "proBono": false, "description": "Business closure due to tax dispute, needs immediate legal action"}
- "I can't afford a lawyer for my tax case" → {"practiceArea": "General Tax Law", "urgency": "standard", "complexity": "moderate", "costRange": "low", "location": "any", "proBono": true, "description": "Tax legal matter requiring pro bono assistance"}`;

    const { text } = await chatCompletion({
      model: process.env.OPENROUTER_MODEL || "anthropic/claude-3.5-sonnet",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
      temperature: 0.2,
      maxTokens: 300,
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
        practiceArea: parsed.practiceArea || "General Tax Law",
        urgency: parsed.urgency || "standard",
        complexity: parsed.complexity || "moderate",
        costRange: parsed.costRange || "mid",
        location: parsed.location || "any",
        proBono: parsed.proBono || false,
        description: parsed.description || query,
      },
    });
  } catch (error: any) {
    console.error("Error in AI tax legal classifier:", error);
    return NextResponse.json(
      { success: false, error: error.message || "AI classification failed" },
      { status: 500 }
    );
  }
}

