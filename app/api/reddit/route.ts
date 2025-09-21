import { NextResponse } from 'next/server';

interface SubredditResult {
  subreddit: string;
  posts: Array<{
    id: string;
    title: string;
    url: string;
    permalink: string;
    score: number;
    num_comments: number;
    author: string;
    subreddit: string;
    created_utc: number;
    is_video: boolean;
    media: any;
    post_hint?: string;
    preview?: {
      images: Array<{
        source?: {
          url: string;
          width: number;
          height: number;
        };
      }>;
    };
  }>;
  error?: string;
}

const SUBREDDITS = ['memes', 'dankmemes', 'wholesomememes', 'me_irl'];

export async function GET() {
  try {
    // Fetch memes from multiple subreddits
    const fetchPromises = SUBREDDITS.map(subreddit =>
      fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=10&raw_json=1`)
        .then(res => res.json())
        .then(data => ({
          subreddit,
          posts: data.data?.children?.map((post: any) => ({
            id: post.data.id,
            title: post.data.title,
            url: post.data.url,
            permalink: `https://reddit.com${post.data.permalink}`,
            score: post.data.score,
            num_comments: post.data.num_comments,
            author: post.data.author,
            subreddit: post.data.subreddit,
            created_utc: post.data.created_utc,
            is_video: post.data.is_video,
            media: post.data.media,
            post_hint: post.data.post_hint,
            preview: post.data.preview
          })) || []
        }))
        .catch(error => ({
          subreddit,
          error: error.message,
          posts: []
        }))
    );

    const results: SubredditResult[] = await Promise.all(fetchPromises);
    const allPosts = results.flatMap(result => result.posts);
    
    // Filter out non-image posts and sort by score
    const imagePosts = allPosts
      .filter(post => {
        // Check if post has image
        const hasImage = post.url.match(/\.(jpeg|jpg|gif|png|webp)$/) !== null || 
                        (post.preview && post.preview.images && post.preview.images[0]?.source);
        // Filter out gallery posts and non-image posts
        return hasImage && !post.is_video;
      })
      .sort((a, b) => b.score - a.score);

    return NextResponse.json({ posts: imagePosts });
  } catch (error: unknown) {
    console.error('Error fetching Reddit posts:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch memes from Reddit';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
