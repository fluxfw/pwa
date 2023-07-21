import { LOCALIZATION_MODULE } from "../Localization/LOCALIZATION_MODULE.mjs";
import { LOCALIZATION_KEY_FORCE_UPDATE, LOCALIZATION_KEY_LATER, LOCALIZATION_KEY_SHOW_UPDATE_CONFIRM_MESSAGE } from "../Localization/LOCALIZATION_KEY.mjs";

/** @typedef {import("../Localization/Localization.mjs").Localization} Localization */
/** @typedef {import("./Manifest.mjs").Manifest} Manifest */

export class ShowUpdateConfirm {
    /**
     * @type {Localization}
     */
    #localization;

    /**
     * @param {Localization} localization
     * @returns {ShowUpdateConfirm}
     */
    static new(localization) {
        return new this(
            localization
        );
    }

    /**
     * @param {Localization} localization
     * @private
     */
    constructor(localization) {
        this.#localization = localization;
    }

    /**
     * @param {Manifest} manifest
     * @returns {Promise<boolean>}
     */
    async showUpdateConfirm(manifest) {
        const {
            FluxOverlayElement
        } = await import("../../../flux-overlay/src/FluxOverlayElement.mjs");

        const name = manifest.name ?? "";

        const flux_overlay_element = FluxOverlayElement.new(
            name,
            await this.#localization.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_SHOW_UPDATE_CONFIRM_MESSAGE,
                {
                    name
                }
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
                        LOCALIZATION_KEY_FORCE_UPDATE
                    ),
                    value: "update"
                }
            ]
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
