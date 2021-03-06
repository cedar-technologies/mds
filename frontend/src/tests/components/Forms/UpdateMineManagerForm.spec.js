import React from 'react';
import { shallow } from 'enzyme';
import { UpdateMineManagerForm } from '@/components/Forms/UpdateMineManagerForm';
import * as MOCK from '@/tests/mocks/dataMocks';

const dispatchProps = {};
const props = {};

const setupDispatchProps = () => {
  dispatchProps.handleSubmit = jest.fn();
  dispatchProps.handleChange= jest.fn();
  dispatchProps.closeModal = jest.fn();
};

const setupProps = () => {
  props.parties = MOCK.PARTY.parties;
  props.partyIds = MOCK.PARTY.partyIds;
  props.title = "mockTitle";
  props.initialValues = {mineManager: null, startDate: null}
}

beforeEach(() => {
  setupDispatchProps();
  setupProps();
});

describe('AddPartyFrom', () => {
  it('renders properly', () => {
    const component = shallow(<UpdateMineManagerForm {...dispatchProps} {...props} />);
    expect(component).toMatchSnapshot();
  });
});