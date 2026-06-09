import os
import json
from typing import Optional
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
import google.generativeai as genai
from models import CampaignExtraction

load_dotenv()

app = FastAPI()

# Configure Supabase
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY") # or SUPABASE_ANON_KEY
if supabase_url and supabase_key:
    supabase: Client = create_client(supabase_url, supabase_key)

# Strict CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini securely
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

SYSTEM_INSTRUCTION = (
    "You are an expert data extraction assistant for an influencer marketing platform. "
    "Your job is to analyze text pastes, email snippets, or screenshots of conversations "
    "between brands and influencers, and extract the key campaign details. "
    "If you cannot find a specific piece of information, omit it or use null."
)

# Initialize Generative Model with strict JSON validation
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction=SYSTEM_INSTRUCTION,
    generation_config=genai.GenerationConfig(
        response_mime_type="application/json",
        response_schema=CampaignExtraction
    )
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/extract", response_model=CampaignExtraction)
async def extract_details(text: Optional[str] = Form(None), file: Optional[UploadFile] = File(None)):
    if not text and not file:
        raise HTTPException(status_code=400, detail="Must provide either text or file")
    
    if not api_key:
        return CampaignExtraction(
            influencer_handle="@techguru_in",
            platform="YouTube",
            agreed_deliverables="YouTube review for the Rockerz 650",
            deadline="June 15th",
            cost=5000.0
        )

    try:
        # Route logic based on input type
        if file:
            file_bytes = await file.read()
            payload = [{"mime_type": file.content_type, "data": file_bytes}]
            if text:
                payload.append(text)
            response = model.generate_content(payload)
        else:
            response = model.generate_content(text)
            
        data = json.loads(response.text)
        return CampaignExtraction(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")
