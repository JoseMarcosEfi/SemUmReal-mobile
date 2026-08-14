import { createElement, type ReactNode } from 'react';
import { color, iconSize } from '../../theme';
import { iconPaths, type PixelIconName } from './icons';

type PixelIconProps = {
  name: PixelIconName;
  size?: number;
  fill?: string;
  label?: string;
};

export function PixelIcon({
  name,
  size = iconSize.md,
  fill = color.ink,
  label,
}: PixelIconProps) {
  const paths: ReactNode[] = iconPaths[name].map((d) =>
    createElement('path', { key: d, d, fill }),
  );

  return createElement(
    'svg',
    {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      xmlns: 'http://www.w3.org/2000/svg',
      role: label ? 'img' : undefined,
      'aria-label': label,
      'aria-hidden': label ? undefined : true,
      style: { display: 'block', imageRendering: 'pixelated' },
    },
    paths,
  );
}

export type { PixelIconName };
