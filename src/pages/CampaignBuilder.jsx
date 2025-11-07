import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import StepBrief from "../components/builder/StepBrief";
import StepStrategy from "../components/builder/StepStrategy";
import StepCreatives from "../components/builder/StepCreatives";
import StepPosters from "../components/builder/StepPosters";
import StepPreview from "../components/builder/StepPreview";

const STEPS = [
  { id: 1, name: "Brief", description: "Campaign overview" },
  { id: 2, name: "Strategy", description: "AI-powered strategy" },
  { id: 3, name: "Creatives", description: "Generate copy & content" },
  { id: 4, name: "Posters", description: "Design visuals" },
  { id: 5, name: "Preview", description: "Review & deploy" },
];

export default function CampaignBuilder() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    // Step 1 - Brief
    brand_id: "",
    name: "",
    product_service: "",
    objective: "awareness",
    target_segment: "",
    budget: 0,
    duration_days: 30,
    platforms: [],
    
    // Step 2 - Strategy (AI generated)
    strategy: null,
    
    // Step 3 - Creatives (AI generated)
    creatives: [],
    
    // Step 4 - Posters (AI generated)
    posters: [],
    
    // Campaign ID after creation
    campaign_id: null,
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const saveCampaignMutation = useMutation({
    mutationFn: async (data) => {
      const campaign = await base44.entities.Campaign.create({
        brand_id: data.brand_id,
        name: data.name,
        product_service: data.product_service,
        objective: data.objective,
        target_segment: data.target_segment,
        budget: data.budget,
        duration_days: data.duration_days,
        platforms: data.platforms,
        strategy: data.strategy,
        status: "planning",
      });
      
      // Save all creatives
      for (const creative of data.creatives) {
        await base44.entities.Creative.create({
          campaign_id: campaign.id,
          ...creative,
        });
      }
      
      // Save all posters
      for (const poster of data.posters) {
        await base44.entities.Asset.create({
          campaign_id: campaign.id,
          ...poster,
        });
      }
      
      return campaign;
    },
    onSuccess: (campaign) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      navigate(createPageUrl("Campaigns"));
    },
  });

  const updateCampaignData = (updates) => {
    setCampaignData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAndDeploy = async () => {
    setIsProcessing(true);
    try {
      await saveCampaignMutation.mutateAsync(campaignData);
    } catch (error) {
      console.error("Error saving campaign:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;
  const selectedBrand = brands.find(b => b.id === campaignData.brand_id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Campaign Builder</h1>
              <p className="text-gray-600">Create a complete campaign from start to finish</p>
            </div>
            {selectedBrand && (
              <Badge className="bg-purple-100 text-purple-700 border-0 text-sm px-4 py-2">
                {selectedBrand.name}
              </Badge>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">
                Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].name}
              </span>
              <span className="text-gray-500">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step.id < currentStep
                        ? "bg-green-500 text-white"
                        : step.id === currentStep
                        ? "bg-purple-600 text-white ring-4 ring-purple-200"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.id < currentStep ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-xs font-medium text-gray-900">{step.name}</p>
                    <p className="text-xs text-gray-500 hidden md:block">{step.description}</p>
                  </div>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`w-16 md:w-24 h-1 mx-2 transition-all ${
                      step.id < currentStep ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-0 shadow-2xl mb-6">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <StepBrief
                campaignData={campaignData}
                updateCampaignData={updateCampaignData}
                brands={brands}
                onNext={handleNext}
              />
            )}
            {currentStep === 2 && (
              <StepStrategy
                campaignData={campaignData}
                updateCampaignData={updateCampaignData}
                selectedBrand={selectedBrand}
                onNext={handleNext}
                onBack={handleBack}
                setIsProcessing={setIsProcessing}
                isProcessing={isProcessing}
              />
            )}
            {currentStep === 3 && (
              <StepCreatives
                campaignData={campaignData}
                updateCampaignData={updateCampaignData}
                onNext={handleNext}
                onBack={handleBack}
                setIsProcessing={setIsProcessing}
                isProcessing={isProcessing}
              />
            )}
            {currentStep === 4 && (
              <StepPosters
                campaignData={campaignData}
                updateCampaignData={updateCampaignData}
                onNext={handleNext}
                onBack={handleBack}
                setIsProcessing={setIsProcessing}
                isProcessing={isProcessing}
              />
            )}
            {currentStep === 5 && (
              <StepPreview
                campaignData={campaignData}
                selectedBrand={selectedBrand}
                onBack={handleBack}
                onDeploy={handleSaveAndDeploy}
                isProcessing={isProcessing}
              />
            )}
          </CardContent>
        </Card>

        {/* Bottom Actions */}
        {currentStep === STEPS.length && (
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleSaveAndDeploy}
              disabled={isProcessing}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-6 shadow-2xl"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Deploying Campaign...
                </>
              ) : (
                <>
                  <Rocket className="w-6 h-6 mr-3" />
                  Deploy Campaign
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}