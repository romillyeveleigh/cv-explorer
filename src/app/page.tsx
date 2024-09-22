import Image from "next/image";

import MultiSelectForm from "./components/MultiSelectForm";
import PdfExtractor from "./components/PdfExtractor";

import { cn } from "@/lib/utils";
import DotPattern from "@/components/magicui/dot-pattern";
import CvUploader from "./components/CvUploader";
// import CvUploader from "./components/CvUploader";
import CvExplorer from "./components/cv-explorer/CvExplorer";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(1300px_circle_at_center,white,transparent)]"
          )}
        />
        <CvUploader />
        {/* <MultiSelectForm /> */}
        <CvExplorer />
      </div>
    </>
  );
}
