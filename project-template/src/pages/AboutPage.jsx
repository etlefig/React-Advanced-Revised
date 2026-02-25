import { Container, Heading, Stack, Text } from "@chakra-ui/react";

export const AboutPage = () => {
  return (
    <Container maxW="container.md" py={{ base: 4, md: 6 }}>
      <Stack spacing={4}>
        <Heading size="lg">About</Heading>

        <Text>
          Deze applicatie is een event management app gebouwd met React,
          React Router en Chakra UI.
        </Text>

        <Text>
          Voor onderdelen van deze applicatie is AI-ondersteuning gebruikt,
          onder andere bij het opzetten van de componentstructuur en het
          debuggen van functionaliteit.
        </Text>
      </Stack>
    </Container>
  );
};
