import { NextRequest, NextResponse } from 'next/server'
import { submitEnquiry } from '@/lib/firestore'
import type { Enquiry } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Omit<Enquiry, 'id' | 'createdAt' | 'status'>

    // Basic validation
    if (!body.customerName || !body.customerMobile || !body.type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const id = await submitEnquiry(body)

    // TODO: Send confirmation email via Resend (Phase 1 optional)
    // await sendConfirmationEmail(body.customerEmail, body)

    return NextResponse.json({ success: true, id }, { status: 201 })
  } catch (err) {
    console.error('Enquiry submission error:', err)
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 })
  }
}
