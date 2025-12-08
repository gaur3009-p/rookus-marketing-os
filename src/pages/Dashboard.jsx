import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TrendingUp, Target, Zap, ArrowRight, Briefcase, Palette, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Scene3D from "../components/dashboard/Scene3D";

export default function Dashboard() {
  const { data: campaigns = [], isLoading: loadingCampaigns } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => base44.entities.Campaign.list('-created_date', 10),
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const { data: creatives = [] } = useQuery({
    queryKey: ['creatives'],
    queryFn: () => base44.entities.Creative.list('-created_date', 50),
  });

  const activeCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'in_progress');
  const avgEngagement = creatives.length > 0
    ? creatives.reduce((sum, c) => sum + (c.performance_score || 0), 0) / creatives.length
    : 0;

  const recentCampaigns = campaigns.slice(0, 4);

  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 mb-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-white" />
              <Badge className="bg-white/20 text-white border-0 hover:bg-white/30">AI Marketing OS</Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Welcome to Rookus
            </h1>
            <p className="text-lg md:text-xl text-purple-100 mb-8 max-w-2xl">
              Your AI-powered marketing command center. Create campaigns, generate creatives, and drive results with intelligent automation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={createPageUrl("Studio")}>
                <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 font-semibold shadow-lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Creating
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              {brands.length === 0 && (
                <Link to={createPageUrl("BrandSetup")}>
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                    Set Up Your Brand
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid with 3D Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-visible relative group hover:scale-105 transition-transform duration-300">
            <div className="absolute -top-10 -right-10 z-10">
              <Scene3D color="#a855f7" />
            </div>
            <CardHeader className="pb-3 pt-6">
              <CardTitle className="text-sm font-medium text-purple-100">Total Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-5xl font-bold tracking-tight">{campaigns.length}</p>
                  <p className="text-sm text-purple-100 mt-2">{activeCampaigns.length} active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl bg-gradient-to-br from-pink-500 to-pink-600 text-white overflow-visible relative group hover:scale-105 transition-transform duration-300">
            <div className="absolute -top-10 -right-10 z-10">
              <Scene3D color="#ec4899" />
            </div>
            <CardHeader className="pb-3 pt-6">
              <CardTitle className="text-sm font-medium text-pink-100">Creatives Generated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-5xl font-bold tracking-tight">{creatives.length}</p>
                  <p className="text-sm text-pink-100 mt-2">AI-powered content</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-visible relative group hover:scale-105 transition-transform duration-300">
            <div className="absolute -top-10 -right-10 z-10">
              <Scene3D color="#3b82f6" />
            </div>
            <CardHeader className="pb-3 pt-6">
              <CardTitle className="text-sm font-medium text-blue-100">Avg Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-5xl font-bold tracking-tight">{avgEngagement.toFixed(0)}</p>
                  <p className="text-sm text-blue-100 mt-2">Quality score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-visible relative group hover:scale-105 transition-transform duration-300">
            <div className="absolute -top-10 -right-10 z-10">
              <Scene3D color="#f97316" />
            </div>
            <CardHeader className="pb-3 pt-6">
              <CardTitle className="text-sm font-medium text-orange-100">Brands Managed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-5xl font-bold tracking-tight">{brands.length}</p>
                  <p className="text-sm text-orange-100 mt-2">With AI memory</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Campaigns */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-purple-50/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">Recent Campaigns</CardTitle>
              <Link to={createPageUrl("Campaigns")}>
                <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loadingCampaigns ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentCampaigns.map((campaign) => {
                  const statusColors = {
                    planning: 'bg-gray-100 text-gray-700',
                    in_progress: 'bg-blue-100 text-blue-700',
                    active: 'bg-green-100 text-green-700',
                    completed: 'bg-purple-100 text-purple-700',
                    paused: 'bg-orange-100 text-orange-700',
                  };
                  
                  return (
                    <div key={campaign.id} className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-purple-200 transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {campaign.name}
                        </h3>
                        <Badge className={`${statusColors[campaign.status]} border-0 text-xs`}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {campaign.product_service}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Target className="w-3 h-3" />
                        <span className="capitalize">{campaign.objective}</span>
                        {campaign.platforms && (
                          <>
                            <span>•</span>
                            <span>{campaign.platforms.length} platforms</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h3>
                <p className="text-gray-600 mb-4">Start creating your first AI-powered marketing campaign</p>
                <Link to={createPageUrl("Studio")}>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to={createPageUrl("Studio")} className="group">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 h-full">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  AI Campaign Studio
                </h3>
                <p className="text-sm text-gray-600">
                  Chat with AI to create complete campaigns with strategy and creatives
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("Library")} className="group">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 h-full">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Creative Library
                </h3>
                <p className="text-sm text-gray-600">
                  Browse all your AI-generated ad copy, captions, and visual assets
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("Analytics")} className="group">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-amber-50 h-full">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  Campaign Analytics
                </h3>
                <p className="text-sm text-gray-600">
                  Track performance metrics and get AI-powered insights
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}