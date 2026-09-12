import { Icon } from '../core/Icon';

export type FitListProps = {
  fit: string[];
  notFor: string[];
};

export function FitList({ fit, notFor }: FitListProps) {
  return (
    <div className="grid grid-cols-2 gap-block max-[720px]:grid-cols-1 break-keep">
      <div className="flex flex-col gap-inline">
        <div className="flex items-center gap-inline-tight text-strong font-bold text-body-sm">
          <span className="text-muted">
            <Icon name="check" size={16} />
          </span>
          이런 분께 맞습니다
        </div>
        <ul className="m-0 pl-5 text-body text-body-sm leading-[1.7]">
          {fit.map((item) => (
            <li key={item} className="mt-inline-tight first:mt-0">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-inline">
        <div className="flex items-center gap-inline-tight text-strong font-bold text-body-sm">
          <span className="text-muted">
            <Icon name="minus" size={16} />
          </span>
          이런 분께는 맞지 않습니다
        </div>
        <ul className="m-0 pl-5 text-body text-body-sm leading-[1.7]">
          {notFor.map((item) => (
            <li key={item} className="mt-inline-tight first:mt-0">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
