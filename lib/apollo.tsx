import {
  ApolloProvider,
  ApolloClient,
  split,
  HttpLink,
  from,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

// @ts-ignore
export const GraphQLProvider = ({ children }) => {
  const { getToken } = useAuth();
  const apolloClient = useMemo(() => {
    const authMiddleware = setContext(async (req, { headers }) => {
      const token = await getToken({ template: "hasura" });
      return {
        headers: {
          ...headers,
          authorization: `Bearer ${token}`,
        },
      };
    });

    const endpoint =
      process.env.NEXT_PUBLIC_HASURA_GRAPHQL_API ??
      "https://graphql.smuada.com/v1/graphql";

    const httpLink = new HttpLink({
      uri: endpoint,
    });

    const wsLink =
      typeof window !== "undefined"
        ? new GraphQLWsLink(
            createClient({
              url: "wss://graphql.smuada.com/v1/graphql",
            })
          )
        : null;

    const link =
      typeof window !== "undefined" && wsLink != null
        ? split(
            ({ query }) => {
              const def = getMainDefinition(query);
              return (
                def.kind === "OperationDefinition" &&
                def.operation === "subscription"
              );
            },
            wsLink,
            httpLink
          )
        : httpLink;

    return new ApolloClient({
      link: from([authMiddleware, link]),
      cache: new InMemoryCache(),
    });
  }, [getToken]);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
