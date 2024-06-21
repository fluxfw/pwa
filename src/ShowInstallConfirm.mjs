import { LOCALIZATION_MODULE } from "./Localization/LOCALIZATION_MODULE.mjs";
import { LOCALIZATION_KEY_ASK_LATER, LOCALIZATION_KEY_DON_T_SHOW_AGAIN, LOCALIZATION_KEY_INSTALL, LOCALIZATION_KEY_INSTALL_MESSAGE, LOCALIZATION_KEY_INSTALL_TITLE } from "./Localization/LOCALIZATION_KEY.mjs";

/** @typedef {import("./Localization/Localization.mjs").Localization} Localization */
/** @typedef {import("./setHideConfirm.mjs").setHideConfirm} setHideConfirm */
/** @typedef {import("./StyleSheetManager/StyleSheetManager.mjs").StyleSheetManager} StyleSheetManager */

export class ShowInstallConfirm {
    /**
     * @type {Localization}
     */
    #localization;
    /**
     * @type {StyleSheetManager | null}
     */
    #style_sheet_manager;

    /**
     * @param {Localization} localization
     * @param {StyleSheetManager | null} style_sheet_manager
     * @returns {Promise<ShowInstallConfirm>}
     */
    static async new(localization, style_sheet_manager = null) {
        return new this(
            localization,
            style_sheet_manager
        );
    }

    /**
     * @param {Localization} localization
     * @param {StyleSheetManager | null} style_sheet_manager
     * @private
     */
    constructor(localization, style_sheet_manager) {
        this.#localization = localization;
        this.#style_sheet_manager = style_sheet_manager;
    }

    /**
     * @param {setHideConfirm} set_hide_confirm
     * @returns {Promise<boolean | -1 | null>}
     */
    async showInstallConfirm(set_hide_confirm) {
        const overlay_element = await (await import("overlay/src/OverlayElement.mjs")).OverlayElement.new(
            await this.#localization.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_INSTALL_TITLE
            ),
            await this.#localization.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_INSTALL_MESSAGE
            ),
            null,
            [
                {
                    label: await this.#localization.translate(
                        LOCALIZATION_MODULE,
                        LOCALIZATION_KEY_INSTALL
                    ),
                    value: "install",
                    wide: true
                },
                {
                    label: await this.#localization.translate(
                        LOCALIZATION_MODULE,
                        LOCALIZATION_KEY_ASK_LATER
                    ),
                    value: "later",
                    wide: true
                },
                {
                    label: await this.#localization.translate(
                        LOCALIZATION_MODULE,
                        LOCALIZATION_KEY_DON_T_SHOW_AGAIN
                    ),
                    value: "not",
                    wide: true
                }
            ],
            this.#style_sheet_manager
        );

        set_hide_confirm(
            async () => {
                await overlay_element.close(
                    "hide"
                );
            }
        );

        switch ((await overlay_element.wait()).button) {
            case "hide":
                return -1;

            case "install":
                return true;

            case "not":
                return false;

            case "later":
            default:
                return null;
        }
    }
}
