-- Create providers table to store all payment processing partners
CREATE TABLE public.providers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  machine_models TEXT[] NOT NULL,
  contract_length TEXT NOT NULL,
  settlement_time TEXT NOT NULL,
  auto_renewal BOOLEAN NOT NULL DEFAULT false,
  early_termination_fee TEXT,
  fees JSONB NOT NULL,
  turnover_tiers JSONB,
  features TEXT[] NOT NULL DEFAULT '{}',
  device_info JSONB,
  documents_required TEXT[],
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create provider_offers table for timely events/promotions
CREATE TABLE public.provider_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id TEXT NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  badge_text TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  min_turnover NUMERIC,
  max_turnover NUMERIC,
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create priority_rules table for turnover-based provider ranking
CREATE TABLE public.priority_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  min_turnover NUMERIC NOT NULL,
  max_turnover NUMERIC NOT NULL,
  provider_id TEXT NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  priority_score INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(provider_id, min_turnover, max_turnover)
);

-- Enable Row Level Security
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.priority_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Allow public read access to active providers"
  ON public.providers
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow public read access to active offers"
  ON public.provider_offers
  FOR SELECT
  USING (is_active = true AND start_date <= now() AND end_date >= now());

CREATE POLICY "Allow public read access to active priority rules"
  ON public.priority_rules
  FOR SELECT
  USING (is_active = true);

-- Create triggers for updated_at
CREATE TRIGGER update_providers_updated_at
  BEFORE UPDATE ON public.providers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_provider_offers_updated_at
  BEFORE UPDATE ON public.provider_offers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_priority_rules_updated_at
  BEFORE UPDATE ON public.priority_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_providers_active ON public.providers(is_active, display_order);
CREATE INDEX idx_provider_offers_dates ON public.provider_offers(provider_id, start_date, end_date) WHERE is_active = true;
CREATE INDEX idx_priority_rules_turnover ON public.priority_rules(min_turnover, max_turnover) WHERE is_active = true;