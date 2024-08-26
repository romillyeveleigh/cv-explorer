import Image from "next/image";

import MultiSelectForm from "./components/MultiSelectForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MultiSelectForm />
    </main>
  );
}
