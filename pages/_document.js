// pages/_document.js
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          {/* Modal root where the modal will be mounted */}
          <div id="modal-root"></div>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
