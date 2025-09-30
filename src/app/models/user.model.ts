// User model
export interface User {
    userName: string;
    emailId: string;
    password: string;
    role: 'User' | 'Admin' | 'EntryGateOperator' | 'ExitGateOperator' ; // default = 'User'
}