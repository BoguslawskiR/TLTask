import { getAuth } from "./auth";

// TODO: Possibly replace this helper with Apollo Client
export default function graphQlFetch<T>(query: string, variables: object = {}) {
  const token = getAuth();
  // TODO: Possibly use Axios with interceptors to handle token refreshing and more proper handling redirection
  return fetch(
    'http://localhost:3000/api/graphql',
    { 
      method: 'POST', 
      body: JSON.stringify({ query, variables }), 
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } },
      
  ).then(async (res) => (await res.json()) as { data: T });
};