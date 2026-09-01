import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export interface QuoteItem {
  productSlug: string;
  finishId?: string;
  quantity: number;
  roomAssociation?: string;
  notes?: string;
}

export interface GuestProfile {
  name: string;
  email?: string;
}

interface PlannerState {
  savedProducts: string[];
  savedRooms: string[];
  quoteItems: QuoteItem[];
  profile: GuestProfile | null;
  toggleProduct: (slug: string) => void;
  toggleRoom: (slug: string) => void;
  addToQuote: (item: QuoteItem) => void;
  addManyToQuote: (items: QuoteItem[]) => void;
  removeFromQuote: (slug: string) => void;
  updateQuote: (slug: string, patch: Partial<QuoteItem>) => void;
  saveProfile: (profile: GuestProfile) => void;
  clearProfile: () => void;
  showAccountPrompt: boolean;
  dismissAccountPrompt: () => void;
  showAccountPanel: boolean;
  openAccountPanel: () => void;
  closeAccountPanel: () => void;
}

const PlannerContext = createContext<PlannerState | null>(null);

const KEY = "brand-planner-v2";
const LEGACY_KEY = "brand-planner-v1";

const seedQuoteItems: QuoteItem[] = [
  {
    productSlug: "atelier-oak-dining-table",
    finishId: "oak",
    quantity: 1,
    roomAssociation: "Long Table Dining",
    notes: "Confirm extended length.",
  },
  {
    productSlug: "solace-lounge-chair",
    finishId: "boucle",
    quantity: 2,
    roomAssociation: "Warm Neutral Living",
  },
  {
    productSlug: "column-floor-lamp",
    finishId: "brass",
    quantity: 1,
    roomAssociation: "Warm Neutral Living",
  },
];

interface StoredState {
  savedProducts?: string[];
  savedRooms?: string[];
  quoteItems?: QuoteItem[];
  profile?: GuestProfile | null;
  dismissed?: boolean;
}

function readStored(): StoredState | null {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    return raw ? (JSON.parse(raw) as StoredState) : null;
  } catch {
    // localStorage unavailable (private mode, blocked storage)
    return null;
  }
}

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [savedProducts, setSavedProducts] = useState<string[]>([]);
  const [savedRooms, setSavedRooms] = useState<string[]>([]);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>(seedQuoteItems);
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showAccountPanel, setShowAccountPanel] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Read after mount so the server and first client render agree.
  useEffect(() => {
    const stored = readStored();
    if (stored) {
      if (stored.savedProducts) setSavedProducts(stored.savedProducts);
      if (stored.savedRooms) setSavedRooms(stored.savedRooms);
      if (stored.quoteItems) setQuoteItems(stored.quoteItems);
      if (stored.profile) setProfile(stored.profile);
      if (stored.dismissed) setDismissed(true);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ savedProducts, savedRooms, quoteItems, profile, dismissed }),
      );
      localStorage.removeItem(LEGACY_KEY);
    } catch {
      // localStorage unavailable — the plan simply won't persist
    }
  }, [savedProducts, savedRooms, quoteItems, profile, dismissed, hydrated]);

  const triggerPrompt = useCallback(() => {
    setDismissed((wasDismissed) => {
      if (!wasDismissed) setShowAccountPrompt(true);
      return wasDismissed;
    });
  }, []);

  const toggleProduct = useCallback(
    (slug: string) => {
      setSavedProducts((prev) => {
        const has = prev.includes(slug);
        if (!has) triggerPrompt();
        return has ? prev.filter((s) => s !== slug) : [...prev, slug];
      });
    },
    [triggerPrompt],
  );

  const toggleRoom = useCallback(
    (slug: string) => {
      setSavedRooms((prev) => {
        const has = prev.includes(slug);
        if (!has) triggerPrompt();
        return has ? prev.filter((s) => s !== slug) : [...prev, slug];
      });
    },
    [triggerPrompt],
  );

  const addToQuote = useCallback(
    (item: QuoteItem) => {
      setQuoteItems((prev) => {
        if (!prev.some((i) => i.productSlug === item.productSlug)) triggerPrompt();
        return mergeItems(prev, [item]);
      });
    },
    [triggerPrompt],
  );

  const addManyToQuote = useCallback(
    (items: QuoteItem[]) => {
      setQuoteItems((prev) => {
        if (items.some((item) => !prev.some((i) => i.productSlug === item.productSlug))) {
          triggerPrompt();
        }
        return mergeItems(prev, items);
      });
    },
    [triggerPrompt],
  );

  const removeFromQuote = useCallback(
    (slug: string) => setQuoteItems((prev) => prev.filter((i) => i.productSlug !== slug)),
    [],
  );

  const updateQuote = useCallback(
    (slug: string, patch: Partial<QuoteItem>) =>
      setQuoteItems((prev) => prev.map((i) => (i.productSlug === slug ? { ...i, ...patch } : i))),
    [],
  );

  const saveProfile = useCallback((next: GuestProfile) => {
    setProfile(next);
    setShowAccountPrompt(false);
    setDismissed(true);
  }, []);

  const clearProfile = useCallback(() => setProfile(null), []);

  const dismissAccountPrompt = useCallback(() => {
    setShowAccountPrompt(false);
    setDismissed(true);
  }, []);

  const openAccountPanel = useCallback(() => {
    setShowAccountPanel(true);
    setShowAccountPrompt(false);
  }, []);

  const closeAccountPanel = useCallback(() => setShowAccountPanel(false), []);

  return (
    <PlannerContext.Provider
      value={{
        savedProducts,
        savedRooms,
        quoteItems,
        profile,
        toggleProduct,
        toggleRoom,
        addToQuote,
        addManyToQuote,
        removeFromQuote,
        updateQuote,
        saveProfile,
        clearProfile,
        showAccountPrompt: showAccountPrompt && !showAccountPanel,
        dismissAccountPrompt,
        showAccountPanel,
        openAccountPanel,
        closeAccountPanel,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

function mergeItems(prev: QuoteItem[], incoming: QuoteItem[]) {
  const next = [...prev];
  for (const item of incoming) {
    const idx = next.findIndex((i) => i.productSlug === item.productSlug);
    if (idx === -1) next.push(item);
    else next[idx] = { ...next[idx], ...item, quantity: next[idx].quantity + item.quantity };
  }
  return next;
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("usePlanner must be inside PlannerProvider");
  return ctx;
}
