import { Pilet } from 'piral-core';

/**
 * Shows an API extension using Riot components.
 */
export const RiotPilet: Pilet = {
  content: '',
  name: 'Riot Module',
  version: '1.0.0',
  hash: '389',
  setup(piral) {
    piral.registerTile(
      piral.fromRiot({
        name: 'tile',
        exports: {
          components: {
            RiotExtension: piral.RiotExtension,
          },
          state: {
            value: 0,
          },
          increment() {
            this.update({
              value: this.state.value + 1,
            });
          },
          decrement() {
            this.update({
              value: this.state.value - 1,
            });
          },
        } as any,
        template: function(template, expressionTypes, bindingTypes, getComponent) {
          return template(
            '<div class="tile"><h3 expr1="expr1"> </h3><p expr2="expr2"> <riot-extension expr3="expr3" name="smiley"></riot-extension></p><button expr4="expr4">Increment</button><button expr5="expr5">Decrement</button></div>',
            [
              {
                redundantAttribute: 'expr1',
                selector: '[expr1]',
                expressions: [
                  {
                    type: expressionTypes.TEXT,
                    childNodeIndex: 0,
                    evaluate(scope) {
                      return ['Riot: ', scope.state.value].join('');
                    },
                  },
                ],
              },
              {
                redundantAttribute: 'expr2',
                selector: '[expr2]',
                expressions: [
                  {
                    type: expressionTypes.TEXT,
                    childNodeIndex: 0,
                    evaluate(scope) {
                      return [scope.props.rows, ' rows and ', scope.props.columns, ' columns'].join('');
                    },
                  },
                ],
              },
              {
                type: bindingTypes.TAG,
                getComponent: getComponent,
                evaluate(scope) {
                  return 'riot-extension';
                },
                slots: [],
                attributes: [
                  {
                    type: expressionTypes.ATTRIBUTE,
                    name: 'name',
                    evaluate() {
                      return 'smiley';
                    },
                  },
                ],
                redundantAttribute: 'expr3',
                selector: '[expr3]',
              },
              {
                redundantAttribute: 'expr4',
                selector: '[expr4]',
                expressions: [
                  {
                    type: expressionTypes.EVENT,
                    name: 'onclick',
                    evaluate(scope) {
                      return scope.increment;
                    },
                  },
                ],
              },
              {
                redundantAttribute: 'expr5',
                selector: '[expr5]',
                expressions: [
                  {
                    type: expressionTypes.EVENT,
                    name: 'onclick',
                    evaluate(scope) {
                      return scope.decrement;
                    },
                  },
                ],
              },
            ],
          );
        } as any,
      }),
      {
        initialColumns: 2,
        initialRows: 2,
      },
    );
  },
};
