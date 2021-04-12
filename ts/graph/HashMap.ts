/* Module implementing hashable objects and a hashmap. */

// Could expand this later with a `Hash` type instead of hashes being `string`,
// and so then `HashMap.map` has type `Map<Hash, T extends Hashable>`.

/* Object which has this.hash() method returning a unique identifier string. */
export interface Hashable {
  hash: () => string;
}

/* Implementation of a hashmap for objects which have a this.hash() method. */
export class HashMap<T extends Hashable> {
  private map: Map<string, T>; // Only modified via HashMap class methods.

  /* If passed an optional Hashable objs array, we populate the map. */
  constructor(objs?: Array<T>) {
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
  add(obj: T): void {
    this.map.set(obj.hash(), obj);
  }

  /** Checks whether the given hash or Hashable object is in the map.
   * Accepts either a string (the hash) or the Hashable itself as a key,
   * for convenience.
   * @nosideeffects
   */
  has(key: string | T): boolean {
    if (typeof key === 'string') {
      return this.map.has(key);
     } else {
       // If a Hashable was passed as key, we call again with its hash as the key
       return this.map.has(key.hash());
     }
  }

  /** Gets the value associated with the key, or undefined if not in the map.
   * @nosideeffects
   */
  get(key: string): T|undefined {
    return this.map.get(key);
  }

  /** Removes all key:value pairs from the map.
   * @modifies {this.map}
   */
  clear(): void {
    this.map.clear();
  }

  /** Returns an Iterable of the keys in the HashMap.
   * @nosideeffects
   */
  keys(): Iterable<string> {
    return this.map.keys();
  }

  /* Returns an Iterable of the values in the HashMap.
   * @nosideeffects
   */
  values(): Iterable<T> {
    return this.map.values();
  }

  /** Returns the number of key:value pairs in the HashMap.
   * @nosideeffects
   */
  size(): number {
    return this.map.size;
  }
}