export interface PasswordServiceInterface {
  hashedPassword(password: string): Promise<string>;
}
