/* @ds-bundle: {"format":4,"namespace":"DesignSystem_e51539","components":[{"name":"EmailGate","sourcePath":"components/blocks/EmailGate.jsx"},{"name":"SiteFooter","sourcePath":"components/blocks/SiteFooter.jsx"},{"name":"ProductCard","sourcePath":"components/cards/ProductCard.jsx"},{"name":"Thumb16x9","sourcePath":"components/cards/ResourceCard.jsx"},{"name":"ResourceCard","sourcePath":"components/cards/ResourceCard.jsx"},{"name":"VideoCard","sourcePath":"components/cards/VideoCard.jsx"},{"name":"BeforeAfter","sourcePath":"components/content/BeforeAfter.jsx"},{"name":"SectionHeading","sourcePath":"components/content/SectionHeading.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"}],"sourceHashes":{"components/blocks/EmailGate.jsx":"cfe2d979b67a","components/blocks/SiteFooter.jsx":"a4f2342a2961","components/cards/ProductCard.jsx":"1c191ba27472","components/cards/ResourceCard.jsx":"bf99d8a3947c","components/cards/VideoCard.jsx":"548b3e7caa19","components/content/BeforeAfter.jsx":"bc1dc4dfc4e7","components/content/SectionHeading.jsx":"999a2d5c8075","components/core/Badge.jsx":"928ccfcd8701","components/core/Button.jsx":"6789aa7168d6","components/core/Icon.jsx":"fad00f2dfb84","components/core/Input.jsx":"2b6ac51dac9d","ui_kits/website/App.jsx":"f11a08e0a3d4","ui_kits/website/HomeScreen.jsx":"e4eee3be8a2c","ui_kits/website/ProductScreen.jsx":"d2f6c7b0cd84","ui_kits/website/ResourcesScreen.jsx":"1e44b93864f0","ui_kits/website/SiteHeader.jsx":"095406eb4ff8","ui_kits/website/VideosScreen.jsx":"7f2d3664d924","ui_kits/website/data.js":"ccb18d053bd9"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DesignSystem_e51539 = window.DesignSystem_e51539 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/content/BeforeAfter.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function BAPane({
  caption,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap-inline)',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--size-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, caption), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: 'var(--border-hairline)',
      borderRadius: 'var(--radius)',
      padding: 'var(--card-pad)',
      minHeight: '180px',
      color: 'var(--text-body)',
      fontSize: 'var(--size-body-sm)',
      lineHeight: 'var(--leading-body)'
    }
  }, children));
}
function BeforeAfter({
  beforeCaption = '만들기 전',
  afterCaption = '만든 후',
  before,
  after,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: 'var(--gap-block-tight)',
      ...style
    }
  }), /*#__PURE__*/React.createElement(BAPane, {
    caption: beforeCaption
  }, before), /*#__PURE__*/React.createElement(BAPane, {
    caption: afterCaption
  }, after));
}
Object.assign(__ds_scope, { BeforeAfter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/BeforeAfter.jsx", error: String((e && e.message) || e) }); }

// components/content/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SectionHeading({
  index,
  label,
  title,
  description,
  align = 'left',
  style,
  ...rest
}) {
  const centered = align === 'center';
  return /*#__PURE__*/React.createElement("header", _extends({}, rest, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap-inline)',
      alignItems: centered ? 'center' : 'flex-start',
      textAlign: centered ? 'center' : 'left',
      ...style
    }
  }), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--size-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      lineHeight: 1.4
    }
  }, index ? index + ' / ' : '', label) : null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 'var(--size-h2)',
      fontWeight: 'var(--weight-bold)',
      lineHeight: 'var(--leading-heading)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--text-strong)',
      wordBreak: 'keep-all'
    }
  }, title), description ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: 'var(--measure)',
      fontSize: 'var(--size-body)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--text-body)',
      wordBreak: 'keep-all'
    }
  }, description) : null);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const LUCIDE = 'https://cdn.jsdelivr.net/npm/lucide-static@0.460.0/icons/';
const CACHE = new Map();

/* Lucide glyphs, fetched once and inlined so they inherit `currentColor`
   through the SVG's own stroke="currentColor". The brand never tints an
   icon with the mint accent on its own. */
function Icon({
  name,
  size = 16,
  style,
  ...rest
}) {
  const [markup, setMarkup] = React.useState(() => CACHE.get(name) || '');
  React.useEffect(() => {
    let alive = true;
    if (CACHE.has(name)) {
      setMarkup(CACHE.get(name));
      return undefined;
    }
    fetch(LUCIDE + name + '.svg').then(r => r.ok ? r.text() : '').then(text => {
      const svg = text.replace(/width="24"/, 'width="100%"').replace(/height="24"/, 'height="100%"');
      CACHE.set(name, svg);
      if (alive) setMarkup(svg);
    }).catch(() => {});
    return () => {
      alive = false;
    };
  }, [name]);
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-hidden": "true"
  }, rest, {
    dangerouslySetInnerHTML: {
      __html: markup
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      flex: '0 0 auto',
      color: 'inherit',
      ...style
    }
  }));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/blocks/SiteFooter.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const FOOTER_POLICY = [{
  label: '이용약관',
  href: '/terms'
}, {
  label: '개인정보처리방침',
  href: '/privacy'
}, {
  label: '환불 정책',
  href: '/refund'
}];
const FOOTER_SOCIAL = [{
  label: 'YouTube',
  href: 'https://www.youtube.com/@nodiworks',
  icon: 'youtube'
}, {
  label: 'Threads',
  href: 'https://www.threads.net/@nodiworks',
  icon: 'at-sign'
}];
function SiteFooter({
  operator = 'Cascades',
  business = ['상호 Cascades', '대표 노디', '사업자등록번호 000-00-00000', '통신판매업신고 제0000-서울-0000호', '문의 hello@nodiworks.com'],
  policyLinks = FOOTER_POLICY,
  socialLinks = FOOTER_SOCIAL,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("footer", _extends({}, rest, {
    style: {
      borderTop: 'var(--border-hairline)',
      padding: '48px 0 64px',
      ...style
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: '0 var(--page-gutter)',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--gap-block)',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap-inline)',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--size-body-sm)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--text-strong)',
      letterSpacing: 'var(--tracking-heading)'
    }
  }, operator), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    }
  }, business.map(line => /*#__PURE__*/React.createElement("li", {
    key: line,
    style: {
      fontSize: 'var(--size-label)',
      lineHeight: 1.8,
      color: 'var(--text-muted)'
    }
  }, line)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap-block-tight)',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      gap: 'var(--gap-block-tight)',
      flexWrap: 'wrap'
    }
  }, policyLinks.map(l => /*#__PURE__*/React.createElement("li", {
    key: l.label
  }, /*#__PURE__*/React.createElement("a", {
    href: l.href,
    style: {
      fontSize: 'var(--size-caption)',
      color: 'var(--text-body)'
    }
  }, l.label)))), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      gap: 'var(--gap-inline)',
      flexWrap: 'wrap'
    }
  }, socialLinks.map(l => /*#__PURE__*/React.createElement("li", {
    key: l.label
  }, /*#__PURE__*/React.createElement("a", {
    href: l.href,
    target: "_blank",
    rel: "noreferrer",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: 'var(--size-caption)',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: l.icon,
    size: 14
  }), l.label)))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--size-label)',
      color: 'var(--text-disabled)'
    }
  }, "\xA9 ", new Date().getFullYear(), " Cascades"))));
}
Object.assign(__ds_scope, { SiteFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/blocks/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const BADGE_TONES = {
  neutral: {
    background: 'var(--surface-raised)',
    color: 'var(--text-muted)',
    borderColor: 'var(--border-subtle)'
  },
  accent: {
    background: 'var(--accent-quiet)',
    color: 'var(--accent)',
    borderColor: 'transparent'
  },
  locked: {
    background: 'transparent',
    color: 'var(--text-muted)',
    borderColor: 'var(--border-subtle)'
  }
};
function Badge({
  tone = 'neutral',
  icon,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 9px',
      border: '1px solid',
      borderRadius: 'var(--radius-badge)',
      fontSize: 'var(--size-label)',
      lineHeight: 1.4,
      letterSpacing: 'var(--tracking-body)',
      whiteSpace: 'nowrap',
      ...BADGE_TONES[tone],
      ...style
    }
  }), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 12
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/cards/ResourceCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Thumb16x9({
  src,
  alt = '',
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '16 / 9',
      width: '100%',
      overflow: 'hidden',
      borderRadius: 'calc(var(--radius) - 3px)',
      background: 'var(--surface-raised)',
      border: 'var(--border-hairline)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--size-label)',
      letterSpacing: 'var(--tracking-label)',
      color: 'var(--text-disabled)'
    }
  }, "16:9"), children);
}
function ResourceCard({
  title,
  thumbnail,
  fromVideo = true,
  locked = true,
  lockedLabel = '이메일 등록 후 열림',
  openLabel = '받기',
  href,
  onOpen,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("article", _extends({}, rest, {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap-inline)',
      background: 'var(--surface-card)',
      border: '1px solid ' + (hover && !locked ? 'var(--border-strong)' : 'var(--border-subtle)'),
      borderRadius: 'var(--radius)',
      padding: '12px 12px 20px',
      transition: 'var(--transition-ui)',
      ...style
    }
  }), /*#__PURE__*/React.createElement(Thumb16x9, {
    src: thumbnail,
    alt: "",
    style: {
      opacity: locked ? 0.55 : 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap-inline)',
      padding: '0 8px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 'var(--size-body)',
      fontWeight: 'var(--weight-bold)',
      lineHeight: 'var(--leading-tight)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--text-strong)',
      wordBreak: 'keep-all'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--gap-inline-tight)',
      flexWrap: 'wrap'
    }
  }, fromVideo ? /*#__PURE__*/React.createElement(__ds_scope.Badge, null, "\uC601\uC0C1\uC5D0\uC11C \uC18C\uAC1C") : null, locked ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "locked",
    icon: "lock"
  }, lockedLabel) : /*#__PURE__*/React.createElement("a", {
    href: href,
    onClick: onOpen,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: 'var(--size-caption)',
      fontWeight: 'var(--weight-bold)'
    }
  }, openLabel, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-right",
    size: 14
  })))));
}
Object.assign(__ds_scope, { Thumb16x9, ResourceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ResourceCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/VideoCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function VideoCard({
  title,
  thumbnail,
  href,
  note,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    target: "_blank",
    rel: "noreferrer"
  }, rest, {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap-inline)',
      background: 'var(--surface-card)',
      border: '1px solid ' + (hover ? 'var(--border-strong)' : 'var(--border-subtle)'),
      borderRadius: 'var(--radius)',
      padding: '12px 12px 20px',
      color: 'inherit',
      textDecoration: 'none',
      transition: 'var(--transition-ui)',
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Thumb16x9, {
    src: thumbnail,
    alt: ""
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 12,
      bottom: 12,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-badge)',
      background: 'rgba(6,18,14,0.72)',
      color: 'var(--text-strong)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "play",
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      padding: '0 8px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 'var(--size-body)',
      fontWeight: 'var(--weight-bold)',
      lineHeight: 'var(--leading-tight)',
      letterSpacing: 'var(--tracking-heading)',
      color: hover ? 'var(--link)' : 'var(--text-strong)',
      wordBreak: 'keep-all',
      transition: 'var(--transition-ui)'
    }
  }, title), note ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--size-caption)',
      color: 'var(--text-muted)'
    }
  }, note) : null));
}
Object.assign(__ds_scope, { VideoCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/VideoCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const BTN_SIZES = {
  md: {
    padding: '14px 22px',
    fontSize: 'var(--size-body-sm)'
  },
  sm: {
    padding: '9px 16px',
    fontSize: 'var(--size-caption)'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  href,
  icon,
  disabled = false,
  fullWidth = false,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: fullWidth ? '100%' : undefined,
    border: '1px solid transparent',
    borderRadius: 'var(--radius)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 'var(--weight-bold)',
    lineHeight: 1.2,
    letterSpacing: 'var(--tracking-body)',
    textDecoration: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'var(--transition-ui)',
    ...BTN_SIZES[size]
  };
  const skin = disabled ? variant === 'primary' ? {
    background: 'var(--surface-field)',
    color: 'var(--text-disabled)'
  } : {
    background: 'transparent',
    color: 'var(--text-disabled)',
    borderColor: 'var(--border-subtle)'
  } : variant === 'primary' ? {
    background: press ? 'var(--accent-press)' : hover ? 'var(--accent-hover)' : 'var(--accent)',
    color: 'var(--text-on-accent)'
  } : {
    background: press ? 'var(--surface-raised)' : 'transparent',
    color: 'var(--text-strong)',
    borderColor: hover ? 'var(--border-strong)' : 'var(--border-subtle)'
  };
  const Tag = href && !disabled ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href && !disabled ? href : undefined,
    disabled: Tag === 'button' ? disabled : undefined,
    "aria-disabled": disabled || undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      ...base,
      ...skin,
      ...style
    }
  }, rest), children, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'sm' ? 14 : 16
  }) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/cards/ProductCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ProductCard({
  label,
  title,
  summary,
  rows = [],
  ctaLabel = '자세히 보기',
  ctaHref,
  onCtaClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("article", _extends({}, rest, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap-block-tight)',
      background: 'var(--surface-card)',
      border: 'var(--border-hairline)',
      borderRadius: 'var(--radius)',
      padding: 'var(--card-pad)',
      ...style
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap-inline-tight)'
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--size-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 'var(--size-h3)',
      fontWeight: 'var(--weight-bold)',
      lineHeight: 'var(--leading-tight)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--text-strong)',
      wordBreak: 'keep-all'
    }
  }, title), summary ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--size-body-sm)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--text-body)',
      wordBreak: 'keep-all'
    }
  }, summary) : null), rows.length ? /*#__PURE__*/React.createElement("dl", {
    style: {
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      borderTop: 'var(--border-hairline)'
    }
  }, rows.map(row => /*#__PURE__*/React.createElement("div", {
    key: row.label,
    style: {
      display: 'grid',
      gridTemplateColumns: '84px 1fr',
      gap: 'var(--gap-inline)',
      padding: '12px 0',
      borderBottom: 'var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("dt", {
    style: {
      fontSize: 'var(--size-caption)',
      color: 'var(--text-muted)'
    }
  }, row.label), /*#__PURE__*/React.createElement("dd", {
    style: {
      margin: 0,
      fontSize: 'var(--size-caption)',
      lineHeight: 1.6,
      color: 'var(--text-strong)',
      wordBreak: 'keep-all'
    }
  }, row.value)))) : null, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    href: ctaHref,
    onClick: onCtaClick,
    fullWidth: true
  }, ctaLabel));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  invalid = false,
  style,
  id,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const autoId = React.useId();
  const inputId = id || autoId;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap-inline-tight)',
      width: '100%'
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: 'var(--size-caption)',
      color: 'var(--text-muted)',
      letterSpacing: 'var(--tracking-body)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    onFocus: e => {
      setFocus(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur && rest.onBlur(e);
    }
  }, rest, {
    style: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '14px 16px',
      background: 'var(--surface-field)',
      color: 'var(--text-strong)',
      border: '1px solid ' + (invalid ? 'var(--border-strong)' : focus ? 'var(--accent)' : 'var(--border-subtle)'),
      borderRadius: 'var(--radius)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--size-body-sm)',
      lineHeight: 1.4,
      letterSpacing: 'var(--tracking-body)',
      outline: 'none',
      transition: 'var(--transition-ui)',
      ...style
    }
  })), hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--size-label)',
      color: 'var(--text-muted)',
      lineHeight: 1.6
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/blocks/EmailGate.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function EmailGate({
  title = '이메일을 남기면 자료를 보내드립니다',
  description = '영상에서 쓴 파일과 체크리스트를 한 번에 보내드립니다.',
  placeholder = '이메일 주소',
  buttonLabel = '자료 받기',
  consent = '자료 전달과 새 자료 안내 목적으로만 사용하고, 언제든 수신을 해지할 수 있습니다.',
  onSubmit,
  submitted = false,
  submittedLabel = '보내드렸습니다. 메일함을 확인해 주세요.',
  style,
  ...rest
}) {
  const [value, setValue] = React.useState('');
  return /*#__PURE__*/React.createElement("section", _extends({}, rest, {
    style: {
      background: 'var(--surface-raised)',
      border: 'var(--border-hairline)',
      borderRadius: 'var(--radius)',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap-block-tight)',
      ...style
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap-inline)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 'var(--size-h3)',
      fontWeight: 'var(--weight-bold)',
      lineHeight: 'var(--leading-tight)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--text-strong)',
      wordBreak: 'keep-all'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: 'var(--measure)',
      fontSize: 'var(--size-body-sm)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--text-body)',
      wordBreak: 'keep-all'
    }
  }, description)), submitted ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--size-body-sm)',
      color: 'var(--accent)'
    }
  }, submittedLabel) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onSubmit && onSubmit(value);
    },
    style: {
      display: 'flex',
      gap: 'var(--gap-inline)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Input, {
    type: "email",
    required: true,
    placeholder: placeholder,
    value: value,
    onChange: e => setValue(e.target.value),
    style: {
      flex: '1 1 240px',
      width: 'auto'
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    type: "submit"
  }, buttonLabel)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--size-label)',
      lineHeight: 1.7,
      color: 'var(--text-muted)',
      maxWidth: 'var(--measure)',
      wordBreak: 'keep-all'
    }
  }, consent));
}
Object.assign(__ds_scope, { EmailGate });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/blocks/EmailGate.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/App.jsx
try { (() => {
const {
  SiteFooter
} = window.DesignSystem_e51539 || {};
function App() {
  const [route, setRoute] = React.useState('home');
  const [unlocked, setUnlocked] = React.useState(false);
  const navigate = r => {
    setRoute(r);
    window.scrollTo(0, 0);
  };
  const unlock = () => setUnlocked(true);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(SiteHeader, {
    route: route,
    onNavigate: navigate
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, route === 'home' && /*#__PURE__*/React.createElement(HomeScreen, {
    onNavigate: navigate,
    unlocked: unlocked,
    onUnlock: unlock
  }), route === 'resources' && /*#__PURE__*/React.createElement(ResourcesScreen, {
    unlocked: unlocked,
    onUnlock: unlock
  }), route === 'product' && /*#__PURE__*/React.createElement(ProductScreen, {
    onNavigate: navigate
  }), route === 'videos' && /*#__PURE__*/React.createElement(VideosScreen, null)), /*#__PURE__*/React.createElement(SiteFooter, null));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomeScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Button,
  SectionHeading,
  ProductCard,
  ResourceCard,
  VideoCard,
  BeforeAfter,
  EmailGate
} = window.DesignSystem_e51539 || {};
function Hero({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement(Section, {
    style: {
      paddingTop: 120,
      paddingBottom: 0,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--gap-block-tight)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--size-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, "Build what you imagine"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 'var(--size-hero)',
      fontWeight: 'var(--weight-bold)',
      lineHeight: 'var(--leading-hero)',
      letterSpacing: 'var(--tracking-hero)',
      color: 'var(--text-strong)',
      wordBreak: 'keep-all'
    }
  }, "\uB9D0\uD558\uBA74,", /*#__PURE__*/React.createElement("br", null), "\uB9CC\uB4E4\uC5B4\uC9D1\uB2C8\uB2E4"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: '30em',
      fontSize: 'var(--size-body)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--text-body)',
      wordBreak: 'keep-all'
    }
  }, "\uCF54\uB529\uB3C4 \uB514\uC790\uC778\uB3C4 \uBAA8\uB985\uB2C8\uB2E4. \uC800\uB3C4 \uADF8\uB7AC\uC2B5\uB2C8\uB2E4.", /*#__PURE__*/React.createElement("br", null), "\uC601\uC0C1\uC5D0\uC11C \uB9CC\uB4E0 \uAC83\uB4E4\uC744 \uADF8\uB300\uB85C \uB450\uACE0 \uAC11\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--gap-inline)',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => onNavigate('resources')
  }, "\uBB34\uB8CC \uC790\uB8CC \uBC1B\uAE30"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    href: "https://www.youtube.com/@nodiworks"
  }, "\uC601\uC0C1 \uBCF4\uB7EC \uAC00\uAE30"))));
}
function HomeScreen({
  onNavigate,
  unlocked,
  onUnlock
}) {
  const d = window.NODI_DATA;
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, {
    onNavigate: onNavigate
  }), /*#__PURE__*/React.createElement(Section, {
    style: {
      paddingTop: 'var(--gap-section)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    index: "01",
    label: "\uBB34\uC5C7\uC774 \uB2EC\uB77C\uC9C0\uB098",
    title: "\uB3C4\uAD6C\uB97C \uBC30\uC6B0\uB294 \uAC8C \uC544\uB2C8\uB77C, \uD558\uB098\uB97C \uB05D\uB0C5\uB2C8\uB2E4"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--gap-block)'
    }
  }), /*#__PURE__*/React.createElement(BeforeAfter, {
    before: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
      style: {
        color: 'var(--text-strong)',
        fontWeight: 700
      }
    }, "\uC8FC\uB9D0 \uC774\uD2C0"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '8px 0 0'
      }
    }, "\uD15C\uD50C\uB9BF\uB9CC \uACE0\uB974\uB2E4 \uB05D\uB0AC\uC2B5\uB2C8\uB2E4. \uC62C\uB9B0 \uD398\uC774\uC9C0\uB294 \uC5C6\uC5C8\uC2B5\uB2C8\uB2E4.")),
    after: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
      style: {
        color: 'var(--text-strong)',
        fontWeight: 700
      }
    }, "\uB300\uD654 30\uBD84"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '8px 0 0'
      }
    }, "\uB0B4 \uBB38\uC7A5\uC774 \uB4E4\uC5B4\uAC04 \uD55C \uC7A5\uC9DC\uB9AC \uD398\uC774\uC9C0\uAC00 \uB0A8\uC558\uC2B5\uB2C8\uB2E4."))
  })), /*#__PURE__*/React.createElement(Section, {
    style: {
      paddingTop: 'var(--gap-section)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    index: "02",
    label: "\uBB34\uB8CC \uC790\uB8CC",
    title: "\uC601\uC0C1\uC5D0\uC11C \uC4F4 \uD30C\uC77C, \uADF8\uB300\uB85C \uB4DC\uB9BD\uB2C8\uB2E4",
    description: "\uB530\uB77C \uD558\uB2E4 \uB9C9\uD788\uB294 \uC9C0\uC810\uC740 \uB300\uBD80\uBD84 \uD30C\uC77C\uC774 \uC5C6\uC5B4\uC11C\uC785\uB2C8\uB2E4."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--gap-block)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: 'var(--gap-block-tight)'
    }
  }, d.resources.slice(0, 3).map(r => /*#__PURE__*/React.createElement(ResourceCard, {
    key: r.id,
    title: r.title,
    locked: !unlocked,
    openLabel: "\uBC1B\uAE30"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--gap-block)'
    }
  }), /*#__PURE__*/React.createElement(EmailGate, {
    submitted: unlocked,
    onSubmit: onUnlock
  })), /*#__PURE__*/React.createElement(Section, {
    style: {
      paddingTop: 'var(--gap-section)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    index: "03",
    label: "\uC0C1\uD488",
    title: "\uB354 \uBE68\uB9AC \uB05D\uB0B4\uACE0 \uC2F6\uC73C\uC2DC\uBA74"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--gap-block)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 'var(--gap-block-tight)'
    }
  }, d.products.map(p => /*#__PURE__*/React.createElement(ProductCard, _extends({
    key: p.title
  }, p, {
    ctaLabel: "\uC790\uC138\uD788 \uBCF4\uAE30",
    onCtaClick: () => onNavigate('product')
  }))))), /*#__PURE__*/React.createElement(Section, {
    style: {
      paddingTop: 'var(--gap-section)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    index: "04",
    label: "\uC601\uC0C1",
    title: "\uCD5C\uADFC \uC62C\uB9B0 \uC601\uC0C1"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--gap-block)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 'var(--gap-block-tight)'
    }
  }, d.videos.slice(0, 3).map(v => /*#__PURE__*/React.createElement(VideoCard, _extends({
    key: v.title
  }, v, {
    href: "https://www.youtube.com/@nodiworks"
  }))))), /*#__PURE__*/React.createElement(Section, {
    style: {
      paddingTop: 'var(--gap-section)',
      paddingBottom: 'var(--gap-section)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--gap-block-tight)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 'var(--size-h2)',
      fontWeight: 'var(--weight-bold)',
      lineHeight: 'var(--leading-heading)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--text-strong)',
      wordBreak: 'keep-all'
    }
  }, "\uC624\uB298 \uD55C \uC7A5\uB9CC \uB9CC\uB4E4\uC5B4 \uBCF4\uC2DC\uC8E0"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: '28em',
      color: 'var(--text-body)',
      wordBreak: 'keep-all'
    }
  }, "\uC790\uB8CC\uB97C \uBC1B\uACE0 \uC601\uC0C1 \uC21C\uC11C\uB300\uB85C \uB530\uB77C\uC624\uC2DC\uBA74 \uB429\uB2C8\uB2E4."), /*#__PURE__*/React.createElement(Button, {
    onClick: () => onNavigate('resources')
  }, "\uBB34\uB8CC \uC790\uB8CC \uBC1B\uAE30"))));
}
Object.assign(window, {
  HomeScreen,
  Hero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ProductScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Button,
  SectionHeading,
  ProductCard,
  BeforeAfter,
  Badge
} = window.DesignSystem_e51539 || {};
function ProductScreen({
  onNavigate
}) {
  const p = window.NODI_DATA.products[0];
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Section, {
    style: {
      paddingTop: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1.4fr) minmax(280px,1fr)',
      gap: 'var(--gap-block)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap-block-tight)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    index: "01",
    label: "\uC0C1\uD488",
    title: p.title,
    description: p.summary
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: 'var(--measure)',
      lineHeight: 'var(--leading-body)',
      wordBreak: 'keep-all'
    }
  }, "\uC601\uC0C1\uC5D0\uC11C \uB9CC\uB4E0 \uD398\uC774\uC9C0\uB97C \uD30C\uC77C \uD55C \uC7A5\uC73C\uB85C \uC815\uB9AC\uD588\uC2B5\uB2C8\uB2E4. \uBB38\uAD6C\uAC00 \uB4E4\uC5B4\uAC08 \uC790\uB9AC\uC5D0\uB294 \uBB34\uC5C7\uC744 \uC4F0\uBA74 \uB418\uB294\uC9C0 \uD55C \uC904\uC529 \uC801\uC5B4 \uB450\uC5C8\uC2B5\uB2C8\uB2E4. \uCF54\uB4DC\uB97C \uACE0\uCE60 \uD544\uC694\uB294 \uC5C6\uACE0, \uBB38\uC7A5\uB9CC \uBC14\uAFB8\uC2DC\uBA74 \uB429\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      paddingLeft: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("li", null, "\uC139\uC158 \uC5EC\uC12F \uAC1C\uB85C \uB41C HTML \uD55C \uD30C\uC77C"), /*#__PURE__*/React.createElement("li", null, "\uBB38\uAD6C \uBE48\uCE78 \uC2DC\uD2B8\uC640 \uC608\uC2DC \uBB38\uC7A5"), /*#__PURE__*/React.createElement("li", null, "\uC218\uC815\uD574\uC11C \uC4F0\uB294 \uBC29\uBC95 \uC124\uBA85 \uC601\uC0C1 \uB9C1\uD06C")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Badge, null, "\uC601\uC0C1\uC5D0\uC11C \uC18C\uAC1C"), /*#__PURE__*/React.createElement(Badge, {
    tone: "locked"
  }, "\uD658\uBD88 \uADDC\uC815 \uC801\uC6A9"))), /*#__PURE__*/React.createElement(ProductCard, _extends({}, p, {
    ctaLabel: "\uAD6C\uB9E4\uD558\uAE30"
  })))), /*#__PURE__*/React.createElement(Section, {
    style: {
      paddingTop: 'var(--gap-section)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    index: "02",
    label: "\uACB0\uACFC",
    title: "\uC4F0\uAE30 \uC804\uACFC \uC4F4 \uB4A4"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--gap-block)'
    }
  }), /*#__PURE__*/React.createElement(BeforeAfter, {
    before: /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0
      }
    }, "\uBB34\uC5C7\uBD80\uD130 \uC368\uC57C \uD560\uC9C0 \uBAB0\uB77C \uB178\uC158 \uBB38\uC11C\uB9CC \uB298\uC5B4\uB0AC\uC2B5\uB2C8\uB2E4."),
    after: /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0
      }
    }, "\uBE48\uCE78\uC744 \uCC44\uC6B0\uB2C8 \uD398\uC774\uC9C0 \uD55C \uC7A5\uC774 \uADF8\uB0A0 \uC62C\uB77C\uAC14\uC2B5\uB2C8\uB2E4.")
  })), /*#__PURE__*/React.createElement(Section, {
    style: {
      paddingTop: 'var(--gap-section)',
      paddingBottom: 'var(--gap-section)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--gap-block-tight)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 'var(--size-h2)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-heading)',
      color: 'var(--text-strong)'
    }
  }, "\uBA3C\uC800 \uBB34\uB8CC \uC790\uB8CC\uBD80\uD130 \uBCF4\uC154\uB3C4 \uB429\uB2C8\uB2E4"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => onNavigate('resources')
  }, "\uBB34\uB8CC \uC790\uB8CC \uBCF4\uAE30"))));
}
Object.assign(window, {
  ProductScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ProductScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ResourcesScreen.jsx
try { (() => {
const {
  SectionHeading,
  ResourceCard,
  EmailGate
} = window.DesignSystem_e51539 || {};
function ResourcesScreen({
  unlocked,
  onUnlock
}) {
  const d = window.NODI_DATA;
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Section, {
    style: {
      paddingTop: 80
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    index: "01",
    label: "\uBB34\uB8CC \uC790\uB8CC",
    title: "\uC601\uC0C1\uC5D0\uC11C \uC4F4 \uD30C\uC77C \uC804\uBD80",
    description: "\uC774\uBA54\uC77C\uC744 \uB0A8\uAE30\uC2DC\uBA74 \uB124 \uAC1C\uB97C \uD55C \uBC88\uC5D0 \uBCF4\uB0B4\uB4DC\uB9BD\uB2C8\uB2E4. \uC0C8 \uC790\uB8CC\uAC00 \uC0DD\uAE30\uBA74 \uAC19\uC740 \uC8FC\uC18C\uB85C \uC54C\uB824\uB4DC\uB9BD\uB2C8\uB2E4."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--gap-block)'
    }
  }), /*#__PURE__*/React.createElement(EmailGate, {
    submitted: unlocked,
    onSubmit: onUnlock
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--gap-block)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: 'var(--gap-block-tight)'
    }
  }, d.resources.map(r => /*#__PURE__*/React.createElement(ResourceCard, {
    key: r.id,
    title: r.title,
    locked: !unlocked,
    openLabel: "\uBC1B\uAE30"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--gap-section)'
    }
  }));
}
Object.assign(window, {
  ResourcesScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ResourcesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteHeader.jsx
try { (() => {
const {
  Button
} = window.DesignSystem_e51539 || {};
const NAV = [{
  id: 'home',
  label: '홈'
}, {
  id: 'resources',
  label: '무료 자료'
}, {
  id: 'product',
  label: '상품'
}, {
  id: 'videos',
  label: '영상'
}];
function SiteHeader({
  route,
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 10,
      background: 'rgba(13,18,16,0.92)',
      backdropFilter: 'blur(8px)',
      borderBottom: 'var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: '0 var(--page-gutter)',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate('home');
    },
    style: {
      fontSize: 19,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: '-0.03em',
      color: 'var(--text-strong)'
    }
  }, "\uB178\uB514"), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 24
    }
  }, NAV.slice(1).map(n => /*#__PURE__*/React.createElement("a", {
    key: n.id,
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate(n.id);
    },
    style: {
      fontSize: 'var(--size-body-sm)',
      color: route === n.id ? 'var(--accent)' : 'var(--text-body)'
    }
  }, n.label)), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    href: "https://www.youtube.com/@nodiworks",
    icon: "arrow-up-right"
  }, "\uC720\uD29C\uBE0C"))));
}
function Section({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: '0 var(--page-gutter)',
      ...style
    }
  }, children);
}
Object.assign(window, {
  SiteHeader,
  Section,
  NAV
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteHeader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/VideosScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  SectionHeading,
  VideoCard,
  Button
} = window.DesignSystem_e51539 || {};
function VideosScreen() {
  const d = window.NODI_DATA;
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Section, {
    style: {
      paddingTop: 80
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    index: "01",
    label: "\uC601\uC0C1",
    title: "\uC9C0\uAE08\uAE4C\uC9C0 \uC62C\uB9B0 \uC601\uC0C1",
    description: "\uC21C\uC11C\uB300\uB85C \uBCF4\uC2E4 \uD544\uC694\uB294 \uC5C6\uC2B5\uB2C8\uB2E4. \uC9C0\uAE08 \uB9C9\uD78C \uAC83\uBD80\uD130 \uACE0\uB974\uC2DC\uBA74 \uB429\uB2C8\uB2E4."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--gap-block)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 'var(--gap-block-tight)'
    }
  }, d.videos.map(v => /*#__PURE__*/React.createElement(VideoCard, _extends({
    key: v.title
  }, v, {
    href: "https://www.youtube.com/@nodiworks"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--gap-block)'
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    href: "https://www.youtube.com/@nodiworks",
    icon: "arrow-up-right"
  }, "\uCC44\uB110\uC5D0\uC11C \uC804\uCCB4 \uBCF4\uAE30")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 'var(--gap-section)'
    }
  }));
}
Object.assign(window, {
  VideosScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/VideosScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/data.js
try { (() => {
window.NODI_DATA = {
  videos: [{
    title: 'AI로 PPT 만들기, 이 순서만 따라하세요',
    note: '이 영상에서 쓴 파일 있음'
  }, {
    title: '왕초보도 따라하는 클로드 10분 마스터',
    note: '이 영상에서 쓴 파일 있음'
  }, {
    title: '바로 따라하는 웹사이트 디자인, 15분 가이드'
  }, {
    title: '영상 편집 시간을 줄이는 클로드 영상 제작 방법'
  }, {
    title: '클로드로 디자인할 때 프롬프트부터 넣지 마세요'
  }, {
    title: 'AI 시대, 이 직업이 뜨고 있습니다'
  }],
  resources: [{
    id: 'ppt',
    title: '클로드 PPT 3단계 체크리스트'
  }, {
    id: 'copy',
    title: '랜딩페이지 문구 빈칸 시트'
  }, {
    id: 'prompt',
    title: '디자인 프롬프트 기본 문장 10개'
  }, {
    id: 'brand',
    title: '브랜드 한 장 정리 템플릿'
  }],
  products: [{
    label: 'TEMPLATE',
    title: '랜딩페이지 한 장 템플릿',
    summary: '영상에서 만든 구조를 그대로 담았습니다.',
    rows: [{
      label: '누구에게',
      value: '팔 건 있는데 페이지가 없는 분'
    }, {
      label: '뭐가 남나',
      value: 'HTML 한 파일과 문구 작성 가이드'
    }, {
      label: '가격',
      value: '39,000원'
    }]
  }, {
    label: 'WORKSHOP',
    title: '2시간 같이 만들기',
    summary: '화면을 공유하고 각자 페이지 한 장을 끝까지 올립니다.',
    rows: [{
      label: '누구에게',
      value: '혼자 하면 중간에 멈추는 분'
    }, {
      label: '뭐가 남나',
      value: '내 도메인에 올라간 페이지 한 장'
    }, {
      label: '가격',
      value: '120,000원'
    }]
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/data.js", error: String((e && e.message) || e) }); }

__ds_ns.EmailGate = __ds_scope.EmailGate;

__ds_ns.SiteFooter = __ds_scope.SiteFooter;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.Thumb16x9 = __ds_scope.Thumb16x9;

__ds_ns.ResourceCard = __ds_scope.ResourceCard;

__ds_ns.VideoCard = __ds_scope.VideoCard;

__ds_ns.BeforeAfter = __ds_scope.BeforeAfter;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Input = __ds_scope.Input;

})();
