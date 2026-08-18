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
            __html: `(function(){
var s=location.pathname.split('/')[1];
var a=s==='ar';
document.documentElement.lang=a?'ar':'en';
document.documentElement.dir=a?'rtl':'ltr';
var attrs=['bis_skin_checked','bis_register','cz-shortcut-listen'];
function strip(n){
  if(!n||n.nodeType!==1)return;
  for(var i=0;i<attrs.length;i++) if(n.hasAttribute(attrs[i])) n.removeAttribute(attrs[i]);
}
var obs=new MutationObserver(function(ms){
  for(var i=0;i<ms.length;i++){
    var m=ms[i];
    if(m.type==='attributes') strip(m.target);
    for(var j=0;j<(m.addedNodes&&m.addedNodes.length||0);j++) strip(m.addedNodes[j]);
  }
});
obs.observe(document.documentElement,{attributes:true,childList:true,subtree:true,attributeFilter:attrs});
addEventListener('load',function(){setTimeout(function(){obs.disconnect()},1500)});
})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
