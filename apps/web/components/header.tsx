import Link from "next/link";
import React from "react";

export const Header = () => {
  return (
    <section className="flex p-5 justify-between">
      <Link href="/">
        <h1>Header</h1>
      </Link>
      <h2>Github</h2>
    </section>
  );
};
