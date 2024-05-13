import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col h-full">
      <Header />
      <section className="flex h-full items-center justify-center">
        <div>
          <div className="flex gap-5">
            <Link href={`queue`}>
              <Button className="bg-red-500 min-w-max">Start a chat</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
