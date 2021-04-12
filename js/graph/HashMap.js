/* Module implementing hashable objects and a hashmap. */
/* Implementation of a hashmap for objects which have a this.hash() method. */
export class HashMap {
    /* If passed an optional Hashable objs array, we populate the map. */
    constructor(objs) {
        this.map = new Map();
        if (objs) {
            for (let obj of objs) {
                this.add(obj);
            }
        }
    }
    /** Adds Hashable obj to the map with mapping `obj.hash()` => `obj`.
     * @modifies {this.map}
     */
    add(obj) {
        this.map.set(obj.hash(), obj);
    }
    /** Checks whether the given hash or Hashable object is in the map.
     * Accepts either a string (the hash) or the Hashable itself as a key,
     * for convenience.
     * @nosideeffects
     */
    has(key) {
        if (typeof key === 'string') {
            return this.map.has(key);
        }
        else {
            // If a Hashable was passed as key, we call again with its hash as the key
            return this.map.has(key.hash());
        }
    }
    /** Gets the value associated with the key, or undefined if not in the map.
     * @nosideeffects
     */
    get(key) {
        return this.map.get(key);
    }
    /** Removes all key:value pairs from the map.
     * @modifies {this.map}
     */
    clear() {
        this.map.clear();
    }
    /** Returns an Iterable of the keys in the HashMap.
     * @nosideeffects
     */
    keys() {
        return this.map.keys();
    }
    /* Returns an Iterable of the values in the HashMap.
     * @nosideeffects
     */
    values() {
        return this.map.values();
    }
    /** Returns the number of key:value pairs in the HashMap.
     * @nosideeffects
     */
    size() {
        return this.map.size;
    }
}
