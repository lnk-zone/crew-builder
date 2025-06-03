
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const UseCases = () => {
  const useCases = [
    {
      title: "Monitor competitors and create weekly reports",
      description: "Track competitor activities, pricing, and content to stay ahead of the market",
      icon: "🔍"
    },
    {
      title: "Screen job applications and schedule interviews",
      description: "Automatically review resumes, rank candidates, and coordinate interview schedules",
      icon: "👥"
    },
    {
      title: "Create social media content from my blog posts",
      description: "Transform long-form content into engaging social media posts across platforms",
      icon: "📱"
    },
    {
      title: "Analyze customer feedback and suggest improvements",
      description: "Process reviews and support tickets to identify trends and actionable insights",
      icon: "💡"
    }
  ];

  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Popular Use Cases
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how teams are using CrewBuilder to automate their most time-consuming tasks
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {useCases.map((useCase, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{useCase.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {useCase.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/build">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Building Your Crew
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
