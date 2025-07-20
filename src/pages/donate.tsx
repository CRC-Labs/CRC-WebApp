import React from "react"

import Link from "next/link"

import Footer from "@/features/common/components/Footer"
import { Icon } from "@/features/common/utils/icons"
import { LogoWithSlogan } from "@/features/common/utils/logos"

export default function Donate() {
  return (
    <section className="flex h-full min-h-screen flex-col items-center bg-stone-300 pt-8 dark:bg-stone-900">
      <header className="mx-auto mb-8 flex max-h-[100px] max-w-[300px] items-center justify-center">
        <Link href="/">
          <LogoWithSlogan />
        </Link>
      </header>
      <main className="flex w-full flex-col items-center">
        <section className="flex flex-col items-center gap-6 bg-stone-300 px-6 pb-8 dark:bg-stone-900 sm:max-w-[85vw] sm:px-20">
          {/* Main Heading */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">
              Support Chess Repertoire Companion
            </h2>
            <p className="text-base text-gray-500 dark:text-gray-400">
              Help us keep CRC free, ad-free, and accessible to everyone
            </p>
          </div>

          {/* Mission Statement */}
          <div className="w-full max-w-2xl">
            <hr className="border-zinc-200 mb-4 dark:border-zinc-800" />
            <div className="text-center space-y-3 text-base text-gray-500 dark:text-gray-400">
              <p>
                <strong className="text-gray-600 dark:text-gray-300">
                  CRC is completely free
                </strong>{" "}
                because we believe everyone should have access to quality chess
                tools.
              </p>
              <p>
                However, hosting and development costs are real, and we rely
                entirely on community support to keep CRC running.
              </p>
            </div>
          </div>

          {/* Where Money Goes */}
          <div className="w-full max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4 text-center">
              Where Your Support Goes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-500 dark:text-gray-400 justify-items-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                <span>Server hosting and maintenance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                <span>Database infrastructure</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                <span>Development tools and services</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></span>
                <span>Security and backup systems</span>
              </div>
            </div>
          </div>

          {/* Support Options */}
          <div className="w-full max-w-md">
            <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-4 font-medium">
              Choose how you'd like to support CRC
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* One-time Donation */}
              <div className="flex flex-col items-center flex-1 w-full">
                <Link
                  href="https://www.paypal.com/donate/?business=PKDM3XC95D3S4&no_recurring=0&item_name=I%27m+the+creator+of+Chess+Repertoire+Companion+and+I+need+your+help+to+support+the+hosting+and+development+costs.&currency_code=EUR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:bg-blue-500 hover:shadow-xl focus:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <Icon className="h-5 w-5" name="Donate" />
                  <span>One-time Donation</span>
                </Link>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  PayPal • Any amount
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center">
                <span className="hidden sm:block h-8 w-px bg-gray-300 dark:bg-gray-600" />
                <span className="sm:hidden w-16 h-px bg-gray-300 dark:bg-gray-600" />
                <span className="px-3 text-sm font-medium text-gray-500 bg-stone-300 dark:bg-stone-900 dark:text-gray-400">
                  OR
                </span>
                <span className="hidden sm:block h-8 w-px bg-gray-300 dark:bg-gray-600" />
                <span className="sm:hidden w-16 h-px bg-gray-300 dark:bg-gray-600" />
              </div>

              {/* Monthly Support */}
              <div className="flex flex-col items-center flex-1 w-full">
                <Link
                  href="https://patreon.com/Chess_Repertoire_Companion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:bg-orange-500 hover:shadow-xl focus:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <Icon className="h-5 w-5" name="Donate" />
                  <span>Monthly Support</span>
                </Link>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  Patreon • From $3/month
                </p>
              </div>
            </div>
          </div>

          {/* Personal Message */}
          <div className="w-full max-w-2xl">
            <hr className="border-zinc-200 mb-4 dark:border-zinc-800" />
            <div className="text-center bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                A message from Jeremy, CRC's creator:
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                "I'm developing CRC alone, and every contribution—no matter the
                size—makes a real difference in keeping this tool free for the
                chess community. Thank you!"
              </p>
            </div>
          </div>
        </section>

        <hr className="w-full border-zinc-200 py-2 dark:border-zinc-800 sm:max-w-[65vw] sm:px-20" />

        <h2 className="px-6 py-2 text-justify text-lg font-bold text-gray-500 dark:text-gray-400">
          CRC Balance (since February 2023)
        </h2>

        <div className="my-4 flex w-fit flex-col items-center justify-center rounded-lg border-2 border-red-300 bg-red-50 px-8 py-6 dark:border-red-700 dark:bg-red-950/30">
          {/* Current Balance - Prominently Displayed */}
          <div className="mb-4 text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Current Balance
            </p>
            <div className="text-4xl font-bold text-red-600 dark:text-red-400">
              -$1295
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              We need your help to get back to positive!
            </p>
          </div>

          {/* Income vs Expenses Breakdown */}
          <div className="flex w-full justify-center gap-8 text-center">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Income
              </p>
              <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                $205
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total Expenses
              </p>
              <p className="text-xl font-semibold text-red-600 dark:text-red-400">
                $1,500
              </p>
            </div>
          </div>
        </div>

        <Link
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center"
          href="https://docs.google.com/spreadsheets/d/1rjbkKI0Zc47u2CTDqG23WYad9lwUbbeHIOQh5O7whHE/edit?gid=419427895#gid=419427895"
        >
          <div className="flex w-full items-center rounded-xl px-8 py-2 font-medium text-indigo-400 transition-colors duration-300">
            <Icon className="h-14 w-14 pr-6" name="Eye" />
            <p>Annual budget 2025 Spreadsheet</p>
          </div>
        </Link>

        <Link
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center"
          href="https://docs.google.com/spreadsheets/d/1lE7DBl-2v4Sp5l6ZPP75BPfEHy1g6wH_7qQdayKnMQU/edit?usp=sharing"
        >
          <div className="flex w-full items-center rounded-xl px-8 py-2 font-medium text-indigo-400 transition-colors duration-300">
            <Icon className="h-14 w-14 pr-6" name="Eye" />
            <p>Annual budget 2024 Spreadsheet</p>
          </div>
        </Link>

        <Link
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center"
          href="https://docs.google.com/spreadsheets/d/1xVh_pEY8n5IAfd3oJD8Fum3HyPOf-Ul6ZHHQblqPvnQ/edit?usp=sharing"
        >
          <div className="flex w-full items-center rounded-xl px-8 py-2 font-medium text-indigo-400 transition-colors duration-300">
            <Icon className="h-14 w-14 pr-6" name="Eye" />
            <p>Annual budget 2023 Spreadsheet</p>
          </div>
        </Link>

        <hr className="mt-4 w-full border-zinc-200 py-2 dark:border-zinc-800 sm:max-w-[65vw] sm:px-20" />
        <div className="my-2 flex w-fit flex-col items-center justify-center  px-8 py-2 text-gray-500  dark:text-gray-400">
          <h2 className="px-6 py-2 text-justify text-lg font-bold text-gray-500 dark:text-gray-400">
            Donors{" "}
          </h2>
          <div className="my-2 flex flex-wrap items-center justify-center gap-4 text-center">
            <div className="flex w-fit items-center justify-center rounded-lg border border-yellow-500 px-8 py-2 dark:border-amber-400">
              <span
                className="relative font-black"
                style={{
                  background:
                    "linear-gradient(90deg, #6b7280 0%, #eab308 50%, #6b7280 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  animation: "textShift 3s ease-in-out infinite alternate",
                }}
              >
                Sean Aquilina
              </span>
            </div>
            <div className="flex w-fit items-center justify-center rounded-lg border border-zinc-200 px-8 py-2  dark:border-zinc-800">
              Luc Pleimling
            </div>
            <div className="flex w-fit items-center justify-center rounded-lg border border-zinc-200 px-8 py-2  dark:border-zinc-800">
              Michael Andro
            </div>
            <div className="flex w-fit items-center justify-center rounded-lg border border-zinc-200 px-8 py-2 dark:border-zinc-800">
              Adrien Pavão
            </div>
            <div className="flex w-fit items-center justify-center rounded-lg border border-zinc-200 px-8 py-2 dark:border-zinc-800">
              Stanislav Ulman
            </div>
            <div className="flex w-fit items-center justify-center rounded-lg border border-zinc-200 px-8 py-2 dark:border-zinc-800">
              Anonymous donor
            </div>
          </div>

          <hr className="mt-4 w-full border-zinc-200 py-2 dark:border-zinc-800 sm:max-w-[65vw] sm:px-20" />

          <p>
            Thank you to all the generous donors who help make this project
            possible !
          </p>
        </div>

        <Footer />
      </main>
    </section>
  )
}
