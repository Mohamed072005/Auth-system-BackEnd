export interface HashServiceInterface {
  hashClaims(parametre: any): Promise<string>;
}
