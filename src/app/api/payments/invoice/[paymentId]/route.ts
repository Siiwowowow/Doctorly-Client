import { NextRequest, NextResponse } from "next/server";
import { ServerFetchError, serverFetchResponse } from "@/lib/serverFetch";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> },
) {
  const { paymentId } = await params;
  const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
  try {
    // Forward the logged-in user's HTTP-only cookies on the server. Browsers
    // cannot send the frontend's cookies directly to a different API domain.
    const response = await serverFetchResponse(`/payments/invoice/${encodeURIComponent(paymentId)}`, {
      baseUrl: process.env.INVOICE_API_BASE_URL,
      params: { format: "pdf", download: true },
      headers: { Accept: "application/pdf" },
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.headers.get("content-type")?.includes("application/pdf")) {
      return NextResponse.json({ message: "The invoice could not be generated. Please try again." }, { status: 502, headers });
    }
    return new NextResponse(response.body, {
      headers: {
        ...headers,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Doctorly-Invoice-${paymentId.replace(/[^a-zA-Z0-9-]/g, "")}.pdf"`,
      },
    });
  } catch (error) {
    const status = error instanceof ServerFetchError ? error.status : 502;
    const message = status === 401 ? "Your session has expired. Please sign in again to download your invoice."
      : status < 500 && error instanceof Error ? error.message
      : "Unable to download the invoice. Please try again.";
    return NextResponse.json({ message }, { status, headers });
  }
}
