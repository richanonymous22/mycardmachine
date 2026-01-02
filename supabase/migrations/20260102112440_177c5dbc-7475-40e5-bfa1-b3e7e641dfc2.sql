-- Delete duplicate/test providers
DELETE FROM providers WHERE id IN ('Shift4', 'handepay', 'takepayments', 'YOLO');

-- Fix RLS: Allow applications to be read when fetching by ID (for telegram notifications)
-- The issue is the .single() call after creating an application - user can't read it back
-- We need to allow reading applications by ID for notification purposes

-- Create policy to allow reading applications temporarily after creation using a service role
-- Actually the telegram-notify uses the data passed to it, so we need to ensure data is passed correctly from the form

-- Add policy to allow reading own inserted application within the same session
-- This is a workaround - the real fix is to pass the form data directly to telegram-notify