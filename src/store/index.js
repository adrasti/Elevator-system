import { createStore, storeKey } from "vuex";

export default createStore({
  state: {
    //static
    elevator_speed_per_floor: 1000,
    elevator_shaft_width: 200,
    elevator_floor_height: 160,
    elevator_rest_duration: 3000,
    floors_number: 5,
    elevators_number: 1,

    elevator_call_queue: new Set(), //floors
    elevator_call_queue_size: 0,
    active_calls: new Map(), // floor => elevator
    available_elevators: [], //elevators
    elevator_states: new Map(), // elevator => floor
    blinking_elevators: new Map(), // floor => elevator

    reset: [true],
    currentTimeOuts: new Set(),
  },
  getters: {
    getQueueSize(state) {
      return state.elevator_call_queue_size;
    },

    getClosestElevator: (state) => (floor) => {
      let l = state.floors_number - 1;
      let c = 0;
      for (let i = 0; i < state.available_elevators.length; i++) {
        if (
          Math.abs(
            state.elevator_states.get(state.available_elevators[i]) - floor
          ) < l
        ) {
          c = i;
          l = Math.abs(
            state.elevator_states.get(state.available_elevators[i]) - floor
          );
        }
      }
      console.log(state);
      return [state.available_elevators[c], c];
    },
  },
  mutations: {
    init(state) {
      if (localStorage.getItem("staticConfig")) {
        const o = JSON.parse(localStorage.getItem("staticConfig"));
        state.elevator_speed_per_floor = Number(o.elevator_speed_per_floor);
        state.elevator_shaft_width = Number(o.elevator_shaft_width);
        state.elevator_floor_height = Number(o.elevator_floor_height);
        state.elevator_rest_duration = Number(o.elevator_rest_duration);
        state.floors_number = Number(o.floors_number);
        state.elevators_number = Number(o.elevators_number);
      } else {
        localStorage.setItem(
          "staticConfig",
          JSON.stringify({
            elevator_speed_per_floor: state.elevator_speed_per_floor,
            elevator_shaft_width: state.elevator_shaft_width,
            elevator_floor_height: state.elevator_floor_height,
            elevator_rest_duration: state.elevator_rest_duration,
            floors_number: state.floors_number,
            elevators_number: state.elevators_number,
          })
        );
      }

      if (localStorage.getItem("queue")) {
        const q = JSON.parse(localStorage.getItem("queue"));
        state.elevator_call_queue = new Set(q.q);
        state.elevator_call_queue_size = Number(q.s);
      } else {
        localStorage.setItem(
          "queue",
          JSON.stringify({
            q: Array.from(state.elevator_call_queue),
            s: state.elevator_call_queue_size,
          })
        );
      }

      if (localStorage.getItem("activeCalls")) {
        state.active_calls = new Map(
          JSON.parse(localStorage.getItem("activeCalls"))
        );
      } else {
        localStorage.setItem(
          "activeCalls",
          JSON.stringify(Array.from(state.active_calls))
        );
      }

      if (localStorage.getItem("availableElevators")) {
        state.available_elevators = JSON.parse(
          localStorage.getItem("availableElevators")
        );
      } else {
        for (let i = 1; i <= state.elevators_number; i++) {
          state.available_elevators.push(i);
        }
        localStorage.setItem(
          "availableElevators",
          JSON.stringify(state.available_elevators)
        );
      }

      if (localStorage.getItem("elevatorStates")) {
        state.elevator_states = new Map(
          JSON.parse(localStorage.getItem("elevatorStates"))
        );
      } else {
        for (let i = 1; i <= state.elevators_number; i++) {
          state.elevator_states.set(i, state.floors_number);
        }
        localStorage.setItem(
          "elevatorStates",
          JSON.stringify(Array.from(state.elevator_states))
        );
      }

      state.blinking_elevators = new Map();
    },

    reset(state) {
      const o = JSON.parse(localStorage.getItem("staticConfig"));
      state.elevator_speed_per_floor = Number(o.elevator_speed_per_floor);
      state.elevator_shaft_width = Number(o.elevator_shaft_width);
      state.elevator_floor_height = Number(o.elevator_floor_height);
      state.elevator_rest_duration = Number(o.elevator_rest_duration);
      state.floors_number = Number(o.floors_number);
      state.elevators_number = Number(o.elevators_number);

      state.available_elevators = [];
      state.elevator_states.clear();
      state.active_calls.clear();
      state.elevator_call_queue.clear();
      state.elevator_call_queue_size = 0;

      for (let i = 1; i <= state.elevators_number; i++) {
        state.available_elevators.push(i);
        state.elevator_states.set(i, state.floors_number);
      }
      localStorage.setItem(
        "elevatorStates",
        JSON.stringify(Array.from(state.elevator_states))
      );
      localStorage.setItem(
        "availableElevators",
        JSON.stringify(state.available_elevators)
      );
      localStorage.setItem(
        "queue",
        JSON.stringify({
          q: Array.from(state.elevator_call_queue),
          s: state.elevator_call_queue_size,
        })
      );
      localStorage.setItem(
        "activeCalls",
        JSON.stringify(Array.from(state.active_calls))
      );

      state.reset[0] = !state.reset[0];
      state.blinking_elevators = new Map();
    },
    //очередь вызовов
    addToQueue(state, item) {
      if (!state.elevator_call_queue.has(item)) {
        state.elevator_call_queue_size++;
        state.elevator_call_queue.add(item);
        localStorage.setItem(
          "queue",
          JSON.stringify({
            q: Array.from(state.elevator_call_queue),
            s: state.elevator_call_queue_size,
          })
        );
      }
    },
    removeFromQueue(state, item) {
      if (state.elevator_call_queue.delete(item)) {
        state.elevator_call_queue_size--;
        localStorage.setItem(
          "queue",
          JSON.stringify({
            q: Array.from(state.elevator_call_queue),
            s: state.elevator_call_queue_size,
          })
        );
      }
    },

    //очередь активных вызовов (обновляются после завершения движения лифта)

    addActiveButton(state, [fl, el]) {
      state.active_calls.set(fl, el);
      localStorage.setItem(
        "activeCalls",
        JSON.stringify(Array.from(state.active_calls))
      );
    },

    removeActiveButton(state, item) {
      state.active_calls.delete(item);
      localStorage.setItem(
        "activeCalls",
        JSON.stringify(Array.from(state.active_calls))
      );
    },

    //свободные лифты

    addElevator(state, el) {
      state.available_elevators.push(el);
      localStorage.setItem(
        "availableElevators",
        JSON.stringify(state.available_elevators)
      );
    },
    removeElevator(state, el) {
      state.available_elevators.splice(el, 1);
      localStorage.setItem(
        "availableElevators",
        JSON.stringify(state.available_elevators)
      );
    },

    //состояние работы лифтов

    changeElevatorState(state, [el, fl]) {
      state.elevator_states.set(el, fl);
      localStorage.setItem(
        "elevatorStates",
        JSON.stringify(Array.from(state.elevator_states))
      );
    },

    //мигающие лифты

    addBlinkingElevator(state, [fl, el]) {
      state.blinking_elevators.set(fl, el);
    },

    removeBlinkingElevator(state, fl) {
      state.blinking_elevators.delete(fl);
    },

    //timeout

    setCurrentTimeout(state, tout) {
      state.currentTimeOuts.add(tout);
    },

    removeCurrentTimeout(state, tout) {
      state.currentTimeOuts.delete(tout);
    },

    clearCurrentTimeouts(state) {
      state.currentTimeOuts = new Set();
    },
  },
  actions: {},
  modules: {},
});
