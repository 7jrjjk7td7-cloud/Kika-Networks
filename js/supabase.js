// KIKA HOST - CONEXIÓN SUPABASE

import { createClient } from
  "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://jdphiqxataaoiwuutohy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_zTzYtuzEDO48OUvIMIoChg_LmCsfkqa";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
