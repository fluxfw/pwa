/** @typedef {import("../../../Adapter/Pwa/showReloadConfirm.mjs").showReloadConfirm} showReloadConfirm */

export class InitServiceWorkerCommand {
    /**
     * @returns {InitServiceWorkerCommand}
     */
    static new() {
        return new this();
    }

    /**
     * @private
     */
    constructor() {

    }

    /**
     * @param {string} service_worker_mjs_file
     * @param {showReloadConfirm | null} show_reload_confirm
     * @returns {Promise<void>}
     */
    async initServiceWorker(service_worker_mjs_file, show_reload_confirm = null) {
        try {
            const registration = await navigator.serviceWorker.register(service_worker_mjs_file, {
                type: "module"
            });

            if (show_reload_confirm === null) {
                return;
            }

            registration.addEventListener("updatefound", () => {
                const new_service_worker = registration.installing;

                new_service_worker.addEventListener("statechange", async () => {
                    if (new_service_worker.state !== "installed" || navigator.serviceWorker.controller === null) {
                        return;
                    }

                    if (!await show_reload_confirm()) {
                        return;
                    }

                    navigator.serviceWorker.addEventListener("controllerchange", () => {
                        location.reload();
                    }, {
                        once: true
                    });

                    new_service_worker.postMessage("skipWaiting");
                });
            });
        } catch (error) {
            console.error(error);
        }
    }
}
