export class TokenPayloadDto {
  sub: number;
  name: string;
  roles: string[];
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}
