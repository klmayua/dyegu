import React from "react";

interface PhoenixMarkProps {
  className?: string;
  size?: number;
  decorative?: boolean;
}

/**
 * Canonical flat 2D DYEGU Phoenix vector mark (#C5A059, zero gradients or drop shadows).
 * Wrapped as a standalone semantic component for clean final vector master swap.
 */
export function PhoenixMark({
  className = "",
  size = 24,
  decorative = true,
}: PhoenixMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="465 385 1117 1278"
      width={size}
      height={Math.round(size * (1278 / 1117))}
      className={`inline-block shrink-0 ${className}`}
      aria-hidden={decorative ? "true" : undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "DYEGU Phoenix"}
    >
      <path
        fill="#C5A059"
        fillRule="evenodd"
        d="M1133,654 L1105,654 L1077,669 L1062,663 L1043,665 L970,713 L917,731 L946,743 L976,750 L943,871 L994,952 L1024,1007 L1052,954 L1104,870 L1078,788 L1076,759 L1082,736 L1105,699 L1130,674 L1150,663Z M485,405 L506,562 L521,604 L541,631 L716,825 L706,820 L486,651 L548,797 L557,810 L578,828 L793,958 L580,883 L680,1001 L823,1050 L866,1070 L898,1091 L925,1115 L947,1142 L963,1169 L887,1450 L937,1520 L985,1292 L970,1567 L1024,1643 L1078,1566 L1063,1294 L1111,1520 L1160,1451 L1085,1168 L1101,1141 L1119,1119 L1141,1098 L1173,1075 L1225,1050 L1370,1000 L1468,883 L1256,957 L1481,819 L1498,799 L1562,650 L1356,809 L1330,826 L1510,627 L1526,605 L1536,584 L1542,561 L1562,406 L1152,863 L1085,962 L1059,1009 L1024,1084 L966,968 L926,905 L895,863Z"
      />
    </svg>
  );
}

interface BrandLockupProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Primary DYEGU header/wordmark lockup:
 * Wide-tracked serif `D Y E G U` (0.18em) with the Phoenix mark replacing the `Y`,
 * preserving vertical overshoot (~17% above cap height, ~14% below baseline).
 */
export function BrandLockup({ size = "md", className = "" }: BrandLockupProps) {
  const cfg = {
    sm: { text: "text-[17px]", phoenix: 21, shift: "-mt-[0.03em]" },
    md: { text: "text-[22px]", phoenix: 28, shift: "-mt-[0.03em]" },
    lg: { text: "text-[34px]", phoenix: 43, shift: "-mt-[0.03em]" },
  }[size];

  return (
    <span
      className={`inline-flex items-baseline font-display font-medium leading-none tracking-[0.18em] text-[#C5A059] select-none ${cfg.text} ${className}`}
      aria-label="DYEGU"
    >
      <span className="leading-none">D</span>
      <span
        className={`relative inline-flex items-center justify-center mx-[0.04em] self-center ${cfg.shift}`}
        style={{
          transform: "translateY(-0.02em)",
        }}
        aria-hidden="true"
      >
        <PhoenixMark size={cfg.phoenix} />
      </span>
      <span className="leading-none">EGU</span>
    </span>
  );
}

/**
 * Minimal Phoenix section divider obeying Brand Bible v1.1 (#444444 hairlines + flat gold phoenix).
 */
export function PhoenixDivider({ label }: { label?: string }) {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-2">
      <div className="flex items-center gap-5">
        <span className="h-px flex-1 bg-[#444444]" aria-hidden="true" />
        <span className="inline-flex items-center gap-3">
          <PhoenixMark size={16} />
          {label ? (
            <span className="label-track text-[#8E8E8A]">{label}</span>
          ) : null}
        </span>
        <span className="h-px flex-1 bg-[#444444]" aria-hidden="true" />
      </div>
    </div>
  );
}
