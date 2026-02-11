import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Button, Stack, Text } from "@chakra-ui/react";

import { useAppData } from "./AppDataContext";
import { ToastBar } from "../context/ToastBar";

export const Root = () => {
  const { events, categories, categoryById, addEvent } = useAppData();
  const [showForm, setShowForm] = useState(false);

  // Add form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);

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
    setCategoryIds((prev) =>
      prev.includes(cid) ? prev.filter((x) => x !== cid) : [...prev, cid]
    );
  };

  const onSubmitAdd = async (e) => {
    e.preventDefault();

    const ok = await addEvent({
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      location: location.trim(),
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      categoryIds, // keep as strings to match your categories ids
    });

    if (ok) {
      setShowForm(false);
      reset();
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <ToastBar />

      <Stack direction="row" spacing={4} mb={6} align="center">
        <Text as={Link} to="/events">
          Events
        </Text>
        <Text as={Link} to="/about">
          About
        </Text>
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "Add Event"}
        </Button>
      </Stack>

      {showForm && (
        <form
          onSubmit={onSubmitAdd}
          style={{ border: "1px solid #ccc", padding: 16, marginBottom: 24 }}
        >
          <h3>Add event</h3>

          <div style={{ display: "grid", gap: 8 }}>
            <input required placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea required placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input required placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
            <input required placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <input required type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <input required type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

            <div>
              <div>Categories</div>
              {categories.map((c) => (
                <label key={c.id} style={{ display: "block" }}>
                  <input
                    required
                    type="checkbox"
                    checked={categoryIds.includes(String(c.id))}
                    onChange={() => toggleCategory(String(c.id))}
                  />
                  {c.name}
                </label>
              ))}
            </div>

            <button type="submit">Save</button>
          </div>
        </form>
      )}

      <Outlet context={{ events, categories, categoryById }} />
    </div>
  );
};
