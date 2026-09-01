import { toast } from "sonner";

import { Overlay, OverlayContent } from "@/components/ui/overlay";
import { ProfileForm } from "@/components/layout/AccountPanel";
import { usePlanner } from "@/lib/planner-context";

export function AccountPrompt() {
  const { showAccountPrompt, dismissAccountPrompt, saveProfile } = usePlanner();

  return (
    <Overlay open={showAccountPrompt} onOpenChange={(open) => !open && dismissAccountPrompt()}>
      <OverlayContent
        variant="center"
        title="Saved to your planner"
        description="Your rooms, pieces and quote list are kept on this device. Add your name if you'd like the planner personalised and your quote and visit forms filled in for you."
      >
        <ProfileForm
          onSubmit={(profile) => {
            saveProfile(profile);
            toast(
              `Thanks, ${profile.name.split(" ")[0]} — your details will fill in automatically.`,
            );
          }}
          submitLabel="Add details"
        />
        <button
          type="button"
          onClick={dismissAccountPrompt}
          className="mt-3 w-full text-sm font-medium text-graphite/60 underline underline-offset-4 transition-colors hover:text-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
        >
          Continue as a guest
        </button>
      </OverlayContent>
    </Overlay>
  );
}
