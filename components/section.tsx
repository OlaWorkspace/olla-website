import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export default function Section({ children, className = "" }: SectionProps) {
  return (
    <section
      className={`max-w-6xl mx-auto px-4 py-20 ${className}`}
    >
      {children}
    </section>
  );
}
