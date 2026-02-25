import { Flex, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav>
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: 2, md: 6 }}
        align={{ base: "flex-start", md: "center" }}
        mb={6}
      >
        <Link
          as={RouterLink}
          to="/events"
          fontWeight="medium"
          _hover={{ textDecoration: "underline" }}
        >
          Events
        </Link>

        <Link
          as={RouterLink}
          to="/about"
          fontWeight="medium"
          _hover={{ textDecoration: "underline" }}
        >
          About
        </Link>
      </Flex>
    </nav>
  );
};