import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Tag,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useAppData } from "../components/AppDataContext";
import { toaster } from "../components/ui/toaster";

const toDatetimeLocal = (value) => {
  if (!value) return "";
  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    events = [],
    categories = [],
    categoryById,
    isLoading,
    updateEvent,
    deleteEvent,
  } = useAppData();

  const event = useMemo(
    () => events.find((e) => String(e.id) === String(id)),
    [events, id]
  );

  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    location: "",
    startTime: "",
    endTime: "",
    categoryIds: [],
  });

  useEffect(() => {
    if (!event) return;
    setForm({
      title: event.title || "",
      description: event.description || "",
      image: event.image || "",
      location: event.location || "",
      startTime: toDatetimeLocal(event.startTime),
      endTime: toDatetimeLocal(event.endTime),
      categoryIds: (event.categoryIds || []).map(Number),
    });
  }, [event]);

  const inputProps = {
    variant: "outline",
    borderWidth: "1px",
    borderColor: "gray.300",
    _focusVisible: {
      borderColor: "blue.400",
      boxShadow: "0 0 0 1px",
    },
  };

  const setField = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const toggleCategory = (cid) => {
    const idNum = Number(cid);
    setForm((p) => ({
      ...p,
      categoryIds: p.categoryIds.includes(idNum)
        ? p.categoryIds.filter((x) => x !== idNum)
        : [...p.categoryIds, idNum],
    }));
  };

  const onSave = async (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.image.trim() ||
      !form.location.trim()
    ) {
      toaster.create({
        title: "Vul alle velden in",
        type: "error",
        duration: 3000,
        closable: true,
      });
      return;
    }

    if (form.categoryIds.length === 0) {
      toaster.create({
        title: "Selecteer minimaal één categorie",
        type: "error",
        duration: 3000,
        closable: true,
      });
      return;
    }

    const start = new Date(form.startTime);
    const end = new Date(form.endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      toaster.create({
        title: "Vul start- en eindtijd in",
        type: "error",
        duration: 3000,
        closable: true,
      });
      return;
    }

    if (end <= start) {
      toaster.create({
        title: "Eindtijd moet na starttijd liggen",
        type: "error",
        duration: 3000,
        closable: true,
      });
      return;
    }

    const ok = await updateEvent(event.id, {
      title: form.title.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      location: form.location.trim(),
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      categoryIds: form.categoryIds,
    });

    if (ok) {
      toaster.create({
        title: "Event opgeslagen",
        type: "success",
        duration: 3000,
        closable: true,
      });
      setIsEditing(false);
    } else {
      toaster.create({
        title: "Opslaan mislukt",
        description: "Probeer het opnieuw.",
        type: "error",
        duration: 3000,
        closable: true,
      });
    }
  };

  const onDelete = async () => {
    const confirmed = window.confirm(
      "Weet je zeker dat je dit event wilt verwijderen?"
    );
    if (!confirmed) return;

    const ok = await deleteEvent(event.id);

    if (ok) {
      toaster.create({
        title: "Event verwijderd",
        type: "success",
        duration: 2500,
        closable: true,
      });
      navigate("/events");
    } else {
      toaster.create({
        title: "Verwijderen mislukt",
        type: "error",
        duration: 3000,
        closable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={6}>
        <Stack direction="row" spacing={3} align="center">
          <Spinner />
          <Text>Event laden...</Text>
        </Stack>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxW="container.xl" py={6}>
        <Stack spacing={3}>
          <Heading size="md">Event not found.</Heading>
          <Button as={RouterLink} to="/events" w="fit-content" variant="outline">
            Back to events
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={{ base: 4, md: 6 }}>
      <Stack spacing={5} maxW={{ base: "100%", lg: "980px" }}>
        <Button
          as={RouterLink}
          to="/events"
          variant="ghost"
          w="fit-content"
          px={0}
        >
          ← Back
        </Button>

        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={6}
          align="stretch"
        >
          <Box flex="1">
            <Stack spacing={3}>
              <Heading size="lg">{event.title}</Heading>

              <Text color="gray.600">
                {new Date(event.startTime).toLocaleString()} –{" "}
                {new Date(event.endTime).toLocaleString()}
              </Text>

              {event.location ? <Text>Location: {event.location}</Text> : null}

              <Stack direction="row" spacing={2} wrap="wrap">
                {(event.categoryIds || []).map((cid) => (
                  <Tag key={cid} size="sm">
                    {categoryById.get(String(cid)) || `#${cid}`}
                  </Tag>
                ))}
              </Stack>
            </Stack>
          </Box>

          {event.image ? (
            <Box flex={{ base: "none", md: "0 0 360px" }}>
              <Image
                src={event.image}
                alt={event.title}
                w="100%"
                h={{ base: "240px", md: "260px" }}
                objectFit="cover"
                borderRadius="md"
              />
            </Box>
          ) : null}
        </Stack>

        <Text>{event.description}</Text>

        <Divider />

        <Stack direction={{ base: "column", sm: "row" }} spacing={3}>
          <Button onClick={() => setIsEditing(true)}>Edit Event</Button>
          <Button variant="outline" onClick={onDelete}>
            Delete Event
          </Button>
        </Stack>
      </Stack>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box as="form" id="edit-event-form" onSubmit={onSave}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={form.title}
                    onChange={setField("title")}
                    {...inputProps}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    rows={4}
                    value={form.description}
                    onChange={setField("description")}
                    {...inputProps}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Image URL</FormLabel>
                  <Input
                    value={form.image}
                    onChange={setField("image")}
                    {...inputProps}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <Input
                    value={form.location}
                    onChange={setField("location")}
                    {...inputProps}
                  />
                </FormControl>

                <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Start time</FormLabel>
                    <Input
                      type="datetime-local"
                      value={form.startTime}
                      onChange={setField("startTime")}
                      {...inputProps}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>End time</FormLabel>
                    <Input
                      type="datetime-local"
                      value={form.endTime}
                      onChange={setField("endTime")}
                      {...inputProps}
                    />
                  </FormControl>
                </Stack>

                <FormControl isRequired>
                  <FormLabel>Categories</FormLabel>
                  <Stack spacing={2}>
                    {categories.map((c) => {
                      const cid = Number(c.id);
                      return (
                        <Checkbox
                          key={c.id}
                          isChecked={form.categoryIds.includes(cid)}
                          onChange={() => toggleCategory(cid)}
                        >
                          {c.name}
                        </Checkbox>
                      );
                    })}
                  </Stack>
                </FormControl>
              </Stack>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Stack direction="row" spacing={3}>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" form="edit-event-form">
                Save
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};