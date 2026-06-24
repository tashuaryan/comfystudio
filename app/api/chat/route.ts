import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // Right now, this is a basic auto-responder. 
    // Later, we will plug your AI API key in right here!
    let botReply = "I'm a virtual assistant for Comfy Studio! I'm still learning, but how can I help you today?";

    if (message.toLowerCase().includes('shipping')) {
      botReply = "We offer free standard shipping on all orders over ₹999!";
    } else if (message.toLowerCase().includes('return')) {
      botReply = "You can return any unworn items within 14 days of delivery.";
    }

    return NextResponse.json({ reply: botReply });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}