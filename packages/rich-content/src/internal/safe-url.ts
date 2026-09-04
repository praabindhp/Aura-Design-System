const allowedProtocol = /^(?:https?:|mailto:|tel:)/i;
const explicitProtocol = /^[a-z][a-z\d+.-]*:/i;

function hasControlCharacter(value: string): boolean {
  return Array.from(value).some((character) => {
    const codePoint = character.codePointAt(0) ?? 0;
    return codePoint < 32 || codePoint === 127;
  });
}

export function safeUrl(value: string | undefined): string | null {
  if (!value) return null;

  const candidate = value.trim();
  if (!candidate || hasControlCharacter(candidate)) return null;
  if (allowedProtocol.test(candidate)) return candidate;
  if (explicitProtocol.test(candidate)) return null;

  return candidate;
}

export function isExternalHttpUrl(value: string): boolean {
  return /^(?:https?:)?\/\//i.test(value);
}
