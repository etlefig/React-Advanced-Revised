import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../components/AppDataContext";

const SkeletonCard = () => (
  <div style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
    <div style={{ width: "100%", height: 220, background: "#e5e7eb" }} />
    <div style={{ padding: 12, display: "grid", gap: 10 }}>
      <div style={{ width: "60%", height: 16, background: "#e5e7eb", borderRadius: 6 }} />
      <div style={{ width: "90%", height: 12, background: "#e5e7eb", borderRadius: 6 }} />
      <div style={{ width: "75%", height: 12, background: "#e5e7eb", borderRadius: 6 }} />
      <div style={{ width: "50%", height: 12, background: "#e5e7eb", borderRadius: 6 }} />
    </div>
  </div>
);

export const EventsPage = () => {
  const { events, categories, categoryById, isLoading } = useAppData();

  const [query, setQuery] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((event) => {
      const matchesQuery =
        !q ||
        (event.title || "").toLowerCase().includes(q) ||
        (event.description || "").toLowerCase().includes(q);

      const eCats = (event.categoryIds || []).map(String);
      const matchesCats =
        selectedCategoryIds.length === 0 ||
        selectedCategoryIds.every((id) => eCats.includes(id));

      return matchesQuery && matchesCats;
    });
  }, [events, query, selectedCategoryIds]);

  const toggleCategory = (id) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <div style={{ minWidth: 280 }}>
        <h1>Events</h1>

        <div style={{ marginBottom: 16 }}>
          <div>Search</div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or description"
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <div>Filter categories</div>
          <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
            {categories.map((c) => (
              <label key={c.id} style={{ display: "flex", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={selectedCategoryIds.includes(String(c.id))}
                  onChange={() => toggleCategory(String(c.id))}
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 320, display: "grid", gap: 12 }}>
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}
              >
                <Link
                  to={`/events/${event.id}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      style={{ width: "100%", height: 220, objectFit: "cover" }}
                    />
                  ) : null}

                  <div style={{ padding: 12 }}>
                    <div style={{ fontSize: 18 }}>{event.title}</div>
                    <div style={{ marginTop: 6 }}>{event.description}</div>

                    <div style={{ marginTop: 10 }}>
                      {new Date(event.startTime).toLocaleString()} –{" "}
                      {new Date(event.endTime).toLocaleString()}
                    </div>

                    <div style={{ marginTop: 8 }}>
                      Categories:{" "}
                      {(event.categoryIds || [])
                        .map((cid) => categoryById.get(String(cid)) || `#${cid}`)
                        .join(", ")}
                    </div>
                  </div>
                </Link>
              </div>
            ))}

            {filteredEvents.length === 0 && <p>Geen events gevonden.</p>}
          </>
        )}
      </div>
    </div>
  );
};