import * as mocha from 'mocha';
import { assert } from 'chai';

import { HashMap } from '../HashMap';
import { Vertex } from '../Vertex';

/* Tests for HashMap class. */
describe("HashMap", () => {

  describe("constructor", () => {
    const vertices: Array<Vertex> = [new Vertex(0, 0), new Vertex(0, 1), new Vertex(1, 1)];
    const hashMap: HashMap<Vertex> = new HashMap(vertices);

    it("new HashMap(vertices) has given vertices (checked by passing hash to `has()`)", () => {
      for (let vertex of vertices) {
        assert.isTrue(hashMap.has(vertex.hash()));
      }
    });
    it("new HashMap(vertices) has given vertices (check by passing Vertex to `has()`)", () => {
      for (let vertex of vertices) {
        assert.isTrue(hashMap.has(vertex));
      }
    });
  });

  describe("this.add(), this.has()", () => {
    it("new HashMap() does not have test hash '0,0'", () => {
      const emptyMap: HashMap<Vertex> = new HashMap<Vertex>();
      assert.isFalse(emptyMap.has('0,0'));
    });
    it("new HashMap() does not have test Hashable Vertex (0, 0)", () => {
      const emptyMap: HashMap<Vertex> = new HashMap<Vertex>();
      assert.isFalse(emptyMap.has(new Vertex(0, 0)));
    });
    it("HashMap has added Vertex (0, 0), checked with key '0,0'", () => {
      const hashMap: HashMap<Vertex> = new HashMap<Vertex>();
      const vertex: Vertex = new Vertex(0, 0);
      hashMap.add(new Vertex(0, 0));
      assert.isTrue(hashMap.has('0,0'));
    });
    it("HashMap has added Vertex (0, 0), checked with key Vertex (0, 0)", () => {
      const hashMap: HashMap<Vertex> = new HashMap<Vertex>();
      const vertex: Vertex = new Vertex(0, 0);
      hashMap.add(new Vertex(0, 0));
      assert.isTrue(hashMap.has(vertex));
    });
  });

  describe("this.get()", () => {
    it("returns value if key is in the map", () => {
      const hashMap: HashMap<Vertex> = new HashMap<Vertex>();
      const vertex: Vertex = new Vertex(0, 0);
      const key: string = vertex.hash();
      hashMap.add(new Vertex(0, 0));
      assert.deepEqual(hashMap.get(key), vertex);
    });

    it("returns undefined if key is not in the map", () => {
      const hashMap: HashMap<Vertex> = new HashMap<Vertex>();
      const vertex: Vertex = new Vertex(0, 0);
      const key: string = '1,1'; // NOT the key for Vertex (0, 0)
      hashMap.add(new Vertex(0, 0));
      assert.isUndefined(hashMap.get(key));
    });
  });

  describe("this.clear()", () => {
    it("this.clear() removes all key:value pairs from the Hashmap", () => {
      const vertices: Array<Vertex> = [new Vertex(0, 0), new Vertex(0, 1), new Vertex(1, 1)];
      const hashMap: HashMap<Vertex> = new HashMap(vertices);
      assert.strictEqual(hashMap.size(), 3, "key:value pairs were added");
      hashMap.clear();
      assert.strictEqual(hashMap.size(), 0, "key:value pairs were removed");
    });
  });

  describe("this.keys()", () => {
    it("this.keys() is empty for an empty HashMap", () => {
      const hashMap: HashMap<Vertex> = new HashMap();
      assert.isEmpty(hashMap.keys());
    });

    it("this.keys is the keys for a nonempty HashMap", () => {
      const vertices: Array<Vertex> = [new Vertex(0, 0), new Vertex(0, 1), new Vertex(1, 1)];
      const hashMap: HashMap<Vertex> = new HashMap(vertices);
      // Use spread syntax to convert Iterable<string> to Array<string>
      const actual: Array<string> = [...hashMap.keys()];
      const expected: Array<string> = ['0,0', '0,1', '1,1'];
      assert.deepEqual(actual, expected);
    });
  });

  describe("this.values()", () => {
    it("this.values() is empty for an empty HashMap", () => {
      const hashMap: HashMap<Vertex> = new HashMap();
      assert.isEmpty(hashMap.values());
    });

    it("this.values() is the Hashables for a nonempty HashMap", () => {
      const vertices: Array<Vertex> = [new Vertex(0, 0), new Vertex(0, 1), new Vertex(1, 1)];
      const hashMap: HashMap<Vertex> = new HashMap(vertices);
      // Use spread syntax to convert Iterable<string> to Array<string>
      const actual: Array<Vertex> = [...hashMap.values()];
      assert.deepEqual(actual, vertices);
    });
  });

  describe("this.size()", () => {
    it("empty HashMap has size 0", () => {
      const actual: number = (new HashMap<Vertex>()).size();
      assert.strictEqual(actual, 0);
    });
    it("HashMap with three key:value pairs has size 3", () => {
      const vertices: Array<Vertex> = [new Vertex(0, 0), new Vertex(0, 1), new Vertex(1, 1)];
      const actual: number = (new HashMap<Vertex>(vertices)).size();
      assert.strictEqual(actual, 3);
    });
  });
});