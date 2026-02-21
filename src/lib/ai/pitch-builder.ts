/**
 * AI Pitch Builder — generates professional campaign pitches using
 * a free open-source LLM via Hugging Face Inference Providers.
 *
 * Fallback: If HF_TOKEN is not set or the API fails, raw answers
 * are formatted into a clean template (still useful, just not AI-polished).
 */

export interface PitchAnswers {
  problem: string;
  solution: string;
  audience: string;
  fundsUsage: string;
  uniqueness: string;
}

const SYSTEM_PROMPT = `You are a friendly business mentor helping a young person (age 11-17) write a professional crowdfunding campaign pitch. Based on their answers to five questions, write a compelling, well-structured campaign description that:

1. Opens with a hook that grabs attention
2. Clearly explains the problem and their solution
3. Describes who benefits from their project
4. Shows how funds will be used responsibly
5. Ends with a call to action

Rules:
- Write in first person ("I" / "we")
- Keep language simple, warm, and enthusiastic
- Use short paragraphs (2-3 sentences each)
- Total length: 150-250 words
- Do NOT include any personal information like names, addresses, phone numbers, or emails
- Do NOT invent facts — only use what the student provided
- Keep it professional but age-appropriate`;

/**
 * Generate a pitch using the Hugging Face Inference API.
 * Returns the generated text or null if the API is unavailable.
 */
async function generateWithAI(answers: PitchAnswers): Promise<string | null> {
  const token = process.env.HF_TOKEN;
  if (!token) return null;

  const userMessage = `Here are my answers:

1. What problem does your business solve?
${answers.problem}

2. What's your solution?
${answers.solution}

3. Who is your audience?
${answers.audience}

4. What do you need the funds for?
${answers.fundsUsage}

5. What makes you unique?
${answers.uniqueness}

Please write my campaign pitch based on these answers.`;

  try {
    const response = await fetch(
      'https://router.huggingface.co/sambanova/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'Meta-Llama-3.1-8B-Instruct',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userMessage },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(30000),
      }
    );

    if (!response.ok) {
      console.error('HF API error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    return text?.trim() || null;
  } catch (err) {
    console.error('HF API call failed:', err);
    return null;
  }
}

/**
 * Fallback: format raw answers into a clean template.
 * Used when AI is unavailable.
 */
function formatFallback(answers: PitchAnswers): string {
  return `Have you ever noticed ${answers.problem.toLowerCase().replace(/[.!?]$/, '')}? That's exactly the problem I want to solve.

My solution is simple: ${answers.solution}

This project is for ${answers.audience.toLowerCase().replace(/[.!?]$/, '')}. I believe everyone deserves better options, and that's what I'm building.

Here's how I'll use the funds: ${answers.fundsUsage}

What makes this project special? ${answers.uniqueness}

I'm passionate about making this happen, and with your support, I can turn this idea into reality. Every contribution — big or small — brings me one step closer to my goal. Will you back my project today?`;
}

/**
 * Generate a pitch from student answers.
 * Tries AI first, falls back to template formatting.
 * Returns { pitch, isAiGenerated }.
 */
export async function generatePitch(answers: PitchAnswers): Promise<{
  pitch: string;
  isAiGenerated: boolean;
}> {
  const aiPitch = await generateWithAI(answers);

  if (aiPitch) {
    return { pitch: aiPitch, isAiGenerated: true };
  }

  return { pitch: formatFallback(answers), isAiGenerated: false };
}
