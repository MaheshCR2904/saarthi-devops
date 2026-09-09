import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/db";
import { User, AiConversation } from "@/db/schema";

// Saarthi's persona system prompt templates
const SAARTHI_PERSONA = `You are Saarthi, a wise, warm, lifelong AI guide. Your name means "charioteer" in Sanskrit — like Krishna guiding Arjuna. You guide users from age 16 to retirement through every major life decision.

Your core philosophy: You never judge — you only recalculate. You are not a chatbot. You are a companion who remembers their entire journey.

Your tone:
- Warm, conversational, encouraging
- Wise like a mentor, caring like an elder sibling
- Direct when needed, gentle always
- Adapt to the user's mood: motivating when they're down, challenging when coasting
- Use Indian cultural references naturally (not forced)
- Keep responses concise (2-4 sentences) unless they need depth

The user is at: {lifeStage}
Their profile: {profileSummary}

Respond in plain text with occasional emojis for warmth. End with a question sometimes to keep the conversation going.`;

function getLifeStageDescription(stage: string): string {
  const stages: Record<string, string> = {
    stage_1: "Age 16-18: Choosing academic stream, preparing for college entrance exams, exploring interests",
    stage_2: "Age 18-22: In college, building skills, doing internships, maintaining CGPA",
    stage_3: "Age 22-26: Starting career, upskilling, navigating first job challenges",
    stage_4: "Age 26-35: Career growth, salary growth, considering specializations",
    stage_5: "Age 35-50: Mid-career, management roles, investments, work-life balance",
    stage_6: "Age 50-60: Retirement planning, wealth management, legacy building",
  };
  return stages[stage] || "On their life journey";
}

// Simulated AI responses when no LLM API key is available
function generateSaarthiResponse(
  message: string,
  profileSummary: string,
  lifeStage: string
): string {
  const msg = message.toLowerCase();

  if (msg.includes("confused") || msg.includes("not sure") || msg.includes("which")) {
    return "I understand that crossroads feeling. Let's break it down together — tell me more about what's pulling you in each direction? I'm here to help you see clearly. 🌟";
  }
  if (msg.includes("stress") || msg.includes("tired") || msg.includes("exhausted")) {
    return "I hear you, and it's completely normal to feel this way, especially at your stage. Take a breath. Let's look at what's on your plate and see if we can lighten the load. What's the biggest thing weighing on you right now? 💙";
  }
  if (msg.includes("fail") || msg.includes("backlog") || msg.includes("rejected") || msg.includes("lost")) {
    return "A setback is not the end — it's a redirection. I've seen countless journeys where what looked like a failure became the foundation for something better. Let me help you recalculate. What happened, and how can I support you right now? 🙏";
  }
  if (msg.includes("salary") || msg.includes("package") || msg.includes("lpa")) {
    return "Great question! Your earning potential depends on skills, experience, and the path you take. I can run a detailed salary projection for you — would you like me to analyze your profile and give you a 3, 5, and 10-year forecast? 📊";
  }
  if (msg.includes("skill") || msg.includes("learn") || msg.includes("course")) {
    return "Upskilling is one of the best investments you can make! I can analyze your current skills against your target role and suggest specific learning paths. Want me to do a skill gap analysis for you? 🎯";
  }
  if (msg.includes("job") || msg.includes("career") || msg.includes("role")) {
    return "Career decisions shape so much of our journey. Based on your profile, I can predict top career paths that match your interests and skills. Would you like me to run the career path predictor? It gives probability scores for different roles. 🚀";
  }
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    return `Namaste! 🙏 I'm Saarthi, your guide on this journey. I see you're at ${getLifeStageDescription(lifeStage).split(":")[0]}. How are you feeling today? What's on your mind?`;
  }
  if (msg.includes("thank")) {
    return "You're most welcome! Remember, I'm always here — through every milestone, every challenge, every win. What would you like to explore next? ✨";
  }
  if (msg.includes("goal") || msg.includes("dream") || msg.includes("future")) {
    return "Your goals are the stars we navigate by. Tell me more about what you envision — whether it's a specific career, a lifestyle, or a feeling. I can help you chart a path from where you are to where you want to be. 🌠";
  }

  const genericResponses = [
    "That's an important reflection. I'm here to help you think through it — can you tell me a bit more about what's on your mind? 🤔",
    "I appreciate you sharing that with me. Every step of your journey matters. What specifically would you like guidance on? 🌿",
    "You know, many people at your stage feel similarly. Let's work through this together. What outcome would make you feel most fulfilled? 💭",
    "That's a great topic to explore! Based on your profile and where you are in life, I have some thoughts. Want me to dive deeper? 🧭",
  ];

  return genericResponses[Math.floor(Math.random() * genericResponses.length)];
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { message, contextType } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Get user profile for context
    const user = await User.findById(session.userId);
    const profileSummary = user
      ? `${user.name || "User"}, age ${user.age || "N/A"}, ${user.stream || "N/A"} stream, CGPA ${user.cgpa || "N/A"}, interested in ${(user.interests || []).join(", ") || "various fields"}`
      : "New user";
    const lifeStage = user?.lifeStage || "stage_1";

    // Try LLM API if configured, otherwise use simulated response
    let response: string;
    const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

    if (apiKey) {
      // Call actual LLM
      try {
        const systemPrompt = SAARTHI_PERSONA
          .replace("{lifeStage}", getLifeStageDescription(lifeStage))
          .replace("{profileSummary}", profileSummary);

        // Get last 5 conversations for context
        const history = await AiConversation.find({ userId: session.userId })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean();

        const messages = [
          { role: "system" as const, content: systemPrompt },
          ...history.reverse().flatMap((h) => [
            { role: "user" as const, content: h.message },
            { role: "assistant" as const, content: h.response },
          ]),
          { role: "user" as const, content: message },
        ];

        const llmResponse = await fetch(
          process.env.OPENAI_API_KEY
            ? "https://api.openai.com/v1/chat/completions"
            : `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(process.env.OPENAI_API_KEY ? { Authorization: `Bearer ${apiKey}` } : {}),
            },
            body: JSON.stringify(
              process.env.OPENAI_API_KEY
                ? { model: "gpt-3.5-turbo", messages, max_tokens: 300 }
                : { contents: [{ parts: [{ text: systemPrompt + "\n\nUser: " + message }] }] }
            ),
          }
        );

        const data = await llmResponse.json();
        response = process.env.OPENAI_API_KEY
          ? data.choices?.[0]?.message?.content || "I'm here with you. Let's continue our conversation."
          : data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here with you. Let's continue.";
      } catch {
        response = generateSaarthiResponse(message, profileSummary, lifeStage);
      }
    } else {
      response = generateSaarthiResponse(message, profileSummary, lifeStage);
    }

    // Save conversation
    await AiConversation.create({
      userId: session.userId,
      message,
      response,
      contextType: contextType || "general",
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const conversations = await AiConversation.find({ userId: session.userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json({ conversations: conversations.reverse() });
}

