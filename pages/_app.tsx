import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import { useRouter } from "next/router";
import { GraphQLProvider } from "../lib/apollo";

const publicPages = ["/"];

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  // Check if the current route matches a public page
  const isPublicPage = publicPages.includes(pathname);

  return (
    <ChakraProvider>
      <ClerkProvider {...pageProps}>
        {isPublicPage ? (
          <Component {...pageProps} />
        ) : (
          <GraphQLProvider>
            <SignedIn>
              <Component {...pageProps} />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </GraphQLProvider>
        )}
      </ClerkProvider>
    </ChakraProvider>
  );
}
