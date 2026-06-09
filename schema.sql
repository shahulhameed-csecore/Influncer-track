-- schema.sql

CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE campaign_proofs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    influencer_handle TEXT,
    platform TEXT,
    agreed_deliverables TEXT,
    deadline TEXT,
    cost TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_proofs ENABLE ROW LEVEL SECURITY;

-- Note: Policies need to be added according to application auth logic.
-- Basic open read policy for demonstration purposes:
CREATE POLICY "Allow public read access" ON brands FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON campaign_proofs FOR SELECT USING (true);
