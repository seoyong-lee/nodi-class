'use client';

import { useState } from 'react';
import { Button, Input } from '@nodi/design-system';

/** Visual stub for access=paid locked gate — reopen API not wired yet. */
export function PaidGateStub() {
  const [email, setEmail] = useState('');

  return (
    <section
      id="gate"
      className="scroll-mt-24 bg-raised border-hairline rounded flex flex-col gap-block-tight min-w-0 box-border overflow-hidden p-10 max-[720px]:p-6"
    >
      <div className="flex flex-col gap-inline">
        <h3 className="m-0 text-h3 font-bold text-strong break-keep">
          이 자료는 「클로드 디자인 실전」 교재가 되었습니다
        </h3>
        <p className="m-0 max-w-measure text-body-sm text-body break-keep">
          이전에 등록한 이메일이면 그대로 열립니다. 새로 보시려면 강의에서 볼 수
          있습니다.
        </p>
      </div>
      <div className="flex flex-col gap-6 min-w-0 w-full">
        <Input
          label="이메일"
          type="email"
          name="email"
          placeholder="이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button variant="secondary" type="button" disabled>
          등록한 이메일로 열기
        </Button>
        <Button variant="primary" href="/course">
          강의 보기
        </Button>
      </div>
    </section>
  );
}
