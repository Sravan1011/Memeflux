"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface Article {
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  source: {
    name: string
  }
}

export default function TrendingNews() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleGenerateMeme = (article: Article) => {
    // Store the article in sessionStorage to use in the meme generator
    sessionStorage.setItem('memePrompt', `Funny meme about: ${article.title}. Make it humorous and shareable.`)
    // Navigate to the meme generator page
    router.push('/memegenerator')
  }

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news")

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch news")
        }

        const data = await response.json()
        setArticles(data.articles || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching news. Please try again later.")
        console.error("Error fetching news:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated starfield background */}
        <div className="absolute inset-0">
          {[...Array(200)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 p-8">
          <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Trending News
          </h1>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 p-6 rounded-xl shadow-2xl"
              >
                <div className="h-6 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded w-3/4 mb-4 animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded w-1/2 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated starfield background */}
        <div className="absolute inset-0">
          {[...Array(200)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 p-8">
          <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Trending News
          </h1>
          <div className="bg-red-900/50 backdrop-blur-sm border border-red-500/50 text-red-200 px-6 py-4 rounded-xl shadow-2xl">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated starfield background */}
      <div className="absolute inset-0">
        {[...Array(300)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Nebula effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-center">
            Trending News
          </h1>

          <div className="space-y-6">
            {articles.map((article, index) => (
              <div
                key={index}
                className="bg-slate-800/30 backdrop-blur-sm border border-purple-500/20 rounded-xl shadow-2xl overflow-hidden hover:border-purple-400/40 hover:shadow-purple-500/20 transition-all duration-300 group"
              >
                {article.urlToImage && (
                  <div className="relative overflow-hidden">
                    <img
                      src={article.urlToImage || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = "none"
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-white hover:text-purple-300 transition-colors duration-200">
                    <Link href={article.url} target="_blank" rel="noopener noreferrer">
                      {article.title}
                    </Link>
                  </h2>
                  <p className="text-slate-300 mb-4 leading-relaxed">{article.description}</p>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
                    <div className="flex-1">
                      <span className="text-sm text-purple-300 font-medium">{article.source.name}</span>
                      <span className="text-sm text-slate-400 block sm:inline sm:ml-2">• {new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <Button 
                      onClick={() => handleGenerateMeme(article)}
                      size="sm" 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium w-full sm:w-auto"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Meme
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
