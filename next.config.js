module.exports = {
  reactStrictMode: true,
  transpilePackages: ["cm-pgn","chessground","@react-aria/utils"],
  publicRuntimeConfig: {
    // Will be available on both server and client
    API_HOST: process.env.API_HOST,
    API_TLS: process.env.API_TLS,
  },
}
