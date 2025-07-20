import { promises as fs } from "fs"
import path from "path"

import { useEffect, useState } from "react"

import dynamic from "next/dynamic"
import { usePapaParse } from "react-papaparse"
import AuthenticationStateProvider from "@/features/auth/providers/AuthenticationStateProvider"

const AppContextProvider = dynamic(
  () => import("@/features/context/providers/AppContextProvider"),
  {
    ssr: false,
  },
)

const ApiProvider = dynamic(
  () => import("@/features/api/providers/ApiProvider"),
  {
    ssr: false,
  },
)

const App = dynamic(() => import("@/features/context/components/Main"), {
  ssr: false,
})

const LoadingScreenWithoutLayout = dynamic(
  () => import("@/features/common/components/LoadingScreenWithoutLayout"),
  {
    ssr: false,
  },
)

export default function Home({ fileContents }) {
  const { readString } = usePapaParse()
  const [openings, setOpenings] = useState(null)

  useEffect(() => {
    if (!openings) initOpenings()
  }, [])

  function initOpenings() {
    readString(fileContents, {
      worker: true,
      complete: (results) => {
        let indexedOpenings = new Map<string, string>()
        results.data.forEach((line) => {
          indexedOpenings.set(line[2], line[1])
        })
        setOpenings(indexedOpenings)
      },
    })
  }

  return (
    <>
      <AuthenticationStateProvider>
        <AppContextProvider openings={openings}>
          <ApiProvider>
            <App />
          </ApiProvider>
        </AppContextProvider>
      </AuthenticationStateProvider>
    </>
  )
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const openingsDirectory = path.join(
    process.cwd(),
    "resources/openings/chess-openings",
  )

  const filePath = path.join(openingsDirectory, "full.tsv")
  const fileContents = await fs.readFile(filePath, "utf8")
  // By returning { props: { posts } }, the component
  // will receive `posts` as a prop at build time
  return {
    props: {
      fileContents,
    },
  }
}
