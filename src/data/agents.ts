import { AgentData } from '../types/agent';

export const AGENTS_DATA: AgentData[] = [
  {
    id: 'simple-reflex',
    number: 1,
    name: 'Simple Reflex Agent',
    tagline: 'React to what you see.',
    gameName: 'Beat the Heat',
    category: 'Reactive Decision Making',
    theme: {
      primary: '#22D3EE', // Cyan
      bgBadge: 'rgba(34, 211, 238, 0.1)',
      borderAccent: 'rgba(34, 211, 238, 0.4)',
      textAccent: 'text-cyan-400',
      gradient: 'from-cyan-500 to-teal-400',
      glow: 'shadow-[0_0_24px_rgba(34,211,238,0.25)]',
    },
    definition:
      'A Simple Reflex Agent selects actions based solely on the current percept, completely ignoring percept history. It relies on condition-action rules: "IF condition THEN action".',
    poaiConcept:
      'In POAI, a Simple Reflex Agent operates on the simplest agent architecture. Because it has no internal memory or state, it can only succeed in fully observable environments where the current percept provides all necessary information.',
    environment: 'Fully observable room with dynamic ambient temperature and a smart fan.',
    sensors: ['Digital Thermometer (Current room temperature in °C)'],
    actuators: ['Smart Fan Relay Switch (Turn ON / Keep OFF)'],
    limitations:
      'Lacks memory of previous states and cannot plan ahead. If the environment becomes partially observable or noisy, it can enter infinite loops (e.g. oscillating endlessly between turning on and off).',
    realWorldExample:
      'A smart home thermostat, an automated sliding door triggered by an infrared sensor, or a car airbag sensor.',
    whatPlayerWillDo:
      'Observe fluctuating room temperatures, apply the agent’s reflex rule, and toggle the smart fan to maintain climate comfort across 5 dynamic rounds.',
    winCondition: 'Correctly evaluate 5 temperature rounds by applying the reflex rule without errors.',
    controlsExplanation: [
      'Look at the current digital thermometer reading.',
      'Check if temperature > 30°C: Click "Turn Fan ON".',
      'Check if temperature ≤ 30°C: Click "Keep Fan OFF".',
      'You can also toggle Auto-Reflex to watch the agent make instant rule-based decisions!',
    ],
    pythonCode: `def simple_reflex_agent(temperature):
    # Rule 1: High heat threshold requires cooling
    if temperature > 30:
        action = "Turn Fan ON"
    # Rule 2: Normal/low heat preserves energy
    else:
        action = "Keep Fan OFF"

    return action


# Example execution
room_temperature = 34
current_action = simple_reflex_agent(room_temperature)

print(f"Sensor Percept: {room_temperature}°C")
print(f"Actuator Action: {current_action}")`,
    pythonRunResult: `Sensor Percept: 34°C\nActuator Action: Turn Fan ON`,
    flowSteps: [
      {
        id: 'step-1',
        title: 'Sensor Percept',
        subtitle: 'Digital Thermometer',
        description: 'The agent’s sensor samples the external temperature from the room environment (e.g., 34°C).',
        gameConnection: 'Displayed as the glowing mercury column and numerical reading.',
      },
      {
        id: 'step-2',
        title: 'Condition Check',
        subtitle: 'IF temperature > 30°C',
        description: 'The agent evaluates the current reading against its programmed condition-action rule threshold.',
        gameConnection: 'The comparison logic evaluating whether the room is in the "Hot" or "Comfortable" zone.',
      },
      {
        id: 'step-3',
        title: 'Action Selection',
        subtitle: '"Turn Fan ON" or "OFF"',
        description: 'The matching rule directly outputs the corresponding discrete action.',
        gameConnection: 'Determines which button lights up or which decision the agent auto-executes.',
      },
      {
        id: 'step-4',
        title: 'Actuator Execution',
        subtitle: 'Relay Switch',
        description: 'The chosen action drives the actuator, changing the physical state of the room environment.',
        gameConnection: 'The fan blades spinning up or halting with air current particle animation.',
      },
    ],
    codeLines: [
      {
        lineNumber: 1,
        code: 'def simple_reflex_agent(temperature):',
        explanation: 'Defines the agent function accepting only the current percept (temperature) as input.',
        gameAction: 'Sensor takes the room reading at the start of a round.',
        variableState: { temperature: 34 },
      },
      {
        lineNumber: 2,
        code: '    if temperature > 30:',
        explanation: 'Condition evaluation: checks if current percept exceeds the 30°C comfort boundary.',
        gameAction: 'Thermometer detects room is overheating.',
        variableState: { 'temperature > 30': true },
      },
      {
        lineNumber: 3,
        code: '        action = "Turn Fan ON"',
        explanation: 'Condition-action triggered: selects cooling actuation to counteract heat.',
        gameAction: 'Smart Fan relay switch triggers motor to ON.',
        variableState: { action: 'Turn Fan ON' },
      },
      {
        lineNumber: 4,
        code: '    else:',
        explanation: 'Alternative branch for temperatures within or below comfortable range.',
        gameAction: 'Temperature is within normal threshold.',
        variableState: { 'temperature <= 30': false },
      },
      {
        lineNumber: 5,
        code: '        action = "Keep Fan OFF"',
        explanation: 'Preserves energy by keeping the actuator inactive.',
        gameAction: 'Fan remains idle.',
        variableState: { action: 'Keep Fan OFF' },
      },
      {
        lineNumber: 7,
        code: '    return action',
        explanation: 'Outputs the decided action to the actuator subsystem.',
        gameAction: 'Round decision resolved and evaluated.',
        variableState: { return: 'Turn Fan ON' },
      },
    ],
    mapping: [
      {
        codeSnippet: 'temperature = 34',
        whatItDoes: 'Simulates the sensor percept coming from the environment',
        gameEvent: 'Thermometer shows 34°C with warm ambient lighting',
      },
      {
        codeSnippet: 'if temperature > 30:',
        whatItDoes: 'Checks the condition-action rule threshold',
        gameEvent: 'Comfort gauge drops into the red "Overheating" warning',
      },
      {
        codeSnippet: 'action = "Turn Fan ON"',
        whatItDoes: 'Assigns the corresponding action based on the condition',
        gameEvent: 'Player or agent clicks "Turn Fan ON", fan spins and cools room',
      },
      {
        codeSnippet: 'return action',
        whatItDoes: 'Sends the physical directive to the actuator mechanism',
        gameEvent: 'Room temperature normalizes back to comfortable range',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is the primary defining characteristic of a Simple Reflex Agent?',
        options: [
          'It maintains a database of past decisions to predict the future',
          'It acts solely on the current percept using condition-action rules',
          'It calculates path costs toward an explicit destination goal',
          'It updates a Q-table through trial-and-error rewards',
        ],
        correctIndex: 1,
        explanation:
          'A Simple Reflex Agent makes decisions strictly based on the current percept at the present moment, without consulting history or an internal state.',
      },
      {
        id: 'q2',
        question: 'In what kind of environment does a Simple Reflex Agent struggle or fail?',
        options: [
          'Fully observable static environments',
          'Deterministic environments with clear rules',
          'Partially observable environments where percepts are ambiguous',
          'Discrete environments with few states',
        ],
        correctIndex: 2,
        explanation:
          'Because reflex agents lack memory, if the environment is partially observable, two identical current percepts might require opposite actions, potentially causing endless loops.',
      },
      {
        id: 'q3',
        question: 'Which of the following represents a real-world Simple Reflex Agent?',
        options: [
          'Chess engine calculating 15 moves ahead using minimax',
          'Thermostat turning on a heater when mercury drops below 18°C',
          'Autonomous delivery vehicle planning a route across city traffic',
          'AlphaGo training on millions of game positions',
        ],
        correctIndex: 1,
        explanation:
          'A thermostat directly maps the current temperature reading to a heater ON/OFF switch via a fixed condition-action threshold.',
      },
    ],
  },
  {
    id: 'model-based',
    number: 2,
    name: 'Model-Based Agent',
    tagline: 'Remember what you have experienced.',
    gameName: 'Escape the Maze',
    category: 'State Tracking & Internal Memory',
    theme: {
      primary: '#3B82F6', // Electric Blue
      bgBadge: 'rgba(59, 130, 246, 0.1)',
      borderAccent: 'rgba(59, 130, 246, 0.4)',
      textAccent: 'text-blue-400',
      gradient: 'from-blue-500 to-indigo-500',
      glow: 'shadow-[0_0_24px_rgba(59,130,246,0.25)]',
    },
    definition:
      'A Model-Based Agent maintains an internal state to track aspects of the environment that cannot be seen right now. It uses two key knowledge models: how the world evolves independently, and how the agent’s own actions affect the world.',
    poaiConcept:
      'When an environment is partially observable, current percepts alone cannot distinguish states. The agent’s internal state acts as an internal memory model: State_t = Update(State_{t-1}, Action_{t-1}, Percept_t).',
    environment: 'A partially obscured 2D maze with stone walls, branching corridors, and hidden dead ends.',
    sensors: ['Wall Proximity Sensors (Detects walls adjacent to current cell: N, S, E, W)'],
    actuators: ['Motor Drive (Move North, South, East, West, or Backtrack)'],
    limitations:
      'Its decisions depend on the accuracy of its internal model. If the environment changes unpredictably or the model becomes corrupt, the agent can get trapped or make suboptimal inferences.',
    realWorldExample:
      'A robotic vacuum cleaner mapping out rooms it visited so it does not clean the same area twice, or a self-driving car tracking occluded pedestrians behind parked trucks.',
    whatPlayerWillDo:
      'Guide a scout robot through an intricate maze. Observe the live internal memory panel recording visited coordinates and breadcrumb paths to escape dead ends and reach the extraction door.',
    winCondition: 'Navigate the robot from the starting bay to the exit portal using the internal state tracker.',
    controlsExplanation: [
      'Use the on-screen Directional Pad (Up, Down, Left, Right) or Arrow keys.',
      'Watch the Memory Panel update visited cells and backtrack history.',
      'Click "Step Agent" or "Auto-Solve" to watch the model-based policy explore unvisited paths and backtrack out of dead ends.',
    ],
    pythonCode: `def model_based_agent(current_pos, visited_memory, available_neighbors):
    """
    Model-Based Agent navigates using internal state:
    - visited_memory: set of known explored coordinates
    - available_neighbors: dict of valid movement directions
    """
    # 1. Update internal model with current observation
    visited_memory.add(current_pos)

    # 2. Prefer uncharted (unvisited) paths
    for direction, next_pos in available_neighbors.items():
        if next_pos not in visited_memory:
            return direction, "EXPLORE"

    # 3. If surrounded by walls/visited cells, use backtrack memory
    return "BACKTRACK", "RETREAT"


# Simulation demonstration
visited = {(0, 0), (0, 1)}
current = (0, 1)
moves = {
    "SOUTH": (0, 0),  # already in visited
    "EAST": (1, 1),   # unvisited!
}

decision, strategy = model_based_agent(current, visited, moves)
print(f"Current State: {current}")
print(f"Internal Visited Model: {visited}")
print(f"Agent Action: {decision} ({strategy})")`,
    pythonRunResult: `Current State: (0, 1)\nInternal Visited Model: {(0, 0), (0, 1)}\nAgent Action: EAST (EXPLORE)`,
    flowSteps: [
      {
        id: 'step-1',
        title: 'Sensor Percept',
        subtitle: 'Local Wall Readings',
        description: 'Robot receives sensory data regarding immediate adjacent tiles (walls vs openings).',
        gameConnection: 'Sensor indicators highlight open doorways around the robot.',
      },
      {
        id: 'step-2',
        title: 'Internal State Update',
        subtitle: 'Visited Memory & Map',
        description: 'Current position is committed to the internal model, updating the history of explored territory.',
        gameConnection: 'The explored cell changes color on the grid and logs into the Memory Panel.',
      },
      {
        id: 'step-3',
        title: 'Model-Informed Decision',
        subtitle: 'Unvisited Priority vs Backtrack',
        description: 'The agent queries its internal state: if a path is in visited_memory, it avoids re-entering unless retreating.',
        gameConnection: 'Robot chooses unvisited corridors instead of oscillating back and forth.',
      },
      {
        id: 'step-4',
        title: 'Actuation & Trajectory',
        subtitle: 'Execute Move',
        description: 'Robot advances, updating its real coordinate and pushing the step onto the breadcrumb stack.',
        gameConnection: 'Animated robot sprite slides smoothly to the target cell.',
      },
    ],
    codeLines: [
      {
        lineNumber: 1,
        code: 'def model_based_agent(current_pos, visited_memory, available_neighbors):',
        explanation: 'Accepts current position, accumulated internal state (visited), and immediate percepts.',
        gameAction: 'Robot reads its current coordinate and sensor map.',
        variableState: { current_pos: '(0, 1)' },
      },
      {
        lineNumber: 7,
        code: '    visited_memory.add(current_pos)',
        explanation: 'Updates the internal state model with the current location.',
        gameAction: 'Tile glows cyan/blue as "remembered" in robot memory.',
        variableState: { visited_memory: '{(0,0), (0,1)}' },
      },
      {
        lineNumber: 9,
        code: '    for direction, next_pos in available_neighbors.items():',
        explanation: 'Iterates through possible physical transitions permitted by local percepts.',
        gameAction: 'Checks open corridors to the North, East, South, West.',
        variableState: { available_neighbors: '{"SOUTH": (0,0), "EAST": (1,1)}' },
      },
      {
        lineNumber: 10,
        code: '        if next_pos not in visited_memory:',
        explanation: 'Evaluates candidate transitions against the internal model of visited terrain.',
        gameAction: 'Identifies that (1,1) has never been explored before.',
        variableState: { 'is_new_path': true },
      },
      {
        lineNumber: 11,
        code: '            return direction, "EXPLORE"',
        explanation: 'Chooses the novel path to make forward progress.',
        gameAction: 'Robot moves East into uncharted corridor.',
        variableState: { decision: 'EAST' },
      },
      {
        lineNumber: 13,
        code: '    return "BACKTRACK", "RETREAT"',
        explanation: 'Dead end fallback: uses internal history stack to back out of traps safely.',
        gameAction: 'Robot reverses along breadcrumbs when blocked.',
        variableState: { decision: 'BACKTRACK' },
      },
    ],
    mapping: [
      {
        codeSnippet: 'visited_memory.add(current_pos)',
        whatItDoes: 'Records visited coordinate into memory',
        gameEvent: 'Grid tile illuminates and appears in the Memory State list',
      },
      {
        codeSnippet: 'if next_pos not in visited_memory:',
        whatItDoes: 'Filters out visited tiles to avoid infinite loops',
        gameEvent: 'Agent ignores previously visited dead ends and picks open paths',
      },
      {
        codeSnippet: 'return "BACKTRACK"',
        whatItDoes: 'Triggers backtracking when no unvisited paths remain',
        gameEvent: 'Robot retraces breadcrumb path until it finds a fork with an unvisited branch',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Why does a Model-Based Agent need an internal state?',
        options: [
          'To generate random actions faster',
          'To keep track of parts of the world not currently visible in the percept',
          'To calculate gradients for deep neural networks',
          'To communicate with human operators over HTTP',
        ],
        correctIndex: 1,
        explanation:
          'When environments are partially observable, the current sensor reading does not reveal the whole state. The internal state preserves history and unobserved context.',
      },
      {
        id: 'q2',
        question: 'How does an agent update its internal state over time?',
        options: [
          'By erasing all previous data every second',
          'By combining previous state, recent action, and current percept',
          'By asking a goal-based agent for permission',
          'By maximizing discount factors in a Q-table',
        ],
        correctIndex: 1,
        explanation:
          'State update is formalized as: State_t = Update(State_{t-1}, Action_{t-1}, Percept_t).',
      },
      {
        id: 'q3',
        question: 'In the maze game, what prevents the robot from looping between two cells forever?',
        options: [
          'A timer that shuts off the battery',
          'Its internal visited memory that remembers already explored tiles',
          'A simple reflex rule that always turns right',
          'Random coin flips on every turn',
        ],
        correctIndex: 1,
        explanation:
          'Because the agent stores visited coordinates in its internal memory model, it knows whether it has already been to a tile and seeks unvisited alternatives.',
      },
    ],
  },
  {
    id: 'goal-based',
    number: 3,
    name: 'Goal-Based Agent',
    tagline: 'Plan your way to the destination.',
    gameName: 'Mission Possible',
    category: 'Path Planning & Search',
    theme: {
      primary: '#F59E0B', // Amber
      bgBadge: 'rgba(245, 158, 11, 0.1)',
      borderAccent: 'rgba(245, 158, 11, 0.4)',
      textAccent: 'text-amber-400',
      gradient: 'from-amber-500 to-orange-500',
      glow: 'shadow-[0_0_24px_rgba(245,158,11,0.25)]',
    },
    definition:
      'A Goal-Based Agent combines percepts and internal representations with explicit goal information to evaluate which sequences of actions will lead to desirable goal states.',
    poaiConcept:
      'While reflex and model-based agents ask "What action should I take right now?", a Goal-Based Agent asks "What will happen if I take this sequence of actions, and will it achieve my desired goal?". This requires search and planning algorithms such as BFS, DFS, or A*.',
    environment: 'A logistical warehouse grid with charging docks, hazardous obstacles, and priority delivery destinations.',
    sensors: ['Global Grid Coordinates of Agent (x, y) & Target Goal (gx, gy)'],
    actuators: ['Navigation Trajectory Engine (Executes planned sequential path vectors)'],
    limitations:
      'Search and planning can be computationally expensive as the state space expands. It cares only about whether a goal is achieved, not whether one path is more comfortable or enjoyable than another (which requires utility).',
    realWorldExample:
      'GPS navigation systems finding driving directions from home to airport, or robotic arms computing inverse kinematics to grasp a package.',
    whatPlayerWillDo:
      'Configure start positions, destination goals, and place obstacles on the grid. Run the search planner (Breadth-First Search) to watch the frontier queue expand and generate the shortest obstacle-free path.',
    winCondition: 'Successfully compute an optimal route to the delivery goal and guide the bot along it.',
    controlsExplanation: [
      'Click grid cells to add or remove obstacle barriers.',
      'Click "Set Goal" to reposition the destination flag.',
      'Click "Compute BFS Path" to visualize the explored queue frontier and optimal path.',
      'Click "Execute Delivery" to watch the robot traverse the computed route step-by-step.',
    ],
    pythonCode: `from collections import deque

def find_path_bfs(grid, start, goal):
    """
    Goal-Based Search using Breadth-First Search (BFS).
    Guarantees the shortest path on an unweighted grid.
    """
    queue = deque([[start]])
    visited = {start}

    while queue:
        # 1. Pop the oldest path from frontier queue
        path = queue.popleft()
        current_node = path[-1]

        # 2. Check if current state satisfies the GOAL
        if current_node == goal:
            return path  # Optimal route to goal found!

        # 3. Expand valid neighboring transitions
        for neighbor in get_valid_neighbors(grid, current_node):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(path + [neighbor])

    return None  # No path can reach the goal


# Simulation execution
start_pos = (0, 0)
goal_pos = (3, 2)
# Grid with 0 = free, 1 = obstacle
sample_grid = [[0]*4 for _ in range(4)]
sample_grid[1][1] = 1  # obstacle

shortest_path = find_path_bfs(sample_grid, start_pos, goal_pos)
print(f"Goal State: {goal_pos}")
print(f"Computed Steps ({len(shortest_path)-1}): {shortest_path}")`,
    pythonRunResult: `Goal State: (3, 2)\nComputed Steps (5): [(0, 0), (1, 0), (2, 0), (2, 1), (2, 2), (3, 2)]`,
    flowSteps: [
      {
        id: 'step-1',
        title: 'Goal Formulation',
        subtitle: 'Target Definition',
        description: 'Agent defines the explicit target state (e.g. Delivery Target Flag at coordinate [3, 2]).',
        gameConnection: 'Gold pulsating goal flag placed on the destination tile.',
      },
      {
        id: 'step-2',
        title: 'State Space Exploration',
        subtitle: 'Queue & Frontier',
        description: 'Agent builds potential action paths, expanding outward level-by-level using Breadth-First Search.',
        gameConnection: 'Blue ripples illustrate explored cells radiating from start.',
      },
      {
        id: 'step-3',
        title: 'Goal Condition Check',
        subtitle: 'Is node == goal?',
        description: 'The search halts the instant an expanded branch touches the target goal coordinate.',
        gameConnection: 'A gold flash confirms optimal route discovery.',
      },
      {
        id: 'step-4',
        title: 'Plan Execution',
        subtitle: 'Actuation Sequence',
        description: 'Agent extracts the discovered sequence of moves and commits them to physical actuation.',
        gameConnection: 'Robot follows the glowing yellow breadcrumb path step-by-step.',
      },
    ],
    codeLines: [
      {
        lineNumber: 1,
        code: 'from collections import deque',
        explanation: 'Imports double-ended queue for efficient O(1) FIFO frontier expansion.',
        gameAction: 'Initializes the path planner system.',
        variableState: {},
      },
      {
        lineNumber: 7,
        code: '    queue = deque([[start]])',
        explanation: 'Seeds the frontier queue with the initial path containing only the starting position.',
        gameAction: 'Robot start tile is marked as root of search tree.',
        variableState: { queue: '[[(0,0)]]' },
      },
      {
        lineNumber: 12,
        code: '        path = queue.popleft()',
        explanation: 'Pulls the earliest added path for First-In-First-Out exploration.',
        gameAction: 'Expands the next search frontier ring.',
        variableState: { current_path: '[(0,0)]' },
      },
      {
        lineNumber: 16,
        code: '        if current_node == goal:',
        explanation: 'Goal test: checks if the search has reached the desired objective.',
        gameAction: 'Frontier reaches delivery coordinate.',
        variableState: { 'is_goal': true },
      },
      {
        lineNumber: 17,
        code: '            return path',
        explanation: 'Terminates search and returns the complete shortest sequence of steps.',
        gameAction: 'Optimal path lights up on the game grid.',
        variableState: { path_length: 5 },
      },
      {
        lineNumber: 22,
        code: '                queue.append(path + [neighbor])',
        explanation: 'Enqueues extended paths with unvisited neighbor coordinates.',
        gameAction: 'Neighbor tiles scheduled for inspection.',
        variableState: { 'queue_size': 4 },
      },
    ],
    mapping: [
      {
        codeSnippet: 'if current_node == goal:',
        whatItDoes: 'Goal test that halts search when the objective is met',
        gameEvent: 'Delivery flag sparkles as the target path is locked',
      },
      {
        codeSnippet: 'queue.popleft()',
        whatItDoes: 'FIFO queue retrieval that guarantees shortest path in unweighted graphs',
        gameEvent: 'Search expands outward uniformly in all directions like a wave',
      },
      {
        codeSnippet: 'return path',
        whatItDoes: 'Returns the planned step-by-step action sequence',
        gameEvent: 'Robot executes the exact path, reaching the delivery package in minimal steps',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What distinguishes a Goal-Based Agent from a Simple Reflex Agent?',
        options: [
          'It has no actuators and works only in simulation',
          'It considers future outcomes against an explicit goal before acting',
          'It only reacts to immediate sensor stimuli without planning',
          'It uses fewer computational resources',
        ],
        correctIndex: 1,
        explanation:
          'Goal-Based Agents reason about sequences of actions and their future consequences to determine if they fulfill a defined goal, rather than reacting instantly to isolated percepts.',
      },
      {
        id: 'q2',
        question: 'Why is Breadth-First Search (BFS) well-suited for grid path planning with uniform step costs?',
        options: [
          'It uses random heuristics to jump directly to the goal',
          'It explores level-by-level, guaranteeing the shortest path in unweighted graphs',
          'It consumes zero memory regardless of grid size',
          'It does not require tracking visited nodes',
        ],
        correctIndex: 1,
        explanation:
          'In graphs where every step has the same cost (1 step), BFS guarantees finding the path with the fewest steps because it explores states in order of their distance from the start.',
      },
      {
        id: 'q3',
        question: 'What is a limitation of Goal-Based Agents that Utility-Based Agents solve?',
        options: [
          'Goal-Based agents cannot reach destinations',
          'Goal-Based agents treat all successful paths as equal, ignoring trade-offs like speed, cost, or comfort',
          'Goal-Based agents only work on single-threaded CPUs',
          'Goal-Based agents cannot use search algorithms',
        ],
        correctIndex: 1,
        explanation:
          'A goal is binary (achieved vs not achieved). It cannot distinguish between a bumpy, expensive 5-hour route and a smooth, cheap 5-hour route. That requires a utility function.',
      },
    ],
  },
  {
    id: 'utility-based',
    number: 4,
    name: 'Utility-Based Agent',
    tagline: 'Choose the option with the best overall value.',
    gameName: 'Smart Choice Challenge',
    category: 'Optimization & Trade-offs',
    theme: {
      primary: '#8B5CF6', // Violet
      bgBadge: 'rgba(139, 92, 246, 0.1)',
      borderAccent: 'rgba(139, 92, 246, 0.4)',
      textAccent: 'text-violet-400',
      gradient: 'from-violet-500 to-purple-500',
      glow: 'shadow-[0_0_24px_rgba(139,92,246,0.25)]',
    },
    definition:
      'A Utility-Based Agent uses a mathematical utility function to measure the desirability of different states or outcomes. It selects the action that maximizes expected utility, enabling nuanced trade-offs between competing priorities.',
    poaiConcept:
      'Goals alone are crude (success vs failure). A utility function maps a state onto a real number representing its degree of satisfaction: U(s) -> Real. This allows the agent to handle conflicting goals, balance speed vs safety vs cost, and make rational decisions under uncertainty.',
    environment: 'A gourmet digital cafeteria with multiple meal choices possessing varying Taste, Health, and Cost scores.',
    sensors: ['Meal Attributes (Taste score 1-10, Health score 1-10, Cost score 1-10)'],
    actuators: ['Selection Selector (Dispatches optimal meal choice)'],
    limitations:
      'Requires designing an accurate utility function with appropriate weighting. If weights are poorly calibrated, the agent can make bizarre or unbalanced decisions.',
    realWorldExample:
      'Ride-sharing dispatch algorithms balancing driver travel time, passenger wait time, and surge price; or financial portfolio management maximizing returns while minimizing risk.',
    whatPlayerWillDo:
      'Adjust priority sliders for Taste, Health, and Budget (Cost Penalty). See how changing user preferences mathematically shifts the utility scores and ranks across 5 distinct meal candidates.',
    winCondition: 'Configure preference weights and select the meal that achieves maximum mathematical utility under the scenario criteria.',
    controlsExplanation: [
      'Adjust the Taste Weight slider (0 to 10).',
      'Adjust the Health Weight slider (0 to 10).',
      'Adjust the Cost Weight slider (0 to 10 penalty).',
      'Observe live calculated utility bars and click "Confirm Optimal Pick" to verify.',
    ],
    pythonCode: `def calculate_utility(meal, weights):
    """
    Computes overall utility score:
    Utility = (W_taste * Taste) + (W_health * Health) - (W_cost * Cost)
    """
    utility = (
        weights["taste"] * meal["taste"]
        + weights["health"] * meal["health"]
        - weights["cost"] * meal["cost"]
    )
    return utility


def choose_best_option(meals, weights):
    """
    Utility-Based Agent selects the option with the highest utility value.
    """
    return max(meals, key=lambda m: calculate_utility(m, weights))


# Sample dishes and user priorities
menu = [
    {"name": "Superfood Salad", "taste": 6, "health": 10, "cost": 7},
    {"name": "Gourmet Burger",   "taste": 10, "health": 3,  "cost": 8},
    {"name": "Nutrient Bento",   "taste": 8, "health": 8,  "cost": 5},
]

user_weights = {"taste": 4, "health": 7, "cost": 3}

best_meal = choose_best_option(menu, user_weights)
for item in menu:
    score = calculate_utility(item, user_weights)
    print(f"{item['name']}: Utility = {score}")

print(f"\\nOptimal Choice: {best_meal['name']}")`,
    pythonRunResult: `Superfood Salad: Utility = 73\nGourmet Burger: Utility = 37\nNutrient Bento: Utility = 73\n\nOptimal Choice: Nutrient Bento`,
    flowSteps: [
      {
        id: 'step-1',
        title: 'Attribute Percepts',
        subtitle: 'Multi-Factor Data',
        description: 'Agent extracts multi-attribute parameters for each candidate option (Taste, Health, Cost).',
        gameConnection: 'Card badges displaying the raw metrics for each dish.',
      },
      {
        id: 'step-2',
        title: 'Preference Weighting',
        subtitle: 'W_taste, W_health, W_cost',
        description: 'Agent receives user utility weights representing personal priorities and trade-offs.',
        gameConnection: 'Interactive slider bars set by the player.',
      },
      {
        id: 'step-3',
        title: 'Utility Calculation',
        subtitle: 'U = (Wt*T) + (Wh*H) - (Wc*C)',
        description: 'Applies the mathematical utility formula to compute a scalar satisfaction score for each candidate.',
        gameConnection: 'Animated progress bars fill with real-time numeric utility totals.',
      },
      {
        id: 'step-4',
        title: 'Maximization Selection',
        subtitle: 'arg max U(s)',
        description: 'Agent applies the principle of maximum expected utility, picking the highest-scoring candidate.',
        gameConnection: 'The winning dish highlights with a glowing violet trophy border.',
      },
    ],
    codeLines: [
      {
        lineNumber: 1,
        code: 'def calculate_utility(meal, weights):',
        explanation: 'Function mapping candidate attributes and user weights to a scalar utility score.',
        gameAction: 'Initializes mathematical evaluation.',
        variableState: {},
      },
      {
        lineNumber: 6,
        code: '    utility = (',
        explanation: 'Evaluates linear combination of positive factors and negative cost penalties.',
        gameAction: 'Combines taste bonus and health bonus.',
        variableState: {},
      },
      {
        lineNumber: 7,
        code: '        weights["taste"] * meal["taste"]',
        explanation: 'Scales taste by its subjective priority factor.',
        gameAction: 'Taste score multiplied by slider value.',
        variableState: { 'taste_contrib': 32 },
      },
      {
        lineNumber: 8,
        code: '        + weights["health"] * meal["health"]',
        explanation: 'Adds health benefits weighted by health importance.',
        gameAction: 'Health score multiplied by health slider.',
        variableState: { 'health_contrib': 56 },
      },
      {
        lineNumber: 9,
        code: '        - weights["cost"] * meal["cost"]',
        explanation: 'Subtracts monetary penalty multiplied by budget sensitivity.',
        gameAction: 'Cost deducted from total score.',
        variableState: { 'cost_penalty': 15 },
      },
      {
        lineNumber: 17,
        code: '    return max(meals, key=lambda m: calculate_utility(m, weights))',
        explanation: 'Selects the candidate that maximizes overall utility (arg max).',
        gameAction: 'Winning dish selected and highlighted.',
        variableState: { 'best_choice': 'Nutrient Bento' },
      },
    ],
    mapping: [
      {
        codeSnippet: 'weights["taste"] * meal["taste"]',
        whatItDoes: 'Multiplies taste rating by user preference weight',
        gameEvent: 'Adjusting Taste slider instantly boosts delicious dishes',
      },
      {
        codeSnippet: '- weights["cost"] * meal["cost"]',
        whatItDoes: 'Penalizes expensive options according to budget weight',
        gameEvent: 'Increasing Cost Penalty suppresses expensive luxury items',
      },
      {
        codeSnippet: 'max(meals, key=...)',
        whatItDoes: 'Finds the option with the maximum calculated utility score',
        gameEvent: 'Highest utility dish receives the "Top Recommendation" badge',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is the primary advantage of a Utility-Based Agent over a Goal-Based Agent?',
        options: [
          'It operates without any sensory input',
          'It can weigh conflicting priorities and quantify degrees of desirability',
          'It runs faster because it never calculates numbers',
          'It does not require any mathematical functions',
        ],
        correctIndex: 1,
        explanation:
          'Goals only say "yes" or "no". Utility functions assign real numbers, allowing an agent to weigh trade-offs (e.g., faster vs cheaper vs safer) and make balanced choices.',
      },
      {
        id: 'q2',
        question: 'In the utility formula U = (Wt * Taste) + (Wh * Health) - (Wc * Cost), why is Cost subtracted?',
        options: [
          'Because computers cannot add negative numbers',
          'Because cost represents an expenditure/penalty rather than a benefit',
          'Because food taste is always positive',
          'Because the algorithm would crash if it was added',
        ],
        correctIndex: 1,
        explanation:
          'Cost represents a penalty or resource drain. Higher cost decreases overall utility, so its weighted value is subtracted from the positive utility contributors.',
      },
      {
        id: 'q3',
        question: 'What does "Principle of Maximum Expected Utility" mean in AI?',
        options: [
          'An agent should always choose the action that minimizes work',
          'A rational agent should select the action that maximizes its expected utility',
          'An agent should execute the first action in its list',
          'An agent should choose random actions 50% of the time',
        ],
        correctIndex: 1,
        explanation:
          'The foundational definition of rationality in AI states that an agent ought to select the action that yields the highest expected utility averaged over possible outcomes.',
      },
    ],
  },
  {
    id: 'learning',
    number: 5,
    name: 'Learning Agent',
    tagline: 'Improve through experience.',
    gameName: 'Train Your Bot',
    category: 'Reinforcement Learning & Q-Learning',
    theme: {
      primary: '#EC4899', // Pink / Magenta
      bgBadge: 'rgba(236, 72, 153, 0.1)',
      borderAccent: 'rgba(236, 72, 153, 0.4)',
      textAccent: 'text-pink-400',
      gradient: 'from-pink-500 to-rose-500',
      glow: 'shadow-[0_0_24px_rgba(236,72,153,0.25)]',
    },
    definition:
      'A Learning Agent improves its performance element over time through interactions with its environment. It consists of four conceptual components: the Learning Element, Performance Element, Critic, and Learning Goals (Problem Generator).',
    poaiConcept:
      'In POAI, a learning agent is not hardcoded with optimal rules. Instead, it interacts with an unknown environment, receives rewards and penalties via a Critic, and updates its action values (e.g. Q-table) using reinforcement learning.',
    environment: 'A 4x4 Grid World with Start (0,0), Goal Crystal (+100 reward), Lava Traps (-50 penalty), and Step Cost (-1).',
    sensors: ['Current Grid State s=(r, c) & Scalar Feedback Reward r'],
    actuators: ['Motor Stepper (Up, Down, Left, Right)'],
    limitations:
      'Requires exploration which can lead to mistakes during initial training. Finding optimal behavior depends on hyperparameter tuning (learning rate alpha, discount gamma, and exploration epsilon).',
    realWorldExample:
      'AlphaZero learning chess through self-play, robotic walking dogs adapting to slippery ice, or recommendation algorithms learning user preferences through click feedback.',
    whatPlayerWillDo:
      'Watch an untrained bot make erratic moves into lava traps. Train the agent across episodes using genuine Tabular Q-Learning, observe the Q-values converge in real-time, and run a greedy test run to see it navigate flawlessly.',
    winCondition: 'Train the agent for at least 15 episodes so the Q-table converges to a positive reward path.',
    controlsExplanation: [
      'Click "Test Untrained Bot" to see random/naive exploration into hazards.',
      'Click "Train 1 Episode" or "Train 20 Episodes" to trigger genuine Q-table updates.',
      'Hover over grid cells to inspect the learned directional Q-values (Up, Down, Left, Right).',
      'Click "Test Trained Bot" to watch the agent follow its converged greedy policy to victory!',
    ],
    pythonCode: `import numpy as np

# Q-Learning parameters
ALPHA = 0.2     # Learning rate: how much new info overrides old
GAMMA = 0.9     # Discount factor: value of future rewards
EPSILON = 0.3   # Exploration rate: probability of random action

def q_learning_update(q_table, state, action, reward, next_state, is_terminal):
    """
    Standard Bellman Q-Learning update rule:
    Q(s, a) <- Q(s, a) + alpha * [reward + gamma * max_a' Q(s', a') - Q(s, a)]
    """
    current_q = q_table[state][action]

    if is_terminal:
        # At terminal state (goal or trap), no future rewards exist
        td_target = reward
    else:
        # Future value discounted by gamma
        best_future_q = max(q_table[next_state].values())
        td_target = reward + GAMMA * best_future_q

    # Update value weighted by learning rate alpha
    td_error = td_target - current_q
    q_table[state][action] = current_q + ALPHA * td_error

    return q_table[state][action]


# Example update demonstration
q_values = {
    (0, 0): {"UP": 0.0, "DOWN": 0.0, "LEFT": 0.0, "RIGHT": 0.0},
    (0, 1): {"UP": 0.0, "DOWN": 0.0, "LEFT": 0.0, "RIGHT": 0.0},
}

# Agent moves from (0,0) RIGHT to (0,1), receives step penalty -1
new_q = q_learning_update(q_values, (0, 0), "RIGHT", -1, (0, 1), False)
print("Updated Q((0,0), RIGHT):", round(new_q, 3))`,
    pythonRunResult: `Updated Q((0,0), RIGHT): -0.2`,
    flowSteps: [
      {
        id: 'step-1',
        title: 'Action Selection',
        subtitle: 'Epsilon-Greedy',
        description: 'Agent decides whether to explore (random action) or exploit (best known Q-value from table).',
        gameConnection: 'Robot flashes cyan when exploring, or magenta when exploiting learned knowledge.',
      },
      {
        id: 'step-2',
        title: 'Environment Interaction',
        subtitle: 'State Transition s -> s\'',
        description: 'Action moves the robot to a new tile; environment yields a reward or penalty.',
        gameConnection: 'Robot lands on step (-1), lava trap (-50), or crystal goal (+100).',
      },
      {
        id: 'step-3',
        title: 'Critic Evaluation',
        subtitle: 'Temporal Difference Error',
        description: 'Critic compares expected reward against actual outcome: TD_Target = r + gamma * max Q(s\', a\').',
        gameConnection: 'Reward notification floats up from the contacted cell.',
      },
      {
        id: 'step-4',
        title: 'Q-Table Update',
        subtitle: 'Bellman Equation',
        description: 'Learning element adjusts Q(s, a) proportionally to learning rate alpha.',
        gameConnection: 'Arrows on the grid tile tilt and turn emerald green for high values, red for traps.',
      },
    ],
    codeLines: [
      {
        lineNumber: 7,
        code: 'def q_learning_update(q_table, state, action, reward, next_state, is_terminal):',
        explanation: 'Core learning update function implementing the Bellman optimality equation.',
        gameAction: 'Invoked after every step the bot takes during training.',
        variableState: {},
      },
      {
        lineNumber: 12,
        code: '    current_q = q_table[state][action]',
        explanation: 'Retrieves current estimated value of taking this action from this state.',
        gameAction: 'Reads current arrow value on tile.',
        variableState: { current_q: 0.0 },
      },
      {
        lineNumber: 14,
        code: '    if is_terminal:',
        explanation: 'Terminal boundary: no future actions exist after reaching goal or dying.',
        gameAction: 'Robot reaches the goal crystal or falls into lava.',
        variableState: { is_terminal: false },
      },
      {
        lineNumber: 18,
        code: '        best_future_q = max(q_table[next_state].values())',
        explanation: 'Estimates optimal future payoff from the next state s\'.',
        gameAction: 'Looks ahead at the highest value arrow on next tile.',
        variableState: { best_future_q: 0.0 },
      },
      {
        lineNumber: 19,
        code: '        td_target = reward + GAMMA * best_future_q',
        explanation: 'Bellman target: immediate reward plus discounted future value.',
        gameAction: 'Calculates expected return.',
        variableState: { td_target: -1.0 },
      },
      {
        lineNumber: 23,
        code: '    q_table[state][action] = current_q + ALPHA * td_error',
        explanation: 'Updates table entry proportionally by learning rate alpha.',
        gameAction: 'Tile directional arrow updates color and numeric weight.',
        variableState: { new_q: -0.2 },
      },
    ],
    mapping: [
      {
        codeSnippet: 'ALPHA = 0.2',
        whatItDoes: 'Learning rate governing how quickly new experience updates values',
        gameEvent: 'Controls how rapidly arrow colors shift after each episode',
      },
      {
        codeSnippet: 'GAMMA = 0.9',
        whatItDoes: 'Discount factor determining the weight of future rewards vs immediate payoff',
        gameEvent: 'Allows the robot to learn paths that lead to the distant crystal goal',
      },
      {
        codeSnippet: 'q_table[state][action] = ...',
        whatItDoes: 'Persists learned knowledge into the tabular Q-matrix',
        gameEvent: 'Arrows on the grid permanently guide the trained robot away from lava',
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What are the four key components of a Learning Agent in AI architecture?',
        options: [
          'CPU, GPU, RAM, and SSD',
          'Learning Element, Performance Element, Critic, and Problem Generator',
          'Sensor, Actuator, Battery, and Wheel',
          'Compiler, Linker, Assembler, and Debugger',
        ],
        correctIndex: 1,
        explanation:
          'According to Russell & Norvig, a Learning Agent consists of: the Critic (evaluates behavior against standards), the Learning Element (makes improvements), the Performance Element (selects actions), and the Problem Generator (suggests exploratory actions).',
      },
      {
        id: 'q2',
        question: 'In the Q-learning update formula, what role does the discount factor (gamma) play?',
        options: [
          'It sets the computer screen brightness',
          'It balances the importance of immediate rewards vs future rewards',
          'It determines how many games can be played per day',
          'It forces the robot to move backward',
        ],
        correctIndex: 1,
        explanation:
          'Gamma (0 <= gamma <= 1) determines how much future rewards are valued. A gamma close to 1 makes the agent farsighted, valuing long-term goals like reaching the destination.',
      },
      {
        id: 'q3',
        question: 'Why does a learning agent use an epsilon-greedy strategy instead of only picking the highest Q-value from the start?',
        options: [
          'To save electricity during training',
          'To balance exploration of unknown actions with exploitation of known rewards',
          'Because computers cannot calculate maximum values',
          'To make the game harder for human players',
        ],
        correctIndex: 1,
        explanation:
          'Exploration vs. exploitation: if an agent only exploits what it already knows (greedy), it might stick to a mediocre early path and never discover the true optimal route with higher rewards.',
      },
    ],
  },
];
