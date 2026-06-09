export type CampaignStatus = "Pending" | "Posted" | "Overdue" | "Issue";

export interface Campaign {
  id: string;
  influencer_handle: string;
  avatar_url?: string;
  platform: "Instagram" | "YouTube" | "Twitter" | "Other";
  agreed_deliverables: string;
  status: CampaignStatus;
  deadline: string;
  cost: number;
}
