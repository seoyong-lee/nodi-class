/** @type {import('eslint').Rule.RuleModule} */
const noRawColor = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow raw hex/rgb/rgba/hsl color literals; use design-system CSS variables.',
    },
    schema: [],
    messages: {
      rawColor: 'Raw color literal — use a design-system color token via var().',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    const text = sourceCode.getText();
    const pattern =
      /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|\b(?:rgb|rgba|hsl|hsla)\s*\(/g;

    return {
      Program() {
        let match;
        while ((match = pattern.exec(text)) !== null) {
          context.report({
            loc: {
              start: sourceCode.getLocFromIndex(match.index),
              end: sourceCode.getLocFromIndex(match.index + match[0].length),
            },
            messageId: 'rawColor',
          });
        }
      },
    };
  },
};

export default noRawColor;
