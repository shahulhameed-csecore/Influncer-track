from pydantic import BaseModel
from typing import Optional

class CampaignExtraction(BaseModel):
    influencer_handle: Optional[str]
    platform: Optional[str]
    agreed_deliverables: Optional[str]
    deadline: Optional[str]
    cost: Optional[float]
