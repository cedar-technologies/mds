import React from "react";
import { Table } from "antd";
import NullScreen from "@/components/common/NullScreen";
import * as Strings from "@/constants/strings";
import CustomPropTypes from "@/customPropTypes";
import { formatDate } from "@/utils/helpers";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPartyRelationships } from "@/selectors/partiesSelectors";
/**
 * @class  MinePermitInfo - contains all permit information
 */

const propTypes = {
  mine: CustomPropTypes.mine.isRequired,
  partyRelationships: PropTypes.arrayOf(CustomPropTypes.partyRelationship),
};
const defaultProps = {
  partyRelationships: [],
};

const columns = [
  {
    title: "Permit No.",
    dataIndex: "permitNo",
    key: "permitNo",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Permittee",
    dataIndex: "permittee",
    key: "permittee",
  },
  {
    title: "Authorization End Date",
    dataIndex: "authorizationEndDate",
    key: "authorizationEndDate",
  },

  {
    title: "First Issued",
    dataIndex: "firstIssued",
    key: "firstIssued",
  },
  {
    title: "Last Amended",
    dataIndex: "lastAmended",
    key: "lastAmended",
  },
];

const childColumns = [
  { title: "Permit No.", dataIndex: "permitNo", key: "childPermitNo" },
  { title: "Date", dataIndex: "Date", key: "Date" },
  { title: "Permittee", dataIndex: "permittee", key: "childPermittee" },
  { title: "Description", dataIndex: "description", key: "description" },
];

const groupPermits = (permits) =>
  permits.reduce((acc, permit) => {
    acc[permit.permit_no] = acc[permit.permit_no] || [];
    acc[permit.permit_no].push(permit);
    return acc;
  }, {});

const transformRowData = (permits, partyRelationships) => {
  const latest = permits[0];
  const first = permits[permits.length - 1];
  let permitteeName = "Loading...";
  let permittees = [];
  if (partyRelationships.length > 0) {
    permittees = partyRelationships
      .filter((x) => x.related_guid === latest.permit_guid)
      .sort((pr1, pr2) => {
        if (!(Date.parse(pr1.due_date) === Date.parse(pr2.due_date)))
          return Date.parse(pr1.due_date) > Date.parse(pr2.due_date) ? 1 : -1;
        return pr1.exp_document_name > pr2.exp_document_name ? 1 : -1;
      });
    permitteeName = permittees[0] ? permittees[0].party.party_name : Strings.EMPTY_FIELD;
  }
  return {
    key: latest.permit_guid,
    lastAmended: formatDate(latest.issue_date),
    permitNo: latest.permit_no || Strings.EMPTY_FIELD,
    firstIssued: formatDate(first.issue_date) || Strings.EMPTY_FIELD,
    permittee: permitteeName,
    authorizationEndDate: latest.expiry_date ? formatDate(latest.expiry_date) : Strings.EMPTY_FIELD,
    permittees,
    status: Strings.EMPTY_FIELD,
  };
};

const transformChildRowData = (permittee, record) => ({
  key: record.key,
  permitNo: record.permitNo,
  Date: permittee.start_date,
  permittee: permittee.party.name,
  description: Strings.EMPTY_FIELD,
});

export const MinePermitInfo = (props) => {
  const groupedPermits = Object.values(groupPermits(props.mine.mine_permit));
  const amendmentHistory = (record) => {
    const childRowData = record.record.permittees.map((permittee) =>
      transformChildRowData(permittee, record)
    );
    return (
      <Table align="center" pagination={false} columns={childColumns} dataSource={childRowData} />
    );
  };
  const rowData = groupedPermits.map((permits) =>
    transformRowData(permits, props.partyRelationships)
  );

  return (
    <Table
      className="nested-table"
      align="center"
      pagination={false}
      columns={columns}
      dataSource={rowData}
      expandedRowRender={amendmentHistory}
      locale={{ emptyText: <NullScreen type="permit" /> }}
    />
  );
};

const mapStateToProps = (state) => ({
  partyRelationships: getPartyRelationships(state),
});

MinePermitInfo.propTypes = propTypes;
MinePermitInfo.defaultProps = defaultProps;

export default connect(mapStateToProps)(MinePermitInfo);
