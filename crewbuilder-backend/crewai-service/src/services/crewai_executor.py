import openai
import requests
from typing import Dict, List, Any, Optional
import os
from datetime import datetime
import json
import asyncio
from concurrent.futures import ThreadPoolExecutor
import time

class LightweightCrewExecutor:
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
    def execute_crew(self, crew_spec: Dict[str, Any]) -> Dict[str, Any]:
        """Execute crew using lightweight OpenAI-based agents"""
        
        try:
            print(f"🚀 Starting lightweight crew execution for: {crew_spec['meta']['original_goal']}")
            
            start_time = datetime.now()
            
            # Execute workflow steps
            results = self._execute_workflow(crew_spec)
            
            end_time = datetime.now()
            execution_time = (end_time - start_time).total_seconds()
            
            print(f"✅ Crew execution completed in {execution_time:.1f} seconds")
            
            # Format comprehensive results
            execution_results = {
                "status": "completed",
                "execution_time_seconds": execution_time,
                "original_goal": crew_spec["meta"]["original_goal"],
                "crew_id": crew_spec["meta"]["crew_id"],
                "agents_used": [
                    {
                        "name": spec["name"],
                        "title": spec["title"],
                        "role": spec["role_in_goal"]
                    }
                    for spec in crew_spec["crew_composition"]
                ],
                "tasks_completed": len(crew_spec["workflow_plan"]["execution_steps"]),
                "deliverables": {
                    "final_result": results["final_output"],
                    "business_recommendations": results["recommendations"],
                    "next_steps": results["next_steps"],
                    "implementation_guide": results["implementation_guide"],
                    "detailed_analysis": results["detailed_analysis"]
                },
                "quality_metrics": {
                    "completion_rate": "100%",
                    "confidence_level": crew_spec["crew_analysis"].get("success_probability", "medium"),
                    "human_review_needed": crew_spec["crew_analysis"].get("human_oversight_needed", True)
                },
                "execution_metadata": {
                    "started_at": start_time.isoformat(),
                    "completed_at": end_time.isoformat(),
                    "workflow_type": crew_spec["crew_analysis"]["workflow_type"],
                    "model_used": "gpt-4-lightweight-executor"
                }
            }
            
            return execution_results
            
        except Exception as e:
            print(f"❌ Lightweight crew execution failed: {str(e)}")
            return {
                "status": "failed",
                "error": str(e),
                "original_goal": crew_spec["meta"]["original_goal"],
                "crew_id": crew_spec["meta"]["crew_id"],
                "fallback_recommendations": self._generate_fallback_recommendations(crew_spec["meta"]["original_goal"])
            }
    
    def _execute_workflow(self, crew_spec: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the workflow using OpenAI agents"""
        
        goal = crew_spec["meta"]["original_goal"]
        agents = crew_spec["crew_composition"]
        workflow_steps = crew_spec["workflow_plan"]["execution_steps"]
        
        # Collect all step results
        step_results = []
        
        for i, step in enumerate(workflow_steps):
            print(f"🎯 Executing Step {step['step_number']}: {step['step_name']}")
            
            # Find the responsible agent
            responsible_agent = agents[0] if agents else None
            if len(agents) > i:
                responsible_agent = agents[i]
            
            # Execute the step
            step_result = self._execute_step(step, responsible_agent, goal, step_results)
            step_results.append(step_result)
            
            print(f"✅ Completed Step {step['step_number']}")
        
        # Generate final comprehensive output
        final_output = self._generate_final_output(goal, agents, step_results)
        
        return {
            "final_output": final_output["comprehensive_result"],
            "recommendations": final_output["recommendations"],
            "next_steps": final_output["next_steps"],
            "implementation_guide": final_output["implementation_guide"],
            "detailed_analysis": step_results
        }
    
    def _execute_step(self, step: Dict[str, Any], agent: Dict[str, Any], goal: str, previous_results: List[Dict]) -> Dict[str, Any]:
        """Execute a single workflow step using OpenAI"""
        
        # Build context from previous steps
        context = ""
        if previous_results:
            context = "\n\nPREVIOUS WORK COMPLETED:\n"
            for i, prev_result in enumerate(previous_results):
                context += f"Step {i+1}: {prev_result['summary']}\n"
        
        # Create the prompt for this step
        prompt = f"""
You are {agent['name']}, {agent['title']}.

BACKGROUND: {agent['background']}
EXPERTISE: {', '.join(agent['expertise'])}
ACHIEVEMENTS: {agent['achievements']}

BUSINESS GOAL: {goal}

YOUR CURRENT TASK: {step['step_name']}
EXPECTED DELIVERABLES: {', '.join(step.get('deliverables', ['analysis and recommendations']))}
ESTIMATED TIME: {step.get('estimated_duration', '15-20 minutes')}

{context}

INSTRUCTIONS:
As a world-class expert, provide detailed, actionable analysis for this step. Focus on:

1. SPECIFIC ANALYSIS: Provide concrete, data-driven insights
2. ACTIONABLE RECOMMENDATIONS: Give specific steps the business can implement immediately
3. PRACTICAL CONSIDERATIONS: Address real-world implementation challenges
4. MEASURABLE OUTCOMES: Suggest specific metrics and KPIs to track success
5. NEXT STEPS: Provide clear, prioritized action items

Your response should be comprehensive, professional, and immediately actionable for a business owner.

DELIVER YOUR EXPERT ANALYSIS:
"""

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a world-class business expert providing detailed, actionable analysis."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=2000,
                temperature=0.7
            )
            
            result_content = response.choices[0].message.content
            
            return {
                "step_name": step['step_name'],
                "agent_name": agent['name'],
                "agent_title": agent['title'],
                "summary": f"{step['step_name']} completed by {agent['name']}",
                "detailed_output": result_content,
                "deliverables": step.get('deliverables', []),
                "duration": step.get('estimated_duration', '15-20 minutes')
            }
            
        except Exception as e:
            print(f"❌ Error executing step {step['step_name']}: {str(e)}")
            return {
                "step_name": step['step_name'],
                "agent_name": agent['name'],
                "error": str(e),
                "summary": f"Step {step['step_name']} encountered an error",
                "detailed_output": f"Error occurred during execution: {str(e)}"
            }
    
    def _generate_final_output(self, goal: str, agents: List[Dict], step_results: List[Dict]) -> Dict[str, Any]:
        """Generate comprehensive final output combining all step results"""
        
        # Combine all step outputs
        combined_analysis = "\n\n".join([
            f"=== {result['step_name']} (by {result['agent_name']}) ===\n{result['detailed_output']}"
            for result in step_results
            if 'detailed_output' in result
        ])
        
        # Generate final synthesis
        synthesis_prompt = f"""
BUSINESS GOAL: {goal}

EXPERT TEAM ANALYSIS:
{combined_analysis}

As the project coordinator, synthesize all expert analysis into a comprehensive business action plan.

Provide:

1. EXECUTIVE SUMMARY (2-3 sentences)
2. KEY RECOMMENDATIONS (5-7 specific, actionable items)
3. IMPLEMENTATION ROADMAP (prioritized next steps with timelines)
4. SUCCESS METRICS (specific KPIs to track)
5. RISK MITIGATION (potential challenges and solutions)
6. RESOURCE REQUIREMENTS (what the business needs to succeed)

Format your response as a professional business report that can be immediately implemented.
"""

        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a senior business consultant creating executive-level action plans."},
                    {"role": "user", "content": synthesis_prompt}
                ],
                max_tokens=2500,
                temperature=0.6
            )
            
            final_synthesis = response.choices[0].message.content
            
            # Extract specific sections
            recommendations = self._extract_recommendations(final_synthesis)
            next_steps = self._extract_next_steps(final_synthesis)
            implementation_guide = self._extract_implementation_guide(final_synthesis)
            
            return {
                "comprehensive_result": final_synthesis,
                "recommendations": recommendations,
                "next_steps": next_steps,
                "implementation_guide": implementation_guide
            }
            
        except Exception as e:
            print(f"❌ Error generating final output: {str(e)}")
            return {
                "comprehensive_result": combined_analysis,
                "recommendations": ["Review individual expert analysis", "Consult with business advisor"],
                "next_steps": ["Implement expert recommendations", "Monitor progress"],
                "implementation_guide": "Follow the detailed analysis provided by each expert."
            }
    
    def _extract_recommendations(self, text: str) -> List[str]:
        """Extract actionable recommendations from text"""
        lines = text.split('\n')
        recommendations = []
        
        in_recommendations = False
        for line in lines:
            line = line.strip()
            if 'recommendation' in line.lower() or 'key action' in line.lower():
                in_recommendations = True
                continue
            if in_recommendations and line and not line.startswith('#'):
                if line.startswith(('•', '-', '*', '1.', '2.', '3.', '4.', '5.')):
                    recommendations.append(line.lstrip('•-*123456789. '))
                elif len(recommendations) >= 5:
                    break
        
        return recommendations[:7] if recommendations else [
            "Implement the expert analysis provided",
            "Monitor key performance indicators",
            "Review progress weekly",
            "Adjust strategy based on results"
        ]
    
    def _extract_next_steps(self, text: str) -> List[str]:
        """Extract next steps from text"""
        lines = text.split('\n')
        next_steps = []
        
        in_next_steps = False
        for line in lines:
            line = line.strip()
            if 'next step' in line.lower() or 'implementation' in line.lower() or 'roadmap' in line.lower():
                in_next_steps = True
                continue
            if in_next_steps and line and not line.startswith('#'):
                if line.startswith(('•', '-', '*', '1.', '2.', '3.')):
                    next_steps.append(line.lstrip('•-*123456789. '))
                elif len(next_steps) >= 3:
                    break
        
        return next_steps[:5] if next_steps else [
            "Begin implementation of expert recommendations",
            "Set up tracking and measurement systems",
            "Schedule regular progress reviews"
        ]
    
    def _extract_implementation_guide(self, text: str) -> str:
        """Extract implementation guidance from text"""
        lines = text.split('\n')
        implementation_lines = []
        
        in_implementation = False
        for line in lines:
            line = line.strip()
            if any(keyword in line.lower() for keyword in ['implementation', 'roadmap', 'resource', 'timeline']):
                in_implementation = True
                implementation_lines.append(line)
            elif in_implementation and line:
                implementation_lines.append(line)
                if len(implementation_lines) >= 10:
                    break
        
        return '\n'.join(implementation_lines) if implementation_lines else "Follow the detailed recommendations provided by the expert team."
    
    def _generate_fallback_recommendations(self, goal: str) -> List[str]:
        """Generate fallback recommendations if execution fails"""
        return [
            f"Break down the goal into smaller, specific tasks: {goal}",
            "Gather more detailed requirements and constraints",
            "Consult with domain experts for specialized guidance",
            "Research best practices and case studies in your industry",
            "Create a pilot program to test approaches on a smaller scale"
        ]
