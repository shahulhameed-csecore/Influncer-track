from pydantic import BaseModel
from typing import Optional

class ExtractedCampaignDetails(BaseModel):
    influencer_handle: Optional[str] = None
    platform: Optional[str] = None
    agreed_deliverables: Optional[str] = None
    deadline: Optional[str] = None
    cost: Optional[str] = None
