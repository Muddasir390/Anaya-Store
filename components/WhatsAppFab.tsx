"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { whatsappLink } from "@/lib/format";

export default function WhatsAppFab({ number }: { number: string }) {
  return (
    <motion.a
      href={whatsappLink(number, "Hello Anaya! I'd like some help choosing an abaya.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 16 }}
      whileHover={{ scale: 1.08 }}
      className="fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#1fa855] text-white shadow-[0_10px_30px_-8px_rgba(31,168,85,0.7)]"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#1fa855] opacity-25" />
      <MessageCircle className="relative h-6 w-6" />
    </motion.a>
  );
}
