import { describe, expect, it } from 'vitest';
import { footerHtml, footerText, parseBizInfo } from '../footer.js';
import { resourceMail } from '../templates/resource.js';
import { waitlistMail } from '../templates/waitlist.js';
import { inquiryAckMail } from '../templates/inquiry-ack.js';

const baseFooter = {
  siteUrl: 'https://nodi.example',
  unsubscribeUrl: 'https://nodi.example/unsubscribe?t=token',
  biz: {
    name: 'Cascades',
    owner: '홍길동',
    regNo: '000-00-00000',
    address: '서울특별시',
  },
};

describe('parseBizInfo', () => {
  it('returns empty object for missing or invalid JSON', () => {
    expect(parseBizInfo(undefined)).toEqual({});
    expect(parseBizInfo('')).toEqual({});
    expect(parseBizInfo('{')).toEqual({});
  });

  it('keeps only non-empty string fields', () => {
    expect(
      parseBizInfo(
        JSON.stringify({
          name: 'Cascades',
          owner: ' ',
          regNo: '123',
          address: '서울',
        }),
      ),
    ).toEqual({ name: 'Cascades', regNo: '123', address: '서울' });
  });
});

describe('footer', () => {
  it('omits business lines when BIZ_INFO is empty', () => {
    const text = footerText({
      siteUrl: 'https://nodi.example',
      unsubscribeUrl: 'https://nodi.example/unsubscribe?t=t',
      biz: {},
    });
    expect(text).toBe(
      [
        '문의 contact@cascades.studio',
        '수신거부: https://nodi.example/unsubscribe?t=t',
      ].join('\n'),
    );
    expect(footerHtml({ siteUrl: 'https://nodi.example', biz: {} })).not.toContain(
      '운영',
    );
  });

  it('renders available business fields', () => {
    const text = footerText(baseFooter);
    expect(text).toContain('노디 AI 클래스 · 운영 Cascades');
    expect(text).toContain('대표 홍길동 · 사업자등록번호 000-00-00000 · 서울특별시');
  });

  it('omits unsubscribe line when not provided', () => {
    const text = footerText({ siteUrl: 'https://nodi.example', biz: {} });
    expect(text).not.toContain('수신거부');
  });
});

describe('resourceMail snapshots', () => {
  it('free with promptCount', () => {
    expect(
      resourceMail({
        resourceTitle: 'AI 티를 줄이는 디자인 5원칙',
        slug: 'ai-design-5-principles',
        access: 'free',
        promptCount: 6,
        confirmUrl: 'https://api.example/confirm?t=abc',
        footer: baseFooter,
      }),
    ).toMatchSnapshot();
  });

  it('free without promptCount', () => {
    expect(
      resourceMail({
        resourceTitle: '요약본',
        slug: 'summary',
        access: 'free',
        confirmUrl: 'https://api.example/confirm?t=abc',
        footer: baseFooter,
      }),
    ).toMatchSnapshot();
  });

  it('free-until-course with promptCount', () => {
    expect(
      resourceMail({
        resourceTitle: '클로드 PPT 실전 가이드북',
        slug: 'claude-ppt-guidebook',
        access: 'free-until-course',
        courseTitle: '클로드 디자인 실전',
        promptCount: 7,
        confirmUrl: 'https://api.example/confirm?t=abc',
        footer: baseFooter,
      }),
    ).toMatchSnapshot();
  });

  it('free-until-course without promptCount', () => {
    expect(
      resourceMail({
        resourceTitle: '클로드 랜딩페이지 디자인 체크리스트',
        slug: 'claude-design-landing-checklist',
        access: 'free-until-course',
        courseTitle: '클로드 디자인 실전',
        confirmUrl: 'https://api.example/confirm?t=abc',
        footer: baseFooter,
      }),
    ).toMatchSnapshot();
  });

  it('includes mailNote and mint button styles', () => {
    const mail = resourceMail({
      resourceTitle: '클로드 PPT 실전 가이드북',
      slug: 'claude-ppt-guidebook',
      access: 'free-until-course',
      courseTitle: '클로드 디자인 실전',
      promptCount: 7,
      mailNote: '부록 PDF도 함께 열려 있습니다.',
      confirmUrl: 'https://api.example/confirm?t=abc',
      footer: baseFooter,
    });
    expect(mail.html).toContain('background:#39CD9B');
    expect(mail.html).toContain('color:#0B1512');
    expect(mail.html).toContain('부록 PDF도 함께 열려 있습니다.');
    expect(mail.text).not.toMatch(/\n{3,}/);
  });
});

describe('other templates', () => {
  it('waitlist copy', () => {
    expect(
      waitlistMail({
        courseTitle: '클로드 디자인 실전 가이드',
        siteUrl: 'https://nodi.example',
        footer: baseFooter,
      }),
    ).toMatchSnapshot();
  });

  it('inquiry-ack omits unsubscribe', () => {
    const mail = inquiryAckMail({ footer: baseFooter });
    expect(mail.subject).toBe('검토 요청을 받았습니다');
    expect(mail.text).not.toContain('수신거부');
    expect(mail.html).not.toContain('수신거부');
    expect(mail).toMatchSnapshot();
  });
});
