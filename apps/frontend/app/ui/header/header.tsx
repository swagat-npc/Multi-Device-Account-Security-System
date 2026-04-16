import Image from "next/image";

export default function Header() {
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
    </header>
  );
}
