import * as angular from 'angular';
import { Pilet } from 'piral-core';

/**
 * Shows an API extension using Angular.js components.
 */
export const NgjsPilet: Pilet = {
  content: '',
  name: 'Angular.js Module',
  version: '1.0.0',
  hash: '439',
  setup(piral) {
    const Tile = angular.module('my-tile', [piral.NgjsExtension.name]);
    Tile.component('tile', {
      template: `
        <div class="tile">
          <h3>Angular.js: {{counter}}</h3>
          <p>
            {{props.rows}} rows and {{props.columns}} columns
            <extension-component name="smiley"></extension-component>
          </p>
          <button ng-click="increment()">Increment</button>
          <button ng-click="decrement()">Decrement</button>
        </div>
      `,
      controller: [
        '$scope',
        'props',
        ($scope, props) => {
          $scope.counter = 0;
          $scope.increment = () => {
            $scope.counter++;
          };
          $scope.decrement = () => {
            $scope.counter--;
          };
          $scope.props = props;
        },
      ],
    });
    piral.registerTile(piral.fromNgjs('tile', Tile), {
      initialColumns: 2,
      initialRows: 2,
    });
  },
};
