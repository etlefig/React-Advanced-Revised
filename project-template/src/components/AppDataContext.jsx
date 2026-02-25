import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const API_BASE_URL = "http://localhost:3000";

const AppDataContext = createContext(null);

export const AppDataProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const categoryById = useMemo(() => {
    const map = new Map();
    categories.forEach((c) => map.set(String(c.id), c.name));
    return map;
  }, [categories]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const [e, c] = await Promise.all([
        fetch(`${API_BASE_URL}/events`).then((r) => {
          if (!r.ok) throw new Error("GET /events failed");
          return r.json();
        }),
        fetch(`${API_BASE_URL}/categories`).then((r) => {
          if (!r.ok) throw new Error("GET /categories failed");
          return r.json();
        }),
      ]);

      setEvents(e);
      setCategories(c);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // errors are handled in the UI (toaster)
    refetch().catch((err) => {
      console.error("Failed to load data from JSON server.", err);
    });
  }, [refetch]);

  const addEvent = useCallback(
    async (payload) => {
      try {
        const res = await fetch(`${API_BASE_URL}/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("POST failed");
        await refetch();
        return true;
      } catch (err) {
        console.error("Failed to add event.", err);
        return false;
      }
    },
    [refetch]
  );

  const updateEvent = useCallback(
    async (eventId, patch) => {
      try {
        const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (!res.ok) throw new Error("PATCH failed");
        await refetch();
        return true;
      } catch (err) {
        console.error("Failed to update event.", err);
        return false;
      }
    },
    [refetch]
  );

  const deleteEvent = useCallback(
    async (eventId) => {
      try {
        const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("DELETE failed");
        await refetch();
        return true;
      } catch (err) {
        console.error("Failed to delete event.", err);
        return false;
      }
    },
    [refetch]
  );

  const value = useMemo(
    () => ({
      events,
      categories,
      categoryById,
      isLoading,
      refetch,
      addEvent,
      updateEvent,
      deleteEvent,
    }),
    [
      events,
      categories,
      categoryById,
      isLoading,
      refetch,
      addEvent,
      updateEvent,
      deleteEvent,
    ]
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return ctx;
};