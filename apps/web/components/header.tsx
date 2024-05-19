import { Github } from "lucide-react";
import Link from "next/link";
import React from "react";

export const Header = () => {
  return (
    <nav className="flex p-5 justify-between z-10">
      <Link href="/">
        <h1 className="text-base font-semibold text-purple-200">
          BolhaDev.Chat
        </h1>
      </Link>
      <Link href="https://github.com/brunocroh/bolhadev.chat">
        <h2 className="hover:bg-white hover:text-black p-1 rounded-lg">
          <Github color="currentColor" />
        </h2>
      </Link>
    </nav>
  );
};
