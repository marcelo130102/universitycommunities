import { Html, Head, Main, NextScript } from 'next/document'
 
export default function Document() {
  return (
    <Html>
      <Head />
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: 'Roboto, sans-serif',
      }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}