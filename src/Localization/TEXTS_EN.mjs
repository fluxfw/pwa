import { LOCALIZATION_KEY_ASK_LATER, LOCALIZATION_KEY_DON_T_SHOW_AGAIN, LOCALIZATION_KEY_FORCE_UPDATE, LOCALIZATION_KEY_INSTALL_AS_PWA, LOCALIZATION_KEY_LATER, LOCALIZATION_KEY_SHOW_INSTALL_CONFIRM_MESSAGE, LOCALIZATION_KEY_SHOW_UPDATE_CONFIRM_MESSAGE } from "./LOCALIZATION_KEY.mjs";

export const TEXTS_EN = Object.freeze({
    [LOCALIZATION_KEY_ASK_LATER]: "Ask later",
    [LOCALIZATION_KEY_DON_T_SHOW_AGAIN]: "Don't show again",
    [LOCALIZATION_KEY_FORCE_UPDATE]: "Force update",
    [LOCALIZATION_KEY_INSTALL_AS_PWA]: "Install as PWA",
    [LOCALIZATION_KEY_LATER]: "Later",
    [LOCALIZATION_KEY_SHOW_INSTALL_CONFIRM_MESSAGE]: "Do you wish to install {name} as PWA?\nYou can also install it later directly from your browser",
    [LOCALIZATION_KEY_SHOW_UPDATE_CONFIRM_MESSAGE]: "A new version of {name} is available\nThe update is installed automatically once all instances are closed\nThe update can be tried to be forced, but this may make conflicts if multiple instances exists and may take up to a minute or may not work"
});
