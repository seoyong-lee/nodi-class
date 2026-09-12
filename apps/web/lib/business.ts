export function getBusinessLines(): string[] {
  const entries: { env: string | undefined; prefix: string }[] = [
    { env: process.env.BIZ_NAME, prefix: '상호' },
    { env: process.env.BIZ_OWNER, prefix: '대표' },
    { env: process.env.BIZ_REG_NO, prefix: '사업자등록번호' },
    { env: process.env.BIZ_ADDRESS, prefix: '주소' },
    { env: process.env.BIZ_EMAIL, prefix: '문의' },
  ];

  return entries
    .map(({ env, prefix }) => {
      const value = env?.trim();
      if (!value || value.includes('[ ]')) return null;
      return `${prefix} ${value}`;
    })
    .filter((line): line is string => Boolean(line));
}

export function getSocialLinks(): { label: string; href: string; icon: string }[] {
  const links: { label: string; href: string; icon: string }[] = [];
  const youtube = process.env.NEXT_PUBLIC_YOUTUBE_URL?.trim();
  const threads = process.env.NEXT_PUBLIC_THREADS_URL?.trim();
  if (youtube) {
    links.push({ label: 'YouTube', href: youtube, icon: 'youtube' });
  }
  if (threads) {
    links.push({ label: 'Threads', href: threads, icon: 'at-sign' });
  }
  return links;
}

export function getYoutubeUrl(): string {
  return (
    process.env.NEXT_PUBLIC_YOUTUBE_URL?.trim() ||
    'https://www.youtube.com/@nodiworks'
  );
}
