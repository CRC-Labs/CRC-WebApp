import { useEffect, useState } from "react"

import Link from "next/link"
import SwitchThemeBar from "@/features/theme/components/SwitchThemeBar"
import { LogoWithSlogan } from "../utils/logos"
import Footer from "./Footer"

const Landing = () => {
  const [themeMode, _setThemeMode] = useState(null)
  useEffect(() => {
    if (!("theme" in localStorage) && themeMode === null) {
      _setThemeMode("system")
    } else if (themeMode === null) {
      if (localStorage.theme === "dark") {
        setThemeMode("dark")
      } else {
        setThemeMode("light")
      }
    }
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  }, [themeMode])
  useEffect(() => {
    if (!("theme" in localStorage) || themeMode === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        //System use dark mode
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    } else {
      if (localStorage.theme === "dark" || themeMode === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  }, [themeMode])

  function setThemeMode(value) {
    if (value === "system") {
      // Whenever the user explicitly chooses to respect the OS preference
      localStorage.removeItem("theme")
    } else {
      localStorage.theme = value
    }
    _setThemeMode(value)
  }
  return (
    <section className="flex h-full min-h-screen flex-col items-center bg-stone-300 pt-8 dark:bg-stone-900">
      <header className="mx-auto mb-8 flex max-h-[100px] max-w-[300px] items-center justify-center">
        <LogoWithSlogan />
      </header>

      {/* <motion.main
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{ type: "linear" }}
        className="flex w-full flex-col items-center"
      >
        {children}
      </motion.main> */}
      <main className="flex w-full flex-col items-center">
        <section className="flex flex-col items-center bg-stone-300 px-6 pb-8 dark:bg-stone-900 sm:max-w-[85vw] sm:px-20">
          <div className="px-6 text-justify text-base text-gray-500 dark:text-gray-400">
            <hr className="border-zinc-200 dark:border-zinc-800" />
            <h4 className="mb-2 mt-6 text-center text-2xl font-medium leading-tight text-gray-600 dark:text-gray-200">
              Welcome !
            </h4>

            <p className="py-2">
              Chess Repertoire Companion provides a beautiful and robust
              starting point for your chess player journey.
            </p>
            <p className="py-2">
              It is designed to help you build and memorize your chess
              repertoire in a simple and enjoyable way.{" "}
            </p>

            <p className="py-2">
              We believe you should love spending time to carefully construct
              and learn a repertoire, so we have spent time carefully crafting
              CRC to be a breath of fresh air.
            </p>
            <p className="py-2">We hope you'll love it.</p>
          </div>
        </section>
        <section className="flex w-full flex-col items-center justify-center gap-2 bg-zinc-300/80 p-8 py-10 shadow-inner dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-400">
          <div className="flex animate-pulse items-center text-gray-700 dark:text-gray-200">
            <p>Try it now !</p>
          </div>
          <Link
            href="/app"
            className="flex flex-col items-center hover:underline"
          >
            <div className="flex w-56 items-center rounded-xl bg-indigo-600 px-8 py-4 text-lg font-medium text-indigo-400 shadow-md shadow-indigo-700 transition-colors duration-300 hover:bg-indigo-500">
              <LogoWithSlogan />{" "}
            </div>
            <div className="mt-3 flex items-center text-sm font-semibold text-indigo-700 dark:text-indigo-400">
              <div>Access the App</div>
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
          </Link>
        </section>
        <section className="grid grid-cols-1 sm:max-w-[85vw] sm:px-20 md:grid-cols-2">
          <div className="border-t border-zinc-200 p-6 dark:border-zinc-800">
            <div className="flex items-center">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                viewBox="0 0 24 24"
                className="h-8 w-8 text-gray-400 dark:text-gray-200"
              >
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <div className="ml-4 text-lg font-semibold leading-7 text-gray-600 dark:text-gray-200">
                <a
                  href="https://wiki.chess-repertoire-companion.com"
                  rel="noopener"
                  target="blank"
                >
                  Documentation
                </a>
              </div>
            </div>
            <div className="ml-4 sm:ml-12">
              <div className="mt-2 text-justify text-sm text-gray-500 dark:text-gray-400">
                <p className="py-1">
                  Chess Repertoire Companion has a documentation tool which aims
                  to cover every aspect of the application.
                </p>
                <p className="py-1">
                  Whether you're new to CRC or have previous experience, we
                  recommend reading all of the documentation from beginning to
                  end.
                </p>
              </div>
              <a
                href="https://wiki.chess-repertoire-companion.com"
                rel="noopener"
                target="blank"
              >
                <div className="mt-3 flex items-center text-sm font-semibold text-indigo-700 hover:underline dark:text-indigo-400">
                  <div>Explore the documentation</div>
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
          <div className="border-t border-zinc-200 p-6 dark:border-zinc-800 md:border-l">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 122.88 86.686"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={4}
                className="h-8 w-8 text-gray-500/90 dark:text-gray-200"
              >
                <g>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M53.995,73.994h25.399c0.064,4.396,1.872,8.325,6.783,11.429H47.22 C51.14,82.576,54.013,79.116,53.995,73.994L53.995,73.994L53.995,73.994L53.995,73.994z M41.118,30.451v53.131 c0,1.012-0.829,1.841-1.84,1.841H1.841C0.829,85.423,0,84.594,0,83.582V30.451c0-1.011,0.829-1.84,1.841-1.84h37.432 C40.289,28.611,41.118,29.439,41.118,30.451L41.118,30.451L41.118,30.451z M20.557,79.303c1.164,0,2.11,0.945,2.11,2.109 s-0.946,2.11-2.11,2.11s-2.11-0.946-2.11-2.11C18.452,80.248,19.393,79.303,20.557,79.303L20.557,79.303L20.557,79.303z M38.622,31.895v45.537H2.755V31.895H38.622L38.622,31.895L38.622,31.895z M102.54,44.215h15.942c1.213,0,2.32,0.495,3.109,1.29 c0.8,0.801,1.288,1.902,1.288,3.109v33.673c0,1.214-0.494,2.321-1.288,3.109c-0.802,0.802-1.902,1.289-3.109,1.289H102.54 c-1.214,0-2.321-0.494-3.109-1.289c-0.801-0.8-1.289-1.901-1.289-3.109V48.608c0-1.214,0.494-2.321,1.289-3.11 C100.231,44.698,101.326,44.215,102.54,44.215L102.54,44.215L102.54,44.215z M99.657,80.576h21.701V49.012H99.657V80.576 L99.657,80.576z M110.505,81.952c0.995,0,1.808,0.801,1.808,1.808c0,0.996-0.801,1.809-1.808,1.809 c-0.995,0-1.809-0.801-1.809-1.809C108.696,82.766,109.497,81.952,110.505,81.952L110.505,81.952L110.505,81.952z M17.5,0h97.411 c1.542,0,2.8,1.257,2.8,2.8v31.73h-3.976V6.268c0-1.359-1.11-2.479-2.479-2.479H21.145l0,0c-1.359,0-2.479,1.11-2.479,2.479v16.178 H14.7V2.8C14.7,1.257,15.958,0,17.5,0L17.5,0L17.5,0L17.5,0z M47.03,60.417h45.478v9.713H47.03V60.417L47.03,60.417z"
                  ></path>
                </g>
              </svg>
              <div className="ml-4 text-lg font-semibold leading-7 text-gray-600 dark:text-gray-200">
                <p>Cross-Platform & Dark Theme</p>
              </div>
            </div>
            <div className="ml-4 sm:ml-12">
              <div className="mt-2 text-justify text-sm text-gray-500 dark:text-gray-400">
                <p className="py-1">
                  CRC is designed to allow you to play from your favorite
                  device.
                </p>
                <p className="py-1">
                  You can easily build your repertoire on a computer and
                  practice on your smartphone... or vice versa... well, it's a
                  bit like you want!
                </p>

                <p className="py-1">
                  Whether you're a fan of dark themes or prefer a more
                  traditional light theme, CRC has it covered.
                </p>
                <div className="mt-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Give it a try !
                </div>
              </div>
            </div>
            <SwitchThemeBar />
          </div>
          <div className="border-t border-zinc-200 p-6 dark:border-zinc-800">
            <div className="flex items-center">
              <svg
                fill="currentColor"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                viewBox="0 0 50 50"
                className="h-8 w-8 text-gray-400 dark:text-gray-200"
              >
                <path d="M 18.90625 7 C 18.90625 7 12.539063 7.4375 8.375 10.78125 C 8.355469 10.789063 8.332031 10.800781 8.3125 10.8125 C 7.589844 11.480469 7.046875 12.515625 6.375 14 C 5.703125 15.484375 4.992188 17.394531 4.34375 19.53125 C 3.050781 23.808594 2 29.058594 2 34 C 1.996094 34.175781 2.039063 34.347656 2.125 34.5 C 3.585938 37.066406 6.273438 38.617188 8.78125 39.59375 C 11.289063 40.570313 13.605469 40.960938 14.78125 41 C 15.113281 41.011719 15.429688 40.859375 15.625 40.59375 L 18.0625 37.21875 C 20.027344 37.683594 22.332031 38 25 38 C 27.667969 38 29.972656 37.683594 31.9375 37.21875 L 34.375 40.59375 C 34.570313 40.859375 34.886719 41.011719 35.21875 41 C 36.394531 40.960938 38.710938 40.570313 41.21875 39.59375 C 43.726563 38.617188 46.414063 37.066406 47.875 34.5 C 47.960938 34.347656 48.003906 34.175781 48 34 C 48 29.058594 46.949219 23.808594 45.65625 19.53125 C 45.007813 17.394531 44.296875 15.484375 43.625 14 C 42.953125 12.515625 42.410156 11.480469 41.6875 10.8125 C 41.667969 10.800781 41.644531 10.789063 41.625 10.78125 C 37.460938 7.4375 31.09375 7 31.09375 7 C 31.019531 6.992188 30.949219 6.992188 30.875 7 C 30.527344 7.046875 30.234375 7.273438 30.09375 7.59375 C 30.09375 7.59375 29.753906 8.339844 29.53125 9.40625 C 27.582031 9.09375 25.941406 9 25 9 C 24.058594 9 22.417969 9.09375 20.46875 9.40625 C 20.246094 8.339844 19.90625 7.59375 19.90625 7.59375 C 19.734375 7.203125 19.332031 6.964844 18.90625 7 Z M 18.28125 9.15625 C 18.355469 9.359375 18.40625 9.550781 18.46875 9.78125 C 16.214844 10.304688 13.746094 11.160156 11.4375 12.59375 C 11.074219 12.746094 10.835938 13.097656 10.824219 13.492188 C 10.816406 13.882813 11.039063 14.246094 11.390625 14.417969 C 11.746094 14.585938 12.167969 14.535156 12.46875 14.28125 C 17.101563 11.410156 22.996094 11 25 11 C 27.003906 11 32.898438 11.410156 37.53125 14.28125 C 37.832031 14.535156 38.253906 14.585938 38.609375 14.417969 C 38.960938 14.246094 39.183594 13.882813 39.175781 13.492188 C 39.164063 13.097656 38.925781 12.746094 38.5625 12.59375 C 36.253906 11.160156 33.785156 10.304688 31.53125 9.78125 C 31.59375 9.550781 31.644531 9.359375 31.71875 9.15625 C 32.859375 9.296875 37.292969 9.894531 40.3125 12.28125 C 40.507813 12.460938 41.1875 13.460938 41.8125 14.84375 C 42.4375 16.226563 43.09375 18.027344 43.71875 20.09375 C 44.9375 24.125 45.921875 29.097656 45.96875 33.65625 C 44.832031 35.496094 42.699219 36.863281 40.5 37.71875 C 38.5 38.496094 36.632813 38.84375 35.65625 38.9375 L 33.96875 36.65625 C 34.828125 36.378906 35.601563 36.078125 36.28125 35.78125 C 38.804688 34.671875 40.15625 33.5 40.15625 33.5 C 40.570313 33.128906 40.605469 32.492188 40.234375 32.078125 C 39.863281 31.664063 39.226563 31.628906 38.8125 32 C 38.8125 32 37.765625 32.957031 35.46875 33.96875 C 34.625 34.339844 33.601563 34.707031 32.4375 35.03125 C 32.167969 35 31.898438 35.078125 31.6875 35.25 C 29.824219 35.703125 27.609375 36 25 36 C 22.371094 36 20.152344 35.675781 18.28125 35.21875 C 18.070313 35.078125 17.8125 35.019531 17.5625 35.0625 C 16.394531 34.738281 15.378906 34.339844 14.53125 33.96875 C 12.234375 32.957031 11.1875 32 11.1875 32 C 10.960938 31.789063 10.648438 31.699219 10.34375 31.75 C 9.957031 31.808594 9.636719 32.085938 9.53125 32.464844 C 9.421875 32.839844 9.546875 33.246094 9.84375 33.5 C 9.84375 33.5 11.195313 34.671875 13.71875 35.78125 C 14.398438 36.078125 15.171875 36.378906 16.03125 36.65625 L 14.34375 38.9375 C 13.367188 38.84375 11.5 38.496094 9.5 37.71875 C 7.300781 36.863281 5.167969 35.496094 4.03125 33.65625 C 4.078125 29.097656 5.0625 24.125 6.28125 20.09375 C 6.90625 18.027344 7.5625 16.226563 8.1875 14.84375 C 8.8125 13.460938 9.492188 12.460938 9.6875 12.28125 C 12.707031 9.894531 17.140625 9.296875 18.28125 9.15625 Z M 18.5 21 C 15.949219 21 14 23.316406 14 26 C 14 28.683594 15.949219 31 18.5 31 C 21.050781 31 23 28.683594 23 26 C 23 23.316406 21.050781 21 18.5 21 Z M 31.5 21 C 28.949219 21 27 23.316406 27 26 C 27 28.683594 28.949219 31 31.5 31 C 34.050781 31 36 28.683594 36 26 C 36 23.316406 34.050781 21 31.5 21 Z M 18.5 23 C 19.816406 23 21 24.265625 21 26 C 21 27.734375 19.816406 29 18.5 29 C 17.183594 29 16 27.734375 16 26 C 16 24.265625 17.183594 23 18.5 23 Z M 31.5 23 C 32.816406 23 34 24.265625 34 26 C 34 27.734375 32.816406 29 31.5 29 C 30.183594 29 29 27.734375 29 26 C 29 24.265625 30.183594 23 31.5 23 Z"></path>
              </svg>
              <div className="ml-4 text-lg font-semibold leading-7 text-gray-600 dark:text-gray-200">
                <a href="https://tailwindcss.com/">
                  Be a Member of The Community
                </a>
              </div>
            </div>
            <div className="ml-4 sm:ml-12">
              <div className="mt-2 text-justify text-sm text-gray-500 dark:text-gray-400">
                <p className="py-1">You are welcome on our Discord server !</p>
                <p className="py-1">
                  Come say hello, ask questions, give feedback or just chat with
                  members of the community.
                </p>
                <p className="py-1">
                  This is also a good place to express your creativity and get
                  involved in the collaborative roadmap construction process.
                </p>
              </div>
              <a
                href="https://discord.gg/38eY9bYcPH"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="mt-3 flex items-center text-sm font-semibold text-indigo-700 hover:underline dark:text-indigo-400">
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
          <div className="border-t border-zinc-200 p-6 dark:border-zinc-800 md:border-l">
            <div className="flex items-center">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                viewBox="0 0 24 24"
                className="h-8 w-8 text-gray-400 dark:text-gray-200"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />{" "}
              </svg>
              <div className="ml-4 text-lg font-semibold leading-7 text-gray-600 dark:text-gray-200">
                Free & Under Development
              </div>
            </div>
            <div className="ml-4 sm:ml-12">
              <div className="mt-2 text-justify text-sm text-gray-500 dark:text-gray-400">
                <p className="py-1 font-bold">
                  Please note that CRC is completely free & currently under
                  development (when I have time...).
                </p>
                <p className="py-1">
                  You can already register to show your interest or try it
                  without registering.
                </p>
                <p className="py-1">
                  Please consider making a donation if you are actively using
                  CRC and want to support hosting and development costs, because
                  it is not free for me to provide you this wonderful webapp.
                </p>
              </div>
              <Link href="/donate" target="_blank" rel="noopener noreferrer">
                <div className="mt-3 flex items-center text-sm font-semibold text-indigo-700 hover:underline dark:text-indigo-400">
                  <div>Donate</div>
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
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </section>
  )
}

export default Landing
