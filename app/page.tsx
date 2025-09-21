import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ArrowRight, TrendingUp, Users, Star, CheckCircle, Flame, Share2 } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-blue-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
        {/* Animated stars */}
        {Array.from({ length: 200 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>

      <header className="relative z-10 w-full px-6 py-4">
        <nav className="flex items-center justify-between max-w-7xl mx-auto bg-black/30 backdrop-blur-md rounded-full px-6 py-3 border border-purple-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">MemeFlux</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/trending"  className="text-white/80 hover:text-white transition-colors font-medium">
              Trending
            </Link>
            <Link href="/community" className="text-white/80 hover:text-white transition-colors font-medium">
              Community
            </Link>
            <Link href="/news-memes" className="text-white/80 hover:text-white transition-colors font-medium">
              News Memes
            </Link>
            <Button
              variant="outline"
              className="bg-white/10 border-purple-500/30 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold">
              Sign Up
            </Button>
          </div>
        </nav>
      </header>

      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 backdrop-blur-sm animate-pulse">
            🔥 Viral memes created daily
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight animate-fade-in-up">
            Turn breaking news into{" "}
            <span className="text-gradient bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              viral memes
            </span>
          </h1>

          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
            Stay ahead of the meme game with AI-powered tools that transform today's headlines into tomorrow's viral
            content. Create, share, and dominate social media.
          </p>

     
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
            <Link href="/memegenerator">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 backdrop-blur-sm text-white font-semibold"
              >
                Start Creating <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/trending">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-purple-500/30 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                Explore Trending Memes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="trending" className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <span className="text-orange-500 text-sm font-medium">AI-Powered Creation</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                From headlines to viral hits in seconds.
              </h2>

              <p className="text-white/70 text-lg leading-relaxed">
                Our AI scans breaking news, trending topics, and social media buzz to suggest the perfect meme templates
                and captions. Stay relevant, stay viral.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-orange-500" />
                  <span className="text-white">Real-time news integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-orange-500" />
                  <span className="text-white">Smart template suggestions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-orange-500" />
                  <span className="text-white">Viral prediction algorithm</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20 backdrop-blur-sm p-8 animate-float">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Trending Now</span>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">🔥 Hot</Badge>
                  </div>
                  <div className="text-white text-lg font-semibold">"Breaking: AI discovers memes"</div>
                  <div className="flex items-center space-x-4 text-sm text-white/60">
                    <span>📈 +2.3M views</span>
                    <span>💬 45K comments</span>
                    <span>🔄 89K shares</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">Ready to go viral?</h2>

          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Join thousands of creators already dominating social media with AI-powered meme generation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
            >
              Start Creating Free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-purple-500/30 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              View Examples
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-6 text-white/60 text-sm">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-current" />
              <span>No watermarks</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share2 className="w-4 h-4" />
              <span>Instant sharing</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>Creator community</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-purple-500/20 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold text-lg">MemeFlux</span>
            </div>

            <div className="flex items-center space-x-8 text-white/60 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
