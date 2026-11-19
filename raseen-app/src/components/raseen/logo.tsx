import { cn } from "@/lib/utils";
import logoAsset from "@/assets/raseen-logo.png.asset.json";
import logoLightAsset from "@/assets/raseen-logo-light.png.asset.json";
import markAsset from "@/assets/raseen-mark.png.asset.json";
import markLightAsset from "@/assets/raseen-mark-light.png.asset.json";

export const raseenLogoUrl = logoAsset.url;

export function RaseenMark({
  className,
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("grid size-9 shrink-0 place-items-center p-1", className)}
    >
      <img
        src={invert ? markLightAsset.url : markAsset.url}
        alt=""
        className="h-full w-full object-contain"
      />
    </span>
  );
}

export function RaseenLogo({
  className,
  invert = false,
}: {
  className?: string;
  /** kept for API compatibility; the logo carries the brand name itself */
  showTagline?: boolean;
  invert?: boolean;
}) {
  return (
    <div className={cn("flex min-w-0 items-center px-1 py-1.5", className)}>
      <img
        src={invert ? "/brand/raseen-logo-white.png" : "/brand/raseen-logo-navy.png"}
        alt="رسين Raseen"
        className="h-9 w-auto max-w-full object-contain object-right"
      />
    </div>
  );
}
