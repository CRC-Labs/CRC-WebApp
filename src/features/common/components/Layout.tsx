import { LogoWithSlogan } from "../utils/logos"
import DemoModeHeader from "./DemoModeHeader"
import { useAuthenticationState } from "@/features/auth/providers/AuthenticationStateProvider"
import { Icon } from "../utils/icons"
import Link from "next/link"

export default function Layout({ children, logo, onClick, demoHeader = true }) {
  const { authenticationState } = useAuthenticationState()

  let cursorPointer = ""
  if (onClick !== null) {
    cursorPointer = "cursor-pointer "
  }
  return (
    <section className="flex h-full min-h-screen flex-col items-center bg-stone-300 pt-8 dark:bg-stone-900">
      {logo ? (
        <header
          onClick={onClick}
          className={
            cursorPointer +
            "flex justify-center items-center mx-auto mb-8 max-w-[300px] max-h-[100px]"
          }
        >
          <LogoWithSlogan />
        </header>
      ) : (
        <></>
      )}

      {demoHeader && !authenticationState.isAuthenticated && <DemoModeHeader />}
      {authenticationState.isAuthenticated && (
        <section className="my-4 sm:my-6 w-full bg-red-300">
          <section
            className="flex w-full items-center justify-center bg-zinc-300/80 p-3 sm:p-4 text-red-700/90 shadow-inner dark:border-zinc-800 dark:bg-zinc-300/80"
            role="alert"
          >
            {/* ✅ Responsive container with better width management */}
            <div className="flex flex-col sm:flex-row w-full max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl items-center gap-3 sm:gap-4">
              {/* ✅ Icon - Responsive sizing and positioning */}
              <Icon
                name="Donate"
                className="h-6 w-6 sm:h-[24px] sm:w-[24px] flex-shrink-0 text-red-700/90"
                fill="currentColor"
              />

              {/* ✅ Text content - Responsive typography and spacing */}
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-semibold">CRC is free & ad-free</span>
                  <span className="hidden sm:inline">
                    {" "}
                    but needs your support to stay online. We're struggling to
                    cover hosting and maintenance costs.
                  </span>
                  <span className="inline sm:hidden">
                    {" "}
                    but needs your support to stay online.
                  </span>
                </p>
              </div>

              {/* ✅ Button - Responsive sizing and layout */}
              <Link
                href="/donate"
                className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg bg-red-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white shadow transition-all duration-200 hover:bg-red-500 focus:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 w-full sm:w-auto min-w-[100px] sm:min-w-[120px]"
              >
                <Icon className="h-3 w-3 sm:h-4 sm:w-4" name="Donate" />
                <span>Donate</span>
              </Link>
            </div>
          </section>
        </section>
      )}
      <main className="flex w-full flex-col items-center">{children}</main>
    </section>
  )
}
