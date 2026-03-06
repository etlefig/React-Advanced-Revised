import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";

import { useAppData } from "./AppDataContext";
import { toaster } from "./ui/toaster";

export const Root = () => {
  const { events = [], categories = [], addEvent } = useAppData();
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);

  const inputProps = {
    variant: "outline",
    borderWidth: "1px",
    borderColor: "gray.300",
    _focusVisible: {
      borderColor: "blue.400",
      boxShadow: "0 0 0 1px",
    },
  };

  const reset = () => {
    setTitle("");
    setDescription("");
    setImage("");
    setLocation("");
    setStartTime("");
    setEndTime("");
    setCategoryIds([]);
  };

  const toggleCategory = (cid) => {
    const id = Number(cid);
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const onSubmitAdd = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !image.trim() || !location.trim()) {
      toaster.create({
        title: "Vul alle velden in",
        type: "error",
        duration: 3000,
        closable: true,
      });
      return;
    }

    if (!startTime || !endTime) {
      toaster.create({
        title: "Vul een start- en eindtijd in",
        type: "error",
        duration: 3000,
        closable: true,
      });
      return;
    }

    const startIso = new Date(startTime).toISOString();
    const endIso = new Date(endTime).toISOString();

    if (new Date(endIso) <= new Date(startIso)) {
      toaster.create({
        title: "Eindtijd moet na starttijd liggen",
        type: "error",
        duration: 3000,
        closable: true,
      });
      return;
    }

    if (categoryIds.length === 0) {
      toaster.create({
        title: "Selecteer minimaal één categorie",
        type: "error",
        duration: 3000,
        closable: true,
      });
      return;
    }

    const success = await addEvent({
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      location: location.trim(),
      startTime: startIso,
      endTime: endIso,
      categoryIds,
      createdBy: 1,
    });

    if (success) {
      toaster.create({
        title: "Event opgeslagen",
        description: "Het event is succesvol aangemaakt.",
        type: "success",
        duration: 3000,
        closable: true,
      });

      setShowForm(false);
      reset();
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

  return (
    <Box py={{ base: 4, md: 6 }}>
      <Container maxW="1400px" px={{ base: 4, md: 6 }}>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          mb={6}
          align={{ base: "stretch", md: "center" }}
        >
          <Stack direction="row" spacing={4} align="center">
            <Text as={Link} to="/events">
              Events
            </Text>
            <Text as={Link} to="/about">
              About
            </Text>
          </Stack>

          <Button
            onClick={() => setShowForm((v) => !v)}
            alignSelf={{ base: "flex-start", md: "auto" }}
          >
            {showForm ? "Cancel" : "Add Event"}
          </Button>
        </Stack>

        {showForm && (
          <Container maxW={{ base: "100%", md: "640px", lg: "720px" }} px={0}>
            <Box
              as="form"
              onSubmit={onSubmitAdd}
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="md"
              p={4}
              mb={6}
            >
              <Heading size="md" mb={4}>
                Add event
              </Heading>

              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    {...inputProps}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    {...inputProps}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Image URL</FormLabel>
                  <Input
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    {...inputProps}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    {...inputProps}
                  />
                </FormControl>

                <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Start</FormLabel>
                    <Input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      {...inputProps}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>End</FormLabel>
                    <Input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
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
                          isChecked={categoryIds.includes(cid)}
                          onChange={() => toggleCategory(cid)}
                        >
                          {c.name}
                        </Checkbox>
                      );
                    })}
                  </Stack>
                </FormControl>

                <Stack direction="row" spacing={3}>
                  <Button type="submit">Save</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Container>
        )}

        <Outlet context={{ events, categories }} />
      </Container>
    </Box>
  );
};