import i from './_helpers/_internals'

console.warn(
  '[next-translate] clientSideLang is now deprecated, it will be removed in next releases. Use useRouter from next/router to get the locale: https://nextjs.org/docs/advanced-features/i18n-routing'
)
/**
 * @deprecated
 */
export default () => i.lang
