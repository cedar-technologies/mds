import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Tabs, Row, Col, Divider, Icon } from "antd";
import {
  fetchPartyRelationshipTypes,
  fetchPartyRelationships,
} from "@/actionCreators/partiesActionCreator";
import { fetchMineRecordById } from "@/actionCreators/mineActionCreator";
import { getPartyRelationshipTypes, getPartyRelationships } from "@/selectors/partiesSelectors";
import { getMines } from "@/selectors/mineSelectors";
import Loading from "@/components/common/Loading";
import * as router from "@/constants/routes";
import CustomPropTypes from "@/customPropTypes";

/**
 * @class RelationshipProfile - profile view for party relationship types
 */

const TabPane = Tabs.TabPane;

const propTypes = {
  fetchMineRecordById: PropTypes.func.isRequired,
  fetchPartyById: PropTypes.func.isRequired,
  fetchPartyRelationshipTypes: PropTypes.func.isRequired,
  fetchPartyRelationships: PropTypes.func.isRequired,
  partyRelationships: PropTypes.arrayOf(CustomPropTypes.partyRelationship),
  partyRelationshipTypes: PropTypes.arrayOf(CustomPropTypes.dropdownListItem),
  match: PropTypes.object,
  mines: PropTypes.object,
};

const defaultProps = {
  partyRelationships: [],
  partyRelationshipTypes: [],
};

export class RelationshipProfile extends Component {
  componentDidMount() {
    const { id, typeCode } = this.props.match.params;
    this.props.fetchPartyRelationshipTypes();
    this.props.fetchPartyRelationships(id, null, typeCode);

    const mine = this.props.mines[id];
    if (!mine) {
      this.props.fetchMineRecordById(id);
    }
  }

  render() {
    const { id, typeCode } = this.props.match.params;
    const mine = this.props.mines[id];

    const isLoaded =
      this.props.partyRelationshipTypes.length > 0 &&
      (this.props.partyRelationships.length > 0 && mine);

    if (isLoaded) {
      return (
        <div className="profile">
          <div className="profile__header">
            <div className="inline-flex between">
              <h1 className="bold">
                {this.props.partyRelationshipTypes &&
                  this.props.partyRelationshipTypes.find(
                    (x) => x.value === this.props.partyRelationships[0].mine_party_appt_type_code
                  ).label}{" "}
                History
              </h1>
            </div>
            <div className="inline-flex between">
              <div className="inline-flex">
                <h4>
                  <Link to={router.MINE_SUMMARY.dynamicRoute(mine.guid, "contact-information")}>
                    {mine && mine.mine_detail[0].mine_name}
                  </Link>
                </h4>
              </div>
            </div>
          </div>
          <div className="profile__content">
            <Tabs activeKey="history" size="large" animated={{ inkBar: true, tabPane: false }}>
              <TabPane tab="History" key="history">
                <div>
                  <Row type="flex" style={{ textAlign: "center" }}>
                    <Col span={8}>
                      <h2>Contact</h2>
                    </Col>
                    <Col span={8}>
                      <h2>Role</h2>
                    </Col>
                    <Col span={8}>
                      <h2>dates</h2>
                    </Col>
                  </Row>
                  <Divider style={{ height: "2px", backgroundColor: "#013366", margin: "0" }} />
                </div>
                {this.props.partyRelationships.map((partyRelationship) => (
                  <div>
                    <Row type="flex" style={{ textAlign: "center" }}>
                      <Col span={8}>
                        <Link
                          to={router.PARTY_PROFILE.dynamicRoute(partyRelationship.party.party_guid)}
                        >
                          {partyRelationship.party.name}
                        </Link>
                      </Col>
                      <Col span={8}>
                        {this.props.partyRelationshipTypes &&
                          this.props.partyRelationshipTypes.find(
                            (x) => x.value === partyRelationship.mine_party_appt_type_code
                          ).label}
                      </Col>
                      <Col span={8}>
                        <Icon type="clock-circle" />
                        &nbsp;&nbsp;
                        {partyRelationship.start_date === "None"
                          ? "Unknown"
                          : partyRelationship.start_date}{" "}
                        -{" "}
                        {partyRelationship.end_date === "None"
                          ? "Present"
                          : partyRelationship.end_date}
                      </Col>
                    </Row>
                  </div>
                ))}
              </TabPane>
            </Tabs>
          </div>
        </div>
      );
    }
    return <Loading />;
  }
}
const mapStateToProps = (state) => ({
  mines: getMines(state),
  partyRelationshipTypes: getPartyRelationshipTypes(state),
  partyRelationships: getPartyRelationships(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchMineRecordById,
      fetchPartyRelationshipTypes,
      fetchPartyRelationships,
    },
    dispatch
  );

RelationshipProfile.propTypes = propTypes;
RelationshipProfile.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RelationshipProfile);
