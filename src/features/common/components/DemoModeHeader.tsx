import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from "@headlessui/react"
import Link from "next/link"
import { Icon } from "../utils/icons"


export default function LayDemoModeHeaderout() {
  return (
    <section className="my-8 w-full bg-orange-300">
      <section
        className="flex w-full flex-col items-center justify-center bg-zinc-300/80 p-8 py-10 text-orange-700/90 shadow-inner dark:border-zinc-800 dark:bg-zinc-300/80"
        role="alert"
      >
        <div className="flex max-w-md flex-col gap-4">
          <div className="flex items-center gap-4 font-bold ">
            <Icon
              name="Unlink"
              className="h-[40px] min-h-[40px] w-[40px] min-w-[40px]"
              fill="currentColor"
            />
            <p className="text-xl">Demo Mode !</p>
          </div>
          <p>You are anonymous and using the application in demo mode.</p>
          <section className="w-full">
            <Disclosure as="div">
              {({ open }) => (
                /* Use the `open` state to conditionally change the direction of an icon. */
                <>
                  <DisclosureButton as="div" className="flex w-full items-center justify-between rounded-lg bg-zinc-200 px-4 py-2 text-left text-sm font-medium text-indigo-900 shadow-lg focus:outline-none focus-visible:ring focus-visible:ring-indigo-500/75">
                    <p className="mr-12">What does it mean ?</p>
                    <Icon
                      name="RightChevron"
                      className={
                        open ? "h-6 w-6 -rotate-90" : "h-6 w-6 rotate-90"
                      }
                    />
                  </DisclosureButton>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <DisclosurePanel className="relative -top-2 flex flex-col gap-4 rounded-b-lg border-x border-b bg-zinc-200/70 px-4 pb-2 pt-4 text-sm text-gray-500" as="div">
                      <p>
                        When you are not logged in, CRC can't synchronize your
                        repertoires with the remote database.
                      </p>{" "}
                      <p>
                        You will only be able to view, create and modify local
                        repertoires which are saved on your device. They are
                        temporary and will not be available from another device.
                      </p>
                      <p>
                        You can login to your account in order to access your
                        online repertoires from any device.
                      </p>
                      <p>
                        Once logged in, you'll be able to import a local
                        repertoire to your online account if needed.
                      </p>
                    </DisclosurePanel>
                  </Transition>{" "}
                </>
              )}
            </Disclosure>
          </section>
          <div className="mt-4 flex items-center justify-center gap-4 ">
            <div className="flex flex-col">
              <Link
                href="/app?module=4"
                className="flex flex-col items-center rounded-lg px-4 py-2 font-bold text-indigo-500 outline-none transition-all duration-200 file:text-xs hover:bg-indigo-400/20 hover:text-indigo-700 hover:shadow-inner focus:bg-indigo-300/20 focus:text-indigo-700 focus:shadow-inner"
              >
                <Icon strokeOpacity="0.5" className="h-8 w-8" name="Login" />
                <p className="opacity-50">Login</p>
              </Link>
            </div>
            <span className="flex flex-col items-center justify-center">
              <span className="h-4 w-px bg-gray-400" />
              <span className="text-center font-normal text-gray-500 dark:text-gray-400">
                or
                {/* or login with */}
              </span>
              <span className="h-4 w-px bg-gray-400" />
            </span>
            <div className="flex flex-col">
              <Link
                href="/app?module=5"
                className="flex flex-col items-center rounded-lg px-4 py-2 font-bold text-emerald-500/60 outline-none transition-all duration-200 file:text-xs hover:bg-emerald-400/20 hover:text-emerald-600 hover:shadow-inner focus:bg-emerald-300/20 focus:text-emerald-600 focus:shadow-inner"
              >
                <Icon strokeOpacity="0.5" className="h-8 w-8" name="Register" />
                <p className="opacity-50">Register</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}
