export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? ''

async function request<T>(
  path: string,
  options: RequestInit & { getToken?: () => Promise<string | null | undefined> } = {}
): Promise<T> {
  const { getToken, headers: extraHeaders, ...rest } = options

  const headers: Record<string, string> = {
    ...(extraHeaders as Record<string, string>),
  }

  const token = getToken ? await getToken() : undefined
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers,
  })

  if (!res.ok) {
    let data: unknown
    try {
      data = await res.json()
    } catch {
      data = undefined
    }
    throw new ApiError(res.status, res.statusText, data)
  }

  const text = await res.text()
  return text ? (JSON.parse(text) as T) : (undefined as T)
}

export const apiClient = {
  get<T>(
    path: string,
    options?: RequestInit & { getToken?: () => Promise<string | null | undefined> }
  ): Promise<T> {
    return request<T>(path, { ...options, method: 'GET' })
  },

  post<T>(
    path: string,
    body: unknown,
    options?: RequestInit & { getToken?: () => Promise<string | null | undefined> }
  ): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string>),
      },
      body: JSON.stringify(body),
    })
  },

  put<T>(
    path: string,
    body: unknown,
    options?: RequestInit & { getToken?: () => Promise<string | null | undefined> }
  ): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string>),
      },
      body: JSON.stringify(body),
    })
  },

  patch<T>(
    path: string,
    body: unknown,
    options?: RequestInit & { getToken?: () => Promise<string | null | undefined> }
  ): Promise<T> {
    return request<T>(path, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string>),
      },
      body: JSON.stringify(body),
    })
  },

  delete<T>(
    path: string,
    options?: RequestInit & { getToken?: () => Promise<string | null | undefined> }
  ): Promise<T> {
    return request<T>(path, { ...options, method: 'DELETE' })
  },
}
