export let debugLog: (text: string) => HTMLParagraphElement;
export function setDebugLog(f: (text: string) => HTMLParagraphElement) {
    debugLog = f;
}

export let debugInfo: (text: string) => HTMLParagraphElement;
export function setDebugInfo(f: (text: string) => HTMLParagraphElement) {
    debugInfo = f;
}

export let debugError: (text: string) => HTMLParagraphElement;
export function setDebugError(f: (text: string) => HTMLParagraphElement) {
    debugError = f;
}
