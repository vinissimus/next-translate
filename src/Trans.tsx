import { useMemo } from 'react'

import { TransProps } from '.'
import useTranslation from './useTranslation'
import formatElements from './formatElements'

/**
 * Translate transforming:
 * <0>This is an <1>example</1><0>
 * to -> <h1>This is an <b>example</b><h1>
 */
export default function Trans({
  i18nKey,
  values,
  components,
  fallback,
}: TransProps): any {
  const { t, lang } = useTranslation()

  /**
   * Memoize the transformation
   */
  const result = useMemo(() => {
    const text = t(i18nKey, values, { fallback })

    if (!components || components.length === 0) return text

    return formatElements(text, components)
  }, [i18nKey, values, components, lang]) as string

  return result
}
