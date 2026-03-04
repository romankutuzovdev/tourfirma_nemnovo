'use client'

import Script from 'next/script'

export function GoogleTranslateWidget() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.googleTranslateElementInit=function(){var el=document.getElementById("google_translate_element");if(el&&!window.__gtInit){window.__gtInit=true;var g=window.google;if(g&&g.translate&&g.translate.TranslateElement){new g.translate.TranslateElement({pageLanguage:"ru",layout:g.translate.TranslateElement.InlineLayout.SIMPLE,includedLanguages:"ru,be,en,pl,zh-CN",autoDisplay:false},"google_translate_element");}}};`,
        }}
      />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <div className="translate-widget-wrapper flex items-center self-center">
        <div id="google_translate_element" />
      </div>
    </>
  )
}
