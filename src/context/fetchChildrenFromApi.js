const BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchChildrenFromApi(getToken) {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/children`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("HTTP error " + res.status);
  return await res.json();
}