import React from 'react'
import SourceDocument, { Html, Head, Main, NextScript } from 'next/document'
import firebase from '../utils/firebase'

export default class Document extends SourceDocument {
  render(): JSX.Element {
    return (
      <Html lang="en" data-theme="blue">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Just+Another+Hand&display=swap"
            rel="stylesheet"
          ></link>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&family=Roboto+Slab:wght@300;400;500;700;900&display=swap"
            rel="stylesheet"
          ></link>
          <link rel="icon" href="/surfgxds.ico" />

          <script src="https://www.gstatic.com/firebasejs/8.7.1/firebase-app.js"></script>
          <script src="https://www.gstatic.com/firebasejs/8.7.1/firebase-analytics.js"></script>
        </Head>
        <body>
          <Main />
          <div id="modal" />
          <div id="tip" />
          <NextScript />
        </body>
      </Html>
    )
  }
}
