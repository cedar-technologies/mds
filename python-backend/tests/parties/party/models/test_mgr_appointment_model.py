from tests.constants import TEST_PARTY_PER_GUID_1, TEST_MANAGER_GUID, TEST_MINE_GUID
from app.api.parties.party.models.mgr_appointment import MgrAppointment


# Mgr Appointment Class Methods
def test_mgr_model_find_by_person_guid(test_client, auth_headers):
    mgr = MgrAppointment.find_by_party_guid(TEST_PARTY_PER_GUID_1)
    assert str(mgr[0].party_guid) == TEST_PARTY_PER_GUID_1


def test_mgr_model_find_by_mgr_appointment_guid(test_client, auth_headers):
    mgr = MgrAppointment.find_by_mgr_appointment_guid(TEST_MANAGER_GUID)
    assert str(mgr.mgr_appointment_guid) == TEST_MANAGER_GUID


def test_mgr_model_find_by_mine_guid(test_client, auth_headers):
    mgr = MgrAppointment.find_by_mine_guid(TEST_MINE_GUID)
    assert str(mgr[0].mine_guid) == TEST_MINE_GUID
