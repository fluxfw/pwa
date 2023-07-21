import { LOCALIZATION_MODULE } from "../Localization/LOCALIZATION_MODULE.mjs";
import { LOCALIZATION_KEY_ASK_LATER, LOCALIZATION_KEY_DON_T_SHOW_AGAIN, LOCALIZATION_KEY_INSTALL_AS_PWA, LOCALIZATION_KEY_SHOW_INSTALL_CONFIRM_MESSAGE } from "../Localization/LOCALIZATION_KEY.mjs";

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
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_SHOW_INSTALL_CONFIRM_MESSAGE,
                {
                    name
                }
            ),
            [
                {
                    label: await this.#localization.translate(
                        LOCALIZATION_MODULE,
                        LOCALIZATION_KEY_INSTALL_AS_PWA
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
