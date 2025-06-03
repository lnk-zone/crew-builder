from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
import os
from dotenv import load_dotenv
import uvicorn
from datetime import datetime
import sys
import traceback
from services.crewai_executor import LightweightCrewExecutor


# Add the services directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'services'))

from services.openai_service import OpenAICrewGenerator

# Load environment variables
load_dotenv()

app = FastAPI(
    title="CrewAI Service",
    description="Dynamic AI Crew Creation and Execution Service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI crew generator
crew_generator = OpenAICrewGenerator()
# Initialize CrewAI executor
crew_executor = LightweightCrewExecutor()


# Pydantic models
class CrewRequest(BaseModel):
    goal: str
    conversation: Optional[List[Dict[str, str]]] = []
    user_context: Optional[Dict[str, Any]] = {}

class CrewResponse(BaseModel):
    crew_id: str
    name: str
    description: str
    agents: List[Dict[str, Any]]
    workflow: Dict[str, Any]
    estimated_time: str
    analysis: Dict[str, Any]
    escape_hatches: Dict[str, Any]

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "OK",
        "service": "CrewAI Service",
        "version": "1.0.0",
        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),
        "timestamp": datetime.now().isoformat()
    }


# Root endpoint
@app.get("/")
async def root():
    return {"message": "Dynamic CrewAI Service Running"}

# Generate crew from goal using OpenAI
@app.post("/generate-crew", response_model=CrewResponse)
async def generate_crew(request: CrewRequest):
    try:
        print(f"🎯 Generating crew for goal: {request.goal}")
        
        # Use OpenAI to analyze goal and generate custom crew
        crew_data = crew_generator.analyze_goal_and_generate_crew(
            goal=request.goal,
            conversation=request.conversation
        )
        
        print(f"✅ Generated crew with {len(crew_data['crew_composition'])} agents")
        
        # Transform the OpenAI response to match our API format
        response_data = {
            "crew_id": crew_data["meta"]["crew_id"],
            "name": generate_crew_name(request.goal, crew_data["crew_composition"]),
            "description": f"Elite team of world-renowned experts assembled to: {request.goal}",
            "agents": transform_agents_format(crew_data["crew_composition"]),
            "workflow": {
                "type": crew_data["crew_analysis"]["workflow_type"],
                "steps": [step["step_name"] for step in crew_data["workflow_plan"]["execution_steps"]],
                "execution_plan": crew_data["workflow_plan"]["execution_steps"],
                "quality_checkpoints": crew_data["workflow_plan"]["quality_checkpoints"],
                "success_metrics": crew_data["workflow_plan"]["success_metrics"]
            },
            "estimated_time": crew_data["crew_analysis"]["estimated_time"],
            "analysis": {
                "complexity": crew_data["crew_analysis"]["goal_complexity"],
                "success_probability": crew_data["crew_analysis"]["success_probability"],
                "human_oversight_needed": crew_data["crew_analysis"]["human_oversight_needed"],
                "risk_factors": crew_data["crew_analysis"]["risk_factors"]
            },
            "escape_hatches": crew_data["escape_hatches"]
        }
        
        return CrewResponse(**response_data)
        
    except Exception as e:
        print(f"❌ Error generating crew: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Failed to generate crew: {str(e)}")

def generate_crew_name(goal: str, agents: List[Dict]) -> str:
    """Generate a descriptive crew name based on goal and agents"""
    goal_lower = goal.lower()
    
    if "content" in goal_lower or "marketing" in goal_lower:
        return "Content & Marketing Excellence Crew"
    elif "sales" in goal_lower or "lead" in goal_lower:
        return "Sales Acceleration Crew"
    elif "customer" in goal_lower or "support" in goal_lower:
        return "Customer Success Crew"
    elif "data" in goal_lower or "analytics" in goal_lower:
        return "Data Intelligence Crew"
    elif "automat" in goal_lower or "process" in goal_lower:
        return "Process Automation Crew"
    elif "research" in goal_lower or "market" in goal_lower:
        return "Market Intelligence Crew"
    else:
        return f"Business Optimization Crew ({len(agents)} Experts)"

def transform_agents_format(openai_agents: List[Dict]) -> List[Dict]:
    """Transform OpenAI agent format to our API format"""
    transformed_agents = []
    
    for agent in openai_agents:
        transformed_agent = {
            "id": agent["agent_id"],
            "name": agent["name"],
            "title": agent["title"],
            "role": agent["role_in_goal"],
            "background": agent["background"],
            "expertise": agent["expertise"],
            "achievements": agent["achievements"],
            "years_experience": agent["years_experience"],
            "specific_tasks": agent["specific_tasks"],
            "tools": agent["tools_needed"],
            "confidence_level": agent["confidence_level"],
            "escalation_criteria": agent["when_to_escalate"],
            "status": "ready"
        }
        transformed_agents.append(transformed_agent)
    
    return transformed_agents

# Test endpoint for debugging
@app.post("/test-crew")
async def test_crew_generation():
    """Test endpoint to verify crew generation works"""
    test_goal = "Improve email marketing conversion rates for my SaaS startup"
    
    try:
        crew_data = crew_generator.analyze_goal_and_generate_crew(test_goal)
        return {
            "status": "success",
            "test_goal": test_goal,
            "generated_agents": len(crew_data["crew_composition"]),
            "crew_data": crew_data
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "test_goal": test_goal
        }

# Execute crew endpoint - REAL CrewAI execution
@app.post("/execute-crew")
async def execute_crew(request: CrewRequest):
    """Generate crew with OpenAI and execute with CrewAI for real business results"""
    try:
        print(f"🎯 Full crew execution for goal: {request.goal}")
        
        # Step 1: Generate crew specification with OpenAI
        crew_spec = crew_generator.analyze_goal_and_generate_crew(
            goal=request.goal,
            conversation=request.conversation
        )
        
        print(f"✅ Generated crew specification with {len(crew_spec['crew_composition'])} agents")
        
        # Step 2: Execute the crew with CrewAI
        execution_results = crew_executor.execute_crew(crew_spec)
        
        print(f"✅ Crew execution completed: {execution_results['status']}")
        
        # Step 3: Return comprehensive results
        return {
            "status": "success",
            "crew_specification": {
                "crew_id": crew_spec["meta"]["crew_id"],
                "name": generate_crew_name(request.goal, crew_spec["crew_composition"]),
                "description": f"Elite team executed for: {request.goal}",
                "agents": transform_agents_format(crew_spec["crew_composition"]),
                "estimated_time": crew_spec["crew_analysis"]["estimated_time"]
            },
            "execution_results": execution_results,
            "business_impact": {
                "goal_achieved": execution_results["status"] == "completed",
                "deliverables_count": execution_results.get("tasks_completed", 0),
                "execution_time": f"{execution_results.get('execution_time_seconds', 0):.1f} seconds",
                "confidence_level": execution_results.get("quality_metrics", {}).get("confidence_level", "medium")
            },
            "next_actions": {
                "recommendations": execution_results.get("deliverables", {}).get("business_recommendations", []),
                "next_steps": execution_results.get("deliverables", {}).get("next_steps", []),
                "implementation_guide": execution_results.get("deliverables", {}).get("implementation_guide", "")
            }
        }
        
    except Exception as e:
        print(f"❌ Full crew execution failed: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Crew execution failed: {str(e)}")



if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

