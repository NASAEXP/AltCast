-- ==================== ALTCAST SUPABASE SCHEMA ====================
-- Run this in your Supabase SQL Editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== LEADS TABLE ====================
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    url TEXT NOT NULL DEFAULT '',
    audit_slug TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick email lookups
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
CREATE INDEX IF NOT EXISTS leads_audit_slug_idx ON leads(audit_slug);

-- ==================== AUDITS TABLE ====================
CREATE TABLE IF NOT EXISTS audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    target_url TEXT NOT NULL,
    domain TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    grade TEXT NOT NULL DEFAULT 'F',
    threat_level TEXT NOT NULL DEFAULT 'UNKNOWN',
    checks JSONB NOT NULL DEFAULT '[]',
    screenshot TEXT,
    scan_duration INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    lead_id UUID REFERENCES leads(id),
    is_public BOOLEAN DEFAULT true
);

-- Indexes for SEO lookups and leaderboard queries
CREATE INDEX IF NOT EXISTS audits_slug_idx ON audits(slug);
CREATE INDEX IF NOT EXISTS audits_domain_idx ON audits(domain);
CREATE INDEX IF NOT EXISTS audits_score_idx ON audits(score DESC);
CREATE INDEX IF NOT EXISTS audits_is_public_idx ON audits(is_public);

-- ==================== PAYMENTS TABLE (DodoPayments) ====================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dodo_payment_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    amount INTEGER NOT NULL, -- Amount in cents
    currency TEXT DEFAULT 'USD',
    product TEXT NOT NULL, -- 'bounty' or 'nightwatch'
    status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS payments_email_idx ON payments(email);
CREATE INDEX IF NOT EXISTS payments_status_idx ON payments(status);

-- ==================== ROW LEVEL SECURITY ====================
-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Public audits are readable by anyone
CREATE POLICY "Public audits are viewable by everyone" ON audits
    FOR SELECT USING (is_public = true);

-- All other operations require service role (server-side only)
-- This is enforced by using the service_role key in the server client
