export async function adminRequest<T>(
  url: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    cache: "no-store",
    signal: AbortSignal.timeout(30000),
    headers: { ...options.headers, Authorization: `Bearer ${token}` },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(
      body?.error || "Could not complete the request. Please try again.",
    );
  if (!body) throw new Error("Could not read the response. Please try again.");
  return body as T;
}
