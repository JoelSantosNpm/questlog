import { cn } from "@/shared/utils/styles";
import { cva, type VariantProps } from "class-variance-authority";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

// Definición de estilos con CVA
const linkVariants = cva(
  "absolute inset-0 z-30 flex h-full w-full flex-col items-center justify-center transition-all duration-700",
  {
    variants: {
      mode: {
        existing: ["border-transparent bg-black/0"],
        new: ["border-transparent bg-white/5"],
      },
    },
    defaultVariants: {
      mode: "existing",
    },
  },
);

export type LinkVariants = VariantProps<typeof linkVariants>;

// Tipos para las props del componente
interface PortalLinkProps extends LinkVariants {
  href: string;
  campaignName?: string;
  className?: string;
}

export const PortalLink: React.FC<PortalLinkProps> = ({
  mode,
  href,
  campaignName,
  className,
}) => {
  return (
    <Link href={href} className={cn(linkVariants({ mode }), className)}>
      <div className="relative z-40 flex flex-col items-center gap-3 px-4 text-center">
        {mode === "existing" ? (
          <>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-amber-500/80">
              Campaña
            </span>
            <span className="text-2xl font-serif text-amber-100 drop-shadow-lg">
              {campaignName}
            </span>
            <div className="mt-4 flex translate-y-2 items-center gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="h-px w-8 bg-amber-500/50" />
              <span className="text-xs tracking-widest text-amber-400">
                ENTRAR
              </span>
              <span className="h-px w-8 bg-amber-500/50" />
            </div>
          </>
        ) : (
          <>
            <div className="rounded-full border border-white/20 p-4 transition-colors group-hover:border-emerald-300/50 group-hover:bg-emerald-900/40">
              <Plus className="h-8 w-8 text-emerald-100/50 group-hover:text-emerald-300" />
            </div>
            <span className="mt-2 text-sm font-serif tracking-widest text-white/60 group-hover:text-emerald-200">
              NUEVA AVENTURA
            </span>
          </>
        )}
      </div>
    </Link>
  );
};
