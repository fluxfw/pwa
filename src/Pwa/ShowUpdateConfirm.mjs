import { LOCALIZATION_MODULE_PWA } from "../Localization/LOCALIZATION_MODULE.mjs";

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
                "A new version of {name} is available\nThe update is installed automatically once all instances are closed\nThe update can be tried to be forced, but this may make conflicts if multiple instances exists and may take up to a minute",
                LOCALIZATION_MODULE_PWA,
                {
                    name
                }
            ),
            [
                {
                    label: await this.#localization.translate(
                        "Later",
                        LOCALIZATION_MODULE_PWA
                    ),
                    value: "later"
                },
                {
                    label: await this.#localization.translate(
                        "Force update",
                        LOCALIZATION_MODULE_PWA
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
