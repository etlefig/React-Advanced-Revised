import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppData } from "../components/AppDataContext";

const toDatetimeLocal = (value) => {
  if (!value) return "";
  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, categories, categoryById, updateEvent, deleteEvent } = useAppData();

  const event = useMemo(() => events.find((e) => String(e.id) === String(id)), [events, id]);

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
      categoryIds: (event.categoryIds || []).map(String),
    });
  }, [event]);

  if (!event) {
    return (
      <div>
        <p>Event not found.</p>
        <Link to="/events">Back to events</Link>
      </div>
    );
  }

  const setField = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const toggleCategory = (cid) => {
    setForm((p) => ({
      ...p,
      categoryIds: p.categoryIds.includes(cid) ? p.categoryIds.filter((x) => x !== cid) : [...p.categoryIds, cid],
    }));
  };

  const onSave = async (e) => {
    e.preventDefault();

    const ok = await updateEvent(event.id, {
      title: form.title.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      location: form.location.trim(),
      startTime: new Date(form.startTime).toISOString(),
      endTime: new Date(form.endTime).toISOString(),
      categoryIds: form.categoryIds,
    });

    if (ok) setIsEditing(false);
  };

  const onDelete = async () => {
    const confirmed = window.confirm("Are you 100% sure you want to delete this event?");
    if (!confirmed) return;

    const ok = await deleteEvent(event.id);
    if (ok) navigate("/events");
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Link to="/events">← Back</Link>

      <h1>{event.title}</h1>

      {event.image ? (
        <img
          src={event.image}
          alt={event.title}
          style={{ width: "100%", maxHeight: 360, objectFit: "cover" }}
        />
      ) : null}

      <div>{event.description}</div>

      <div>
        {new Date(event.startTime).toLocaleString()} – {new Date(event.endTime).toLocaleString()}
      </div>

      <div>
        Categories: {(event.categoryIds || []).map((cid) => categoryById.get(String(cid)) || `#${cid}`).join(", ")}
      </div>

      {event.location ? <div>Location: {event.location}</div> : null}

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button type="button" onClick={() => setIsEditing(true)}>
          Edit Event
        </button>
        <button type="button" onClick={onDelete}>
          Delete Event
        </button>
      </div>

      {isEditing && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "grid",
            placeItems: "center",
            padding: 16,
          }}
          onClick={() => setIsEditing(false)}
        >
          <form
            onSubmit={onSave}
            style={{
              background: "white",
              maxWidth: 720,
              width: "100%",
              padding: 16,
              borderRadius: 8,
              display: "grid",
              gap: 10,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2 style={{ margin: 0 }}>Edit event</h2>
              <button type="button" onClick={() => setIsEditing(false)}>
                ✕
              </button>
            </div>

            <label style={{ display: "grid", gap: 6 }}>
              Title
              <input required value={form.title} onChange={setField("title")} />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              Description
              <textarea required rows={4} value={form.description} onChange={setField("description")} />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              Image URL
              <input required value={form.image} onChange={setField("image")} />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              Location
              <input required value={form.location} onChange={setField("location")} />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <label style={{ display: "grid", gap: 6 }}>
                Start time
                <input required type="datetime-local" value={form.startTime} onChange={setField("startTime")} />
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                End time
                <input required type="datetime-local" value={form.endTime} onChange={setField("endTime")} />
              </label>
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <div>Categories</div>
              <div style={{ display: "grid", gap: 6 }}>
                {categories.map((c) => (
                  <label key={c.id} style={{ display: "flex", gap: 8 }}>
                    <input
                      required
                      type="checkbox"
                      checked={form.categoryIds.includes(String(c.id))}
                      onChange={() => toggleCategory(String(c.id))}
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};