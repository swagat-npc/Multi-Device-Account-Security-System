export async function apiFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  // Don't attempt refresh if we're already hitting the refresh endpoint
  if (url.includes("/auth/refresh")) {
    return res;
  }

  // If authorized, return immediately
  if (res.status !== 401) {
    return res;
  }

  // Refresh Token if access token expired
  const refreshRes = await fetch("http://localhost:3001/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!refreshRes.ok) {
    // If refresh fails, force login
    window.location.href = "/login";
    return res;
  }

  // Retry original request after refreshing token
  return await fetch(url, {
    ...options,
    credentials: "include",
  });
}
