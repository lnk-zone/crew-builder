import openai
import json
import os
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv

load_dotenv()

class OpenAICrewGenerator:
    def __init__(self):
        self.client = openai.OpenAI(
            api_key=os.getenv("OPENAI_API_KEY")
        )
        
    def analyze_goal_and_generate_crew(self, goal: str, conversation: List[Dict] = None) -> Dict[str, Any]:
        """
        Use OpenAI to analyze the user's goal and dynamically generate a custom expert crew
        """
        
        # Build context from conversation if provided
        conversation_context = ""
        if conversation:
            conversation_context = "\n".join([
                f"{msg.get('role', 'user')}: {msg.get('content', '')}" 
                for msg in conversation[-5:]  # Last 5 messages for context
            ])
        
        # Create the metaprompt for crew generation
        system_prompt = """You are an expert AI crew architect who designs world-class teams of specialists to automate business processes.

Your job is to analyze a user's business automation goal and create a custom team of 2-4 world-renowned experts who can accomplish that goal.

For each expert, you must create:
1. A detailed persona with real-world credibility (name, title, background)
2. Specific expertise areas relevant to the goal
3. Notable achievements and years of experience
4. A clear role in accomplishing the user's goal
5. Appropriate tools they would use

IMPORTANT GUIDELINES:
- Each expert should be a world-renowned leader in their field with 15+ years experience
- Include specific achievements, companies worked for, methodologies created
- Make them feel like real people you'd want to hire for this exact task
- Focus on business outcomes, not just technical capabilities
- Include "escape hatches" - when the AI should recommend human expertise instead

Return your response as a JSON object with this exact structure:
{
  "crew_analysis": {
    "goal_complexity": "simple|moderate|complex",
    "estimated_time": "X-Y minutes",
    "workflow_type": "sequential|parallel",
    "success_probability": "high|medium|low",
    "human_oversight_needed": true/false,
    "risk_factors": ["list", "of", "potential", "risks"]
  },
  "crew_composition": [
    {
      "agent_id": "unique_id",
      "name": "Dr. Sarah Chen",
      "title": "Chief Marketing Strategist",
      "background": "Former VP at HubSpot, 18 years experience, pioneered the AIDA-X framework...",
      "expertise": ["marketing strategy", "conversion optimization", "audience psychology"],
      "achievements": "Increased client conversion rates by 340% on average, authored 'Digital Persuasion'...",
      "years_experience": 18,
      "role_in_goal": "Analyze target audience and create comprehensive marketing strategy",
      "specific_tasks": ["audience research", "strategy development", "campaign planning"],
      "tools_needed": ["web_scraper", "analytics_tool", "content_planner"],
      "confidence_level": "high|medium|low",
      "when_to_escalate": "If budget exceeds $50K or requires legal compliance review"
    }
  ],
  "workflow_plan": {
    "execution_steps": [
      {
        "step_number": 1,
        "step_name": "Research and Analysis",
        "responsible_agents": ["agent_1"],
        "estimated_duration": "5-8 minutes",
        "deliverables": ["market analysis report", "competitor overview"]
      }
    ],
    "quality_checkpoints": ["checkpoint 1", "checkpoint 2"],
    "success_metrics": ["metric 1", "metric 2"]
  },
  "escape_hatches": {
    "recommend_human_expert": true/false,
    "reason": "This requires legal expertise beyond AI capabilities",
    "suggested_next_steps": ["consult with attorney", "get compliance review"],
    "confidence_threshold": "If confidence drops below 70% at any step"
  }
}"""

        user_prompt = f"""
BUSINESS AUTOMATION GOAL: {goal}

CONVERSATION CONTEXT (if any):
{conversation_context}

Please analyze this goal and create a custom team of world-renowned experts who can automate this business process. Focus on:

1. What specific expertise is needed to accomplish this goal?
2. What are the key steps and potential challenges?
3. Which world-class experts would you assemble for this exact task?
4. What tools and processes would they use?
5. When should we recommend human oversight instead of full automation?

Remember: These should feel like real experts you'd hire from top consulting firms, with specific backgrounds and proven track records relevant to this exact goal.
"""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            # Parse the JSON response
            crew_data = json.loads(response.choices[0].message.content)
            
            # Add metadata
            crew_data["meta"] = {
                "original_goal": goal,
                "generated_at": "2024-01-01T00:00:00Z",  # Will be replaced with actual timestamp
                "model_used": "gpt-4",
                "crew_id": f"crew_{hash(goal + str(len(crew_data['crew_composition'])))}"
            }
            
            return crew_data
            
        except json.JSONDecodeError as e:
            # Fallback if JSON parsing fails
            return self._create_fallback_crew(goal)
        except Exception as e:
            print(f"OpenAI API Error: {str(e)}")
            return self._create_fallback_crew(goal)
    
    def _create_fallback_crew(self, goal: str) -> Dict[str, Any]:
        """Fallback crew if OpenAI fails"""
        return {
            "crew_analysis": {
                "goal_complexity": "moderate",
                "estimated_time": "10-15 minutes",
                "workflow_type": "sequential",
                "success_probability": "medium",
                "human_oversight_needed": True,
                "risk_factors": ["API unavailable", "requires manual review"]
            },
            "crew_composition": [
                {
                    "agent_id": "fallback_agent_1",
                    "name": "Dr. Alex Morgan",
                    "title": "Business Process Consultant",
                    "background": "20+ years in business automation and process optimization",
                    "expertise": ["process analysis", "automation design", "business optimization"],
                    "achievements": "Helped 500+ companies automate critical business processes",
                    "years_experience": 20,
                    "role_in_goal": f"Analyze and automate: {goal}",
                    "specific_tasks": ["process mapping", "automation design", "implementation planning"],
                    "tools_needed": ["process_analyzer", "automation_builder"],
                    "confidence_level": "medium",
                    "when_to_escalate": "If process involves sensitive data or compliance requirements"
                }
            ],
            "workflow_plan": {
                "execution_steps": [
                    {
                        "step_number": 1,
                        "step_name": "Process Analysis",
                        "responsible_agents": ["fallback_agent_1"],
                        "estimated_duration": "10-15 minutes",
                        "deliverables": ["process analysis", "automation recommendations"]
                    }
                ],
                "quality_checkpoints": ["initial analysis review"],
                "success_metrics": ["process efficiency improvement"]
            },
            "escape_hatches": {
                "recommend_human_expert": True,
                "reason": "OpenAI service temporarily unavailable",
                "suggested_next_steps": ["retry request", "consult human expert"],
                "confidence_threshold": "Manual review recommended"
            },
            "meta": {
                "original_goal": goal,
                "generated_at": "2024-01-01T00:00:00Z",
                "model_used": "fallback",
                "crew_id": f"fallback_crew_{hash(goal)}"
            }
        }

    def validate_crew_quality(self, crew_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Use OpenAI to validate and improve the generated crew
        """
        validation_prompt = f"""
Review this AI-generated crew and provide quality assessment:

CREW DATA: {json.dumps(crew_data, indent=2)}

Evaluate:
1. Are the expert personas realistic and credible?
2. Do their skills match the goal requirements?
3. Is the workflow logical and efficient?
4. Are there any gaps or redundancies?
5. Are the escape hatches appropriate?

Provide a quality score (1-10) and specific improvement suggestions.
"""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a quality assurance expert for AI-generated business teams."},
                    {"role": "user", "content": validation_prompt}
                ],
                temperature=0.3,
                max_tokens=500
            )
            
            return {
                "quality_score": 8,  # Default score
                "validation_notes": response.choices[0].message.content,
                "validated_at": "2024-01-01T00:00:00Z"
            }
            
        except Exception as e:
            return {
                "quality_score": 7,
                "validation_notes": "Validation service temporarily unavailable",
                "validated_at": "2024-01-01T00:00:00Z"
            }

