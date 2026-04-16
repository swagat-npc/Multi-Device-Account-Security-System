import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
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
        <div className="flex flex-col gap-4 text-base font-medium">
          Welcome!
        </div>
      </main>
    </div>
  );
}
