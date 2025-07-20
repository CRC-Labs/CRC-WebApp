import React from "react"

import Link from "next/link"

import Footer from "@/features/common/components/Footer"
import { LogoWithSlogan } from "@/features/common/utils/logos"

export default function Contact() {
  return (
    <section className="flex h-full min-h-screen flex-col items-center bg-stone-300 pt-8 dark:bg-stone-900">
      <header className="mx-auto mb-8 flex max-h-[100px] max-w-[300px] items-center justify-center">
        <Link href="/">
          <LogoWithSlogan />
        </Link>
      </header>
      <main className="flex w-full flex-col items-center">
        <section className="flex flex-col items-center bg-stone-300 px-6 pb-8 dark:bg-stone-900 sm:max-w-[85vw] sm:px-20">
          <div className="px-6 text-justify text-base text-gray-500 dark:text-gray-400">
            <hr className="border-zinc-200 dark:border-zinc-800" />
            <div className="py-2">
              You can contact me by mail:{" "}
              <a
                className="flex cursor-pointer items-center gap-4 pt-4 transition duration-500 ease-in-out hover:-translate-y-1 hover:text-[#c0ab38]"
                href="mailto:jeremy@chess-repertoire-companion.com"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="w-full">
                  Jeremy@chess-repertoire-companion.com
                </span>
              </a>
            </div>
            <div className="flex items-center py-2 text-sm font-semibold">
              <p className="pr-2">You can also </p>
              <a
                href="https://discord.gg/38eY9bYcPH"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center text-indigo-700 hover:underline dark:text-indigo-400">
                  <div>Join the Discord</div>
                  <div className="ml-1 text-indigo-500">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </section>
  )
}
