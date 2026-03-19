'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { routing, type Locale } from './routing'

export async function setLocale(locale: string): Promise<void> {
  if (!routing.locales.includes(locale as Locale)) return

  const cookieStore = await cookies()
  cookieStore.set('NEXT_LOCALE', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 })
  revalidatePath('/', 'layout')
}
