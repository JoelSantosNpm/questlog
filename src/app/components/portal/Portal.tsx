import { cn } from "@/shared/utils/styles";
import { cva, type VariantProps } from "class-variance-authority";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const portalVariants = cva(
  "group relative flex-shrink-0 transition-transform duration-500 hover:scale-105",
  {
    variants: {
      size: {
        sm: "h-32 w-22 md:h-40 md:w-28",
        default: "h-64 w-44 md:h-80 md:w-56",
        lg: "h-96 w-64 md:h-[450px] md:w-[300px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

interface PortalProps extends VariantProps<typeof portalVariants> {
  variant?: "existing" | "new";
  campaignName?: string;
  href?: string;
  className?: string;
  isBright?: boolean;
}

export function Portal({
  variant = "existing",
  campaignName,
  href = "#",
  size,
  className,
  isBright = false,
}: PortalProps) {
  const isExisting = variant === "existing";

  return (
    <div className={cn(portalVariants({ size }), className)}>
      {/* CAPA DE IMÁGENES */}
      <div className="absolute inset-0 overflow-hidden bg-transparent">
        <div className="relative h-full w-full mask-[radial-gradient(ellipse_at_center,black_50%,transparent_70%)]">
          {/* Imagen OFF: Se apaga en hover si es existing */}
          <Image
            src="/portal.png"
            alt="Base"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={cn(
              "object-cover transition-opacity duration-700",
              !isExisting
                ? "opacity-50 grayscale "
                : isBright
                  ? "opacity-80 group-hover:opacity-0"
                  : "opacity-40 group-hover:opacity-0",
            )}
          />

          {/* Imagen ON: Se enciende en hover */}
          <Image
            src="/portal_a_natural.png"
            alt="Activo"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="absolute inset-0 object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        </div>
      </div>

      {/* LINK Y CONTENIDO */}
      <Link
        href={href}
        className="absolute inset-0 z-30 flex h-full w-full flex-col items-center justify-center border-transparent bg-black/0 transition-all duration-700">
        <div className="relative z-40 flex flex-col items-center gap-3 px-4 text-center">
          {isExisting ? (
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
    </div>
  );
}
