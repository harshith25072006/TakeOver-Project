import Link from "next/link";

export function FloorBanner({
  floorNumber,
}: {
  floorNumber: number;
  totalFloors: number;
  currentFloorIndex: number;
}) {
  const activeFloorNumStr = floorNumber < 0
    ? `B${Math.abs(floorNumber)}`
    : String(floorNumber).padStart(2, "0");

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 md:left-64 bg-background flex items-end justify-between px-6 sm:px-8 lg:px-12 pb-0 z-20 select-none overflow-hidden"
      style={{ height: "var(--banner-height)" }}
    >
      {/* Left side: Back Button */}
      <div className="pb-6 sm:pb-8 lg:pb-10 z-20">
        <Link 
          href="/dashboard" 
          className="text-xs font-mono uppercase tracking-widest text-[#2c3040] hover:opacity-70 transition-opacity"
        >
          — Back
        </Link>
      </div>

      {/* Center: Giant Semicircle Dial */}
      <div 
        className="absolute inset-x-0 flex justify-center items-end h-full pointer-events-none z-0"
        style={{ bottom: "var(--semicircle-bottom)" }}
      >
        <div 
          className="relative bg-[#2563eb] rounded-t-full border-[#2c3040] overflow-visible"
          style={{
            width: "var(--semicircle-width)",
            height: "var(--semicircle-height)",
            borderWidth: "var(--semicircle-border)",
          }}
        />
      </div>

      {/* Right side: Giant Outlined Floor Number */}
      <div 
        className="absolute right-6 sm:right-8 lg:right-12 bottom-0 font-bold leading-none tracking-tighter text-transparent select-none z-10 pointer-events-none"
        style={{ 
          WebkitTextStroke: "2.5px #2c3040",
          fontSize: "var(--floor-text-size)"
        }}
      >
        {activeFloorNumStr}
      </div>
    </div>
  );
}
