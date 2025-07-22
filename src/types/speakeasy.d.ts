declare module 'speakeasy' {
  interface GenerateSecretOptions {
    name?: string;
    issuer?: string;
    length?: number;
  }

  interface GeneratedSecret {
    ascii: string;
    hex: string;
    base32: string;
    qr_code_ascii: string;
    qr_code_hex: string;
    qr_code_base32: string;
    google_auth_qr: string;
    otpauth_url: string;
  }

  interface VerifyOptions {
    secret: string;
    token: string;
    encoding?: string;
    window?: number;
    time?: number;
    step?: number;
  }

  interface VerifyResult {
    delta: number;
  }

  interface TotpObject {
    verify(options: VerifyOptions): boolean;
  }

  export function generateSecret(options?: GenerateSecretOptions): GeneratedSecret;
  export const totp: TotpObject & ((options: { secret: string; encoding?: string; time?: number; step?: number }) => string);
  export function totp_verify(options: VerifyOptions): VerifyResult | boolean;
  export function time(options?: { step?: number; initial?: number }): number;
}
