import { cookies } from "next/headers";

import { defaultLocale, getLocaleOrDefault, type Locale } from "@/i18n/config";
import { localeCookieName } from "@/lib/locale-cookie";

export async function getCurrentLocale(): Promise<Locale> {
  const store = await cookies();
  return getLocaleOrDefault(store.get(localeCookieName)?.value ?? defaultLocale);
}
