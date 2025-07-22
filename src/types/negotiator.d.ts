declare module 'negotiator' {
  interface NegotiatorOptions {
    headers: { [key: string]: string | string[] | undefined };
  }

  class Negotiator {
    constructor(request: NegotiatorOptions);
    
    charset(): string | undefined;
    charset(available: string[]): string | undefined;
    charsets(): string[];
    charsets(available: string[]): string[];
    
    encoding(): string | undefined;
    encoding(available: string[]): string | undefined;
    encodings(): string[];
    encodings(available: string[]): string[];
    
    language(): string | undefined;
    language(available: string[]): string | undefined;
    languages(): string[];
    languages(available: string[]): string[];
    
    mediaType(): string | undefined;
    mediaType(available: string[]): string | undefined;
    mediaTypes(): string[];
    mediaTypes(available: string[]): string[];
  }

  export = Negotiator;
}
