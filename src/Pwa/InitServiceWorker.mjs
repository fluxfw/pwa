import { SETTINGS_STORAGE_KEY_INSTALL_CONFIRM_SHOWN } from "../SettingsStorage/SETTINGS_STORAGE_KEY.mjs";
import { SKIP_WAITING } from "./SKIP_WAITING.mjs";

/** @typedef {import("./hideConfirm.mjs").hideConfirm} hideConfirm */
/** @typedef {import("../SettingsStorage/SettingsStorage.mjs").SettingsStorage} SettingsStorage */
/** @typedef {import("./_showInstallConfirm.mjs").showInstallConfirm} showInstallConfirm */
/** @typedef {import("./_showUpdateConfirm.mjs").showUpdateConfirm} showUpdateConfirm */

export class InitServiceWorker {
    /**
     * @type {hideConfirm | null}
     */
    #hide_install_confirm = null;
    /**
     * @type {boolean}
     */
    #reload;
    /**
     * @type {SettingsStorage}
     */
    #settings_storage;
    /**
     * @type {boolean}
     */
    #show_install_confirm_later;

    /**
     * @param {SettingsStorage} settings_storage
     * @returns {InitServiceWorker}
     */
    static new(settings_storage) {
        return new this(
            settings_storage
        );
    }

    /**
     * @param {SettingsStorage} settings_storage
     * @private
     */
    constructor(settings_storage) {
        this.#settings_storage = settings_storage;
        this.#show_install_confirm_later = false;
        this.#reload = false;
    }

    /**
     * @param {string} service_worker_mjs_file
     * @param {showInstallConfirm | null} show_install_confirm
     * @param {showUpdateConfirm | null} show_update_confirm
     * @returns {Promise<void>}
     */
    async initServiceWorker(service_worker_mjs_file, show_install_confirm = null, show_update_confirm = null) {
        try {
            if ((globalThis.serviceWorker?.register ?? null) === null) {
                return;
            }

            if (show_install_confirm !== null) {
                await this.#registerInstallConfirm(
                    show_install_confirm
                );
            }

            if (document.readyState !== "complete") {
                await new Promise(resolve => {
                    addEventListener("load", () => {
                        resolve();
                    }, {
                        once: true
                    });
                });
            }

            const registration = await navigator.serviceWorker.register(service_worker_mjs_file, {
                type: "module"
            });

            if (show_update_confirm !== null) {
                await this.#registerUpdateConfirm(
                    registration,
                    show_update_confirm
                );
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * @returns {void}
     */
    #hideInstallConfirm() {
        if (this.#hide_install_confirm !== null) {
            this.#hide_install_confirm();
        }
    }

    /**
     * @returns {Promise<boolean>}
     */
    async #isInstallConfirmShown() {
        return this.#settings_storage.get(
            SETTINGS_STORAGE_KEY_INSTALL_CONFIRM_SHOWN,
            false
        );
    }

    /**
     * @param {showInstallConfirm} show_install_confirm
     * @returns {Promise<void>}
     */
    async #registerInstallConfirm(show_install_confirm) {
        if (!("onbeforeinstallprompt" in globalThis)) {
            return;
        }

        addEventListener("beforeinstallprompt", async e => {
            e.preventDefault();

            this.#hideInstallConfirm();

            if (this.#show_install_confirm_later || await this.#isInstallConfirmShown()) {
                return;
            }

            const install = await show_install_confirm(
                hide_confirm => {
                    this.#hide_install_confirm = () => {
                        this.#hide_install_confirm = null;
                        hide_confirm();
                    };
                }
            );

            this.#hide_install_confirm = null;

            if (install === null) {
                this.#show_install_confirm_later = true;
                return;
            }

            await this.#setInstallConfirmShown();

            if (!install) {
                return;
            }

            await e.prompt();
        });

        if (await this.#isInstallConfirmShown()) {
            return;
        }

        const pwa_installed_detector = matchMedia("(display-mode:browser)");

        if (!pwa_installed_detector.matches) {
            await this.#setInstallConfirmShown();
            return;
        }

        pwa_installed_detector.addEventListener("change", async () => {
            await this.#setInstallConfirmShown();

            this.#hideInstallConfirm();
        }, {
            once: true
        });
    }

    /**
     * @param {ServiceWorkerRegistration} registration
     * @param {showUpdateConfirm} show_update_confirm
     * @returns {Promise<void>}
     */
    async #registerUpdateConfirm(registration, show_update_confirm) {
        registration.addEventListener("updatefound", () => {
            if (registration.active === null || registration.installing === null) {
                return;
            }

            registration.installing.addEventListener("statechange", e => {
                if (e.target.state !== "installed") {
                    return;
                }

                this.#showUpdateConfirm(
                    registration,
                    show_update_confirm
                );
            });
        });

        navigator.serviceWorker.addEventListener("controllerchange", async e => {
            if (!this.#reload) {
                return;
            }

            await e.target.ready;

            location.reload();
        }, {
            once: true
        });

        if (registration.waiting !== null) {
            this.#showUpdateConfirm(
                registration,
                show_update_confirm
            );
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #setInstallConfirmShown() {
        await this.#settings_storage.store(
            SETTINGS_STORAGE_KEY_INSTALL_CONFIRM_SHOWN,
            true
        );
    }

    /**
     * @param {ServiceWorkerRegistration} registration
     * @param {showUpdateConfirm} show_update_confirm
     * @returns {Promise<void>}
     */
    async #showUpdateConfirm(registration, show_update_confirm) {
        if (this.#reload) {
            return;
        }

        this.#reload = await show_update_confirm();

        if (!this.#reload) {
            return;
        }

        registration.waiting.postMessage({
            type: SKIP_WAITING
        });
    }
}
