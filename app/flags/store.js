import mitt from "mitt";
import { localStorageAdapter } from "@/flags/local-storage-adapter";
import { FLAG_NAMES } from "@/flags/types";
/**
 * In memory key value storage.
 *
 * Can potentially be backed by localStorage if present.

 * Emits `change` when a key is set (eventEmitter).
 */
export class FlagStore {
    constructor() {
        this.store = {};
        this.longTermStore = null;
        this.ee = mitt();
        try {
            if (typeof localStorage !== "undefined") {
                this.longTermStore = localStorageAdapter;
            }
        }
        catch (error) {
            console.error("Error initializing flag store", error);
        }
        this.restore();
    }
    restore() {
        const longTermStore = this.longTermStore;
        if (!longTermStore) {
            return;
        }
        const allValues = longTermStore.getAll();
        Object.entries(allValues).forEach(([flag, val]) => {
            if (FLAG_NAMES.includes(flag)) {
                this.store[flag] = val;
                this.ee.emit("change", flag);
            }
            else {
                longTermStore.removeItem(flag);
            }
        });
    }
    keys() {
        return Object.keys(this.store);
    }
    get(name) {
        if (!Object.prototype.hasOwnProperty.call(this.store, name)) {
            this.store[name] = null;
        }
        return this.store[name];
    }
    set(name, value) {
        if (this.longTermStore) {
            this.longTermStore.setItem(name, value);
        }
        this.store[name] = value;
        this.ee.emit("change", name);
    }
    remove(name) {
        delete this.store[name];
        if (this.longTermStore) {
            this.longTermStore.removeItem(name);
        }
        this.ee.emit("change", name);
    }
    removeListener(_event, _fn) { }
}
