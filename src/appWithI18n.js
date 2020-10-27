import React from 'react'
import App from 'next/app'
import I18nProvider from './I18nProvider'
import getPageNamespaces from './_helpers/getPageNamespaces'

function removeTrailingSlash(path = '') {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}

export default function appWithI18n(AppToTranslate, config = {}) {

  if (config.ignoreRoutes) {
    console.warn('[next-translate] ignoreRoutes is not longer supported. The i18n routing has moved to the Next.js core, so we have been forced to deprecate this behavior.')
  }

  function AppWithTranslations(props) {
    const { lang, namespaces } = props
    const { logger } = config

    return (
      <I18nProvider
        lang={lang}
        namespaces={namespaces}
        logger={logger}
      >
        <AppToTranslate {...props} />
      </I18nProvider>
    )
  }

  AppWithTranslations.getInitialProps = async (appCtx) => {
    const { router, ctx } = appCtx
    const lang = router.locale
    const getInitialProps =
      AppToTranslate.getInitialProps || App.getInitialProps
    let appProps = { pageProps: {} }

    if (getInitialProps) {
      appProps = (await getInitialProps(appCtx)) || {}
    }

    const page = removeTrailingSlash(ctx.pathname)
    const namespaces = await getPageNamespaces(config, page, ctx)
    const pageNamespaces =
      (await Promise.all(
        namespaces.map((ns) =>
          typeof config.loadLocaleFrom === 'function'
            ? config.loadLocaleFrom(lang, ns)
            : Promise.resolve([])
        )
      ).catch(() => { })) || []

    return {
      ...appProps,
      lang,
      namespaces: namespaces.reduce((obj, ns, i) => {
        obj[ns] = pageNamespaces[i]
        return obj
      }, {}),
    }
  }

  return AppWithTranslations
}
