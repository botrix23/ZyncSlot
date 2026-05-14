/**
 * Billing Cron — runs daily via Vercel Cron or external scheduler.
 *
 * NOTE: With N1CO subscriptions, recurring charges are handled entirely
 * by N1CO and reported back via webhooks (/api/webhooks/n1co).
 * This cron only enforces local state transitions:
 *   PAST_DUE (grace expired)  → suspend tenant
 *   CANCELLED (period ended)  → suspend tenant
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { subscriptions, tenants } from '@/db/schema'
import { and, eq, lte } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  let suspended = 0

  try {
    // 1. Tenants in PAST_DUE whose grace period has expired → SUSPENDED
    const pastDueExpired = await db.query.subscriptions.findMany({
      where: and(
        eq(subscriptions.status, 'PAST_DUE'),
        lte(subscriptions.gracePeriodEndsAt, now),
      ),
    })

    for (const sub of pastDueExpired) {
      await db.update(tenants)
        .set({ status: 'SUSPENDED', updatedAt: now })
        .where(eq(tenants.id, sub.tenantId))
      suspended++
      console.log(`[Billing Cron] Suspended tenant ${sub.tenantId} (grace period expired)`)
    }

    // 2. Tenants CANCELLED whose period has ended → SUSPENDED
    const cancelledExpired = await db.query.subscriptions.findMany({
      where: and(
        eq(subscriptions.status, 'CANCELLED'),
        lte(subscriptions.currentPeriodEnd, now),
      ),
    })

    for (const sub of cancelledExpired) {
      await db.update(tenants)
        .set({ status: 'SUSPENDED', updatedAt: now })
        .where(eq(tenants.id, sub.tenantId))
      suspended++
      console.log(`[Billing Cron] Suspended tenant ${sub.tenantId} (cancelled, period ended)`)
    }

    return NextResponse.json({ ok: true, suspended })
  } catch (error) {
    console.error('[Billing Cron] Fatal error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
