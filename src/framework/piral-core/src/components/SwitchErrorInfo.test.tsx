import *  as React from 'react';
import { mount } from 'enzyme';
import { SwitchErrorInfo } from './SwitchErrorInfo';

jest.mock('../hooks/globalState', () => ({
    useGlobalState(select: any) {
        return select(state);
    },
}));

const StubComponent1: React.FC = (props) => <div children={props.children} />;
const Unknown: React.FC = (props) => <div children={props.children} />;

const state = {
    registry: {
        extensions: {},
    },
    errorComponents: {
        stubComponent1: StubComponent1,
        unknown: Unknown,
    },
};

(React as any).useMemo = (cb) => cb();

describe('SwitchErrorInfo Module', () => {
    it('is able to render StubComponent1 component', () => {
        const node = mount(<SwitchErrorInfo type="stubComponent1" />);
        expect(node.at(0).exists()).toBe(true);
        expect(node.find(StubComponent1).length).toBe(1);
    });

    it('is able to default render Unknow component if the compenent name not available in state data', () => {
        const node = mount(<SwitchErrorInfo type="notRealComponent" />);
        expect(node.at(0).exists()).toBe(true);
        expect(node.find(Unknown).length).toBe(1);
    });
})