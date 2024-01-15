import { LOCALIZATION_MODULE } from "./Localization/LOCALIZATION_MODULE.mjs";
import { LOCALIZATIONS } from "./Localization/LOCALIZATIONS.mjs";
import root_css from "./Pwa/FluxPwaRoot.css" with { type: "css" };
import shadow_css from "./Pwa/FluxPwaShadow.css" with { type: "css" };

/** @typedef {import("./Pwa/InitInstallConfirm.mjs").InitInstallConfirm} InitInstallConfirm */
/** @typedef {import("./Localization/Localization.mjs").Localization} Localization */
/** @typedef {import("./Pwa/Manifest.mjs").Manifest} Manifest */
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
     * @type {Manifest | null}
     */
    #manifest = null;
    /**
     * @type {Map<string, Manifest>}
     */
    #manifests;
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

        const flux_pwa = new this(
            localization,
            settings_storage,
            style_sheet_manager
        );

        if (flux_pwa.#localization !== null) {
            await flux_pwa.#localization.addModule(
                LOCALIZATION_MODULE,
                LOCALIZATIONS
            );
        }

        return flux_pwa;
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
        this.#manifests = new Map();
    }

    /**
     * @returns {Promise<Manifest>}
     */
    async getManifest() {
        if (this.#manifest === null) {
            await new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 2_000);
            });

            if (this.#manifest === null) {
                throw new Error("Missing manifest");
            }
        }

        return structuredClone(this.#manifest);
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
     * @param {string} manifest_json_file
     * @param {string | null} localization_module
     * @returns {Promise<void>}
     */
    async initPwa(manifest_json_file, localization_module = null) {
        this.#manifest = await (await import("./Pwa/InitPwa.mjs")).InitPwa.new(
            this.#manifests,
            this.#localization
        )
            .initPwa(
                manifest_json_file,
                localization_module
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
        await (await import("./Pwa/InitServiceWorker.mjs")).InitServiceWorker.new(
            this
        )
            .initServiceWorker(
                service_worker_mjs_file,
                show_install_confirm,
                show_update_confirm,
                show_install_confirm_later
            );
    }

    /**
     * @param {setHideConfirm} set_hide_confirm
     * @returns {Promise<boolean | null>}
     */
    async showInstallConfirm(set_hide_confirm) {
        if (this.#localization === null) {
            throw new Error("Missing Localization");
        }

        return (await import("./Pwa/ShowInstallConfirm.mjs")).ShowInstallConfirm.new(
            this.#localization,
            this.#style_sheet_manager
        )
            .showInstallConfirm(
                await this.getManifest(),
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
     * @returns {Promise<boolean>}
     */
    async showUpdateConfirm() {
        if (this.#localization === null) {
            throw new Error("Missing Localization");
        }

        return (await import("./Pwa/ShowUpdateConfirm.mjs")).ShowUpdateConfirm.new(
            this.#localization,
            this.#style_sheet_manager
        )
            .showUpdateConfirm(
                await this.getManifest()
            );
    }

    /**
     * @returns {Promise<InitInstallConfirm>}
     */
    async #getInitInstallConfirm() {
        if (this.#init_install_confirm === null) {
            if (this.#settings_storage === null) {
                throw new Error("Missing SettingsStorage");
            }

            this.#init_install_confirm ??= (await import("./Pwa/InitInstallConfirm.mjs")).InitInstallConfirm.new(
                this.#settings_storage
            );
        }

        return this.#init_install_confirm;
    }
}
