import { getHomelabStatus } from "@/_app/api-routes/homelab-status";

export const runtime = "nodejs";

export async function GET() {
  const statuses = await getHomelabStatus();
  return Response.json(statuses, { headers: { "Cache-Control": "no-store" } });
}
