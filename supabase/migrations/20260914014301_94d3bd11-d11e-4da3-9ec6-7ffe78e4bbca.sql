CREATE TABLE IF NOT EXISTS public.app_settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.app_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings public read" ON public.app_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "owner inserts settings" ON public.app_settings
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'owner'::app_role));
CREATE POLICY "owner updates settings" ON public.app_settings
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'owner'::app_role))
  WITH CHECK (has_role(auth.uid(), 'owner'::app_role));

INSERT INTO public.app_settings (key, value) VALUES
  ('courier_fee', '2000'),
  ('courier_card_number', ''),
  ('courier_card_holder', '')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE public.courier_applications
  ADD COLUMN IF NOT EXISTS fee_amount numeric,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS payment_reference text,
  ADD COLUMN IF NOT EXISTS payment_holder text,
  ADD COLUMN IF NOT EXISTS payment_last4 text,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;