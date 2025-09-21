const POLLINATIONS_API = 'https://image.pollinations.ai/prompt';
const DEFAULT_IMAGE_MODEL = 'flux';

type AspectRatio = '1:1' | '16:9' | '9:16' | '4:5';

export async function generateImageWithFlux(
  prompt: string,
  aspectRatio: AspectRatio = '1:1',
  negativePrompt: string = 'low quality, blurry, distorted, bad anatomy, text, watermark, signature, lowres, bad anatomy, bad hands, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name, bad proportions, duplicate, ugly, disfigured, bad anatomy, extra limbs, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, mutated hands, fused fingers, too many fingers, long neck, cross-eye, body out of frame, cut off, low contrast, underexposed, overexposed, bad art, beginner, amateur, distorted face, blurry, draft, grainy'
): Promise<string> {
  try {
    // Clean the prompt
    const cleanPrompt = prompt.trim().replace(/[^\w\s\-.,!]/g, ' ').trim();
    
    // Map aspect ratios to dimensions
    const dimensions = {
      '1:1': { width: 1024, height: 1024 },
      '16:9': { width: 1024, height: 576 },
      '9:16': { width: 576, height: 1024 },
      '4:5': { width: 1024, height: 1280 }
    };
    
    const { width, height } = dimensions[aspectRatio] || dimensions['1:1'];
    
    // Build the URL with parameters
    const params = new URLSearchParams();
    params.append('width', width.toString());
    params.append('height', height.toString());
    params.append('model', DEFAULT_IMAGE_MODEL);
    params.append('enhance', 'true');
    params.append('nologo', 'true');
    
    if (negativePrompt) {
      params.append('negative_prompt', negativePrompt);
    }
    
    // Encode the prompt for URL
    const encodedPrompt = encodeURIComponent(cleanPrompt);
    const imageUrl = `${POLLINATIONS_API}/${encodedPrompt}?${params.toString()}`;
    
    // For debugging
    console.log('Generated image URL:', imageUrl);
    
    return imageUrl;
  } catch (error) {
    console.error('Error generating image with FLUX:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to generate image: ${errorMessage}`);
  }
}
