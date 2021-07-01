import {
  cloneElement,
  Fragment,
  ReactElement,
  ReactNode,
} from 'react'

const tagRe = /<(\w+)>(.*?)<\/\1>|<(\w+)\/>/
const nlRe = /(?:\r\n|\r|\n)/g

function getElements(
  parts: Array<string | undefined>
): Array<string | undefined>[] {
  if (!parts.length) return []

  const [paired, children, unpaired, after] = parts.slice(0, 4)

  return [
    [(paired || unpaired) as string, children || ('' as string), after],
  ].concat(getElements(parts.slice(4, parts.length)))
}


export default function formatElements(
  value: string,
  elements: ReactElement[] | Record<string, ReactElement> = []
): string | ReactNode[] {
  const parts = value.replace(nlRe, '').split(tagRe)

  if (parts.length === 1) return value

  const tree = []

  const before = parts.shift()
  if (before) tree.push(before)

  getElements(parts).forEach(([key, children, after], realIndex: number) => {
    const element =
      // @ts-ignore
      elements[key as string] || <Fragment />

    tree.push(
      cloneElement(
        element,
        { key: realIndex },

        // format children for pair tags
        // unpaired tags might have children if it's a component passed as a variable
        children ? formatElements(children, elements) : element.props.children
      )
    )

    if (after) tree.push(after)
  })

  return tree
}
