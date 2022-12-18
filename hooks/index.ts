import { request } from "graphql-request";
import { useAuth } from "@clerk/nextjs";
import useSWR from "swr";

/**
 * Make authenticated GraphQL query request
 * @param {string} query GraphQL query or mutation
 * @param {Object} variables GraphQL Document variables
 * @param {boolean} blockRequest Request blocked if true
 * @returns useSWR object (data, error, isValidating, mutate)
 */
export const useQuery = (
  query: string,
  variables: any,
  blockRequest: boolean
) => {
  if (!query) {
    throw Error("No query provided to `useQuery`");
  }

  const { getToken } = useAuth();
  const endpoint =
    process.env.NEXT_PUBLIC_HASURA_GRAPHQL_API ??
    "https://graphql.smuada.com/v1/graphql";
  const fetcher = async () => {
    return request(endpoint, query, variables, {
      authorization: `Bearer ${await getToken({
        template: "your-template-name",
      })}`,
    });
  };

  return useSWR(query, blockRequest ? () => {} : fetcher);
};
