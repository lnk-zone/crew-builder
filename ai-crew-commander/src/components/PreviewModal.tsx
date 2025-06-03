
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, CheckCircle, Clock, FileText, ArrowRight } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  crew: any[];
}

interface ActivityItem {
  id: string;
  agent: string;
  action: string;
  status: 'running' | 'completed' | 'pending';
  output?: string;
}

const PreviewModal = ({ isOpen, onClose, crew }: PreviewModalProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const simulateExecution = () => {
    setIsRunning(true);
    setActivities([]);
    
    const simulatedActivities = [
      { id: '1', agent: crew[0]?.name || 'Agent 1', action: 'Starting research phase...', status: 'running' as const },
      { id: '2', agent: crew[1]?.name || 'Agent 2', action: 'Waiting for research data...', status: 'pending' as const },
      { id: '3', agent: crew[2]?.name || 'Agent 3', action: 'Ready to compile results...', status: 'pending' as const }
    ];

    setActivities(simulatedActivities);

    // Simulate agent progression
    setTimeout(() => {
      setActivities(prev => prev.map(item => 
        item.id === '1' ? { ...item, status: 'completed', output: 'Found 15 competitor updates' } : item
      ));
    }, 2000);

    setTimeout(() => {
      setActivities(prev => prev.map(item => 
        item.id === '2' ? { ...item, status: 'running', action: 'Analyzing competitor data...' } : item
      ));
    }, 2500);

    setTimeout(() => {
      setActivities(prev => prev.map(item => 
        item.id === '2' ? { ...item, status: 'completed', output: 'Identified 3 key trends' } : item
      ));
    }, 4500);

    setTimeout(() => {
      setActivities(prev => prev.map(item => 
        item.id === '3' ? { ...item, status: 'running', action: 'Creating weekly report...' } : item
      ));
    }, 5000);

    setTimeout(() => {
      setActivities(prev => prev.map(item => 
        item.id === '3' ? { ...item, status: 'completed', output: 'Weekly report generated successfully' } : item
      ));
      setIsRunning(false);
    }, 7000);
  };

  useEffect(() => {
    if (isOpen) {
      simulateExecution();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-600" />
            Crew Preview - Execution Simulation
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Feed */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Agent Activity Feed</h3>
            <div className="space-y-3">
              {activities.map((activity) => (
                <Card key={activity.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-600' :
                      activity.status === 'running' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {activity.status === 'completed' ? <CheckCircle className="h-4 w-4" /> :
                       activity.status === 'running' ? <Clock className="h-4 w-4 animate-spin" /> :
                       <Clock className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{activity.agent}</h4>
                        <Badge 
                          variant={activity.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{activity.action}</p>
                      {activity.output && (
                        <p className="text-xs text-green-600 font-medium">{activity.output}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sample Outputs */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sample Outputs</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4" />
                    Weekly Competitor Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p><strong>Key Findings:</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Competitor A launched new pricing strategy</li>
                      <li>Competitor B expanded to 3 new markets</li>
                      <li>Industry trend toward AI integration</li>
                    </ul>
                    <p className="text-xs text-blue-600 mt-2">📊 Full report: 2,450 words</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4" />
                    Data Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Sources Monitored</p>
                      <p className="text-2xl font-bold text-blue-600">47</p>
                    </div>
                    <div>
                      <p className="font-medium">Updates Found</p>
                      <p className="text-2xl font-bold text-green-600">15</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Adjust Crew
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={simulateExecution} disabled={isRunning}>
              Run Preview Again
            </Button>
            <Button>
              Deploy Crew
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
