import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Sparkles, Lightbulb, Target, MessageSquare, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function StepStrategy({ 
  campaignData, 
  updateCampaignData, 
  selectedBrand,
  onNext, 
  onBack,
  setIsProcessing,
  isProcessing 
}) {
  const [generatedStrategy, setGeneratedStrategy] = useState(campaignData.strategy || null);
  const [customInstructions, setCustomInstructions] = useState("");

  useEffect(() => {
    if (!campaignData.strategy) {
      generateStrategy();
    }
  }, []);

  const generateStrategy = async () => {
    setIsProcessing(true);
    try {
      const prompt = `You are an expert marketing strategist. Create a comprehensive marketing strategy for this campaign:

Brand: ${selectedBrand?.name || 'Unknown'} (${selectedBrand?.brand_voice || 'professional'} voice)
Brand Values: ${selectedBrand?.core_values?.join(', ') || 'N/A'}
Target Audience: ${selectedBrand?.target_audience || 'N/A'}

Campaign Details:
- Name: ${campaignData.name}
- Product/Service: ${campaignData.product_service}
- Objective: ${campaignData.objective}
- Target Segment: ${campaignData.target_segment}
- Platforms: ${campaignData.platforms?.join(', ')}
- Budget: $${campaignData.budget}
- Duration: ${campaignData.duration_days} days

${customInstructions ? `Additional Instructions: ${customInstructions}` : ''}

Create a detailed marketing strategy including:
1. Key message and positioning
2. Tone and communication style
3. Content pillars (3-4 main themes)
4. Call-to-action recommendations
5. Platform-specific tactics

Return as JSON.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            key_message: { type: "string" },
            tone: { type: "string" },
            channels: { 
              type: "array",
              items: { type: "string" }
            },
            content_pillars: {
              type: "array",
              items: { type: "string" }
            },
            cta: { type: "string" },
            platform_tactics: {
              type: "object",
              additionalProperties: { type: "string" }
            },
            success_metrics: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setGeneratedStrategy(result);
      updateCampaignData({ strategy: result });
    } catch (error) {
      console.error("Error generating strategy:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedStrategy(null);
    generateStrategy();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaign Strategy</h2>
          <p className="text-gray-600">AI-powered strategic recommendations</p>
        </div>
      </div>

      {isProcessing ? (
        <div className="py-16 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Analyzing Your Campaign...
          </h3>
          <p className="text-gray-600">
            Our AI is crafting a strategic marketing plan tailored to your goals
          </p>
        </div>
      ) : generatedStrategy ? (
        <div className="space-y-6">
          {/* Key Message */}
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Key Message</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    "{generatedStrategy.key_message}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tone & CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-3">Communication Tone</h3>
                <Badge className="bg-purple-100 text-purple-700 border-0 text-sm px-3 py-1">
                  {generatedStrategy.tone}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-3">Call-to-Action</h3>
                <p className="text-gray-700 font-medium">"{generatedStrategy.cta}"</p>
              </CardContent>
            </Card>
          </div>

          {/* Content Pillars */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Content Pillars
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {generatedStrategy.content_pillars?.map((pillar, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700 text-sm">{pillar}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platform Tactics */}
          {generatedStrategy.platform_tactics && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Platform-Specific Tactics</h3>
                <div className="space-y-3">
                  {Object.entries(generatedStrategy.platform_tactics).map(([platform, tactic]) => (
                    <div key={platform} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-600 mb-1 capitalize">{platform}</h4>
                      <p className="text-sm text-gray-700">{tactic}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success Metrics */}
          {generatedStrategy.success_metrics && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Success Metrics to Track</h3>
                <div className="flex flex-wrap gap-2">
                  {generatedStrategy.success_metrics.map((metric, idx) => (
                    <Badge key={idx} variant="outline" className="text-sm px-3 py-1">
                      {metric}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Custom Instructions */}
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Want to refine the strategy?</h3>
              <Textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Add any specific requirements or changes you'd like..."
                rows={3}
                className="mb-3"
              />
              <Button
                variant="outline"
                onClick={handleRegenerate}
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Regenerate Strategy
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack} size="lg">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Brief
        </Button>
        <Button
          size="lg"
          onClick={onNext}
          disabled={!generatedStrategy || isProcessing}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          Generate Creatives
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}