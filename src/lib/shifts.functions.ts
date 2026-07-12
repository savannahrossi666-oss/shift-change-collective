import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

const CreateInput = z.object({
  title: z.string().min(4).max(140),
  description: z.string().min(10).max(2000),
  category: z.string().min(2).max(80),
  location_text: z.string().min(1).max(120),
  pay_cents: z.number().int().min(0).max(100_000_00),
  pay_type: z.enum(["fixed", "hourly"]),
  urgency: z.enum(["now", "today", "this_week"]),
});

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

const SHIFT_COLUMNS =
  "id, title, description, category, location_text, pay_cents, pay_type, urgency, status, poster_id, claimed_by, claimed_at, created_at";

export const listOpenShifts = createServerFn({ method: "GET" }).handler(async () => {
  const supa = publicClient();
  const { data, error } = await supa
    .from("shifts")
    .select(SHIFT_COLUMNS)
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(60);
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getShiftById = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const supa = publicClient();
    const { data: row, error } = await supa
      .from("shifts")
      .select(`${SHIFT_COLUMNS}, poster:profiles!shifts_poster_id_fkey(display_name, avatar_url, city)`)
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const createShift = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => CreateInput.parse(d))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("shifts")
      .insert({ ...data, poster_id: context.userId })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const claimShift = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("shifts")
      .update({
        status: "claimed",
        claimed_by: context.userId,
        claimed_at: new Date().toISOString(),
      })
      .eq("id", data.id)
      .eq("status", "open")
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("This shift was just claimed by someone else.");
    return { id: row.id };
  });

export const completeShift = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("shifts")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", data.id)
      .eq("poster_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const cancelShift = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("shifts")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
      .eq("id", data.id)
      .eq("poster_id", context.userId)
      .eq("status", "open");
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listMyShifts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [posted, claimed] = await Promise.all([
      context.supabase
        .from("shifts")
        .select(SHIFT_COLUMNS)
        .eq("poster_id", context.userId)
        .order("created_at", { ascending: false }),
      context.supabase
        .from("shifts")
        .select(SHIFT_COLUMNS)
        .eq("claimed_by", context.userId)
        .order("claimed_at", { ascending: false }),
    ]);
    if (posted.error) throw new Error(posted.error.message);
    if (claimed.error) throw new Error(claimed.error.message);
    return { posted: posted.data ?? [], claimed: claimed.data ?? [] };
  });
