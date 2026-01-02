-- Update SumUp
UPDATE public.providers SET
  machine_models = ARRAY['SumUp Air', 'SumUp Solo'],
  contract_length = 'No contract',
  settlement_time = 'Next working day (Instant payouts available)',
  auto_renewal = false,
  early_termination_fee = null,
  fees = '{
    "transaction_fee": 0.0175,
    "monthly_rental": 0,
    "setup_fee": 81,
    "pci_fee": 0,
    "non_compliance_fee": 0,
    "sim_fee": 0,
    "international_card_fee": 0.0199,
    "authorization_fee": 0
  }'::jsonb,
  turnover_tiers = '[
    {"range": "5000–9999", "fee": {"min": 0.0085, "max": 0.0129}},
    {"range": "10000–14999", "fee": {"min": 0.0085, "max": 0.0085}},
    {"range": "15000–18999", "fee": {"min": 0.0069, "max": 0.0099}},
    {"range": "20000–28999", "fee": {"min": 0.0069, "max": 0.0085}},
    {"range": "32000–49999", "fee": {"min": 0.0059, "max": 0.0075}},
    {"range": "100000+", "fee": {"min": 0.0055, "max": 0.0055}}
  ]'::jsonb,
  features = ARRAY[
    'Pay-as-you-go model',
    'No contract',
    'No monthly rental',
    'No PCI fees',
    'No authorization fees',
    'Instant payouts available',
    'Use own bank account or SumUp Bank account',
    'Fast setup',
    'Free dashboard access',
    '100% transparent pricing'
  ],
  updated_at = now()
WHERE id = 'sumup';

-- Insert Shift4 (new provider)
INSERT INTO public.providers (id, name, machine_models, contract_length, settlement_time, auto_renewal, early_termination_fee, fees, turnover_tiers, features, is_active, display_order)
VALUES (
  'shift4',
  'Shift4',
  ARRAY['PAX920'],
  'No contract',
  'Next working day (editable from portal)',
  false,
  null,
  '{
    "debit": {"blended": 0.0125},
    "credit": {"blended": 0.0125},
    "settlement_fee": 0.0025,
    "monthly_rental": 0,
    "setup_fee": 0,
    "pci_fee": 0,
    "non_compliance_fee": 0,
    "authorization_fee": 0
  }'::jsonb,
  '[
    {"range": "0–9999", "fee": 0.0125},
    {"range": "10000+", "fee": 0.007}
  ]'::jsonb,
  ARRAY[
    'First terminal free',
    'Next working day settlement',
    'No PCI fees',
    'No authorization fees',
    'No hidden charges',
    'Settlement time editable from portal',
    'Transparent pricing'
  ],
  true,
  5
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  machine_models = EXCLUDED.machine_models,
  contract_length = EXCLUDED.contract_length,
  settlement_time = EXCLUDED.settlement_time,
  auto_renewal = EXCLUDED.auto_renewal,
  early_termination_fee = EXCLUDED.early_termination_fee,
  fees = EXCLUDED.fees,
  turnover_tiers = EXCLUDED.turnover_tiers,
  features = EXCLUDED.features,
  updated_at = now();

-- Update Teya
UPDATE public.providers SET
  machine_models = ARRAY['Teya Go', 'Teya Essential'],
  contract_length = 'No contract – cancel anytime',
  settlement_time = 'Next working day (Instant & everyday payout available)',
  auto_renewal = false,
  early_termination_fee = null,
  fees = '{
    "monthly_rental": 15,
    "setup_fee": 0,
    "tap_fee": 0,
    "pci_fee": 0,
    "non_compliance_fee": 0,
    "min_monthly_charge": 0,
    "business_account_cashback": 0.005
  }'::jsonb,
  turnover_tiers = '[
    {"range": "8000–8999", "fee": 0.0125, "rental": 12},
    {"range": "10000–10999", "fee": 0.012, "rental": 12},
    {"range": "11000–11999", "fee": 0.011, "rental": 12},
    {"range": "12000–12999", "fee": 0.0104, "rental": 12},
    {"range": "13000–13999", "fee": 0.0102, "rental": 12},
    {"range": "14000–14999", "fee": 0.0101, "rental": 12},
    {"range": "15000–15999", "fee": 0.010, "rental": 12},
    {"range": "16000–16999", "fee": 0.0095, "rental": 0},
    {"range": "17000–17999", "fee": 0.009, "rental": 0},
    {"range": "18000–18999", "fee": 0.0088, "rental": 0},
    {"range": "19000–19999", "fee": 0.0086, "rental": 0},
    {"range": "20000–21999", "fee": 0.0085, "rental": 0},
    {"range": "22000–35999", "fee": 0.008, "rental": 0},
    {"range": "36000–42999", "fee": 0.0077, "rental": 0},
    {"range": "43000–65999", "fee": 0.007, "rental": 0},
    {"range": "66000–80999", "fee": 0.0067, "rental": 0},
    {"range": "81000–95999", "fee": 0.0063, "rental": 0},
    {"range": "100000–119999", "fee": 0.0061, "rental": 0},
    {"range": "120000–199999", "fee": 0.0060, "rental": 0},
    {"range": "200000+", "fee": 0.0055, "rental": 0}
  ]'::jsonb,
  device_info = '[
    {"device_name": "Teya Go", "buy_price": 69, "rental_price": 10, "buyout_option": true},
    {"device_name": "Teya Essential", "buy_price": 89, "rental_price": 10, "buyout_option": true}
  ]'::jsonb,
  documents_required = '{"proof_of_id": true, "proof_of_business": true, "proof_of_address": true}'::jsonb,
  features = ARRAY[
    'Instant payout available',
    'Everyday payout available',
    'Next-day settlement',
    'No setup or PCI fees',
    'No minimum charges',
    'Cancel anytime',
    'Live app access',
    'Business bank account 0.5% cash back',
    'Terminal buy out option available',
    'Fast and reliable terminals',
    '100% transparent pricing'
  ],
  updated_at = now()
WHERE id = 'teya';

-- Update Worldpay
UPDATE public.providers SET
  machine_models = ARRAY['DX8000', 'Ingenico 5000'],
  contract_length = '18 months (cannot be cancelled after 1 year)',
  settlement_time = 'Next working day',
  auto_renewal = true,
  early_termination_fee = 'Up to £150',
  fees = '{
    "debit": {"min": 0.003, "max": 0.014},
    "credit": {"min": 0.0065, "max": 0.016},
    "authorization_fee": 0.01,
    "tap_fee": [0.01, 0.02],
    "refund_fee": 5,
    "chargeback_fee": 20,
    "monthly_rental": 1,
    "setup_fee": 0,
    "dashboard_fee": 10,
    "pci_fee": 5,
    "non_compliance_fee": 22.5,
    "sim_fee": null,
    "min_monthly_charge": 10
  }'::jsonb,
  turnover_tiers = '[
    {"range": "0–24999", "debit": 0.0035, "credit": 0.0075},
    {"range": "25000+", "debit": 0.003, "credit": 0.0065}
  ]'::jsonb,
  features = ARRAY[
    'Next-day settlement',
    '£1 per month rental for first year',
    'Live mobile app (replaces optional dashboard)',
    '18-month contract',
    'No setup fees',
    'Established UK provider'
  ],
  updated_at = now()
WHERE id = 'worldpay';

-- Insert Elavon (new provider)
INSERT INTO public.providers (id, name, machine_models, contract_length, settlement_time, auto_renewal, early_termination_fee, fees, features, is_active, display_order)
VALUES (
  'elavon',
  'Elavon',
  ARRAY['PAX920 Pro'],
  '18 months',
  'Everyday settlement',
  true,
  'Remaining rental fees',
  '{
    "debit": {"min": 0.0031, "max": 0.015},
    "credit": {"min": 0.007, "max": 0.0175},
    "amex": 0.019,
    "business_debit": {"min": 0.009, "max": 0.025},
    "commercial_card": {"min": 0.018, "max": 0.03},
    "authorization_fee": 0.03,
    "refund_fee": null,
    "chargeback_fee": null,
    "monthly_rental": 20,
    "setup_fee": 0,
    "pci_fee": 2.5,
    "pci_annual_fee": 49,
    "non_compliance_fee": null,
    "sim_fee": null,
    "min_monthly_charge": null
  }'::jsonb,
  ARRAY[
    'Everyday settlement',
    'PAX920 Pro terminal',
    'Payment over the phone available',
    'Pay by link option available',
    '18-month contract',
    'PCI charges apply',
    'Monthly rental £20 + VAT'
  ],
  true,
  6
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  machine_models = EXCLUDED.machine_models,
  contract_length = EXCLUDED.contract_length,
  settlement_time = EXCLUDED.settlement_time,
  auto_renewal = EXCLUDED.auto_renewal,
  early_termination_fee = EXCLUDED.early_termination_fee,
  fees = EXCLUDED.fees,
  features = EXCLUDED.features,
  updated_at = now();

-- Update EVO
UPDATE public.providers SET
  machine_models = ARRAY['PAX920 Pro', 'Castle Terminal'],
  contract_length = '18 months',
  settlement_time = 'Next working day (editable from portal)',
  auto_renewal = true,
  early_termination_fee = 'Remaining rental fees',
  fees = '{
    "debit": {"min": 0.0031, "max": 0.015},
    "credit": {"min": 0.007, "max": 0.0175},
    "amex": 0.019,
    "business_debit": {"min": 0.009, "max": 0.025},
    "commercial_card": {"min": 0.018, "max": 0.03},
    "transaction_fee": 0.03,
    "tap_fee": [0.01, 0.02, 0.04, 0.05],
    "refund_fee": 5,
    "monthly_rental": 20,
    "setup_fee": 0,
    "pci_fee": 0,
    "non_compliance_fee": 0,
    "authorization_fee": 0,
    "min_monthly_charge": 0
  }'::jsonb,
  features = ARRAY[
    'Next-day settlement (editable from portal)',
    'No PCI fees',
    'No authorization fees',
    'No minimum monthly service charge',
    'Mobile app',
    'Integration with most EPOS systems',
    '18-month contract',
    'Monthly rental £20 + VAT',
    'PAX920 Pro terminal',
    'Payment over the phone available'
  ],
  updated_at = now()
WHERE id = 'evo';

-- Update Clover
UPDATE public.providers SET
  machine_models = ARRAY['Clover Flex', 'Clover Mini'],
  contract_length = '48 months',
  settlement_time = 'Next working day',
  auto_renewal = true,
  early_termination_fee = 'Remaining rental fees',
  fees = '{
    "debit": {"min": 0.003, "max": 0.0145},
    "credit": {"min": 0.0065, "max": 0.02},
    "authorization_fee": 0.03,
    "business_card": 0.025,
    "tap_fee": [0.03, 0.04, 0.05],
    "refund_fee": 5,
    "chargeback_fee": 28,
    "monthly_rental": 25,
    "setup_fee": 70,
    "dashboard_fee": 10,
    "pci_fee": 5,
    "non_compliance_fee": 25,
    "sim_fee": 10,
    "min_monthly_charge": 35
  }'::jsonb,
  turnover_tiers = '[
    {"range": "0–24999", "debit": null, "credit": null},
    {"range": "25000+", "debit": 0.003, "credit": 0.0065}
  ]'::jsonb,
  features = ARRAY[
    'Next-day settlement',
    '48-month contract',
    'Smart touchscreen terminals',
    'Modern user interface',
    'Updated dashboard system',
    'Authorization fee 3p'
  ],
  updated_at = now()
WHERE id = 'clover';