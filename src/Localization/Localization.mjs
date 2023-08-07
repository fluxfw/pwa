/**
 * @typedef {{addModule: (module: string, localizations: {"fallback-default"?: boolean, "fallback-languages"?: string[], getTexts: () => Promise<{[key: string]: string}>, language: string}[]) => Promise<void>, getLanguage: (module: string) => Promise<{language: string}>, translate: (module: string, key: string, placeholders?: {[key: string]: string} | null) => Promise<string>}} Localization
 */
