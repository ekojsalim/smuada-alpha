import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { InstantSearch, SearchBox, Hits, Highlight } from "react-instantsearch-hooks-web";

import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

import "instantsearch.css/themes/reset.css";
import "instantsearch.css/themes/algolia.css";

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: "dahcCmC1hDPv0cBteaOR7fJefyCdD8Yn",
    nodes: [
      {
        host: "search.smuada.com",
        port: 443,
        protocol: "https",
      },
    ],
  },
  additionalSearchParameters: {
    query_by: "name",
  },
});

const searchClient = typesenseInstantsearchAdapter.searchClient;

// @ts-ignore
const Hit = ({ hit }) => {
  return (
    <article>
      <img src={hit?.image} alt={hit?.name} />
      <Text fontSize="lg"><Highlight attribute="name" hit={hit} /></Text>
    </article>
  );
};

const ProductSearch = () => {
  return (
    <InstantSearch searchClient={searchClient} indexName="products">
      <Box mb="4">
        <SearchBox />
      </Box>
      <Hits hitComponent={Hit} />
    </InstantSearch>
  );
};

export default ProductSearch;
