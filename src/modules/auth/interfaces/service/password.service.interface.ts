export interface PasswordServiceInterface {
  hashedPassword(password: string): Promise<string>;

  comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
