import './globals.css';
import type {ReactNode} from 'react';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  icons: {
    icon: '/alsaffar-favicon.png',
    apple: '/alsaffar-favicon.png',
  },
};

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=location.pathname.split('/')[1];var a=s==='ar';document.documentElement.lang=a?'ar':'en';document.documentElement.dir=a?'rtl':'ltr';})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
