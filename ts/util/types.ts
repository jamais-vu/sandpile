/* Type definitions in a single file to keep imports from being all over the place. */

/* A 2D Coord is a 2-tuple of numbers. */
export type Coord = [number, number];

/** A Grid is an n x m Array of numbers.
 * TODO: Each inner Array<number> should have same length but I'm not sure
 * there's a way to specify that in TypeScript.
 */
export type Grid = Array<Array<number>>;

/** A VertexGroups is an Array of five Arrays of vertex ij coords.
 *
 * This is for some experimental stuff I'm doing, we create collections of
 * independent vertices (no shared neighbors) to parallelize vertex toppling.
 *
 * It uses Coord since it's for the grid version of sandpile, but when we return
 * to the graph version we can make this accept a generic type instead of Coord,
 * and then pass it our Vertex class.
 */
export type VertexGroups = [
  Array<Coord>,
  Array<Coord>,
  Array<Coord>,
  Array<Coord>,
  Array<Coord>
];

/** A transition function maps a state (and optional inputs) to another state in the state space.
 *
 * Input type I is `void` by default to permit it being an optional argument.
 *
 * The return type include a union with `void` to support transition functions
 * which mutate state in-place and return nothing.
  */
export type TransitionFunction<S, I = void> = (state: S, input?: I) => S | void;


// NOTE: Nothing after this is used. Just more playing around with types to get
// a feel for what I can do.

/* Generic interface for a finite state machine which has a state, and a
 * transition function which maps the state (plus an optional input) to the
 * next state (or void, if it mutates state instead of returning new state).
 * Input type InputT is void be default so we can implement this interface with
 * transition functions which don't take an input.
 *
 * I think if we were to use this, it actually describes each cell of the
 * cellular automaton:
 *   - Each cell has a state,
 *   - inputs are the neighbors
 *   - transition function maps combined state plus neighbors to next state.
 * So a cellular automaton is a finite state machine, but also a collection of
 * finite state machines.
 */
interface FiniteStateMachine<S, I = void> {
  state: S;
  input?: I;
  transitionFunction: TransitionFunction<S, I>;
}

// Unions of numbers would be nice to have, but as far as I can tell, TypeScript
// can't check if a resulting calculation will be in the union.
type CellState = 0 | 1 | 2 | 3;
type Range0to4 =  0 | 1 | 2 | 3 | 4;