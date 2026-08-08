import { ChildCard, type ChildCardData } from "@/components/children/child-card";
import { EmptyChildren } from "@/components/children/empty-children";

interface ChildrenGridProps {
  children: ChildCardData[];
}

export function ChildrenGrid({ children }: ChildrenGridProps) {
  if (children.length === 0) {
    return <EmptyChildren />;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {children.map((child) => (
        <ChildCard key={child.id} child={child} />
      ))}
    </div>
  );
}