import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Flex,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { gql, useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useState } from "react";

const CREATE_LIST_MUTATION = gql`
  mutation CreateList($user_id: String = "", $name: String = "") {
    insert_lists_one(
      object: {
        user: {
          data: { id: $user_id }
          on_conflict: { constraint: users_pkey, update_columns: id }
        }
        track_requests: { data: { status: "created" } }
        name: $name
      }
    ) {
      id
      name
      track_requests {
        id
        created_at
        status
      }
    }
  }
`;

const LISTS_QUERY = gql`
  query Lists {
    lists {
      id
      name
      created_at
      track_requests: track_requests_aggregate {
        aggregate {
          count
        }
      }
      products: list_products_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

const TrackPage = () => {
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const { loading, error, data } = useQuery(LISTS_QUERY);
  const [createList, d] = useMutation(CREATE_LIST_MUTATION, {
    refetchQueries: [{ query: LISTS_QUERY }],
  });

  const [search, setSearch] = useState("");

  const addList = async () => {
    if (search) {
      await createList({
        variables: {
          user_id: userId,
          name: search,
        },
      });
    }

    setSearch("");
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <Box as="main" minHeight="100vh">
      <Flex justifyContent="space-between" padding="4">
        <Link href="/">
          <Heading size="md">Smuada</Heading>
        </Link>
        <Flex alignItems="center">
          <UserButton />
        </Flex>
      </Flex>
      <Container mt="5vh">
        <Heading>Tracklists</Heading>
        <Text>
          Below are your track lists. You can create a new one using the input
          below.
        </Text>

        <Flex my="4">
          <Input
            placeholder="Search Term"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button ml="4" onClick={() => addList()}>
            Add
          </Button>
        </Flex>

        <Divider mb="4" />

        {data?.lists &&
          // @ts-ignore
          data.lists.map((l, idx) => {
            return (
              <Card key={idx} mb="4">
                <Link href={`/track/${l.id}`}>
                  <CardBody>
                    <Heading size="md" mb="1">
                      {l.name}
                    </Heading>
                    <Text>
                      {l?.track_requests?.aggregate?.count} Track Requests
                    </Text>
                    <Text>{l?.products?.aggregate?.count} Products</Text>
                  </CardBody>
                </Link>
              </Card>
            );
          })}
      </Container>
    </Box>
  );
};

export default TrackPage;
