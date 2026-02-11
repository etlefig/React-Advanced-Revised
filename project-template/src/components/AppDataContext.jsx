import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";

const API_BASE_URL = "http://localhost:3000";

const AppDataContext = createContext(null);

export const AppDataProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // simple toast system
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message: string }

  const notify = useCallback((type, message) => {
    setToast({ type, message });
    window.clearTimeout(notify._t);
    notify._t = window.setTimeout(() => setToast(null), 3000);
  }, []);
  // eslint-disable-next-line
  notify._t = notify._t || null;

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
    refetch().catch(() =>
      notify("error", "Failed to load data from JSON server.")
    );
  }, [refetch, notify]);

  const addEvent = useCallback(
    async (payload) => {
      try {
        const res = await fetch(`${API_BASE_URL}/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("POST failed");
        notify("success", "Event added successfully.");
        await refetch();
        return true;
      } catch {
        notify("error", "Failed to add event.");
        return false;
      }
    },
    [refetch, notify]
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
        notify("success", "Event updated successfully.");
        await refetch();
        return true;
      } catch {
        notify("error", "Failed to update event.");
        return false;
      }
    },
    [refetch, notify]
  );

  const deleteEvent = useCallback(
    async (eventId) => {
      try {
        const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("DELETE failed");
        notify("success", "Event deleted successfully.");
        await refetch();
        return true;
      } catch {
        notify("error", "Failed to delete event.");
        return false;
      }
    },
    [refetch, notify]
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
      toast,
      notify,
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
      toast,
      notify,
    ]
  );

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return ctx;
};