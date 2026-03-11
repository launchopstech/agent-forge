'use server'

import { exampleFormSchema } from './ExampleForm'

type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

export async function submitExampleForm(
  _prev: ActionResult<void>,
  formData: FormData
): Promise<ActionResult<void>> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  }

  const result = exampleFormSchema.safeParse(raw)

  if (!result.success) {
    return {
      ok: false,
      error: 'Validation failed',
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  // TODO: call apiClient.post('/api/contact', result.data)

  return { ok: true, data: undefined }
}
