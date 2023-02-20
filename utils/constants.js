exports.roles = {
    COORDINATOR: 'coordinator',
    ADMINISTRATOR: 'administrator',
    PARTICIPANT: 'participant'
};

exports.tableNames = {
    USERS: 'users',
    ROLES: 'roles',
    USERDOCS: 'user_docs',
    WORKSHOP: 'workshops',
    WORKSHOP_SPECIALIZATION: 'workshop_specializations',
    COORDINATOR_DETAILS: 'coordinator_details',
    INSTITUTE: 'institute',
    WORKSHOP_DETAILS: 'workshop_details'
};

exports.workshop = {
    colNames: {
        workshopId: 'workshop_id',
        coordinatorId: 'coordinator_id',
        coCoordinatorId: 'co_coordinator_id',
        instituteId: 'institute_id',
        workshopDetailsId: 'workshop_details_id',
        draft: 'draft'
    }
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

exports.workshop_details = {
    colNames: {
        workshopId: 'workshop_id',
        areaSpecializationId: 'area_specialization_id',
        subArea: 'sub_area',
        title: 'title',
        beginDate: 'begin_date',
        endDate: 'end_date',
        mode: 'mode',
        participantIntake: 'participant_intake',
        workshopApprovalStatus: 'workshop_approval_status',
        allotedFunds: 'alloted_funds',
        expenditure: 'expenditure',
        quizGenerated: 'quiz_generated',
        quizId: 'quiz_id',
        workshopCompleted: 'workshop_completed'
    }
};