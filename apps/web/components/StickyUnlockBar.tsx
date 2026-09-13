'use client';

import { useEffect, useState } from 'react';
import { Button } from '@nodi/design-system';

/** Mobile sticky CTA — visible only while locked and #gate is off-screen. */
export function StickyUnlockBar({
  href = '#gate',
  label = '무료로 열기',
}: {
  href?: string;
  label?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const gate = document.getElementById('gate');
    if (!gate) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(!(entry?.isIntersecting ?? false));
      },
      { threshold: 0.05 },
    );
    io.observe(gate);
    return () => io.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div className="hidden max-[720px]:flex fixed inset-x-0 bottom-0 z-30 bg-card border-t border-line px-gutter pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] [&_a]:w-full">
      <Button variant="primary" href={href}>
        {label}
      </Button>
    </div>
  );
}
