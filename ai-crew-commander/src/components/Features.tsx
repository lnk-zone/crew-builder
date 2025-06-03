
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const Features = () => {
  const features = [
    {
      icon: '💬',
      title: 'Conversational Setup',
      description: 'Just describe what you want in plain English',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '🤖',
      title: 'Smart AI Agents',
      description: 'Researcher, Writer, Analyst, and much more work together',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '📊',
      title: 'Business Results',
      description: 'Track ROI and time saved automatically',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '🎯',
      title: 'No Code Required',
      description: 'From idea to automation in minutes',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose CrewBuilder?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The easiest way to automate your business processes with AI. 
            No technical expertise needed.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
            >
              <CardContent className="p-8 text-center">
                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                  {feature.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
