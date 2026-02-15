import Link from "next/link"

const Footer = () => {
  return (
    <footer className="border-t border-zinc-200">
      <div className="flex max-w-screen-xl flex-col items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex w-[85vw] flex-wrap justify-start gap-8 px-8 pl-[15vw] md:pl-32 lg:justify-center lg:pl-8">
          <div className="w-fit">
            <p className="font-medium dark:text-gray-300">Helpful Links</p>
            <nav className="mt-4 flex flex-col space-y-2 text-sm text-gray-500">
              <Link
                href="/contact"
                className="hover:opacity-75"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                Contact{" "}
              </Link>
              <Link
                href="https://wiki.chess-repertoire-companion.com/en/faq"
                className="hover:opacity-75"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                FAQs{" "}
              </Link>
            </nav>
          </div>
          <div className="w-fit">
            <p className="font-medium dark:text-gray-300">Legal</p>
            <nav className="mt-4 flex flex-col space-y-2 text-sm text-gray-500">
              <Link
                href="/terms-and-conditions"
                className="hover:opacity-75"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                Terms & Conditions{" "}
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:opacity-75"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                Privacy Policy{" "}
              </Link>
            </nav>
          </div>
          <div className="w-fit">
            <p className="font-medium dark:text-gray-300">Attributions</p>
            <nav className="mt-4 flex flex-col space-y-2 text-sm text-gray-500">
              <p> CRC is relying on Chessground library, © 2025 lichess-org</p>
              <p>
                Licensed under{" "}
                <Link
                  href="https://github.com/lichess-org/chessground/blob/master/LICENSE"
                  className="font-semibold text-indigo-700 hover:underline dark:text-indigo-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GNU GPLv3
                </Link>{" "}
                | download Chessground source{" "}
                <Link
                  href="https://github.com/lichess-org/chessground"
                  className="font-semibold text-indigo-700 hover:underline dark:text-indigo-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </Link>
              </p>
            </nav>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <p className="mt-8 text-xs text-gray-500 dark:text-gray-400">
            CRC is free/libre open source software. You can download, read, use
            and modify every bit of source code. Download CRC source{" "}
            <Link
              href="https://github.com/crc-labs/crc-webapp"
              className="font-semibold text-indigo-700 hover:underline dark:text-indigo-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </Link>
          </p>
          <Link
            href="https://wiki.chess-repertoire-companion.com/en/changelog"
            className="mt-2 text-xs font-semibold text-indigo-700 hover:underline dark:text-indigo-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            CRC v0.3.1
          </Link>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            © 2026 Chess Repertoire Companion
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
