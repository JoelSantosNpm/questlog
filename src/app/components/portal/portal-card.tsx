"use client";
import { motion } from "framer-motion";
import { Portal } from "./portal";

interface PortalCardProps {
  index: number;
  activeIndex: number;
  campaign: {
    id: number;
    name: string;
    variant: "existing" | "new";
  };
  onClick?: () => void;
}

export const PortalCard = ({
  index,
  activeIndex,
  campaign,
  onClick,
}: PortalCardProps) => {
  const offset = index - activeIndex;
  const isActive = offset === 0;

  return (
    <motion.div
      initial={false}
      animate={{
        x: offset * 380, // Reduced spacing for tighter cluster
        y: Math.abs(offset) * 50, // Arch effect: side cards move up
        scale: isActive ? 1.15 : 0.85,
        rotateY: offset * -30, // Inward rotation -25
        z: Math.abs(offset) * -100, // Depth pushback -100
        opacity: Math.abs(offset) >= 3 ? 0 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 160,
        damping: 20,
      }}
      style={{
        zIndex: isActive ? 50 : 50 - Math.abs(offset),
        transformStyle: "preserve-3d",
      }}
      className="absolute cursor-pointer perspective-origin-center h-[500px] flex items-center justify-center"
      onClick={onClick}>
      <Portal
        variant={campaign.variant}
        size={"lg"}
        campaignName={campaign.name}
      />
    </motion.div>
  );
};
