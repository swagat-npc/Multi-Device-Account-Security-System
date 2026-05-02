import { apiFetch } from "./api";

export async function getMe() {
    console.log("Get me entered");
  const res = await apiFetch("/auth/me");

  if (res.status === 401) return null;

  console.log("Get me exit time");
  return await res.json();
}

export async function logout() {
  await fetch("http://localhost:3001/auth/logout", {
    method: "POST",
    credentials: "include",
  }).then((res) => {
    if (res.ok) {
      window.location.href = "/";
    } else {
      alert("Logout failed: " + (res.body || "Unknown error"));
    }
  });
}
