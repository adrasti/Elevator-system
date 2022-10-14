import { createStore, storeKey } from "vuex";

export default createStore({
  state: {
    elevator_speed_per_floor: 1000,
    elevator_shaft_width: "150px",
    elevator_floor_height: "150px",
    elevator_rest_duration: 3000,
    elevator_call_queue: new Set(),
    elevator_call_queue_size: 0,

    active_buttons: new Set(),

    available_elevators_stack: [1, 2],

    floors_number: 5,
    elevators_number: 2,
  },
  getters: {
    getQueueSize(state) {
      return state.elevator_call_queue_size;
    },
  },
  mutations: {
    //очередь вызовов
    addToQueue(state, item) {
      if (!state.elevator_call_queue.has(item)) {
        state.elevator_call_queue_size++;
        state.elevator_call_queue.add(item);
      }
    },
    removeFromQueue(state, item) {
      if (state.elevator_call_queue.delete(item))
        state.elevator_call_queue_size--;
    },

    //очередь активных вызовов (обновляются не сразу)

    addActiveButton(state, item) {
      state.active_buttons.add(item);
    },

    removeActiveButton(state, item) {
      state.active_buttons.delete(item);
    },

    //свободные

    addElevator(state, el) {
      state.available_elevators_stack.push(el);
    },
    removeElevator(state) {
      state.available_elevators_stack.pop();
    },
  },
  actions: {},
  modules: {},
});
