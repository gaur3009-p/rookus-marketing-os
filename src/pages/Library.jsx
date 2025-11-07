import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Image as ImageIcon, Hash, TrendingUp, Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Library() {
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [platformFilter, setPlatformFilter] = React.useState("all");

  const { data: creatives = [], isLoading: loadingCreatives } = useQuery({
    queryKey: ['creatives'],
    queryFn: () => base44.entities.Creative.list('-created_date'),
  });

  const { data: assets = [], isLoading: loadingAssets } = useQuery({
    queryKey: ['assets'],
    queryFn: () => base44.entities.Asset.list('-created_date'),
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => base44.entities.Campaign.list(),
  });

  const getCampaign = (campaignId) => campaigns.find(c => c.id === campaignId);

  const filteredCreatives = creatives.filter(c => {
    const typeMatch = typeFilter === "all" || c.type === typeFilter;
    const platformMatch = platformFilter === "all" || c.platform === platformFilter;
    return typeMatch && platformMatch;
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const typeColors = {
    ad_copy: 'bg-blue-100 text-blue-700',
    caption: 'bg-purple-100 text-purple-700',
    tagline: 'bg-pink-100 text-pink-700',
    script: 'bg-green-100 text-green-700',
    email: 'bg-orange-100 text-orange-700',
    headline: 'bg-red-100 text-red-700',
    cta: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Creative Library</h1>
              <p className="text-gray-600">All your AI-generated content in one place</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100 mb-1">Total Creatives</p>
                  <p className="text-3xl font-bold">{creatives.length}</p>
                </div>
                <FileText className="w-10 h-10 opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-100 mb-1">Visual Assets</p>
                  <p className="text-3xl font-bold">{assets.length}</p>
                </div>
                <ImageIcon className="w-10 h-10 opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-pink-100 mb-1">Avg Performance</p>
                  <p className="text-3xl font-bold">
                    {creatives.length > 0 
                      ? (creatives.reduce((sum, c) => sum + (c.performance_score || 0), 0) / creatives.length).toFixed(0)
                      : 0}/100
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 opacity-30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Content Type</label>
                <Tabs value={typeFilter} onValueChange={setTypeFilter}>
                  <TabsList className="bg-gray-100">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="ad_copy">Ad Copy</TabsTrigger>
                    <TabsTrigger value="caption">Captions</TabsTrigger>
                    <TabsTrigger value="tagline">Taglines</TabsTrigger>
                    <TabsTrigger value="script">Scripts</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Platform</label>
                <Tabs value={platformFilter} onValueChange={setPlatformFilter}>
                  <TabsList className="bg-gray-100">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="instagram">Instagram</TabsTrigger>
                    <TabsTrigger value="facebook">Facebook</TabsTrigger>
                    <TabsTrigger value="twitter">Twitter</TabsTrigger>
                    <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Creatives Grid */}
        {loadingCreatives ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="h-48 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-full bg-gray-100 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCreatives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCreatives.map((creative) => {
              const campaign = getCampaign(creative.campaign_id);
              
              return (
                <Card key={creative.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${typeColors[creative.type]} border-0 text-xs`}>
                            {creative.type.replace(/_/g, ' ')}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {creative.platform}
                          </Badge>
                        </div>
                        {campaign && (
                          <p className="text-xs text-gray-500">{campaign.name}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(creative.content)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-lg p-4 border border-gray-100">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap line-clamp-4">
                        {creative.content}
                      </p>
                    </div>

                    {creative.hashtags && creative.hashtags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Hash className="w-3 h-3 text-gray-400" />
                        {creative.hashtags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-xs text-purple-600">
                            #{tag}
                          </span>
                        ))}
                        {creative.hashtags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{creative.hashtags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {creative.performance_score && (
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500">AI Performance Score</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                              style={{ width: `${creative.performance_score}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-purple-600">
                            {creative.performance_score}/100
                          </span>
                        </div>
                      </div>
                    )}

                    {creative.engagement_prediction && (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        <span className="text-xs text-gray-600">
                          Predicted: <span className="font-semibold capitalize">{creative.engagement_prediction}</span> engagement
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-xl">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No creatives yet</h3>
              <p className="text-gray-600">
                Start creating campaigns to generate AI-powered content
              </p>
            </CardContent>
          </Card>
        )}

        {/* Visual Assets Section */}
        {assets.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Visual Assets</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {assets.map((asset) => (
                <Card key={asset.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 relative">
                    {asset.file_url && (
                      <img 
                        src={asset.file_url} 
                        alt={asset.type}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="sm"
                        className="bg-white text-gray-900 hover:bg-gray-100"
                        onClick={() => window.open(asset.file_url, '_blank')}
                      >
                        View Full
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <Badge className="text-xs" variant="outline">
                      {asset.platform}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {asset.type.replace(/_/g, ' ')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}