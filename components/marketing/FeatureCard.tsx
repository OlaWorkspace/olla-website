import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-md transition">
      <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-text mb-3">{title}</h3>
      <p className="text-text-light">{description}</p>
    </div>
  );
}
