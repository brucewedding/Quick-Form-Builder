import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const formId = parseInt(params.formId);
    const data = await request.json();

    // Get the form to verify it exists and is published
    const form = await prisma.form.findFirst({
      where: {
        id: formId,
        published: true,
      },
    });

    if (!form) {
      return new NextResponse("Form not found", { status: 404 });
    }

    // Save the submission and analytics
    const submission = await prisma.submission.create({
      data: {
        formId,
        content: JSON.stringify(data),
      },
    });

    // Track analytics
    await prisma.analytics.create({
      data: {
        formId,
        submissionId: submission.id,
        event: 'FORM_SUBMISSION',
        metadata: JSON.stringify({
          timestamp: new Date().toISOString(),
          userAgent: request.headers.get('user-agent'),
          referer: request.headers.get('referer'),
          origin: request.headers.get('origin'),
          fieldCount: Object.keys(data).length,
        }),
      },
    });

    return new NextResponse(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
      },
    });
  } catch (error) {
    console.error('Error processing form submission:', error);
    return new NextResponse("Error processing submission", { status: 500 });
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
