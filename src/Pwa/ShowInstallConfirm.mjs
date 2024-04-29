import { LOCALIZATION_MODULE } from "../Localization/LOCALIZATION_MODULE.mjs";
import { LOCALIZATION_KEY_ASK_LATER, LOCALIZATION_KEY_DON_T_SHOW_AGAIN, LOCALIZATION_KEY_INSTALL, LOCALIZATION_KEY_INSTALL_MESSAGE, LOCALIZATION_KEY_INSTALL_TITLE } from "../Localization/LOCALIZATION_KEY.mjs";

/** @typedef {import("../Localization/Localization.mjs").Localization} Localization */
/** @typedef {import("./setHideConfirm.mjs").setHideConfirm} setHideConfirm */
/** @typedef {import("../StyleSheetManager/StyleSheetManager.mjs").StyleSheetManager} StyleSheetManager */

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
     * @returns {Promise<boolean | null>}
     */
    async showInstallConfirm(set_hide_confirm) {
        const flux_overlay_element = await (await import("flux-overlay/src/FluxOverlayElement.mjs")).FluxOverlayElement.new(
            await this.#localization.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_INSTALL_TITLE
            ),
            await this.#localization.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_INSTALL_MESSAGE
            ),
            [
                {
                    label: await this.#localization.translate(
                        LOCALIZATION_MODULE,
                        LOCALIZATION_KEY_INSTALL
                    ),
                    value: "install"
                },
                {
                    label: await this.#localization.translate(
                        LOCALIZATION_MODULE,
                        LOCALIZATION_KEY_ASK_LATER
                    ),
                    value: "later"
                },
                {
                    label: await this.#localization.translate(
                        LOCALIZATION_MODULE,
                        LOCALIZATION_KEY_DON_T_SHOW_AGAIN
                    ),
                    value: "not"
                }
            ],
            this.#style_sheet_manager
        );

        flux_overlay_element.buttons_vertical = true;

        set_hide_confirm(
            () => {
                flux_overlay_element.remove();
            }
        );

        switch ((await flux_overlay_element.wait()).button) {
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
