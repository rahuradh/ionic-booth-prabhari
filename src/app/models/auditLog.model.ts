export interface AuditLog {
    name: string,
    partyResponsibility: string,
    phoneNo: string,
    password: string;
    accessType: string,
    accessCode: string,
    isAdminApproved: boolean,
    activity: string,
    loggedTime: Date,
}