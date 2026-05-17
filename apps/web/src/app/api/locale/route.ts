import { NextResponse } from "next/server";

import { getLocaleOrDefault } from "@/i18n/config";
import { localeCookieName } from "@/lib/locale-cookie";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { locale?: string };
  const locale = getLocaleOrDefault(body.locale);
  const response = NextResponse.json({ locale });
  response.cookies.set(localeCookieName, locale, { maxAge: 60 * 60 * 24 * 365, path: "/", sameSite: "lax" });
  return response;
}
