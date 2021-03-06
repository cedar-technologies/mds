import React from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { Form, Button, Col, Row, Divider, Popconfirm } from "antd";
import * as FORM from "@/constants/forms";
import { required, validSearchSelection } from "@/utils/Validate";
import { resetForm } from "@/utils/helpers";
import { renderConfig } from "@/components/common/config";
import CustomPropTypes from "@/customPropTypes";

const propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  parties: PropTypes.objectOf(CustomPropTypes.party).isRequired,
  partyIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  permit: PropTypes.arrayOf(CustomPropTypes.permit),
  title: PropTypes.string.isRequired,
};

const defaultProps = {
  permit: [],
};

const permitteeOptions = (permit) =>
  permit.map((obj) => ({
    value: `${obj.permittee[0].permittee_guid}, ${obj.permit_guid}`,
    label: `${obj.permittee[0].party.name}, ${obj.permit_no}`,
  }));

const validParty = validSearchSelection({ key: "parties", err: "Invalid Permittee" });

export const UpdatePermitteeForm = (props) => (
  <Form layout="vertical" onSubmit={props.handleSubmit}>
    <Divider>
      <h2>From</h2>
    </Divider>
    <Row gutter={16}>
      <Col span={24}>
        <Form.Item>
          <Field
            id="permittee"
            name="permittee"
            label="Current Permittee *"
            placeholder="Select Current Permittee"
            component={renderConfig.SELECT}
            data={permitteeOptions(props.permit)}
            validate={[required]}
          />
        </Form.Item>
      </Col>
    </Row>
    <Divider>
      <h2>To</h2>
    </Divider>
    <Row gutter={16}>
      <Col md={12} xs={24}>
        <Form.Item>
          <Field
            id="party"
            name="party"
            label="New Permittee *"
            placeholder="Search for a Party"
            component={renderConfig.LARGE_SELECT}
            data={props.partyIds}
            options={props.parties}
            validate={[required, validParty]}
            handleChange={props.handleChange}
          />
        </Form.Item>
      </Col>
      <Col md={12} xs={24}>
        <Form.Item>
          <Field
            id="startDate"
            name="startDate"
            placeholder="yyyy-mm-dd"
            label="Select a Start date *"
            component={renderConfig.DATE}
            validate={[required]}
          />
        </Form.Item>
      </Col>
    </Row>
    <div className="right center-mobile">
      <Popconfirm
        placement="topRight"
        title="Are you sure you want to cancel?"
        onConfirm={props.closeModal}
        okText="Yes"
        cancelText="No"
      >
        <Button className="full-mobile" type="secondary">
          Cancel
        </Button>
      </Popconfirm>
      <Button className="full-mobile" type="primary" htmlType="submit">
        {props.title}
      </Button>
    </div>
  </Form>
);

UpdatePermitteeForm.propTypes = propTypes;
UpdatePermitteeForm.defaultProps = defaultProps;

export default reduxForm({
  form: FORM.UPDATE_PERMITTEE,
  touchOnBlur: false,
  onSubmitSuccess: resetForm(FORM.UPDATE_PERMITTEE),
})(UpdatePermitteeForm);
