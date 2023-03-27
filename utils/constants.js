exports.roles = {
    COORDINATOR: 'coordinator',
    ADMINISTRATOR: 'administrator',
    PARTICIPANT: 'participant'
};

exports.fileUploadNames = {
    USER: {

    },
    WORKSHOP: {
        IMAGES: "workshopImages",
        MEDIA_IMAGES: "workshopMediaImages",
        REPORT: "workshopReport",
        STMT_OF_EXPENDITURE: "workshopStmtOfExpenditure"
    }
};

exports.tableNames = {
    USERS: 'users',
    ROLES: 'roles',
    USERDOCS: 'user_docs',
    WORKSHOP: 'workshops',
    WORKSHOP_SPECIALIZATION: 'workshop_specializations',
    COORDINATOR_DETAILS: 'coordinator_details',
    INSTITUTE: 'institute',
    WORKSHOP_DETAILS: 'workshop_details',
    RESOURCE_PERSON:'resource_persons',
    TWILIO: 'twilio',
    QUESTIONS:'questions',
    QUIZ:'quizes',
    WORKSHOP_PHOTOS: 'workshop_photos',
    WORKSHOP_MEDIA_PHOTOS: 'workshop_media_photos',
    WORKSHOP_OTHER_DOCS: 'workshop_other_docs'
};

exports.user = { 
    colNames: {
        userId: 'user_id',
        firstName: 'first_name',
        lastName: 'last_name',
        emailId: 'email_id',
        mobileNo: 'mobile_no',
        dob: 'dob',
        title: 'title',
        password: 'password',
        gender: 'gender',
        roleId: 'role_id',
        profileApproved: 'profile_approved',
        roleName: 'role_name'
    }
}

exports.user_docs = {
    colNames: {
        id: 'id',
        filePath: 'file_path',
        userId: 'user_id'
    }
};

exports.workshop = {
    colNames: {
        workshopId: 'workshop_id',
        coordinatorId: 'coordinator_id',
        coCoordinatorId: 'co_coordinator_id',
        instituteId: 'institute_id',
        workshopDetailsId: 'workshop_details_id',
        draft: 'draft',
        otpVerified: 'otp_verified'
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

exports.quizes={
    colNames:{
     quiz_id:'quiz_id',
     quiz_name:'quiz_name'
    }
};

exports.questions={
    colNames:{
        quiz_id:'quiz_id',
        question_id:'question_id',
        questStmt:'question_statement',
        option1:'option1',
        option2:'option2',
        option3:'option3',
        option4:'option4',
        answer:'answer'
    }
}

exports.twilio = {
    colNames: {
        id: 'id',
        sid: 'sid'
    }
};

exports.workshop_photos = {
    colNames: {
        id: 'id',
        photoUrl: 'photo_url',
        workshopId: 'workshop_id'
    }
};

exports.workshop_media_photos = {
    colNames: {
        id: 'id',
        mediaPhotoUrl: 'media_photo_url',
        workshopId: 'workshop_id'
    }
};

exports.workshop_other_docs = {
    colNames: {
        id: 'id',
        reportUrl: 'report_url',
        stmtExpenditureUrl: 'stmt_expenditure_url',
        certificateUrl: 'certificate_url',
        workshopId: 'workshop_id'
    }
};

exports.fileSize = 2 * 1024 * 1024;