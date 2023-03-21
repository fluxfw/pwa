/** @typedef {import("../../../flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("./setHideConfirm.mjs").setHideConfirm} setHideConfirm */

export class ShowPwaConfirm {
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @returns {ShowPwaConfirm}
     */
    static new(flux_localization_api) {
        return new this(
            flux_localization_api
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @private
     */
    constructor(flux_localization_api) {
        this.#flux_localization_api = flux_localization_api;
    }

    /**
     * @param {string} info_text
     * @param {string} confirm_text
     * @param {string} cancel_text
     * @param {setHideConfirm | null} set_hide_confirm
     * @returns {Promise<boolean>}
     */
    async showPwaConfirm(info_text, confirm_text, cancel_text, set_hide_confirm = null) {
        const { PwaConfirmElement } = await import("./PwaConfirmElement.mjs");

        return new Promise(resolve => {
            const confirm_element = PwaConfirmElement.new(
                this.#flux_localization_api,
                document.title,
                info_text,
                confirm_text,
                cancel_text,
                async confirm => {
                    confirm_element.remove();

                    resolve(confirm);
                }
            );

            document.body.appendChild(confirm_element);

            if (set_hide_confirm !== null) {
                set_hide_confirm(
                    () => {
                        confirm_element.remove();
                    }
                );
            }
        });
    }
}
