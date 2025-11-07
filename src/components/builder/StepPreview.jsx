import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Rocket, CheckCircle2, Eye, Smartphone } from "lucide-react";

export default function StepPreview({ 
  campaignData, 
  selectedBrand,
  onBack, 
  onDeploy,
  isProcessing 
}) {
  const [previewPlatform, setPreviewPlatform] = useState(campaignData.platforms?.[0] || "instagram");
  const [previewMode, setPreviewMode] = useState("mobile");

  const getPlatformCreatives = () => {
    return campaignData.creatives?.slice(0, 3) || [];
  };

  const getPlatformPoster = () => {
    return campaignData.posters?.find(p => p.platform === previewPlatform) || campaignData.posters?.[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
          <Eye className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaign Preview</h2>
          <p className="text-gray-600">Review everything before deployment</p>
        </div>
      </div>

      {/* Campaign Summary */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{campaignData.name}</h3>
              {selectedBrand && (
                <Badge className="bg-purple-600 text-white border-0">
                  {selectedBrand.name}
                </Badge>
              )}
            </div>
            <Badge className="bg-green-100 text-green-700 border-0 text-sm px-3 py-2">
              <CheckCircle2 className="w-4 h-4 mr-1 inline" />
              Ready to Deploy
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Objective</p>
              <p className="font-semibold text-gray-900 capitalize">{campaignData.objective}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Budget</p>
              <p className="font-semibold text-gray-900">${campaignData.budget?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Duration</p>
              <p className="font-semibold text-gray-900">{campaignData.duration_days} days</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Platforms</p>
              <p className="font-semibold text-gray-900">{campaignData.platforms?.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Preview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Platform Preview</h3>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={previewMode === "mobile" ? "default" : "outline"}
                onClick={() => setPreviewMode("mobile")}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
              <Tabs value={previewPlatform} onValueChange={setPreviewPlatform}>
                <TabsList className="bg-gray-100">
                  {campaignData.platforms?.slice(0, 4).map(platform => (
                    <TabsTrigger key={platform} value={platform} className="capitalize">
                      {platform}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="flex justify-center">
            <div className={`${previewMode === "mobile" ? "max-w-sm" : "max-w-2xl"} w-full`}>
              {/* Mobile Frame */}
              <div className="bg-gray-900 rounded-3xl p-3 shadow-2xl">
                <div className="bg-white rounded-2xl overflow-hidden">
                  {/* Platform Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        {selectedBrand?.name?.[0] || "B"}
                      </div>
                      <div>
                        <p className="font-semibold">{selectedBrand?.name}</p>
                        <p className="text-xs opacity-80 capitalize">{previewPlatform}</p>
                      </div>
                    </div>
                  </div>

                  {/* Poster */}
                  {getPlatformPoster() && (
                    <div className="aspect-square bg-gray-100">
                      <img 
                        src={getPlatformPoster().file_url} 
                        alt="Campaign poster"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
                      <div>
                        <p className="font-semibold text-sm">{selectedBrand?.name}</p>
                        <p className="text-xs text-gray-500">Sponsored</p>
                      </div>
                    </div>

                    {/* Caption */}
                    {getPlatformCreatives()[0] && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                          {getPlatformCreatives()[0].content}
                        </p>
                      </div>
                    )}

                    {/* Engagement Buttons */}
                    <div className="flex items-center gap-4 py-2 border-t border-gray-200">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
                        <span className="text-xl">❤️</span>
                        <span className="text-sm font-medium">Like</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
                        <span className="text-xl">💬</span>
                        <span className="text-sm font-medium">Comment</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
                        <span className="text-xl">↗️</span>
                        <span className="text-sm font-medium">Share</span>
                      </button>
                    </div>

                    {/* CTA Button */}
                    {campaignData.strategy?.cta && (
                      <Button className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                        {campaignData.strategy.cta}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              {campaignData.creatives?.length || 0}
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Creatives</h4>
            <p className="text-sm text-gray-600">Copy variations ready</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              {campaignData.posters?.length || 0}
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Visual Assets</h4>
            <p className="text-sm text-gray-600">Posters generated</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              {campaignData.platforms?.length || 0}
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Platforms</h4>
            <p className="text-sm text-gray-600">Channels configured</p>
          </CardContent>
        </Card>
      </div>

      {/* Strategy Recap */}
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="p-6">
          <h3 className="font-bold text-gray-900 mb-4">Strategy Overview</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Key Message</p>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {campaignData.strategy?.key_message}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Tone</p>
              <Badge className="bg-purple-100 text-purple-700 border-0 capitalize">
                {campaignData.strategy?.tone}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Content Pillars</p>
              <div className="flex flex-wrap gap-2">
                {campaignData.strategy?.content_pillars?.map((pillar, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {pillar}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack} size="lg">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Posters
        </Button>
      </div>
    </div>
  );
}