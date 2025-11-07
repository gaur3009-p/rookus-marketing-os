import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, Zap, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Analytics() {
  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => base44.entities.Campaign.list(),
  });

  const { data: creatives = [] } = useQuery({
    queryKey: ['creatives'],
    queryFn: () => base44.entities.Creative.list(),
  });

  const { data: abTests = [] } = useQuery({
    queryKey: ['abtests'],
    queryFn: () => base44.entities.ABTest.list(),
  });

  // Campaign status distribution
  const statusData = [
    { name: 'Planning', value: campaigns.filter(c => c.status === 'planning').length, color: '#6B7280' },
    { name: 'In Progress', value: campaigns.filter(c => c.status === 'in_progress').length, color: '#3B82F6' },
    { name: 'Active', value: campaigns.filter(c => c.status === 'active').length, color: '#10B981' },
    { name: 'Completed', value: campaigns.filter(c => c.status === 'completed').length, color: '#8B5CF6' },
  ];

  // Objective distribution
  const objectiveData = [
    { name: 'Awareness', count: campaigns.filter(c => c.objective === 'awareness').length },
    { name: 'Engagement', count: campaigns.filter(c => c.objective === 'engagement').length },
    { name: 'Conversion', count: campaigns.filter(c => c.objective === 'conversion').length },
    { name: 'Retention', count: campaigns.filter(c => c.objective === 'retention').length },
    { name: 'Launch', count: campaigns.filter(c => c.objective === 'launch').length },
  ];

  // Performance scores over time (simplified)
  const performanceData = creatives
    .filter(c => c.performance_score)
    .slice(-10)
    .map((c, idx) => ({
      name: `Creative ${idx + 1}`,
      score: c.performance_score,
    }));

  // Platform distribution
  const platformCount = {};
  campaigns.forEach(campaign => {
    campaign.platforms?.forEach(platform => {
      platformCount[platform] = (platformCount[platform] || 0) + 1;
    });
  });

  const platformData = Object.entries(platformCount).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    campaigns: value,
  }));

  // Insights
  const avgPerformanceScore = creatives.length > 0
    ? creatives.reduce((sum, c) => sum + (c.performance_score || 0), 0) / creatives.length
    : 0;

  const highPerformingCreatives = creatives.filter(c => c.performance_score >= 80).length;
  const completedTests = abTests.filter(t => t.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-amber-50/30 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Track performance and optimize your campaigns</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 opacity-30" />
                <Badge className="bg-white/20 text-white border-0">Live</Badge>
              </div>
              <p className="text-sm text-orange-100 mb-1">Avg Performance</p>
              <p className="text-3xl font-bold">{avgPerformanceScore.toFixed(0)}/100</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 opacity-30" />
                <Badge className="bg-white/20 text-white border-0">Quality</Badge>
              </div>
              <p className="text-sm text-green-100 mb-1">High Performers</p>
              <p className="text-3xl font-bold">{highPerformingCreatives}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-8 h-8 opacity-30" />
                <Badge className="bg-white/20 text-white border-0">Tests</Badge>
              </div>
              <p className="text-sm text-blue-100 mb-1">A/B Tests Run</p>
              <p className="text-3xl font-bold">{completedTests}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 opacity-30" />
                <Badge className="bg-white/20 text-white border-0">Active</Badge>
              </div>
              <p className="text-sm text-purple-100 mb-1">Active Campaigns</p>
              <p className="text-3xl font-bold">
                {campaigns.filter(c => c.status === 'active' || c.status === 'in_progress').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Campaign Status Distribution */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Campaign Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Objectives Breakdown */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Campaign Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={objectiveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Platform Usage */}
          {platformData.length > 0 && (
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Platform Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={platformData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                    <Tooltip />
                    <Bar dataKey="campaigns" fill="#3B82F6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Performance Trend */}
          {performanceData.length > 0 && (
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Creative Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Insights */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              AI-Powered Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-2">Performance Trend</h4>
                <p className="text-sm text-gray-600">
                  Your average creative performance score is <span className="font-bold text-purple-600">{avgPerformanceScore.toFixed(0)}/100</span>.
                  {avgPerformanceScore >= 70 
                    ? " Great job! Your content is resonating well with audiences."
                    : " Consider A/B testing different messaging approaches to improve performance."}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-2">Campaign Balance</h4>
                <p className="text-sm text-gray-600">
                  You have <span className="font-bold text-purple-600">{campaigns.filter(c => c.status === 'active').length} active campaigns</span>.
                  {campaigns.filter(c => c.status === 'planning').length > 3
                    ? " Several campaigns are in planning - prioritize launching your strongest concepts first."
                    : " Consider planning new campaigns to maintain momentum."}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-2">Top Performers</h4>
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-purple-600">{highPerformingCreatives} creatives</span> scored 80+ in AI performance prediction.
                  {highPerformingCreatives > 0
                    ? " Analyze these high performers to understand what resonates."
                    : " Keep creating and testing to discover your winning formulas."}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-2">Platform Strategy</h4>
                <p className="text-sm text-gray-600">
                  {platformData.length > 0 
                    ? `Your most used platform is ${platformData.sort((a, b) => b.campaigns - a.campaigns)[0]?.name}. Consider diversifying to reach wider audiences.`
                    : "Start defining your platform strategy to maximize campaign reach."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}