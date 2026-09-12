export type ContentsListItem = {
  count: number;
  label: string;
  note: string;
};

export type ContentsListProps = {
  items: ContentsListItem[];
};

export function ContentsList({ items }: ContentsListProps) {
  return (
    <ul className="list-none m-0 p-0 flex flex-col break-keep">
      {items.map((item) => (
        <li
          key={`${item.label}-${item.count}`}
          className="flex items-baseline gap-4 py-inline border-b border-line"
        >
          <span className="text-h2 font-bold text-strong min-w-[48px] max-[720px]:text-[24px]">
            {item.count}
          </span>
          <div className="flex flex-col gap-[4px] min-w-0">
            <span className="text-[16px] text-strong">{item.label}</span>
            <span className="text-[13px] text-muted">{item.note}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
