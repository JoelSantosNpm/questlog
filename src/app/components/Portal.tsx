import { LinkVariants, PortalLink } from "@/app/components/PortalLink";
import { cn } from "@/shared/utils/styles";
import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";

const portalVariants = cva(
  "group relative flex-shrink-0 transition-transform duration-500 hover:scale-105",
  {
    variants: {
      size: {
        sm: "h-64 w-44 md:h-80 md:w-56",
        default: "h-96 w-64 md:h-[450px] md:w-[300px]",
        lg: "h-[500px] w-[350px] md:h-[600px] md:w-[420px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

interface PortalProps
  extends VariantProps<typeof portalVariants>, LinkVariants {
  campaignName?: string;
  href?: string;
  className?: string; // Permitir inyección de estilos
}

export function Portal({
  mode = "existing",
  campaignName,
  href,
  size,
  className,
}: PortalProps) {
  return (
    <div className={cn(portalVariants({ size }), className)}>
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
                ? "opacity-30 grayscale "
                : "opacity-80 group-hover:opacity-0",
            )}
          />

          {/* Imagen ON: Se enciende en hover */}
          <Image
            src="/portal_a_natural.png"
            alt="Activo"
            fill
            className="absolute inset-0 object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        </div>
      </div>

      {/* LINK Y CONTENIDO */}
      <PortalLink
        href={href || "#"}
        mode={mode}
        campaignName={campaignName || ""}
      />
    </div>
  );
}
