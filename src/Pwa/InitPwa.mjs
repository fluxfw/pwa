/** @typedef {import("../Localization/Localization.mjs").Localization} Localization */
/** @typedef {import("./Manifest.mjs").Manifest} Manifest */

export class InitPwa {
    /**
     * @type {Localization | null}
     */
    #localization;
    /**
     * @type {Map<string, Manifest>}
     */
    #manifests;

    /**
     * @param {Map<string, Manifest>} manifests
     * @param {Localization | null} localization
     * @returns {Promise<InitPwa>}
     */
    static async new(manifests, localization = null) {
        return new this(
            manifests,
            localization
        );
    }

    /**
     * @param {Map<string, Manifest>} manifests
     * @param {Localization | null} localization
     * @private
     */
    constructor(manifests, localization) {
        this.#manifests = manifests;
        this.#localization = localization;
    }

    /**
     * @param {string} manifest_json_file
     * @returns {Promise<Manifest>}
     */
    async initPwa(manifest_json_file) {
        let manifest = null, _manifest_json_file = manifest_json_file;

        if (this.#localization !== null) {
            const manifest_json_file_dot_pos = manifest_json_file.lastIndexOf(".");
            const localized_manifest_json_file = `${manifest_json_file.substring(0, manifest_json_file_dot_pos)}-${(await this.#localization.getLanguage()).language}${manifest_json_file.substring(manifest_json_file_dot_pos)}`;

            try {
                manifest = await this.#importManifest(
                    localized_manifest_json_file
                );

                _manifest_json_file = localized_manifest_json_file;
            } catch (error) {
                console.error(`Load ${localized_manifest_json_file} failed - Use ${manifest_json_file} as fallback (`, error, ")!");
            }
        }

        if (manifest === null) {
            manifest = await this.#importManifest(
                _manifest_json_file
            );
        }

        document.documentElement.dir = manifest.dir ?? "";
        document.documentElement.lang = manifest.lang ?? "";

        document.title = manifest.name ?? "";

        const description_meta = document.head.querySelector("meta[name=description]") ?? document.createElement("meta");
        description_meta.content = manifest.description ?? "";
        description_meta.name = "description";
        if (!description_meta.isConnected) {
            document.head.append(description_meta);
        }

        const manifest_link = document.head.querySelector("link[rel=manifest]") ?? document.createElement("link");
        manifest_link.href = _manifest_json_file;
        manifest_link.rel = "manifest";
        if (!manifest_link.isConnected) {
            document.head.append(manifest_link);
        }

        return manifest;
    }

    /**
     * @param {string} manifest_json_file
     * @returns {Promise<Manifest>}
     */
    async #importManifest(manifest_json_file) {
        let manifest = null;

        if (this.#manifests.has(manifest_json_file)) {
            manifest = this.#manifests.get(manifest_json_file) ?? null;
        } else {
            try {
                const response = await fetch(manifest_json_file);

                if (!response.ok || !(response.headers.get("Content-Type")?.includes("application/json") ?? false)) {
                    throw response;
                }

                manifest = await response.json();
            } finally {
                this.#manifests.set(manifest_json_file, manifest);
            }
        }

        if (manifest === null) {
            throw new Error("Invalid manifest!");
        }

        return manifest;
    }
}
