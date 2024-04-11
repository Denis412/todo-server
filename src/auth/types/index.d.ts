export type JwtPayload = {
  sub: string;
  email: string;
};

export type JwtPayloadWithRefreshToken = JwtPayload & { refresh_token: string };
