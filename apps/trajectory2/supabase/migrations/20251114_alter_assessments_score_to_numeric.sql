-- Alter assessments table score column from INTEGER to NUMERIC(3,2)
-- This allows storing decimal scores like 3.45 as returned by the scoring system

ALTER TABLE public.assessments
  ALTER COLUMN score TYPE NUMERIC(3,2);

-- Add comment explaining the precision
COMMENT ON COLUMN public.assessments.score IS 'Overall assessment score from 0.00 to 5.00 with 2 decimal places';
