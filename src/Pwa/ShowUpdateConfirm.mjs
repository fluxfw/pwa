import { LOCALIZATION_MODULE } from "../Localization/LOCALIZATION_MODULE.mjs";
import { LOCALIZATION_KEY_LATER, LOCALIZATION_KEY_UPDATE, LOCALIZATION_KEY_UPDATE_MESSAGE, LOCALIZATION_KEY_UPDATE_TITLE } from "../Localization/LOCALIZATION_KEY.mjs";

/** @typedef {import("../Localization/Localization.mjs").Localization} Localization */
/** @typedef {import("../StyleSheetManager/StyleSheetManager.mjs").StyleSheetManager} StyleSheetManager */

export class ShowUpdateConfirm {
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
     * @returns {Promise<ShowUpdateConfirm>}
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
     * @returns {Promise<boolean>}
     */
    async showUpdateConfirm() {
        const flux_overlay_element = await (await import("flux-overlay/src/FluxOverlayElement.mjs")).FluxOverlayElement.new(
            await this.#localization.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_UPDATE_TITLE
            ),
            await this.#localization.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_UPDATE_MESSAGE
            ),
            [
                {
                    label: await this.#localization.translate(
                        LOCALIZATION_MODULE,
                        LOCALIZATION_KEY_LATER
                    ),
                    value: "later"
                },
                {
                    label: await this.#localization.translate(
                        LOCALIZATION_MODULE,
                        LOCALIZATION_KEY_UPDATE
                    ),
                    value: "update"
                }
            ],
            this.#style_sheet_manager
        );

        if ((await flux_overlay_element.wait(
            null,
            null,
            false
        )).button === "update") {
            flux_overlay_element.buttons = true;

            await flux_overlay_element.showLoading();

            return true;
        } else {
            flux_overlay_element.remove();

            return false;
        }
    }
}
