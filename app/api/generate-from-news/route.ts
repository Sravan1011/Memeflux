import { NextResponse } from 'next/server';
import { generateImageWithFlux } from '@/lib/fluxGenerator';

export const runtime = 'edge';

// Helper function to fetch news
async function fetchNews() {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    if (!apiKey) {
      throw new Error('News API key not configured');
    }

    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error('Failed to fetch news');
  }
}

// Helper function to generate meme from news article
async function generateMemeFromArticle(article: any) {
  try {
    // Create a meme prompt based on the article
    const prompt = `Funny meme about: ${article.title}. Make it humorous and shareable.`;
    
    // Generate the image using our existing FLUX generator
    const imageUrl = await generateImageWithFlux(
      prompt,
      '1:1',
      'low quality, blurry, distorted, text, watermark, signature'
    );

    return {
      ...article,
      memeUrl: imageUrl,
      memePrompt: prompt
    };
  } catch (error) {
    console.error('Error generating meme for article:', article.title, error);
    return {
      ...article,
      memeUrl: null,
      error: 'Failed to generate meme'
    };
  }
}

export async function GET() {
  try {
    // Fetch news articles
    const newsData = await fetchNews();
    
    if (!newsData.articles || !Array.isArray(newsData.articles)) {
      throw new Error('Invalid news data format');
    }

    // Process articles in parallel to generate memes
    const articlesWithMemes = await Promise.all(
      newsData.articles.map(article => generateMemeFromArticle(article))
    );

    return NextResponse.json({
      status: 'success',
      totalResults: articlesWithMemes.length,
      articles: articlesWithMemes
    });
  } catch (error) {
    console.error('Error in generate-from-news:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process request';
    return NextResponse.json(
      { 
        status: 'error',
        message: errorMessage 
      },
      { status: 500 }
    );
  }
}
