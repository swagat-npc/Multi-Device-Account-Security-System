"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
   const router = useRouter();

  function handleLogout() {
    fetch("http://localhost:3001/auth/logout", {
      method: "POST",
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        router.push("/");
      } else {
        alert("Logout failed");
      }
    });
  }

  return (
    <header className="w-full bg-gray-800 text-white flex items-center justify-center p-6">
      <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
        <div className="flex gap-6 text-center">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <Image
            src="/NestJS.svg"
            alt="NestJS logo"
            width={50}
            height={20}
            priority
          />
        </div>
        Next.JS + NestJS Project
      </div>
      <div className="absolute right-0 top-0 m-4 flex gap-4">
        <Link href="/login">
          <button className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded">Login</button>
        </Link>
        <button className="bg-red-500 hover:bg-red-700 cursor-pointer text-white font-bold py-2 px-4 rounded" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
