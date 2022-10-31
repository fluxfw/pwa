/** @typedef {import("../../../../../flux-json-api/src/Adapter/Api/JsonApi.mjs").LocalizationApi} JsonApi */
/** @typedef {import("../../../../../flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").JsonApi} LocalizationApi */

export class InitPwaCommand {
    /**
     * @type {JsonApi}
     */
    #json_api;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;

    /**
     * @param {JsonApi} json_api
     * @param {LocalizationApi} localization_api
     * @returns {InitPwaCommand}
     */
    static new(json_api, localization_api) {
        return new this(
            json_api,
            localization_api
        );
    }

    /**
     * @param {JsonApi} json_api
     * @param {LocalizationApi} localization_api
     * @private
     */
    constructor(json_api, localization_api) {
        this.#json_api = json_api;
        this.#localization_api = localization_api;
    }

    /**
     * @param {string} manifest_json_file
     * @returns {Promise<void>}
     */
    async initPwa(manifest_json_file) {
        const localized_manifest_json_file = `${manifest_json_file.substring(0, manifest_json_file.lastIndexOf("."))}-${this.#localization_api.getLanguage()}.json`;

        const manifest = await this.#json_api.importJson(
            localized_manifest_json_file
        );

        document.documentElement.dir = manifest.dir ?? "";
        document.documentElement.lang = manifest.lang ?? "";

        document.title = manifest.name ?? "";

        const description_meta = document.head.querySelector("meta[name=description]") ?? document.createElement("meta");
        description_meta.content = manifest.description ?? "";
        description_meta.name = "description";
        if (!description_meta.isConnected) {
            document.head.appendChild(description_meta);
        }

        const manifest_link = document.head.querySelector("link[rel=manifest]") ?? document.createElement("link");
        manifest_link.href = localized_manifest_json_file;
        manifest_link.rel = "manifest";
        if (!manifest_link.isConnected) {
            document.head.appendChild(manifest_link);
        }
    }
}
