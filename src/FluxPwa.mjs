import root_css from "./Pwa/FluxPwaRoot.css" with { type: "css" };
import shadow_css from "./Pwa/FluxPwaShadow.css" with { type: "css" };

/** @typedef {import("./Pwa/InitInstallConfirm.mjs").InitInstallConfirm} InitInstallConfirm */
/** @typedef {import("./Localization/Localization.mjs").Localization} Localization */
/** @typedef {import("./Pwa/setHideConfirm.mjs").setHideConfirm} setHideConfirm */
/** @typedef {import("./SettingsStorage/SettingsStorage.mjs").SettingsStorage} SettingsStorage */
/** @typedef {import("./Pwa/_showInstallConfirm.mjs").showInstallConfirm} showInstallConfirm */
/** @typedef {import("./Pwa/_showUpdateConfirm.mjs").showUpdateConfirm} showUpdateConfirm */
/** @typedef {import("./StyleSheetManager/StyleSheetManager.mjs").StyleSheetManager} StyleSheetManager */

export class FluxPwa {
    /**
     * @type {InitInstallConfirm | null}
     */
    #init_install_confirm = null;
    /**
     * @type {Localization | null}
     */
    #localization;
    /**
     * @type {SettingsStorage | null}
     */
    #settings_storage;
    /**
     * @type {StyleSheetManager | null}
     */
    #style_sheet_manager;

    /**
     * @param {Localization | null} localization
     * @param {SettingsStorage | null} settings_storage
     * @param {StyleSheetManager | null} style_sheet_manager
     * @returns {Promise<FluxPwa>}
     */
    static async new(localization = null, settings_storage = null, style_sheet_manager = null) {
        if (style_sheet_manager !== null) {
            await style_sheet_manager.addShadowStyleSheet(
                shadow_css,
                true
            );

            await style_sheet_manager.addRootStyleSheet(
                root_css,
                true
            );
        } else {
            if (!document.adoptedStyleSheets.includes(shadow_css)) {
                document.adoptedStyleSheets.unshift(shadow_css);
            }

            if (!document.adoptedStyleSheets.includes(root_css)) {
                document.adoptedStyleSheets.unshift(root_css);
            }
        }

        return new this(
            localization,
            settings_storage,
            style_sheet_manager
        );
    }

    /**
     * @param {Localization | null} localization
     * @param {SettingsStorage | null} settings_storage
     * @param {StyleSheetManager | null} style_sheet_manager
     * @private
     */
    constructor(localization, settings_storage, style_sheet_manager) {
        this.#localization = localization;
        this.#settings_storage = settings_storage;
        this.#style_sheet_manager = style_sheet_manager;
    }

    /**
     * @param {showInstallConfirm} show_install_confirm
     * @param {boolean | null} show_install_confirm_later
     * @returns {Promise<void>}
     */
    async initInstallConfirm(show_install_confirm, show_install_confirm_later = null) {
        await (await this.#getInitInstallConfirm()).initInstallConfirm(
            show_install_confirm,
            show_install_confirm_later
        );
    }

    /**
     * @param {string} service_worker_mjs_file
     * @param {showInstallConfirm | null} show_install_confirm
     * @param {showUpdateConfirm | null} show_update_confirm
     * @param {boolean | null} show_install_confirm_later
     * @returns {Promise<void>}
     */
    async initServiceWorker(service_worker_mjs_file, show_install_confirm = null, show_update_confirm = null, show_install_confirm_later = null) {
        await (await (await import("./Pwa/InitServiceWorker.mjs")).InitServiceWorker.new(
            this
        ))
            .initServiceWorker(
                service_worker_mjs_file,
                show_install_confirm,
                show_update_confirm,
                show_install_confirm_later
            );
    }

    /**
     * @param {string} name
     * @param {setHideConfirm} set_hide_confirm
     * @returns {Promise<boolean | null>}
     */
    async showInstallConfirm(name, set_hide_confirm) {
        if (this.#localization === null) {
            throw new Error("Missing Localization!");
        }

        return (await (await import("./Pwa/ShowInstallConfirm.mjs")).ShowInstallConfirm.new(
            this.#localization,
            this.#style_sheet_manager
        ))
            .showInstallConfirm(
                name,
                set_hide_confirm
            );
    }

    /**
     * @returns {Promise<void>}
     */
    async showLaterInstallConfirm() {
        await (await this.#getInitInstallConfirm()).showLaterInstallConfirm();
    }

    /**
     * @param {string} name
     * @returns {Promise<boolean>}
     */
    async showUpdateConfirm(name) {
        if (this.#localization === null) {
            throw new Error("Missing Localization!");
        }

        return (await (await import("./Pwa/ShowUpdateConfirm.mjs")).ShowUpdateConfirm.new(
            this.#localization,
            this.#style_sheet_manager
        ))
            .showUpdateConfirm(
                name
            );
    }

    /**
     * @returns {Promise<InitInstallConfirm>}
     */
    async #getInitInstallConfirm() {
        if (this.#init_install_confirm === null) {
            if (this.#settings_storage === null) {
                throw new Error("Missing SettingsStorage!");
            }

            this.#init_install_confirm ??= await (await import("./Pwa/InitInstallConfirm.mjs")).InitInstallConfirm.new(
                this.#settings_storage
            );
        }

        return this.#init_install_confirm;
    }
}
