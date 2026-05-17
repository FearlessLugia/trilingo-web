const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn('NEXT_PUBLIC_API_BASE_URL is not defined in environment variables');
}

export async function fetchLanguages(query: string) {
  const formattedQuery = query.trim().replace(/ /g, '_');
  console.log(`Fetching languages for: ${formattedQuery} from ${API_BASE_URL}`);
  const res = await fetch(`${API_BASE_URL}/languages?q=${encodeURIComponent(formattedQuery)}`);
  if (!res.ok) throw new Error('Failed to fetch languages');
  return res.json();
}

export async function fetchAlign(query: string, pivot: string) {
  const formattedQuery = query.trim().replace(/ /g, '_');
  const res = await fetch(`${API_BASE_URL}/align`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: formattedQuery, pivot }),
  });
  if (!res.ok) throw new Error('Failed to fetch aligned synsets');
  return res.json();
}
