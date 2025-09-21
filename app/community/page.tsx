'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ExternalLink, Heart, MessageSquare, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface RedditPost {
  id: string;
  title: string;
  url: string;
  permalink: string;
  score: number;
  num_comments: number;
  author: string;
  subreddit: string;
  created_utc: number;
  preview?: {
    images: Array<{
      source: {
        url: string;
        width: number;
        height: number;
      };
      resolutions: Array<{
        url: string;
        width: number;
        height: number;
      }>;
    }>;
  };
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const formatTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() / 1000) - timestamp);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }
  
  return 'just now';
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubreddit, setSelectedSubreddit] = useState<string>('all');

  const subreddits = [
    { name: 'All', value: 'all' },
    { name: 'r/memes', value: 'memes' },
    { name: 'r/dankmemes', value: 'dankmemes' },
    { name: 'r/wholesomememes', value: 'wholesomememes' },
    { name: 'r/me_irl', value: 'me_irl' },
  ];

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/reddit');
        
        if (!response.ok) {
          throw new Error('Failed to fetch memes');
        }
        
        const data = await response.json();
        
        // Filter by selected subreddit if not 'all'
        const filteredPosts = selectedSubreddit === 'all' 
          ? data.posts 
          : data.posts.filter((post: RedditPost) => post.subreddit.toLowerCase() === selectedSubreddit);
        
        setPosts(filteredPosts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load memes');
        console.error('Error fetching memes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemes();
  }, [selectedSubreddit]);

  const getImageUrl = (post: RedditPost) => {
    if (post.url && (post.url.endsWith('.jpg') || post.url.endsWith('.png') || post.url.endsWith('.gif'))) {
      return post.url;
    }
    if (post.preview?.images?.[0]?.source?.url) {
      return post.preview.images[0].source.url.replace(/&amp;/g, '&');
    }
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-center">
            Meme Community
          </h1>
          
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {subreddits.map((sub) => (
              <div key={sub.value} className="px-4 py-2 rounded-full bg-slate-800/50 text-white/80 cursor-not-allowed">
                {sub.name}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-800/30 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 animate-pulse">
                <div className="h-6 bg-slate-700/50 rounded w-3/4 mb-4"></div>
                <div className="aspect-square bg-slate-700/50 rounded-lg mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-slate-700/50 rounded w-1/4"></div>
                  <div className="h-4 bg-slate-700/50 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-400 mb-4">Error Loading Memes</h1>
          <p className="text-slate-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-center">
          Meme Community
        </h1>
        
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {subreddits.map((sub) => (
            <button
              key={sub.value}
              onClick={() => setSelectedSubreddit(sub.value)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedSubreddit === sub.value
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-slate-800/50 hover:bg-slate-700/70 text-white/80 hover:text-white'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No memes found. Try another subreddit!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const imageUrl = getImageUrl(post);
              if (!imageUrl) return null;
              
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-800/30 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <h3 className="text-white text-lg font-medium line-clamp-2">{post.title}</h3>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <a
                        href={`https://www.reddit.com/r/${post.subreddit}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-purple-300 hover:text-purple-200 flex items-center"
                      >
                        r/{post.subreddit}
                        <ArrowUpRight className="w-3 h-3 ml-1" />
                      </a>
                      <span className="text-xs text-slate-400">
                        {formatTimeAgo(post.created_utc)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-slate-300">
                          <Heart className="w-4 h-4 mr-1 text-red-400" />
                          {formatNumber(post.score)}
                        </div>
                        <div className="flex items-center text-sm text-slate-300">
                          <MessageSquare className="w-4 h-4 mr-1 text-blue-400" />
                          {formatNumber(post.num_comments)}
                        </div>
                      </div>
                      <a
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors"
                        title="View on Reddit"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">
            Memes powered by Reddit API. Refresh to see more content.
          </p>
        </div>
      </div>
    </div>
  );
}