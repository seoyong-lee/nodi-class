import {
  renderMail,
  type FooterContext,
  type MailContent,
} from './layout.js';

export function inquiryAckMail(opts: { footer: FooterContext }): MailContent {
  return renderMail({
    subject: '검토 요청을 받았습니다',
    paragraphs: [
      '안녕하세요, 노디입니다.',
      '보내주신 결과물을 확인하고 2영업일 안에 진행 가능 여부와 범위, 견적을 이 주소로 회신드립니다.',
      '급한 내용이 있으면 이 메일에 답장으로 알려주세요.',
      '노디 드림',
    ],
    footer: {
      ...opts.footer,
      unsubscribeUrl: undefined,
    },
  });
}
