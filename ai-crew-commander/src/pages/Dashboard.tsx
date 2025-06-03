
import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Play, Settings, TrendingUp, Clock, DollarSign, Bot, Activity } from 'lucide-react';

const Dashboard = () => {
  const crews = [
    {
      id: 1,
      name: 'Competitor Monitor',
      description: 'Weekly competitive intelligence reports',
      status: 'Active',
      lastRun: '2 hours ago',
      runs: 24,
      hoursSaved: 12,
      valueGenerated: 2400,
      successRate: 95
    },
    {
      id: 2,
      name: 'Social Media Creator',
      description: 'Transform blog posts into social content',
      status: 'Paused',
      lastRun: '1 day ago',
      runs: 12,
      hoursSaved: 8,
      valueGenerated: 1800,
      successRate: 88
    }
  ];

  const recentActivities = [
    {
      id: 1,
      crew: 'Competitor Monitor',
      action: 'Found 3 new product launches',
      time: '2 hours ago',
      icon: TrendingUp,
      type: 'success'
    },
    {
      id: 2,
      crew: 'Social Media Creator',
      action: 'Posted 5 LinkedIn articles',
      time: '4 hours ago',
      icon: Bot,
      type: 'success'
    },
    {
      id: 3,
      crew: 'Lead Generator',
      action: 'Identified 12 qualified prospects',
      time: '6 hours ago',
      icon: TrendingUp,
      type: 'success'
    },
    {
      id: 4,
      crew: 'Sales Assistant',
      action: 'Scheduled 3 demo calls',
      time: '1 day ago',
      icon: Clock,
      type: 'info'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Track your automation performance and business impact</p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-lg px-8 py-3 h-auto">
              <Plus className="h-5 w-5 mr-2" />
              Build New Crew
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">47</div>
                    <div className="text-gray-600">Hours Saved This Month</div>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">$8,400</div>
                    <div className="text-gray-600">Revenue Impact</div>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">2</div>
                    <div className="text-gray-600">Active Automations</div>
                  </div>
                  <Bot className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">92%</div>
                    <div className="text-gray-600">Success Rate</div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Crews Grid */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Automations</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {crews.map((crew) => (
                  <Card key={crew.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-gray-900">{crew.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          crew.status === 'Active' 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {crew.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{crew.description}</p>
                      
                      {/* ROI Metrics */}
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Time Saved This Week</span>
                          <span className="text-sm font-medium text-blue-600">{crew.hoursSaved} hours</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Value Generated</span>
                          <span className="text-sm font-medium text-green-600">${crew.valueGenerated.toLocaleString()}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Performance</span>
                            <span className="text-sm font-medium">{crew.successRate}%</span>
                          </div>
                          <Progress value={crew.successRate} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-500 mb-4">
                        <span>Last run: {crew.lastRun}</span>
                        <span>{crew.runs} runs</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Play className="h-3 w-3 mr-1" />
                          Run
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Activity className="h-5 w-5" />
                    Live Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.crew}</p>
                        <p className="text-sm text-gray-600">{activity.action}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
