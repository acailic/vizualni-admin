/**
 * Custom ESLint plugin for visualize-admin
 */

module.exports = {
  rules: {
    'no-large-sx': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow large inline sx prop objects',
          category: 'Best Practices',
          recommended: true,
        },
        messages: {
          noLargeSx: 'Large sx prop objects should be extracted to a separate variable or use makeStyles',
        },
        schema: [],
      },
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name.name !== 'sx') {
              return;
            }

            if (node.value && node.value.expression && node.value.expression.type === 'ObjectExpression') {
              const properties = node.value.expression.properties;
              // Flag if there are more than 3 properties as "large"
              if (properties.length > 3) {
                context.report({
                  node,
                  messageId: 'noLargeSx',
                });
              }
            }
          },
        };
      },
    },
    'make-styles': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Enforce use of tss-react makeStyles over deprecated @mui/styles',
          category: 'Best Practices',
          recommended: true,
        },
        messages: {
          useTssReact: 'Use makeStyles from tss-react instead of @mui/styles (deprecated)',
        },
        schema: [],
      },
      create(context) {
        return {
          ImportDeclaration(node) {
            if (node.source.value === '@mui/styles') {
              const makeStylesImport = node.specifiers.find(
                (spec) => spec.type === 'ImportSpecifier' && spec.imported.name === 'makeStyles'
              );
              if (makeStylesImport) {
                context.report({
                  node,
                  messageId: 'useTssReact',
                });
              }
            }
          },
        };
      },
    },
  },
};
