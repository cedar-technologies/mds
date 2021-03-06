import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card } from "antd";
import { Link } from "react-router-dom";
import { uniqBy, some } from "lodash";
import * as router from "@/constants/routes";
import ConditionalButton from "@/components/common/ConditionalButton";
import { modalConfig } from "@/components/modalContent/config";
import * as String from "@/constants/strings";
import * as ModalContent from "@/constants/modalContent";
import CustomPropTypes from "@/customPropTypes";
/**
 * @class ViewPermittee - all information of Permittees located under MineContactInfo.js
 */

const propTypes = {
  closeModal: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handlePartySubmit: PropTypes.func.isRequired,
  fetchMineRecordById: PropTypes.func.isRequired,
  fetchParties: PropTypes.func.isRequired,
  addPermittee: PropTypes.func.isRequired,
  mine: CustomPropTypes.mine.isRequired,
  permittees: PropTypes.objectOf(CustomPropTypes.permittee),
  permitteeIds: PropTypes.arrayOf(PropTypes.string),
};

const defaultProps = {
  permittees: {},
  permitteeIds: [],
};

export class ViewPermittee extends Component {
  /**
   * change permittee on record.
   */
  handlePermitteeSubmit = (values) => {
    const guids = values.permittee.split(", ");
    this.props
      .addPermittee(guids[0], guids[1], values.party, this.props.mine.mine_name, values.startDate)
      .then(() => {
        this.props.fetchMineRecordById(this.props.mine.guid);
        this.props.fetchParties();
        this.props.closeModal();
      });
  };

  openModal(event, onSubmit, permit, handleChange, handlePartySubmit, title) {
    event.preventDefault();
    this.props.openModal({
      props: { onSubmit, permit, handleChange, handlePartySubmit, title },
      content: modalConfig.UPDATE_PERMITTEE,
    });
  }

  render() {
    const uniqPermitsPerParty = (permits, guid) =>
      uniqBy(
        permits.filter(({ permittee }) => some(permittee, ({ party_guid }) => party_guid === guid)),
        "permit_no"
      );
    return (
      <div>
        <Card>
          <table>
            {this.props.permitteeIds.map((id) => (
              <tbody key={id}>
                <tr>
                  <th scope="col">
                    <h4>Permittee</h4>
                  </th>
                  <th scope="col">
                    <h4>Permittee Since</h4>
                  </th>
                </tr>
                <tr>
                  <td data-label="Permittee">
                    <p className="p-large">{this.props.permittees[id].party.name}</p>
                  </td>
                  <td data-label="Permittee Since">
                    <p className="p-large">{this.props.permittees[id].effective_date}</p>
                  </td>
                </tr>
                <tr>
                  <th scope="col">
                    <h4>Permit No.</h4>
                  </th>
                  <th scope="col">
                    <h4>Phone Number (Ext)</h4>
                  </th>
                </tr>
                <tr>
                  <td data-label="Permit No.">
                    {this.props.mine.mine_permit[0]
                      ? uniqPermitsPerParty(this.props.mine.mine_permit, id).map(
                          ({ permit_no }) => (
                            <Link
                              to={router.MINE_SUMMARY.dynamicRoute(this.props.mine.guid, "permit")}
                              key={permit_no}
                            >
                              <p className="p-large">{permit_no}</p>
                            </Link>
                          )
                        )
                      : String.EMPTY_FIELD}
                  </td>
                  <td data-label="Phone Number (Ext)">
                    <p className="p-large">
                      {this.props.permittees[id].party.phone_no} (
                      {this.props.permittees[id].party.phone_ext
                        ? this.props.permittees[id].party.phone_ext
                        : String.EMPTY_FIELD}
                      )
                    </p>
                  </td>
                </tr>
                <tr>
                  <th scope="col">
                    <h4>Email</h4>
                  </th>
                </tr>
                <tr>
                  <td data-label="Email">
                    <p className="p-large">{this.props.permittees[id].party.email}</p>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
          <div className="right center-mobile">
            <ConditionalButton
              handleAction={(event) =>
                this.openModal(
                  event,
                  this.handlePermitteeSubmit,
                  this.props.mine.mine_permit,
                  this.props.handleChange,
                  this.props.handlePartySubmit,
                  ModalContent.UPDATE_PERMITTEE
                )
              }
              string={ModalContent.UPDATE_PERMITTEE}
              type="primary"
            />
          </div>
        </Card>
      </div>
    );
  }
}

ViewPermittee.propTypes = propTypes;
ViewPermittee.defaultProps = defaultProps;

export default ViewPermittee;
