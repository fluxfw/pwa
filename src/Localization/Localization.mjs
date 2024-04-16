/**
 * @typedef {{getLanguage: () => Promise<{language: string}>, translate: (module: string, key: string, placeholders?: {[key: string]: string} | null) => Promise<string>}} Localization
 */
