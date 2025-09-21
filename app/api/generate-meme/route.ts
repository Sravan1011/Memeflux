import { NextResponse } from 'next/server';
import { generateImageWithFlux } from '@/lib/fluxGenerator';

export const runtime = 'edge';

interface GenerateMemeRequest {
  prompt: string;
  model?: string;
  aspectRatio?: string;
  negativePrompt?: string;
}

interface GenerateMemeResponse {
  imageUrl: string;
  error?: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Parse the request body
    const body = await req.json() as Partial<GenerateMemeRequest>;
    const { prompt, model = 'flux', aspectRatio = '1:1', negativePrompt } = body;

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
      '1:1', // Force to 1:1 aspect ratio for memes
      negativePrompt
    );

    return NextResponse.json({ imageUrl });
  } catch (error: unknown) {
    console.error('Error generating meme:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate meme';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
