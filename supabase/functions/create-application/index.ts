import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://gkvkixthomqczaoztgyq.supabase.co";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!SERVICE_ROLE_KEY) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is not set");
}

const supabase = SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
  : null;

interface CreateApplicationRequest {
  partner_id: string;
  partner_name: string;
  name: string;
  email: string;
  phone: string;
  monthly_turnover: number;
  estimated_monthly_cost?: number | null;
  estimated_annual_savings?: number | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    if (!supabase) {
      throw new Error("Supabase client not initialized");
    }

    const body: CreateApplicationRequest = await req.json();

    const { partner_id, partner_name, name, email, phone, monthly_turnover, estimated_monthly_cost, estimated_annual_savings } = body;

    if (!partner_id || !partner_name || !name || !email || !phone || !monthly_turnover) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase
      .from("applications")
      .insert({
        partner_id,
        partner_name,
        name,
        email,
        phone,
        monthly_turnover,
        estimated_monthly_cost,
        estimated_annual_savings,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error inserting application:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ id: data.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Error in create-application function:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
