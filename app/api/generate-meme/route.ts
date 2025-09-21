import { NextResponse } from 'next/server';
import { generateImageWithFlux } from '@/lib/fluxGenerator';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { prompt, model = 'flux', aspectRatio = '1:1', negativePrompt } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Enhanced prompt for better meme generation
    const enhancedPrompt = `A funny meme about: ${prompt}. High quality, trending on social media, vibrant colors, detailed, 8k.`;
    
    // Generate image using Pollinations AI with FLUX model
    const imageUrl = await generateImageWithFlux(
      enhancedPrompt,
      aspectRatio as any,
      negativePrompt
    );

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error generating meme:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate meme';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
