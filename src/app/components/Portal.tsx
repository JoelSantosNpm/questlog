import { cn } from "@/shared/utils/styles";
import { cva, type VariantProps } from "class-variance-authority";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const portalLinkVariants = cva(
  "group absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-10 flex h-[70%] w-[80%] cursor-pointer flex-col items-center justify-center rounded-t-full border transition-all duration-300",
  {
    variants: {
      variant: {
        existing:
          "border-white/5 opacity-0 group-hover/portal:opacity-100 hover:border-amber-500/50",
        new: "border-white/20 opacity-100 hover:border-emerald-500/50",
      },
    },
    defaultVariants: {
      variant: "existing",
    },
  },
);

const portalGlowVariants = cva(
  "pointer-events-none absolute inset-0 z-10 rounded-t-full shadow-[0_0_60px_rgba(0,0,0,0)] transition-all duration-700",
  {
    variants: {
      variant: {
        existing:
          "group-hover:shadow-[inset_0_0_40px_rgba(217,119,6,0.6),0_0_60px_rgba(217,119,6,0.4)]",
        new: "group-hover:shadow-[inset_0_0_40px_rgba(16,185,129,0.4),0_0_60px_rgba(16,185,129,0.2)]",
      },
    },
    defaultVariants: {
      variant: "existing",
    },
  },
);

interface PortalProps extends VariantProps<typeof portalLinkVariants> {
  className?: string;
  campaignName?: string;
  href?: string;
}

export function Portal({
  className = "",
  variant = "existing",
  campaignName = "Campaña",
  href = "/coliseo",
}: PortalProps) {
  return (
    <div
      className={cn(
        "group/portal relative flex-shrink-0",
        className || "h-96 w-64 md:h-[450px] md:w-[300px]",
      )}>
      {/* Contenedor interno que maneja la animación de escala al hacer hover */}
      <div className="h-full w-full overflow-hidden rounded-t-full shadow-lg transition-transform duration-300 ease-in-out group-hover/portal:scale-105">
        <div className="absolute inset-0 z-0 bg-black">
          <div className="absolute inset-0 z-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_100%)]">
            <Image
              src="/portal.png"
              alt="Portal de Questlog"
              fill
              className={cn(
                "object-contain object-center transition-opacity duration-400",
                variant === "new"
                  ? "opacity-50 grayscale"
                  : "opacity-90 group-hover/portal:opacity-0",
              )}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            />
            {variant === "existing" && (
              <Image
                src="/portal_a_natural.png"
                alt="Portal de Questlog Activo"
                fill
                className="object-contain object-center opacity-0 transition-opacity duration-400 group-hover/portal:opacity-90"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              />
            )}
          </div>
          {/* Gradiente sutil para oscurecer bordes */}
          <div className="absolute inset-0 z-20 pointer-events-none bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-transparent via-black/40 to-black/80" />
        </div>

        {/* Link ajustado al contorno de la puerta */}
        <Link
          href={href || "#"}
          className={cn(portalLinkVariants({ variant }))}>
          {/* Contenedor del contenido (Texto) */}
          <div className="relative z-20 flex flex-col items-center gap-2 text-center transition-all duration-300 group-hover:scale-110">
            {variant === "existing" ? (
              <>
                <span className="text-lg font-bold text-amber-500 drop-shadow-md">
                  {campaignName}
                </span>
                <span className="text-xl font-serif tracking-[0.15em] text-amber-100 drop-shadow-[0_2px_5px_rgba(217,119,6,0.8)] animate-pulse group-hover:text-white group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-colors">
                  ENTRAR
                </span>
                <span className="h-px w-0 bg-amber-500 group-hover:w-full transition-all duration-500 shadow-[0_0_10px_#f59e0b]" />
              </>
            ) : (
              <>
                <div className="mb-2 rounded-full bg-white/10 p-3 backdrop-blur-sm transition-colors group-hover:bg-emerald-500/20">
                  <Plus className="h-8 w-8 text-white/70 group-hover:text-emerald-400" />
                </div>
                <span className="text-lg font-serif tracking-widest text-white/70 transition-colors group-hover:text-emerald-300">
                  CREAR
                  <br />
                  CAMPAÑA
                </span>
              </>
            )}
          </div>

          {/* Efecto de resplandor */}
          <div className={cn(portalGlowVariants({ variant }))} />
        </Link>
      </div>
    </div>
  );
}
