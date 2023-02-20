exports.roles = {
    COORDINATOR: 'coordinator',
    ADMINISTRATOR: 'administrator',
    PARTICIPANT: 'participant'
};

exports.coordinator_details = {
    colNames: {
        coordinatorId: 'coordinator_id',
        fatherName: 'father_name',
        alternateEmailId: 'alternate_email_id',
        whatsappNo: 'whatsapp_no',
        stateName: 'state_name',
        districtName: 'district_name',
        permanentAddress: 'permanent_address',
        pincode: 'pincode',
        empId: 'emp_id',
        designation: 'designation',
        specializationId: 'specialization_id',
        experience: 'experience',
    }
};

exports.institute_details = {
    colNames: {
        coordinator_id: 'coordinator_id',
        aicteApproved: 'aicte_approved',
        pid: 'pid',
        instituteType: 'institute_type',
        instituteName: 'institute_name',
        instituteAddress: 'institute_address',
        stateName: 'state_name',
        districtName: 'district_name'
    }
};