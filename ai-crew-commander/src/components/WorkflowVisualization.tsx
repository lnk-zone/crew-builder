
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, Bot } from 'lucide-react';

interface CrewMember {
  id: string;
  name: string;
  role: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
}

interface WorkflowVisualizationProps {
  crew: CrewMember[];
}

const WorkflowVisualization = ({ crew }: WorkflowVisualizationProps) => {
  if (crew.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-5 w-5" />
          Workflow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {crew.map((member, index) => (
          <div key={member.id}>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                member.status === 'active' ? 'bg-blue-100 text-blue-600' :
                member.status === 'completed' ? 'bg-green-100 text-green-600' :
                'bg-gray-100 text-gray-400'
              }`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{member.name}</h4>
                <p className="text-xs text-gray-600">{member.role}</p>
              </div>
            </div>
            {index < crew.length - 1 && (
              <div className="flex justify-center py-2">
                <ArrowDown className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
        ))}
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">📤</span>
            </div>
            <span className="text-sm font-medium text-blue-700">Final Output</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">Completed results delivered to you</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowVisualization;
