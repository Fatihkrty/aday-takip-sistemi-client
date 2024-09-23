export interface IResetPasswordForm {
  email: string | null;
  verifyCode: string | null;
  password: string | null;
  confirmPassword: string | null;
}
