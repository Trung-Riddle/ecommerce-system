
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: any
}
export interface RegisterResponse {
  message: string;
}
export interface VerifyOTPResponse extends LoginResponse {
  message: string
  user: any
}
