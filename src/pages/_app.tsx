import React, { JSX } from "react"

import "../styles/tailwind.scss"
import "../styles/chessground.base.css"
import "../styles/chessground.brown.css"
import "../styles/chessground.cburnett.css"
import "../styles/multiRangeSlider.css"
import "../styles/tree.scss"
import "react-notifications-component/dist/theme.css"
import "suneditor/dist/css/suneditor.min.css"

import { AnimatePresence } from "framer-motion"
import { AppProps } from "next/app"
import Head from "next/head"
import { ReactNotifications } from "react-notifications-component"

import ThemeProvider from "@/features/theme/providers/ThemeProvider"

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>Chess Repertoire Companion</title>
        <meta
          name="keywords"
          content="chess, repertoire, tool, app, webapp, application, build, train, memorize, openings"
        />
        <meta
          name="news_keywords"
          content="chess, repertoire, tool, app, webapp, application, build, train, memorize, openings"
        />
        <meta
          name="description"
          content="CRC helps you build and memorize your chess repertoire in a simple and enjoyable way."
          key="desc"
        />
        <meta
          name="subject"
          content="CRC helps you build and memorize your chess repertoire in a simple and enjoyable way."
        />

        <meta property="og:title" content="Chess Repertoire Companion" />
        <meta
          property="og:description"
          content="CRC helps you build and memorize your chess repertoire in a simple and enjoyable way."
        />
        <meta
          name="author"
          content="Jeremy Guillemot, Jeremy@chess-repertoire-companion.com"
        />
        <meta
          property="og:image"
          content="https://chess-repertoire-companion.com/CRC.png"
        />
      </Head>
      <ReactNotifications />
      <ThemeProvider>
        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={() => window.scrollTo(0, 0)}
        >
          <Component {...pageProps} />
        </AnimatePresence>
      </ThemeProvider>
    </>
  )
}

export default MyApp
