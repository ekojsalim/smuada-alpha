import Head from "next/head";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import ProductSearch from "../components/search";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Smuada Alpha</title>
        <meta name="description" content="Ecommerce Price Tracker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box as="main" minHeight="100vh">
        <Flex justifyContent="space-between" padding="4">
          <Link href="/">
            <Heading size="md">Smuada</Heading>
          </Link>
          <Flex alignItems="center">
            <Link href="/track">
              <Button
                colorScheme="blackAlpha"
                variant="outline"
                mr="4"
                size="sm"
              >
                Track
              </Button>
            </Link>
            <UserButton />
          </Flex>
        </Flex>
        <Container maxWidth="80ch" mt="10vh">
          <Center display={"flex"} flexDirection={"column"} mb="4">
            <Heading>Smuada</Heading>
            <Text fontSize="xl">Ecommerce Product Price DB</Text>
          </Center>
          <ProductSearch />
        </Container>
      </Box>
    </>
  );
}
