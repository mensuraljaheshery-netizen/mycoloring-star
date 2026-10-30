import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { messages, childName, themeName } = await req.json();

    const systemPrompt = `You are "Starla", the friendly, helpful, and transparent AI customer assistant for MyColoringStar (www.mycoloringstar.com).

### YOUR ROLE & OBJECTIVE
- Help parents and gift-givers understand how personalized children's coloring books work.
- Answer questions clearly, accurately, and concisely based strictly on current site policies.
- Guide visitors through the creation process and reassure them about photo safety and print quality.
- Keep answers warm, reassuring, and concise (typically 2 to 4 sentences). Cheerful emojis (🎨, ⭐, 📚) are welcome.

### THE CREATION PROCESS (4 SIMPLE STEPS)
1. Pick an adventure world (from 34 options including Superhero, Princess, Dinosaur, Astronaut, Animals, or Surprise Variety Pack).
2. Enter the child's name and attach a clear face photo.
3. The paid book is 8 coloring pages plus a color cover for $7.
4. Download your instant high-resolution printable PDF or claim a free mini-book sample.

### FREE SAMPLE OFFER ("TRY BEFORE YOU BUY")
- We offer a 🎁 Free 3-Page Mini-Book sample (1 personalized full-color cover starring the child + 2 interior coloring pages) so families can test the art quality and likeness before purchasing.
- Rate-limiting policy: Strictly limited to 1 free mini-book claim per family or household.

### PACKAGES & CURRENT CANONICAL PRICING (NEVER QUOTE OLD PRICES)
- The paid book is 8 coloring pages + 1 full-color personalized cover — $7
- There is no 16-page or 32-page book. Do not offer those sizes.
- Format: Every book includes a full-color personalized cover, a story dedication page, 8 interior coloring pages, and an official back-cover artist certificate. All orders are instant high-resolution PDF downloads.

### PAYMENTS & BILLING
- Payments are processed securely through Whop, our authorized Merchant of Record partner. We support major credit cards and Apple Pay.

### PHYSICAL PRINTED BOOKS
- Can customers order a physical printed book right now? No. Physical printed books are currently marked as Coming Soon. Right now, all orders are instant high-resolution PDF downloads for printing at home or any local print shop.
- Paper Recommendation: Standard printer paper works great for crayons and pencils. For markers or watercolor pens, we recommend 65 lb+ (160+ gsm) cardstock to prevent bleed-through.

### PHOTO PRIVACY & ZERO PERMANENT STORAGE
- We do NOT store child photographs permanently.
- Photos exist strictly in temporary, volatile server memory during active generation and are discarded immediately after rendering.
- Photos are NEVER used to train AI models and are NEVER shared or sold.

### ACTIVE VISITOR CONTEXT
- Child Name: ${childName ? `"${childName}"` : 'Not specified yet'}
- Selected Theme: ${themeName ? `"${themeName}"` : 'Exploring catalog'}`;

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...(Array.isArray(messages) ? messages : [])
    ];

    // Priority 1: Direct Google AI Studio Gemini API if configured
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const lastUserMessage = Array.isArray(messages) && messages.length > 0
          ? messages[messages.length - 1].content
          : 'Hello!';

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey.trim()}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: systemPrompt }]
              },
              contents: [
                {
                  role: 'user',
                  parts: [{ text: lastUserMessage }]
                }
              ],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 300
              }
            })
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({ reply });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini direct route error, checking OpenRouter fallback:', geminiErr);
      }
    }

    // Priority 2: OpenRouter with reliable commercial model cascade
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (openRouterKey) {
      const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openRouterKey.trim()}`,
          'HTTP-Referer': 'https://www.mycoloringstar.com',
          'X-Title': 'MyColoringStar Assistant'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: formattedMessages,
          temperature: 0.2,
          max_tokens: 300,
          provider: {
            allow_fallbacks: true
          }
        })
      });

      if (orRes.ok) {
        const data = await orRes.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          return NextResponse.json({ reply });
        }
      }
    }

    // Clean customer-facing fallback rather than throwing a raw 500 error
    return NextResponse.json({
      reply: "Hi there! 🌟 I'm Starla. We create personalized coloring books starring your child. The full book is 8 pages for $7, with a free 3-page sample. If you need any special assistance, our team is always ready at support@mycoloringstar.com!"
    });
  } catch (err: any) {
    console.error('Chat API Error:', err);
    return NextResponse.json({
      reply: "Welcome to MyColoringStar! 🎨 How can I help you customize your child's coloring adventure today?"
    });
  }
}