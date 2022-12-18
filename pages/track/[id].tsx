import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/router";

import { gql, useMutation, useQuery } from "@apollo/client";

const TRACK_QUERY = gql`
  query TrackListPage($id: bigint = 1) {
    list: lists_by_pk(id: $id) {
      id
      name
      updated_at
      track_requests {
        id
        status
        created_at
      }
      list_products {
        product {
          name
          price
          id
          product_prices {
            price
            timestamp
          }
        }
      }
    }
  }
`;

const RETRACK_MUTATION = gql`
  mutation ReTrackMutation($list_id: Int = 10) {
    insert_track_requests_one(
      object: { list_id: $list_id, status: "created" }
    ) {
      id
      status
    }
  }
`;

const TrackListPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading } = useQuery(TRACK_QUERY, {
    variables: { id },
    skip: !id,
    pollInterval: 5000,
  });

  const [retrack, _] = useMutation(RETRACK_MUTATION, {
    refetchQueries: [
      {
        query: TRACK_QUERY,
        variables: { id },
      },
    ],
  });

  // @ts-ignore
  const prices = data?.list.list_products
  // @ts-ignore
    .map((lp) => {
      const p = lp.product;
      // @ts-ignore
      return p.product_prices.map((pp) => {
        return {
          name: p.name,
          price: pp.price,
          time: pp.timestamp,
        };
      });
    })
    .flat()
	// @ts-ignore
    .sort((a, b) => b.time - a.time);

//   console.log(prices.map((v) => v.price.slice(2)));

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
      {loading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <Container mt="5vh">
          <Heading>{data.list.name}</Heading>
          <Text>
            {data.list.track_requests.length} Track Requests |{" "}
            {data.list.list_products.length} Products
          </Text>
          <Divider mb="8" />

          <Box>
            <Flex justifyContent="space-between" mb="3">
              <Heading size="md">Track Requests</Heading>
              <Button onClick={() => retrack({ variables: { list_id: id } })}>
                Retrack
              </Button>
            </Flex>
            <Divider />
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Request ID</Th>
                    <Th>Time</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {
                    // @ts-ignore
                    data.list.track_requests.map((v, idx) => {
                      return (
                        <Tr key={"tr-" + idx}>
                          <Td>{v.id}</Td>
                          <Td>{v.created_at}</Td>
                          <Td>{v.status}</Td>
                        </Tr>
                      );
                    })
                  }
                </Tbody>
              </Table>
            </TableContainer>
          </Box>

          <Box mt="8">
            <Flex justifyContent="space-between" mb="3">
              <Heading size="md">Product Prices</Heading>
              <Text>
                {/* Average {getAvg(prices.map((v) => Number(v.price.slice(2).replaceAll(",", ""))))} */}
              </Text>
            </Flex>
            <Divider />
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Product Name</Th>
                    <Th>Time</Th>
                    <Th isNumeric>Price</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {
                    // @ts-ignore
                    prices.map((v, idx) => {
                      return (
                        <Tr key={"tr2-" + idx}>
                          <Td>{v.name}</Td>
                          <Td>{v.time}</Td>
                          <Td>{v.price.replaceAll("$", "Rp.")}</Td>
                        </Tr>
                      );
                    })
                  }
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      )}
    </Box>
  );
};

export default TrackListPage;
