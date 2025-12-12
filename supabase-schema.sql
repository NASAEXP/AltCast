-- AltCast Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Leads table (email captures)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    url TEXT NOT NULL,
    audit_slug TEXT,
    source TEXT DEFAULT 'web',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick email lookups
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);

-- Audits table (security audit results)
CREATE TABLE IF NOT EXISTS audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    target_url TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('clean', 'vulnerable', 'error')),
    checks JSONB NOT NULL DEFAULT '[]',
    score_percentage INTEGER NOT NULL DEFAULT 0,
    threat_level TEXT NOT NULL DEFAULT 'LOW',
    scan_duration INTEGER NOT NULL DEFAULT 0,
    screenshot TEXT,
    lead_id UUID REFERENCES leads(id),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for SEO and lookups
CREATE INDEX IF NOT EXISTS audits_slug_idx ON audits(slug);
CREATE INDEX IF NOT EXISTS audits_target_url_idx ON audits(target_url);
CREATE INDEX IF NOT EXISTS audits_created_at_idx ON audits(created_at DESC);
CREATE INDEX IF NOT EXISTS audits_is_public_idx ON audits(is_public) WHERE is_public = true;

-- Payments table (DodoPayments transactions)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dodo_payment_id TEXT UNIQUE NOT NULL,
    lead_id UUID REFERENCES leads(id),
    product TEXT NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS payments_lead_id_idx ON payments(lead_id);
CREATE INDEX IF NOT EXISTS payments_status_idx ON payments(status);

-- Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Public read access for audits (SEO)
CREATE POLICY "Public audits are viewable by everyone"
    ON audits FOR SELECT
    USING (is_public = true);

-- Service role can do everything (for server-side operations)
CREATE POLICY "Service role full access to leads"
    ON leads FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to audits"
    ON audits FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to payments"
    ON payments FOR ALL
    USING (auth.role() = 'service_role');
