/** @type {import('eslint').Rule.RuleModule} */
const noShadow = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow box-shadow; elevation uses surface tokens only.',
    },
    schema: [],
    messages: {
      shadow: 'box-shadow is forbidden — use surface lightness tokens for elevation.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    const text = sourceCode.getText();
    const pattern = /\bbox-shadow\s*:/gi;

    return {
      Program() {
        let match;
        while ((match = pattern.exec(text)) !== null) {
          context.report({
            loc: {
              start: sourceCode.getLocFromIndex(match.index),
              end: sourceCode.getLocFromIndex(match.index + match[0].length),
            },
            messageId: 'shadow',
          });
        }
      },
    };
  },
};

export default noShadow;
