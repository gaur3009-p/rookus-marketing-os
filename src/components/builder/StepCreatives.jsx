import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Sparkles, FileText, Copy, RefreshCw } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const CREATIVE_TYPES = [
  { type: "ad_copy", label: "Ad Copy", count: 3 },
  { type: "caption", label: "Social Captions", count: 5 },
  { type: "headline", label: "Headlines", count: 4 },
  { type: "cta", label: "CTAs", count: 3 },
];

export default function StepCreatives({ 
  campaignData, 
  updateCampaignData, 
  onNext, 
  onBack,
  setIsProcessing,
  isProcessing 
}) {
  const [generatedCreatives, setGeneratedCreatives] = useState(campaignData.creatives || []);
  const [activeTab, setActiveTab] = useState("ad_copy");

  useEffect(() => {
    if (campaignData.creatives?.length === 0 || !campaignData.creatives) {
      generateAllCreatives();
    }
  }, []);

  const generateAllCreatives = async () => {
    setIsProcessing(true);
    const allCreatives = [];

    try {
      for (const creativeType of CREATIVE_TYPES) {
        const prompt = `You are an expert copywriter. Create ${creativeType.count} compelling ${creativeType.label} for this campaign:

Campaign: ${campaignData.name}
Product: ${campaignData.product_service}
Objective: ${campaignData.objective}
Target: ${campaignData.target_segment}
Key Message: ${campaignData.strategy?.key_message}
Tone: ${campaignData.strategy?.tone}
CTA: ${campaignData.strategy?.cta}

Create ${creativeType.count} variations that are:
- Attention-grabbing and compelling
- Aligned with the ${campaignData.strategy?.tone} tone
- Optimized for ${campaignData.platforms?.join(', ')}
- Different from each other (test different angles)

Return as JSON array.`;

        const result = await base44.integrations.Core.InvokeLLM({
          prompt,
          response_json_schema: {
            type: "object",
            properties: {
              creatives: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    content: { type: "string" },
                    variant_name: { type: "string" },
                    hook: { type: "string" },
                    estimated_performance: { type: "number" }
                  }
                }
              }
            }
          }
        });

        result.creatives?.forEach((creative) => {
          allCreatives.push({
            type: creativeType.type,
            platform: "universal",
            content: creative.content,
            variant: creative.variant_name,
            hooks: [creative.hook],
            performance_score: creative.estimated_performance || 75,
            tone: campaignData.strategy?.tone,
          });
        });
      }

      setGeneratedCreatives(allCreatives);
      updateCampaignData({ creatives: allCreatives });
    } catch (error) {
      console.error("Error generating creatives:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const regenerateType = async (type) => {
    setIsProcessing(true);
    try {
      const creativeTypeConfig = CREATIVE_TYPES.find(ct => ct.type === type);
      
      const prompt = `Create ${creativeTypeConfig.count} new ${creativeTypeConfig.label} variations for:
Campaign: ${campaignData.name}
Message: ${campaignData.strategy?.key_message}
Tone: ${campaignData.strategy?.tone}

Make them fresh, creative, and different from previous versions.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            creatives: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  content: { type: "string" },
                  variant_name: { type: "string" },
                  hook: { type: "string" },
                  estimated_performance: { type: "number" }
                }
              }
            }
          }
        }
      });

      const newCreatives = result.creatives?.map((creative) => ({
        type: type,
        platform: "universal",
        content: creative.content,
        variant: creative.variant_name,
        hooks: [creative.hook],
        performance_score: creative.estimated_performance || 75,
        tone: campaignData.strategy?.tone,
      })) || [];

      const updatedCreatives = [
        ...generatedCreatives.filter(c => c.type !== type),
        ...newCreatives
      ];

      setGeneratedCreatives(updatedCreatives);
      updateCampaignData({ creatives: updatedCreatives });
    } catch (error) {
      console.error("Error regenerating creatives:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getCreativesByType = (type) => {
    return generatedCreatives.filter(c => c.type === type);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Creative Content</h2>
          <p className="text-gray-600">AI-generated copy for your campaign</p>
        </div>
      </div>

      {isProcessing ? (
        <div className="py-16 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Generating Creative Content...
          </h3>
          <p className="text-gray-600">
            Creating compelling copy variations for your campaign
          </p>
        </div>
      ) : (
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-gray-100">
                {CREATIVE_TYPES.map(ct => (
                  <TabsTrigger key={ct.type} value={ct.type}>
                    {ct.label} ({getCreativesByType(ct.type).length})
                  </TabsTrigger>
                ))}
              </TabsList>
              <Button
                variant="outline"
                size="sm"
                onClick={() => regenerateType(activeTab)}
                disabled={isProcessing}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>

            {CREATIVE_TYPES.map(ct => (
              <TabsContent key={ct.type} value={ct.type} className="space-y-4">
                {getCreativesByType(ct.type).map((creative, idx) => (
                  <Card key={idx} className="group hover:shadow-lg transition-all border-2 border-gray-200 hover:border-purple-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className="bg-purple-100 text-purple-700 border-0">
                          {creative.variant || `Variant ${idx + 1}`}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(creative.content)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-lg p-4 mb-3">
                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                          {creative.content}
                        </p>
                      </div>

                      {creative.hooks?.[0] && (
                        <div className="flex items-start gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Hook:</span> {creative.hooks[0]}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-xs text-gray-500">Performance Score</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                              style={{ width: `${creative.performance_score}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-purple-600">
                            {creative.performance_score}/100
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}

      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack} size="lg">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Strategy
        </Button>
        <Button
          size="lg"
          onClick={onNext}
          disabled={generatedCreatives.length === 0 || isProcessing}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          Generate Posters
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}