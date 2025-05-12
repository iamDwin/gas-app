export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "officer" | "viewer";
  organizationId: string;
  createdAt?: Date;
}

export interface userList {
  errorCode: "string";
  errorMessage: "string";
  id: 0;
  userName: "string";
  fullName: "string";
  email: "string";
  roleId: "string";
  roleName: "string";
  institutionId: "string";
  institutionName: "string";
  createdBy: "string";
  institutionType: "string";
  lastLogin: "2025-05-10T14:03:26.256Z";
  passwordChangeDate: "2025-05-10T14:03:26.256Z";
  changePassword: true;
  createdAt: "2025-05-10T14:03:26.256Z";
  type: "string";
  initiatorComment: "string";
  locked: true;
  active: true;
  roleWeight: 0;
  token: "string";
  services: [
    {
      id: 0;
      name: "string";
      weight: 0;
      weightList: "string";
    }
  ];
}

export interface UserResponse {
  errorCode: "string";
  errorMessage: "string";
  users: userList[];
}

export interface UsersResponse {
  errorCode: string;
  errorMessage: string;
  users: UserResponse[];
}
