import { LOCALIZATION_KEY_ASK_LATER, LOCALIZATION_KEY_DON_T_SHOW_AGAIN, LOCALIZATION_KEY_FORCE_UPDATE, LOCALIZATION_KEY_INSTALL_AS_PWA, LOCALIZATION_KEY_LATER, LOCALIZATION_KEY_SHOW_INSTALL_CONFIRM_MESSAGE, LOCALIZATION_KEY_SHOW_UPDATE_CONFIRM_MESSAGE } from "./LOCALIZATION_KEY.mjs";

export const TEXTS_DE = Object.freeze({
    [LOCALIZATION_KEY_ASK_LATER]: "Später nachfragen",
    [LOCALIZATION_KEY_DON_T_SHOW_AGAIN]: "Nicht erneut anzeigen",
    [LOCALIZATION_KEY_FORCE_UPDATE]: "Aktualisieren erzwingen",
    [LOCALIZATION_KEY_INSTALL_AS_PWA]: "Als PWA installieren",
    [LOCALIZATION_KEY_LATER]: "Später",
    [LOCALIZATION_KEY_SHOW_INSTALL_CONFIRM_MESSAGE]: "Möchtest du {name} als PWA installieren?\nDu kannst sie auch später direkt vom Browser aus installieren",
    [LOCALIZATION_KEY_SHOW_UPDATE_CONFIRM_MESSAGE]: "Eine neue Version von {name} ist verfügbar\nDas Update wird automatisch installiert, sobald alle Instanzen geschlossen sind\nDas Update kann versucht erzwungen zu werden, aber das könnte Konflikte verursachen, wenn mehere Instanzen exisitieren, und dauert möglicherweise bis zu einer Minute"
});
