import { INSTALL_CONFIRM_SHOWN_SETTINGS_KEY } from "../../../Adapter/Settings/INSTALL_CONFIRM_SHOWN_SETTINGS_KEY.mjs";

/** @typedef {import("../../../../../flux-settings-api/src/Adapter/Api/SettingsApi.mjs").SettingsApi} SettingsApi */
/** @typedef {import("../../../Adapter/Pwa/showInstallConfirm.mjs").showInstallConfirm} showInstallConfirm */
/** @typedef {import("../../../Adapter/Pwa/showUpdateConfirm.mjs").showUpdateConfirm} showUpdateConfirm */

export class InitServiceWorkerCommand {
    /**
     * @type {boolean}
     */
    #reload;
    /**
     * @type {SettingsApi}
     */
    #settings_api;

    /**
     * @param {SettingsApi} settings_api
     * @returns {InitServiceWorkerCommand}
     */
    static new(settings_api) {
        return new this(
            settings_api
        );
    }

    /**
     * @param {SettingsApi} settings_api
     * @private
     */
    constructor(settings_api) {
        this.#settings_api = settings_api;
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
     * @returns {Promise<boolean>}
     */
    async #isInstallConfirmShown() {
        return this.#settings_api.get(
            INSTALL_CONFIRM_SHOWN_SETTINGS_KEY,
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

        let _hide_confirm = null;

        addEventListener("beforeinstallprompt", async e => {
            e.preventDefault();

            if (await this.#isInstallConfirmShown()) {
                return;
            }

            const install = await show_install_confirm(
                hide_confirm => {
                    _hide_confirm = () => {
                        _hide_confirm = null;
                        hide_confirm();
                    };
                }
            );

            _hide_confirm = null;

            await this.#setInstallConfirmShown();

            if (!install) {
                return;
            }

            await e.prompt();
        }, {
            once: true
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

            if (_hide_confirm !== null) {
                _hide_confirm();
            }
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
        await this.#settings_api.store(
            INSTALL_CONFIRM_SHOWN_SETTINGS_KEY,
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

        registration.waiting.postMessage("skipWaiting");
    }
}
