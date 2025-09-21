'use client';

import { useState, useRef, useEffect } from 'react';
import { Wand2, Image as ImageIcon, Download, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface MemeTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  style?: string;
}

const MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: 'drake',
    name: 'Drake Hotline Bling',
    description: 'Drake approving/disapproving meme format',
    prompt: 'Create a Drake meme where the top panel shows {text1} and the bottom panel shows {text2}' 
  },
  {
    id: 'distracted-bf',
    name: 'Distracted Boyfriend',
    description: 'Guy checking out another girl while with his girlfriend',
    prompt: 'Create a Distracted Boyfriend meme where the guy is looking at {text1} while his girlfriend looks at him annoyed, with text "{text2}" at the bottom'
  },
  {
    id: 'custom',
    name: 'Custom Meme',
    description: 'Create a completely custom meme',
    prompt: '{text1}'
  }
];

export default function MemeGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate>(MEME_TEMPLATES[0]);
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [model, setModel] = useState<'gemini' | 'flux'>('gemini');
  const [style, setStyle] = useState('funny');
  const [quality, setQuality] = useState<number>(1);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [useTemplate, setUseTemplate] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const generateMeme = async () => {
    if (!prompt && (!text1 || !text2) && useTemplate) {
      toast.error('Please enter some text for your meme');
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      let finalPrompt = prompt;
      
      if (useTemplate && selectedTemplate) {
        finalPrompt = selectedTemplate.prompt
          .replace('{text1}', text1)
          .replace('{text2}', text2);
      }

      // Add style and quality to the prompt
      finalPrompt = `${style} meme: ${finalPrompt}. ${getQualityPrompt(quality)}`;

      const response = await fetch('/api/generate-meme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          model,
          aspectRatio,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate meme');
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
      toast.success('Meme generated successfully!');
    } catch (error) {
      console.error('Error generating meme:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate meme');
    } finally {
      setIsLoading(false);
    }
  };

  const getQualityPrompt = (quality: number) => {
    const qualities = [
      'Low quality, quick generation',
      'Medium quality, balanced generation',
      'High quality, detailed generation',
      'Ultra high quality, maximum detail',
    ];
    return qualities[quality - 1] || '';
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `meme-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTemplateChange = (templateId: string) => {
    const template = MEME_TEMPLATES.find(t => t.id === templateId) || MEME_TEMPLATES[0];
    setSelectedTemplate(template);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
            AI Meme Generator
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Create hilarious memes in seconds using the power of AI. Choose a template or create your own custom meme.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 h-fit">
            <Tabs defaultValue="template" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="template" onClick={() => setUseTemplate(true)}>Template</TabsTrigger>
                <TabsTrigger value="custom" onClick={() => setUseTemplate(false)}>Custom</TabsTrigger>
              </TabsList>
              
              <TabsContent value="template">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template">Meme Template</Label>
                    <Select onValueChange={handleTemplateChange} defaultValue={MEME_TEMPLATES[0].id}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {MEME_TEMPLATES.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-400 mt-1">
                      {selectedTemplate?.description}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="text1">Top Text</Label>
                    <Input
                      id="text1"
                      placeholder="Enter top text"
                      value={text1}
                      onChange={(e) => setText1(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="text2">Bottom Text</Label>
                    <Input
                      id="text2"
                      placeholder="Enter bottom text"
                      value={text2}
                      onChange={(e) => setText2(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="custom">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prompt">Meme Description</Label>
                    <div className="relative mt-2">
                      <Input
                        id="prompt"
                        placeholder="Describe your meme..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="pr-10"
                      />
                      <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Be as descriptive as possible for better results
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="model">AI Model</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-400">
                      {model === 'gemini' ? 'Google Gemini' : 'FLUX.1'}
                    </span>
                  </div>
                </div>
                <Select value={model} onValueChange={(value: 'gemini' | 'flux') => setModel(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">Google Gemini (Faster)</SelectItem>
                    <SelectItem value="flux">FLUX.1 (Higher Quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="style">Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="funny">Funny</SelectItem>
                    <SelectItem value="sarcastic">Sarcastic</SelectItem>
                    <SelectItem value="wholesome">Wholesome</SelectItem>
                    <SelectItem value="dark">Dark Humor</SelectItem>
                    <SelectItem value="surreal">Surreal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="quality">Quality</Label>
                  <span className="text-sm text-slate-400">
                    {['Low', 'Medium', 'High', 'Ultra'][quality - 1]}
                  </span>
                </div>
                <Slider
                  id="quality"
                  min={1}
                  max={4}
                  step={1}
                  value={[quality]}
                  onValueChange={([value]) => setQuality(value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1:1">Square (1:1)</SelectItem>
                    <SelectItem value="16:9">Wide (16:9)</SelectItem>
                    <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                    <SelectItem value="4:5">Instagram (4:5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={generateMeme}
                disabled={isLoading}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold h-12"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Meme
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Meme Preview</h2>
                {generatedImage && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadImage}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                )}
              </div>

              <div className="flex-1 flex items-center justify-center bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-700/50 p-8">
                {isLoading ? (
                  <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto" />
                    <p className="text-slate-400">Generating your meme...</p>
                    <p className="text-xs text-slate-500">This may take a few moments</p>
                  </div>
                ) : generatedImage ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={generatedImage}
                      alt="Generated meme"
                      className="max-w-full max-h-[70vh] rounded-lg shadow-2xl"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setGeneratedImage(null)}
                      className="absolute top-2 right-2 bg-slate-800/80 hover:bg-slate-700/80 text-white"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50 border border-dashed border-purple-500/30">
                      <ImageIcon className="h-8 w-8 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white">Your meme will appear here</h3>
                    <p className="text-sm text-slate-400">
                      {useTemplate 
                        ? 'Fill in the fields and click "Generate Meme"' 
                        : 'Describe your meme and click "Generate Meme"'}
                    </p>
                  </div>
                )}
              </div>
              
              {generatedImage && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-400">
                    Generated with {model === 'gemini' ? 'Google Gemini' : 'FLUX.1'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
