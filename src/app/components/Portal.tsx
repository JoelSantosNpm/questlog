import Image from "next/image";
import Link from "next/link";

export function Portal() {
  return (
    <div className="relative h-[450px] w-[300px] flex-shrink-0 overflow-hidden rounded-t-full shadow-lg transition-transform hover:scale-105">
      <div className="absolute inset-0 z-0">
        <Image
          src="/portal.png"
          alt="Portal de Questlog"
          fill
          className="object-contain object-center opacity-90"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        />
        {/* Gradiente sutil para oscurecer bordes */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-transparent via-black/40 to-black/80" />
      </div>

      {/* Link ajustado al contorno de la puerta - reducido un 20% aprox respecto a la imagen */}
      <Link
        href="/coliseo"
        // className define el TAMAÑO y POSICIÓN de todo el conjunto (borde, luz, click) - 45% del contenedor
        className="group absolute left-[50%] top-[53%] -translate-x-1/2 -translate-y-1/2 z-10 flex h-[60%] w-[65%] cursor-pointer flex-col items-center justify-center rounded-t-full border border-white/10 transition-colors hover:border-amber-500/50">
        {/* Contenedor del contenido (Texto) - llena todo el Link */}
        <div className="relative z-20 flex flex-col items-center gap-2 text-center transition-all duration-300 group-hover:scale-110">
          <span className="text-xl font-serif tracking-[0.15em] text-amber-100 drop-shadow-[0_2px_5px_rgba(217,119,6,0.8)] animate-pulse group-hover:text-white group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-colors">
            ENTRAR
          </span>
          <span className="h-px w-0 bg-amber-500 group-hover:w-full transition-all duration-500 shadow-[0_0_10px_#f59e0b]" />
        </div>

        {/* Efecto de resplandor al hacer hover, limitado a la forma de la puerta (inset-0) */}
        <div className="pointer-events-none absolute inset-0 z-10 rounded-t-full shadow-[0_0_60px_rgba(217,119,6,0)] transition-all duration-700 group-hover:shadow-[inset_0_0_40px_rgba(217,119,6,0.6),0_0_60px_rgba(217,119,6,0.4)]" />
      </Link>
    </div>
  );
}
