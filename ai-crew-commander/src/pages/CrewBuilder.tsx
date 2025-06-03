
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import PreviewModal from '@/components/PreviewModal';
import WorkflowVisualization from '@/components/WorkflowVisualization';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Users, Brain, FileText, Eye } from 'lucide-react';

interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp?: Date;
}

interface CrewMember {
  id: string;
  name: string;
  role: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
}

const CrewBuilder = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      content: "Hello! I'm your AI crew builder assistant. 🤖\n\nI'll help you create a specialized team of AI agents to automate any business process. Just tell me what you'd like to automate, and I'll design the perfect crew for the job.\n\nWhat would you like your AI team to handle for you?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [currentCrew, setCurrentCrew] = useState<CrewMember[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const simulateAIResponse = (userInput: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let aiResponse = "";
      let newCrew: CrewMember[] = [];

      if (userInput.toLowerCase().includes('competitor') || userInput.toLowerCase().includes('monitor')) {
        aiResponse = "Excellent choice! 🎯 Competitive intelligence is crucial for staying ahead.\n\nI'm creating a specialized 3-agent crew that will:\n• Monitor competitor websites, social media, and news 24/7\n• Analyze trends and strategic moves\n• Deliver professional weekly reports with actionable insights\n\nThis will save you 8+ hours per week and ensure you never miss important competitor updates. Let me set up your agents...";
        newCrew = [
          {
            id: '1',
            name: 'Research Scout',
            role: 'Data Collector',
            description: 'Continuously monitors competitor websites, social media, press releases, and industry news',
            status: 'active'
          },
          {
            id: '2',
            name: 'Strategic Analyst',
            role: 'Intelligence Expert',
            description: 'Analyzes competitor data, identifies patterns, and extracts strategic insights',
            status: 'active'
          },
          {
            id: '3',
            name: 'Report Compiler',
            role: 'Business Writer',
            description: 'Creates professional weekly reports with executive summaries and recommendations',
            status: 'pending'
          }
        ];
      } else if (userInput.toLowerCase().includes('social media') || userInput.toLowerCase().includes('content')) {
        aiResponse = "Perfect! 📱 Content amplification is a game-changer for reach and engagement.\n\nI'm building a content transformation crew that will:\n• Extract key insights from your blog posts\n• Create platform-optimized content for LinkedIn, Twitter, etc.\n• Schedule posts at optimal engagement times\n\nThis typically increases social media engagement by 300% and saves 6+ hours per week. Setting up your creative team...";
        newCrew = [
          {
            id: '1',
            name: 'Content Analyzer',
            role: 'Content Strategist',
            description: 'Analyzes blog articles, extracts key points, and identifies shareable insights',
            status: 'active'
          },
          {
            id: '2',
            name: 'Social Creator',
            role: 'Creative Writer',
            description: 'Transforms content into engaging, platform-specific social media posts',
            status: 'active'
          },
          {
            id: '3',
            name: 'Distribution Manager',
            role: 'Optimization Specialist',
            description: 'Schedules posts at optimal times and tracks engagement metrics',
            status: 'pending'
          }
        ];
      } else if (userInput.toLowerCase().includes('job') || userInput.toLowerCase().includes('recruit') || userInput.toLowerCase().includes('candidate')) {
        aiResponse = "Smart move! 💼 Quality hiring is critical for business growth.\n\nI'm assembling a recruitment crew that will:\n• Screen resumes against your specific criteria\n• Rank candidates by fit and qualifications\n• Schedule interviews with top candidates automatically\n\nThis reduces hiring time by 70% and ensures you only interview the best candidates. Building your recruitment team...";
        newCrew = [
          {
            id: '1',
            name: 'Resume Screener',
            role: 'Talent Scout',
            description: 'Reviews applications, checks qualifications, and filters based on your criteria',
            status: 'active'
          },
          {
            id: '2',
            name: 'Candidate Ranker',
            role: 'Assessment Expert',
            description: 'Scores and ranks candidates using AI-powered evaluation methods',
            status: 'active'
          },
          {
            id: '3',
            name: 'Interview Coordinator',
            role: 'Scheduling Agent',
            description: 'Contacts top candidates and schedules interviews automatically',
            status: 'pending'
          }
        ];
      } else if (userInput.toLowerCase().includes('lead') || userInput.toLowerCase().includes('linkedin') || userInput.toLowerCase().includes('sales')) {
        aiResponse = "Excellent! 🚀 Lead generation is the lifeblood of business growth.\n\nI'm creating a sales prospecting crew that will:\n• Find qualified prospects on LinkedIn matching your ideal customer profile\n• Research company backgrounds and pain points\n• Generate personalized outreach messages\n\nThis typically generates 50+ qualified leads per week and increases response rates by 400%. Setting up your sales team...";
        newCrew = [
          {
            id: '1',
            name: 'Prospect Hunter',
            role: 'Lead Researcher',
            description: 'Searches LinkedIn and databases for prospects matching your ideal customer profile',
            status: 'active'
          },
          {
            id: '2',
            name: 'Company Intel',
            role: 'Research Analyst',
            description: 'Researches prospect companies, recent news, and potential pain points',
            status: 'active'
          },
          {
            id: '3',
            name: 'Outreach Specialist',
            role: 'Sales Writer',
            description: 'Crafts personalized connection requests and follow-up sequences',
            status: 'pending'
          }
        ];
      } else if (userInput.toLowerCase().includes('feedback') || userInput.toLowerCase().includes('customer') || userInput.toLowerCase().includes('sentiment')) {
        aiResponse = "Great insight! 📊 Customer feedback is gold for business improvement.\n\nI'm building a feedback analysis crew that will:\n• Collect feedback from all customer touchpoints\n• Analyze sentiment and identify key themes\n• Provide actionable improvement recommendations\n\nThis helps increase customer satisfaction by 25% and reduces churn significantly. Creating your analysis team...";
        newCrew = [
          {
            id: '1',
            name: 'Feedback Collector',
            role: 'Data Aggregator',
            description: 'Gathers customer feedback from reviews, surveys, support tickets, and social media',
            status: 'active'
          },
          {
            id: '2',
            name: 'Sentiment Analyzer',
            role: 'AI Analyst',
            description: 'Performs sentiment analysis and identifies recurring themes and issues',
            status: 'active'
          },
          {
            id: '3',
            name: 'Insights Generator',
            role: 'Business Consultant',
            description: 'Creates actionable recommendations and improvement strategies',
            status: 'pending'
          }
        ];
      } else {
        aiResponse = "I'd love to help you build the perfect AI crew! 🎯\n\nTo create the most effective team, could you tell me more about:\n\n• What specific business process you want to automate?\n• How often should this process run? (daily, weekly, monthly)\n• What kind of outputs or results do you expect?\n• Are there any specific tools or platforms involved?\n\nThe more details you provide, the better I can design your AI crew to deliver exactly what you need!";
      }

      setMessages(prev => [...prev, {
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }]);
      
      if (newCrew.length > 0) {
        setCurrentCrew(newCrew);
      }
      
      setIsTyping(false);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessages = [
      ...messages,
      { type: 'user' as const, content: inputValue, timestamp: new Date() }
    ];
    
    setMessages(newMessages);
    simulateAIResponse(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleExampleClick = (example: string) => {
    setInputValue(example);
  };

  const exampleRequests = [
    "Monitor my competitors and send me weekly reports",
    "Create social media posts from my blog articles", 
    "Screen job applications and rank candidates",
    "Generate sales leads from LinkedIn",
    "Analyze customer feedback and sentiment"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Chat Interface */}
            <div className="flex-1">
              <Card className="h-[700px] flex flex-col">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-blue-600" />
                    Build Your AI Crew
                  </CardTitle>
                  <p className="text-gray-600">Describe what you want to automate in plain English</p>
                </CardHeader>
                
                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' ? 'bg-blue-600' : 'bg-gray-200'
                      }`}>
                        {message.type === 'user' ? 
                          <User className="h-4 w-4 text-white" /> : 
                          <Bot className="h-4 w-4 text-gray-600" />
                        }
                      </div>
                      <div
                        className={`max-w-md px-4 py-3 rounded-lg whitespace-pre-line ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Input and Example Buttons */}
                <div className="p-6 border-t space-y-4">
                  {/* Example Request Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {exampleRequests.map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleExampleClick(example)}
                        disabled={isTyping}
                      >
                        "{example}"
                      </Button>
                    ))}
                  </div>
                  
                  {/* Input */}
                  <div className="flex gap-4">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Describe what you want to automate..."
                      className="flex-1"
                      disabled={isTyping}
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      className="px-6"
                      disabled={isTyping || !inputValue.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="w-96 space-y-6">
              {/* Current Crew */}
              {currentCrew.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Your AI Crew
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentCrew.map((member) => (
                      <div key={member.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{member.name}</h4>
                          <Badge 
                            variant={member.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {member.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-blue-600 font-medium mb-1">{member.role}</p>
                        <p className="text-xs text-gray-600">{member.description}</p>
                      </div>
                    ))}
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setShowPreview(true)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Crew
                      </Button>
                      <Button className="flex-1">
                        Deploy Crew
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Workflow Visualization */}
              {currentCrew.length > 0 && <WorkflowVisualization crew={currentCrew} />}
              
              {/* How It Works */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <h4 className="font-medium text-sm">Describe Your Goal</h4>
                      <p className="text-xs text-gray-600">Tell us what process you want to automate</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <h4 className="font-medium text-sm">AI Builds Your Crew</h4>
                      <p className="text-xs text-gray-600">We create specialized agents for your task</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <h4 className="font-medium text-sm">Deploy & Monitor</h4>
                      <p className="text-xs text-gray-600">Your crew works autonomously while you track progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Preview Modal */}
      <PreviewModal 
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        crew={currentCrew}
      />
    </div>
  );
};

export default CrewBuilder;
