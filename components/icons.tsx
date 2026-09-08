interface IconProps {
  className?: string;
}

const baseProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function IconSprout({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M12 21V10" />
      <path d="M12 10C12 6 9 4 6 4c0 4 2 7 6 7" />
      <path d="M12 13c0-4 3-6 6-6 0 4-2 7-6 7" />
    </svg>
  );
}

export function IconLotus({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M12 18c-3.5 0-6-2-6-5 2.5 0 4.5 1 6 3 1.5-2 3.5-3 6-3 0 3-2.5 5-6 5Z" />
      <path d="M12 13V6" />
      <path d="M9 9c0-2 1.3-3 3-3s3 1 3 3" />
    </svg>
  );
}

export function IconCycle({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M20 12a8 8 0 1 1-3-6.2" />
      <path d="M20 4v4h-4" />
    </svg>
  );
}

export function IconHearts({ className }: IconProps) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M9.5 15.5c-3-2-5-4-5-6.5A3.5 3.5 0 0 1 8 5.5c1 0 1.8.5 2 1 .2-.5 1-1 2-1a3.5 3.5 0 0 1 3.5 3.5" />
      <path d="M14.5 18c3-2 5-4 5-6.5A3.5 3.5 0 0 0 16 8c-1 0-1.8.5-2 1" />
    </svg>
  );
}
