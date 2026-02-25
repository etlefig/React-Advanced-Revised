import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Checkbox,
  Container,
  Divider,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Skeleton,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useAppData } from "../components/AppDataContext";

const SkeletonCard = () => (
  <Box borderWidth="1px" borderColor="gray.200" borderRadius="md" overflow="hidden">
    <Skeleton h="220px" w="100%" />
    <Box p={4}>
      <Stack spacing={3}>
        <Skeleton h="18px" w="60%" />
        <Skeleton h="12px" w="90%" />
        <Skeleton h="12px" w="75%" />
        <Skeleton h="12px" w="50%" />
      </Stack>
    </Box>
  </Box>
);

export const EventsPage = () => {
  const { events = [], categories = [], categoryById, isLoading } = useAppData();

  const [query, setQuery] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]); // numbers

  const inputProps = {
    variant: "outline",
    borderWidth: "1px",
    borderColor: "gray.300",
    _focusVisible: { borderColor: "blue.400", boxShadow: "0 0 0 1px" },
  };

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();

    return events.filter((event) => {
      const matchesQuery =
        !q ||
        (event.title || "").toLowerCase().includes(q) ||
        (event.description || "").toLowerCase().includes(q);

      const eCats = (event.categoryIds || []).map(Number); // numbers
      const matchesCats =
        selectedCategoryIds.length === 0 ||
        selectedCategoryIds.every((id) => eCats.includes(id));

      return matchesQuery && matchesCats;
    });
  }, [events, query, selectedCategoryIds]);

  const toggleCategory = (id) => {
    const cid = Number(id);
    setSelectedCategoryIds((prev) =>
      prev.includes(cid) ? prev.filter((x) => x !== cid) : [...prev, cid]
    );
  };

  return (
    <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
      <Box>
        <Heading size="lg" mb={6}>
          Events
        </Heading>

        <Box
          display="flex"
          gap={6}
          flexDirection={{ base: "column", lg: "row" }}
          alignItems="flex-start"
        >
          {/* Filters */}
          <Box
            w={{ base: "100%", lg: "320px" }}
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="md"
            p={4}
          >
            <Stack spacing={4}>
              <Box>
                <Text mb={2}>Search</Text>
                <Input
                  {...inputProps}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search title or description"
                />
              </Box>

              <Divider />

              <Box>
                <Text mb={2}>Filter categories</Text>
                <Stack spacing={2}>
                  {categories.map((c) => {
                    const cid = Number(c.id);
                    return (
                      <Checkbox
                        key={c.id}
                        isChecked={selectedCategoryIds.includes(cid)}
                        onChange={() => toggleCategory(cid)}
                      >
                        {c.name}
                      </Checkbox>
                    );
                  })}
                </Stack>
              </Box>
            </Stack>
          </Box>

          {/* List */}
          <Box flex="1" w="100%">
            {isLoading ? (
              <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </SimpleGrid>
            ) : (
              <>
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                  {filteredEvents.map((event) => (
                    <Box
                      key={event.id}
                      as={RouterLink}
                      to={`/events/${event.id}`}
                      borderWidth="1px"
                      borderColor="gray.200"
                      borderRadius="md"
                      overflow="hidden"
                      _hover={{ transform: "translateY(-2px)", textDecoration: "none" }}
                      transition="transform 0.1s ease-in-out"
                    >
                      {event.image ? (
                        <Image
                          src={event.image}
                          alt={event.title}
                          w="100%"
                          h="220px"
                          objectFit="cover"
                        />
                      ) : (
                        <Box h="220px" bg="gray.100" />
                      )}

                      <Box p={4}>
                        <Stack spacing={2}>
                          <Heading size="md" noOfLines={1}>
                            {event.title}
                          </Heading>

                          <Text noOfLines={3}>{event.description}</Text>

                          <Text fontSize="sm" color="gray.600">
                            {new Date(event.startTime).toLocaleString()} –{" "}
                            {new Date(event.endTime).toLocaleString()}
                          </Text>

                          <Stack direction="row" spacing={2} wrap="wrap">
                            {(event.categoryIds || []).map((cid) => {
                              const name = categoryById.get(String(cid)) || `#${cid}`;
                              return (
                                <Tag key={`${event.id}-${cid}`} size="sm">
                                  {name}
                                </Tag>
                              );
                            })}
                          </Stack>
                        </Stack>
                      </Box>
                    </Box>
                  ))}
                </SimpleGrid>

                {filteredEvents.length === 0 && <Text mt={4}>Geen events gevonden.</Text>}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};