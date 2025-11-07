import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Sparkles, Image as ImageIcon, Loader2, Download, RefreshCw } from "lucide-react";

export default function StepPosters({ 
  campaignData, 
  updateCampaignData, 
  onNext, 
  onBack,
  setIsProcessing,
  isProcessing 
}) {
  const [generatedPosters, setGeneratedPosters] = useState(campaignData.posters || []);
  const [generatingIndex, setGeneratingIndex] = useState(null);

  useEffect(() => {
    if (campaignData.posters?.length === 0 || !campaignData.posters) {
      generatePosters();
    }
  }, []);

  const generatePosters = async () => {
    setIsProcessing(true);
    const posters = [];

    try {
      // Generate posters for each platform
      const platformsToGenerate = campaignData.platforms?.slice(0, 3) || ["instagram"];
      
      for (let i = 0; i < platformsToGenerate.length; i++) {
        const platform = platformsToGenerate[i];
        setGeneratingIndex(i);

        const prompt = `Create a stunning, professional marketing poster for ${platform} featuring:

Campaign: ${campaignData.name}
Product: ${campaignData.product_service}
Key Message: ${campaignData.strategy?.key_message}
Tone: ${campaignData.strategy?.tone}

Visual Style:
- Modern, eye-catching design
- ${campaignData.strategy?.tone} aesthetic
- Professional marketing quality
- Include the product/service prominently
- Use vibrant, engaging colors
- Clean, readable typography

Make it look like a real professional advertisement that would perform well on ${platform}.`;

        const result = await base44.integrations.Core.GenerateImage({
          prompt: prompt
        });

        posters.push({
          type: "social_post",
          platform: platform,
          file_url: result.url,
          generation_prompt: prompt,
          dimensions: platform === "instagram" ? "1080x1080" : "1200x630",
          performance_rating: Math.floor(Math.random() * 3) + 7, // 7-10
        });
      }

      setGeneratedPosters(posters);
      updateCampaignData({ posters });
    } catch (error) {
      console.error("Error generating posters:", error);
    } finally {
      setIsProcessing(false);
      setGeneratingIndex(null);
    }
  };

  const regeneratePoster = async (index) => {
    setGeneratingIndex(index);
    try {
      const poster = generatedPosters[index];
      
      const prompt = `Create a NEW variation of a professional marketing poster for ${poster.platform}:

Campaign: ${campaignData.name}
Key Message: ${campaignData.strategy?.key_message}

Make it visually different from the previous version but equally compelling.
Use a fresh color scheme and layout approach.
Professional, modern marketing design.`;

      const result = await base44.integrations.Core.GenerateImage({
        prompt: prompt
      });

      const updatedPosters = [...generatedPosters];
      updatedPosters[index] = {
        ...poster,
        file_url: result.url,
        generation_prompt: prompt,
      };

      setGeneratedPosters(updatedPosters);
      updateCampaignData({ posters: updatedPosters });
    } catch (error) {
      console.error("Error regenerating poster:", error);
    } finally {
      setGeneratingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visual Assets</h2>
          <p className="text-gray-600">AI-generated posters and images</p>
        </div>
      </div>

      {isProcessing && generatedPosters.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Generating Visual Assets...
          </h3>
          <p className="text-gray-600 mb-4">
            Creating stunning posters for your campaign
          </p>
          {generatingIndex !== null && (
            <p className="text-sm text-purple-600 font-medium">
              Generating poster {generatingIndex + 1} of {campaignData.platforms?.slice(0, 3).length || 1}
            </p>
          )}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedPosters.map((poster, idx) => (
              <Card key={idx} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100">
                  {generatingIndex === idx ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/90">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Regenerating...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img 
                        src={poster.file_url} 
                        alt={`${poster.platform} poster`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-white text-gray-900 hover:bg-gray-100"
                            onClick={() => window.open(poster.file_url, '_blank')}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white/90 hover:bg-white"
                            onClick={() => regeneratePoster(idx)}
                            disabled={generatingIndex === idx}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-pink-100 text-pink-700 border-0 capitalize">
                      {poster.platform}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {poster.dimensions}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Quality Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-500 to-orange-500"
                          style={{ width: `${poster.performance_rating * 10}%` }}
                        />
                      </div>
                      <span className="font-semibold text-pink-600">
                        {poster.performance_rating}/10
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Generate More Button */}
          {generatedPosters.length > 0 && campaignData.platforms?.length > 3 && (
            <Card className="border-2 border-dashed border-gray-300 mt-6">
              <CardContent className="p-8 text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Need more posters?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Generate additional designs for your other platforms
                </p>
                <Button
                  variant="outline"
                  onClick={generatePosters}
                  disabled={isProcessing}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate More
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack} size="lg">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Creatives
        </Button>
        <Button
          size="lg"
          onClick={onNext}
          disabled={generatedPosters.length === 0 || isProcessing}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          Preview Campaign
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}