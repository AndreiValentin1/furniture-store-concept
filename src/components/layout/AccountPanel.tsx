import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, FileText, LayoutGrid, Pencil } from "lucide-react";
import { toast } from "sonner";

import { Overlay, OverlayContent } from "@/components/ui/overlay";
import { usePlanner } from "@/lib/planner-context";
import { cn } from "@/lib/utils";

export function AccountPanel() {
  const {
    showAccountPanel,
    closeAccountPanel,
    profile,
    saveProfile,
    clearProfile,
    savedProducts,
    savedRooms,
    quoteItems,
  } = usePlanner();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (showAccountPanel) setEditing(false);
  }, [showAccountPanel]);

  const go = (to: "/planner" | "/quote") => {
    closeAccountPanel();
    navigate({ to });
  };

  const summary = [
    `${savedRooms.length} ${savedRooms.length === 1 ? "room" : "rooms"}`,
    `${savedProducts.length} ${savedProducts.length === 1 ? "piece" : "pieces"}`,
    `${quoteItems.length} ${quoteItems.length === 1 ? "quote line" : "quote lines"}`,
  ].join(" · ");

  return (
    <Overlay open={showAccountPanel} onOpenChange={(open) => !open && closeAccountPanel()}>
      <OverlayContent
        id="account-panel"
        variant="center"
        title={profile ? `Planning as ${profile.name}` : "Planning as a guest"}
        description={
          profile
            ? "Your plan is stored on this device and fills in your details when you request a quote or book a visit."
            : "Everything you save is stored on this device. Nothing is sent anywhere."
        }
      >
        <div className="mt-4 rounded-lg border border-walnut/12 bg-parchment/60 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-clay">
            In your planner
          </p>
          <p className="mt-1 text-sm font-medium text-graphite">{summary}</p>
        </div>

        {editing || !profile ? (
          <ProfileForm
            initial={profile}
            onCancel={profile ? () => setEditing(false) : undefined}
            onSubmit={(next) => {
              saveProfile(next);
              setEditing(false);
              toast(
                `Thanks, ${next.name.split(" ")[0]} — your details will fill in automatically.`,
              );
            }}
          />
        ) : (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-walnut/12 p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-graphite">{profile.name}</p>
              {profile.email && (
                <p className="truncate text-xs text-graphite/60">{profile.email}</p>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 rounded-md border border-walnut/15 px-2.5 py-1.5 text-xs font-medium text-graphite transition-colors hover:bg-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
              >
                <Pencil className="h-3 w-3" /> Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  clearProfile();
                  toast("Back to planning as a guest.");
                }}
                className="rounded-md px-2.5 py-1.5 text-xs font-medium text-graphite/60 transition-colors hover:text-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => go("/planner")}
            className="flex items-center justify-between rounded-md border border-walnut/15 bg-parchment px-4 py-2.5 text-sm font-medium text-graphite transition-colors hover:bg-limestone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
          >
            <span className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" /> Open planner
            </span>
            <ArrowRight className="h-4 w-4 opacity-60" />
          </button>
          <button
            type="button"
            onClick={() => go("/quote")}
            className="flex items-center justify-between rounded-md border border-walnut/15 bg-parchment px-4 py-2.5 text-sm font-medium text-graphite transition-colors hover:bg-limestone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
          >
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> View quote list
            </span>
            <ArrowRight className="h-4 w-4 opacity-60" />
          </button>
        </div>

        <p className="mt-4 text-xs text-graphite/50">
          This is a design concept — there are no accounts to sign in to, and syncing across devices
          is out of scope.
        </p>
      </OverlayContent>
    </Overlay>
  );
}

export function ProfileForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save details",
}: {
  initial?: { name: string; email?: string } | null;
  onSubmit: (profile: { name: string; email?: string }) => void;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [error, setError] = useState<string>();

  return (
    <form
      className="mt-3 rounded-lg border border-walnut/12 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) {
          setError("Please add a name");
          return;
        }
        setError(undefined);
        onSubmit({ name: name.trim(), email: email.trim() || undefined });
      }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-clay">
        Add your details
      </p>
      <p className="mt-1 text-xs text-graphite/60">
        Used to personalise your planner and prefill quote and visit forms.
      </p>
      <div className="mt-3 space-y-2">
        <label className="block text-xs">
          <span className="text-graphite/60">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className={cn(
              "mt-1 w-full rounded-md border bg-parchment px-3 py-2 text-sm text-graphite outline-none transition-colors focus:border-walnut",
              error ? "border-rust" : "border-walnut/15",
            )}
          />
          {error && (
            <span className="mt-1 block animate-content-in text-[10px] text-rust">{error}</span>
          )}
        </label>
        <label className="block text-xs">
          <span className="text-graphite/60">Email (optional)</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="mt-1 w-full rounded-md border border-walnut/15 bg-parchment px-3 py-2 text-sm text-graphite outline-none transition-colors focus:border-walnut"
          />
        </label>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded-md bg-walnut px-3 py-2 text-xs font-medium text-ivory transition-colors hover:bg-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-walnut/15 px-3 py-2 text-xs font-medium text-graphite transition-colors hover:bg-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
