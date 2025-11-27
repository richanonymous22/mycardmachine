import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Partner } from "@/types/merchant";

interface ProviderRow {
  id: string;
  name: string;
  machine_models: string[];
  contract_length: string;
  settlement_time: string;
  auto_renewal: boolean;
  early_termination_fee: string | null;
  fees: any;
  turnover_tiers: any;
  features: string[];
  device_info: any;
  documents_required: any;
  logo_url: string | null;
  is_active: boolean;
  display_order: number;
}

interface ProviderOffer {
  id: string;
  provider_id: string;
  title: string;
  description: string;
  badge_text: string;
  start_date: string;
  end_date: string;
  min_turnover: number | null;
  max_turnover: number | null;
  priority: number;
}

interface PriorityRule {
  id: string;
  min_turnover: number;
  max_turnover: number;
  provider_id: string;
  priority_score: number;
}

const convertProviderToPartner = (provider: ProviderRow): Partner => {
  return {
    id: provider.id,
    name: provider.name,
    machine_models: provider.machine_models,
    contract_length: provider.contract_length,
    settlement_time: provider.settlement_time,
    auto_renewal: provider.auto_renewal,
    early_termination_fee: provider.early_termination_fee,
    fees: provider.fees,
    turnover_tiers: provider.turnover_tiers,
    features: provider.features,
    device_info: provider.device_info,
    documents_required: provider.documents_required,
  };
};

export const useProviders = () => {
  return useQuery({
    queryKey: ["providers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("providers")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      
      return (data as ProviderRow[]).map(convertProviderToPartner);
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useProviderOffers = (turnover?: number) => {
  return useQuery({
    queryKey: ["provider-offers", turnover],
    queryFn: async () => {
      let query = supabase
        .from("provider_offers")
        .select("*")
        .eq("is_active", true)
        .lte("start_date", new Date().toISOString())
        .gte("end_date", new Date().toISOString())
        .order("priority", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      // Filter by turnover on the client side if provided
      if (turnover) {
        return (data as ProviderOffer[]).filter(offer => {
          const meetsMin = offer.min_turnover === null || turnover >= offer.min_turnover;
          const meetsMax = offer.max_turnover === null || turnover <= offer.max_turnover;
          return meetsMin && meetsMax;
        });
      }

      return data as ProviderOffer[];
    },
    enabled: turnover !== undefined,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes (offers might change)
  });
};

export const usePriorityRules = (turnover: number) => {
  return useQuery({
    queryKey: ["priority-rules", turnover],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("priority_rules")
        .select("*")
        .eq("is_active", true)
        .lte("min_turnover", turnover)
        .gte("max_turnover", turnover)
        .order("priority_score", { ascending: false });

      if (error) throw error;
      
      return data as PriorityRule[];
    },
    staleTime: 5 * 60 * 1000,
  });
};
