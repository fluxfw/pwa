import { LOCALIZATION_MODULE_PWA } from "../Localization/LOCALIZATION_MODULE.mjs";

/** @typedef {import("../Localization/Localization.mjs").Localization} Localization */
/** @typedef {import("./Manifest.mjs").Manifest} Manifest */
/** @typedef {import("./setHideConfirm.mjs").setHideConfirm} setHideConfirm */

export class ShowInstallConfirm {
    /**
     * @type {Localization}
     */
    #localization;

    /**
     * @param {Localization} localization
     * @returns {ShowInstallConfirm}
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
     * @param {setHideConfirm} set_hide_confirm
     * @returns {Promise<boolean | null>}
     */
    async showInstallConfirm(manifest, set_hide_confirm) {
        const {
            FluxOverlayElement
        } = await import("../../../flux-overlay/src/FluxOverlayElement.mjs");

        const name = manifest.name ?? "";

        const flux_overlay_element = FluxOverlayElement.new(
            name,
            await this.#localization.translate(
                "Do you wish to install {name} as PWA?\nYou can also install it later directly from your browser",
                LOCALIZATION_MODULE_PWA,
                {
                    name
                }
            ),
            [
                {
                    label: await this.#localization.translate(
                        "Install as PWA",
                        LOCALIZATION_MODULE_PWA
                    ),
                    value: "install"
                },
                {
                    label: await this.#localization.translate(
                        "Ask later",
                        LOCALIZATION_MODULE_PWA
                    ),
                    value: "later"
                },
                {
                    label: await this.#localization.translate(
                        "Don't show again",
                        LOCALIZATION_MODULE_PWA
                    ),
                    value: "not"
                }
            ]
        );

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
