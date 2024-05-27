import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import React from "react";

export default function Page(): JSX.Element {
  return (
    <section className="container mt-24 flex h-full flex-col items-center">
      <h2 className="text-slate-6 w-full text-center text-[3rem] leading-10">How was your experience practicing english?</h2>
      <div className="mb-6 mt-2 w-full text-center text-slate-400">Share with us any feedback, problems, issues, ideas, or feature request.</div>
      <div className="flex w-1/2 flex-col items-end gap-4">
        <Textarea placeholder="Write here your feedback." />
        <div className="flex gap-4">
          <Link href="/room/queue">
            <Button variant="secondary">Not now, go back to practicing</Button>
          </Link>
          <Button>Send</Button>
        </div>
      </div>
    </section>
  );
}
