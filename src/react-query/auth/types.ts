export type TSignInPayload = {
  email: string;
  password: string;
};

export type TSignUpPayload = {
  email: string;
  password: string;
  avatar: string;
  firstName: string;
  lastName: string;
};

export type TUpdatePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export type TUpdateProfilePayload = {
  avatar?: string;
  firstName: string;
  lastName: string;
};
