from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
import os
from dotenv import load_dotenv
import uvicorn

# Load environment variables
load_dotenv()

app = FastAPI(
    title="CrewAI Service",
    description="AI Crew Creation and Execution Service",
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

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "OK",
        "service": "CrewAI Service",
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/")
async def root():
    return {"message": "CrewAI Service Running"}

# Generate crew from goal
@app.post("/generate-crew", response_model=CrewResponse)
async def generate_crew(request: CrewRequest):
    try:
        # TODO: Implement actual crew generation logic
        # For now, return a mock response
        mock_response = {
            "crew_id": "crew_123",
            "name": "Content Creation Crew",
            "description": f"AI crew designed to: {request.goal}",
            "agents": [
                {
                    "id": "agent_1",
                    "name": "Content Strategist",
                    "role": "Analyzes requirements and creates strategy",
                    "status": "active"
                },
                {
                    "id": "agent_2", 
                    "name": "Creative Writer",
                    "role": "Creates engaging content based on strategy",
                    "status": "active"
                }
            ],
            "workflow": {
                "type": "sequential",
                "steps": ["analyze", "create", "optimize"]
            },
            "estimated_time": "5-10 minutes"
        }
        
        return CrewResponse(**mock_response)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
