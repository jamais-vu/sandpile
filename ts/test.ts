// I do this because I'm used to the ordering of the tests. No other reason.

/* Tests for utilities we use in both implementations. */
import './util/test/random.test';
import './util/test/getNeighborCoords.test';
import './util/test/minusOneIfEven.test';

/* Tests for graph implementation. */
import './graph/test/Point.test';
import './graph/test/Vertex.test';
import './graph/test/HashMap.test';
import './graph/test/LatticeGraph.test';
import './graph/test/recursive.test';

/* Tests for grid implementation. */
import './test/grid.test';
import './test/transitions.test';
import './test/CellularAutomaton.test';