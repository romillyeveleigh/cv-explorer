import { cn } from "@/lib/utils";
import DotPattern from "@/components/magicui/dot-pattern";
import CvExplorer from "./components/cv-explorer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(1300px_circle_at_center,white,transparent)]"
        )}
      />
      <CvExplorer />
    </div>
  );
}
