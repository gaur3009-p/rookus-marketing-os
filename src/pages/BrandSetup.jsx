import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, X, Save, Sparkles, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function BrandSetup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    target_audience: "",
    brand_voice: "professional",
    core_values: [],
    tagline: "",
    color_palette: [],
    competitor_brands: [],
    unique_selling_points: [],
  });
  const [newValue, setNewValue] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newCompetitor, setNewCompetitor] = useState("");
  const [newUSP, setNewUSP] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => base44.entities.Brand.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Brand.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Brand.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      resetForm();
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      industry: "",
      target_audience: "",
      brand_voice: "professional",
      core_values: [],
      tagline: "",
      color_palette: [],
      competitor_brands: [],
      unique_selling_points: [],
    });
    setEditingBrand(null);
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData(brand);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingBrand) {
      updateMutation.mutate({ id: editingBrand.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, logo_url: file_url });
    } catch (error) {
      console.error("Error uploading logo:", error);
    }
    setUploadingLogo(false);
  };

  const addArrayItem = (field, value, setter) => {
    if (!value.trim()) return;
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), value.trim()]
    });
    setter("");
  };

  const removeArrayItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Brand Setup</h1>
              <p className="text-gray-600">Configure your brand identity for better AI recommendations</p>
            </div>
          </div>
        </div>

        {/* Existing Brands */}
        {brands.length > 0 && !editingBrand && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Brands</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {brands.map((brand) => (
                <Card key={brand.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {brand.logo_url && (
                          <img src={brand.logo_url} alt={brand.name} className="w-12 h-12 object-contain rounded" />
                        )}
                        <div>
                          <h3 className="font-bold text-gray-900">{brand.name}</h3>
                          <p className="text-sm text-gray-500">{brand.industry}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(brand)}>
                        Edit
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Badge className="bg-purple-100 text-purple-700 border-0">
                        {brand.brand_voice}
                      </Badge>
                      {brand.core_values && brand.core_values.length > 0 && (
                        <p className="text-xs text-gray-600">
                          {brand.core_values.slice(0, 3).join(", ")}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Brand Form */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              {editingBrand ? "Edit Brand" : "Create New Brand"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Brand Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Acme Corp"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g., Technology, Fashion, Food"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_audience">Target Audience *</Label>
                <Textarea
                  id="target_audience"
                  value={formData.target_audience}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                  placeholder="Describe your ideal customer (age, interests, behaviors, demographics)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand_voice">Brand Voice *</Label>
                <Select
                  value={formData.brand_voice}
                  onValueChange={(value) => setFormData({ ...formData, brand_voice: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="playful">Playful</SelectItem>
                    <SelectItem value="sophisticated">Sophisticated</SelectItem>
                    <SelectItem value="edgy">Edgy</SelectItem>
                    <SelectItem value="inspirational">Inspirational</SelectItem>
                    <SelectItem value="witty">Witty</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Your memorable brand slogan"
                />
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <Label>Brand Logo</Label>
                <div className="flex items-center gap-4">
                  {formData.logo_url && (
                    <img src={formData.logo_url} alt="Logo" className="w-20 h-20 object-contain border rounded" />
                  )}
                  <div>
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('logo-upload').click()}
                      disabled={uploadingLogo}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadingLogo ? "Uploading..." : "Upload Logo"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Core Values */}
              <div className="space-y-2">
                <Label>Core Values</Label>
                <div className="flex gap-2">
                  <Input
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="e.g., Innovation, Quality, Trust"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('core_values', newValue, setNewValue);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('core_values', newValue, setNewValue)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.core_values?.map((value, idx) => (
                    <Badge key={idx} className="bg-blue-100 text-blue-700 border-0">
                      {value}
                      <button
                        type="button"
                        onClick={() => removeArrayItem('core_values', idx)}
                        className="ml-2"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div className="space-y-2">
                <Label>Color Palette</Label>
                <div className="flex gap-2">
                  <Input
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="e.g., #667eea or purple"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('color_palette', newColor, setNewColor);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('color_palette', newColor, setNewColor)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.color_palette?.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm">{color}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('color_palette', idx)}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitors */}
              <div className="space-y-2">
                <Label>Key Competitors</Label>
                <div className="flex gap-2">
                  <Input
                    value={newCompetitor}
                    onChange={(e) => setNewCompetitor(e.target.value)}
                    placeholder="e.g., Competitor Brand Name"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('competitor_brands', newCompetitor, setNewCompetitor);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('competitor_brands', newCompetitor, setNewCompetitor)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.competitor_brands?.map((competitor, idx) => (
                    <Badge key={idx} className="bg-red-100 text-red-700 border-0">
                      {competitor}
                      <button
                        type="button"
                        onClick={() => removeArrayItem('competitor_brands', idx)}
                        className="ml-2"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* USPs */}
              <div className="space-y-2">
                <Label>Unique Selling Points</Label>
                <div className="flex gap-2">
                  <Input
                    value={newUSP}
                    onChange={(e) => setNewUSP(e.target.value)}
                    placeholder="What makes you unique?"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('unique_selling_points', newUSP, setNewUSP);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('unique_selling_points', newUSP, setNewUSP)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.unique_selling_points?.map((usp, idx) => (
                    <Badge key={idx} className="bg-green-100 text-green-700 border-0">
                      {usp}
                      <button
                        type="button"
                        onClick={() => removeArrayItem('unique_selling_points', idx)}
                        className="ml-2"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                {editingBrand && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingBrand ? "Update Brand" : "Create Brand"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}