import { useMemo } from 'react';

import formatElements from './formatElements';
import { TransProps } from '.';

type ValueTransProps = Omit<TransProps, 'i18nKey'> & {
  text: string;
}

export default function TransText({
  text,
  components,
}: ValueTransProps): any {
  return useMemo(() => (!components || components.length === 0)
    ? text
    : formatElements(text, components), [text, components]) as string;
}
