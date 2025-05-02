export interface HashServiceInterface {
  hashClaims(parametre: any): Promise<string>;
  compareClaims(plainClaims: string, hashedClaims: string): Promise<boolean>;
}
