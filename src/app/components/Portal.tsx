import { cn } from "@/shared/utils/styles";
import { cva, type VariantProps } from "class-variance-authority";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/**
 * CVA UNIFICADO: Toda la lógica de hover ocurre vía selectores de CSS
 */
const portalVariants = cva(
  // Clases Base: El "group" en el padre es la clave
  "group relative h-96 w-64 md:h-[450px] md:w-[300px] flex-shrink-0 transition-transform duration-500 hover:scale-105",
  {
    variants: {
      mode: {
        existing: "",
        new: "",
      },
    },
    defaultVariants: {
      mode: "existing",
    },
  },
);

// Estilo del Enlace/Contenedor Interno
const linkVariants = cva(
  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex h-[75%] w-[85%] flex-col items-center justify-center rounded-t-full border transition-all duration-700",
  {
    variants: {
      mode: {
        existing: [
          "border-transparent bg-black/0",
          "group-hover:border-amber-500/40 group-hover:bg-amber-900/10",
          "group-hover:shadow-[inset_0_0_40px_rgba(217,119,6,0.3),0_0_60px_rgba(217,119,6,0.2)]",
        ],
        new: [
          "border-white/10 bg-white/5",
          "group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10",
          "group-hover:shadow-[inset_0_0_40px_rgba(16,185,129,0.2)]",
        ],
      },
    },
    defaultVariants: { mode: "existing" },
  },
);

export function Portal({
  mode = "existing",
  campaignName,
  href,
}: VariantProps<typeof portalVariants> & {
  campaignName?: string;
  href?: string;
}) {
  return (
    <div className={portalVariants({ mode })}>
      {/* CAPA DE IMÁGENES */}
      <div className="absolute inset-0 overflow-hidden bg-black">
        <div className="relative h-full w-full [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]">
          {/* Imagen OFF: Se apaga en hover si es existing */}
          <Image
            src="/portal.png"
            alt="Base"
            fill
            className={cn(
              "object-cover transition-opacity duration-700",
              mode === "new"
                ? "opacity-30 grayscale"
                : "opacity-80 group-hover:opacity-0",
            )}
          />

          {/* Imagen ON: Se enciende en hover */}
          {mode === "existing" && (
            <Image
              src="/portal_a_natural.png"
              alt="Activo"
              fill
              className="absolute inset-0 object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
        </div>
      </div>

      {/* LINK Y CONTENIDO */}
      <Link href={href || "#"} className={linkVariants({ mode })}>
        <div className="relative z-40 flex flex-col items-center gap-3 text-center px-4">
          {mode === "existing" ? (
            <>
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-amber-500/80">
                Campaña
              </span>
              <span className="text-2xl font-serif text-amber-100 drop-shadow-lg">
                {campaignName}
              </span>
              {/* Texto ENTRAR animado con CSS puro */}
              <div className="mt-4 flex items-center gap-2 opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                <span className="h-px w-8 bg-amber-500/50" />
                <span className="text-xs tracking-widest text-amber-400">
                  ENTRAR
                </span>
                <span className="h-px w-8 bg-amber-500/50" />
              </div>
            </>
          ) : (
            <>
              <div className="rounded-full border border-white/20 p-4 transition-colors group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10">
                <Plus className="h-8 w-8 text-emerald-100/50 group-hover:text-emerald-400" />
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
