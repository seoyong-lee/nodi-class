'use client';

import { useState } from 'react';
import { EmailGate, type EmailGateExtraField } from '@nodi/design-system';
import { CONSENT_LABEL, GATE_SUBMITTED_LABEL } from '../lib/copy';

type Props = {
  title: string;
  description?: string;
  buttonLabel: string;
  extraField?: EmailGateExtraField;
};

export function EmailGateForm({
  title,
  description,
  buttonLabel,
  extraField,
}: Props) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <EmailGate
      title={title}
      description={description}
      buttonLabel={buttonLabel}
      consent={CONSENT_LABEL}
      submittedLabel={GATE_SUBMITTED_LABEL}
      submitted={submitted}
      onSubmit={() => setSubmitted(true)}
      extraField={extraField}
    />
  );
}
