/**
 * @typedef {{addModule: (folder: string, module: string) => Promise<void>, getLanguage: () => Promise<{language: string}>, translate: (text: string, module: string, placeholders?: {[key: string]: string} | null) => Promise<string>}} Localization
 */
