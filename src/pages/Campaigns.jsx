import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Target, Calendar, DollarSign, TrendingUp, Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Campaigns() {
  const [filter, setFilter] = React.useState("all");

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => base44.entities.Campaign.list('-created_date'),
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const getBrand = (brandId) => brands.find(b => b.id === brandId);

  const filteredCampaigns = filter === "all" 
    ? campaigns 
    : campaigns.filter(c => c.status === filter);

  const statusColors = {
    planning: 'bg-gray-100 text-gray-700 border-gray-300',
    in_progress: 'bg-blue-100 text-blue-700 border-blue-300',
    active: 'bg-green-100 text-green-700 border-green-300',
    completed: 'bg-purple-100 text-purple-700 border-purple-300',
    paused: 'bg-orange-100 text-orange-700 border-orange-300',
  };

  const objectiveIcons = {
    awareness: Target,
    engagement: TrendingUp,
    conversion: DollarSign,
    retention: Calendar,
    launch: Sparkles,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Campaigns</h1>
            <p className="text-gray-600">Manage all your marketing campaigns in one place</p>
          </div>
          <Link to={createPageUrl("Studio")}>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Campaign
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-4">
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="bg-gray-100">
                <TabsTrigger value="all">All ({campaigns.length})</TabsTrigger>
                <TabsTrigger value="planning">Planning</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Campaigns Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="h-64 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-full bg-gray-100 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => {
              const ObjectiveIcon = objectiveIcons[campaign.objective] || Target;
              const brand = getBrand(campaign.brand_id);
              
              return (
                <Card key={campaign.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                          {campaign.name}
                        </h3>
                        {brand && (
                          <p className="text-xs text-gray-500 mt-1">{brand.name}</p>
                        )}
                      </div>
                      <Badge className={`${statusColors[campaign.status]} border text-xs`}>
                        {campaign.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {campaign.product_service}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <ObjectiveIcon className="w-4 h-4 text-purple-600" />
                        <span className="text-gray-700 capitalize">{campaign.objective}</span>
                      </div>

                      {campaign.platforms && campaign.platforms.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {campaign.platforms.slice(0, 3).map((platform) => (
                            <Badge key={platform} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                          {campaign.platforms.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{campaign.platforms.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {campaign.budget && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">${campaign.budget.toLocaleString()}</span>
                        </div>
                      )}

                      {campaign.predicted_metrics?.engagement_rate && (
                        <div className="pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Predicted CTR</span>
                            <span className="font-semibold text-purple-600">
                              {(campaign.predicted_metrics.ctr * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-xl">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === "all" ? "No campaigns yet" : `No ${filter} campaigns`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === "all" 
                  ? "Create your first AI-powered marketing campaign" 
                  : `You don't have any ${filter} campaigns at the moment`}
              </p>
              <Link to={createPageUrl("Studio")}>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}