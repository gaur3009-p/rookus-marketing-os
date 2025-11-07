import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const PLATFORMS = [
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "twitter", label: "Twitter" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
  { id: "email", label: "Email" },
];

export default function StepBrief({ campaignData, updateCampaignData, brands, onNext }) {
  const togglePlatform = (platformId) => {
    const platforms = campaignData.platforms || [];
    if (platforms.includes(platformId)) {
      updateCampaignData({ platforms: platforms.filter(p => p !== platformId) });
    } else {
      updateCampaignData({ platforms: [...platforms, platformId] });
    }
  };

  const isValid = campaignData.brand_id && 
                  campaignData.name && 
                  campaignData.product_service && 
                  campaignData.target_segment &&
                  campaignData.platforms?.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaign Brief</h2>
          <p className="text-gray-600">Tell us about your campaign goals and audience</p>
        </div>
      </div>

      {brands.length === 0 ? (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
          <h3 className="font-semibold text-orange-900 mb-2">No Brand Profile Found</h3>
          <p className="text-sm text-orange-700 mb-4">
            Create a brand profile first for better AI recommendations
          </p>
          <Link to={createPageUrl("BrandSetup")}>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              Create Brand Profile
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="brand">Select Brand *</Label>
            <Select
              value={campaignData.brand_id}
              onValueChange={(value) => updateCampaignData({ brand_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a brand..." />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name} - {brand.industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name *</Label>
            <Input
              id="name"
              value={campaignData.name}
              onChange={(e) => updateCampaignData({ name: e.target.value })}
              placeholder="e.g., Summer Launch 2024, Holiday Sale Campaign"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product">Product/Service *</Label>
            <Textarea
              id="product"
              value={campaignData.product_service}
              onChange={(e) => updateCampaignData({ product_service: e.target.value })}
              placeholder="Describe what you're promoting in detail..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objective">Campaign Objective *</Label>
            <Select
              value={campaignData.objective}
              onValueChange={(value) => updateCampaignData({ objective: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="awareness">Brand Awareness</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="conversion">Conversion/Sales</SelectItem>
                <SelectItem value="retention">Customer Retention</SelectItem>
                <SelectItem value="launch">Product Launch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Target Audience *</Label>
            <Textarea
              id="target"
              value={campaignData.target_segment}
              onChange={(e) => updateCampaignData({ target_segment: e.target.value })}
              placeholder="Describe your specific target audience for this campaign..."
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Platforms * (Select at least one)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PLATFORMS.map((platform) => (
                <div
                  key={platform.id}
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    campaignData.platforms?.includes(platform.id)
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => togglePlatform(platform.id)}
                >
                  <Checkbox
                    checked={campaignData.platforms?.includes(platform.id)}
                    onCheckedChange={() => togglePlatform(platform.id)}
                  />
                  <label className="text-sm font-medium cursor-pointer">
                    {platform.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                value={campaignData.budget || ""}
                onChange={(e) => updateCampaignData({ budget: parseFloat(e.target.value) || 0 })}
                placeholder="5000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (Days)</Label>
              <Input
                id="duration"
                type="number"
                value={campaignData.duration_days || ""}
                onChange={(e) => updateCampaignData({ duration_days: parseInt(e.target.value) || 30 })}
                placeholder="30"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-6 border-t">
        <Button
          size="lg"
          onClick={onNext}
          disabled={!isValid}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          Continue to Strategy
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}