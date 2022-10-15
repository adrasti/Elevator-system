<template>
  <div class="elevator-config"></div>
  <div class="elevator-content">
    <div class="elevator-container" :style="elevatorContainerStyle">
      <template v-for="floor in floors" :key="floor">
        <div class="cell-padding"></div>
        <Cell
          v-for="elevator in elevators"
          :key="elevator"
          :floor="floor"
          :elevator="elevator"
          v-on:callElevator="callElevator"
        ></Cell>
        <div class="cell-padding"></div>
      </template>
      <div class="cell-padding"></div>
      <ElevatorCell
        v-for="elevator in elevators"
        :key="elevator"
        :elevatorStyle="elevatorStyle"
        :floor="floors + 1"
        :elevator="elevator"
        :call="callCommand"
        v-on:callElevator="callElevator"
      ></ElevatorCell>
      <div class="cell-padding"></div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, computed, onMounted, watch } from "vue";
import Cell from "./components/cell.vue";
import ElevatorCell from "./components/ElevatorCell.vue";

export default {
  name: "App",
  components: {
    Cell: Cell,
    ElevatorCell: ElevatorCell,
  },
  setup() {
    const store = useStore();

    const floors = ref();
    const elevators = ref();

    const floorHeight = ref();
    const elevatorShaftWidth = ref();

    const callCommand = ref(null);

    const id = ref(null);

    const elevatorStyle = computed(() => {
      return `width:${elevatorShaftWidth.value * 0.8}px;height:${
        floorHeight.value
      }px`;
    });

    const elevatorContainerStyle = computed(() => {
      let columns = "";
      let rows = "";
      const shaftWidth = `${elevatorShaftWidth.value}px`;
      const height = `${floorHeight.value}px`;
      for (let i = 0; i < elevators.value + 2; i++) {
        columns = columns + " " + shaftWidth;
      }
      for (let i = 0; i < floors.value + 1; i++) {
        rows = rows + " " + height;
      }
      return `grid-template-columns:${columns}; grid-template-rows:${rows}`;
    });

    const callElevator = (floor) => {
      store.commit("addToQueue", floor);
      store.commit("addActiveButton", [floor, undefined]);
      clearInterval(id.value);

      if (store.state.available_elevators.length !== 0) {
        const k = store.getters.getClosestElevator(floor);
        callCommand.value = [k[0], floor];
        store.commit("removeElevator", k[1]);
        store.commit("removeFromQueue", floor);
      } else {
        id.value = setInterval(() => {
          console.log(id.value);
          if (store.state.available_elevators.length !== 0) {
            clearInterval(id.value);
            const temp = store.state.elevator_call_queue.values().next().value;
            const k = store.getters.getClosestElevator(temp);
            callCommand.value = [k[0], temp]; //elevator, floor
            store.commit("removeElevator", k[1]);
            store.commit("removeFromQueue", temp);
            if (store.getters.getQueueSize !== 0) {
              callElevator(
                store.state.elevator_call_queue.values().next().value
              );
            }
          }
        }, 10);
      }
    };

    onMounted(() => {
      store.commit("init");
      floors.value = store.state.floors_number - 1;
      elevators.value = store.state.elevators_number;
      floorHeight.value = store.state.elevator_floor_height;
      elevatorShaftWidth.value = store.state.elevator_shaft_width;

      const l = store.state.available_elevators.length;

      for (let [fl, el] of store.state.active_calls) {
        console.log([el, fl]);
        if (el !== null) {
          setTimeout(() => {
            store.commit("addElevator", el);
            callCommand.value = [el, fl];
            store.commit("removeElevator", l);
          }, 0);
        }
      }

      setTimeout(() => {
        if (store.getters.getQueueSize !== 0) {
          callElevator(store.state.elevator_call_queue.values().next().value);
        }
      }, 0);
    });
    return {
      elevatorContainerStyle,
      floors,
      elevators,
      elevatorStyle,
      callElevator,
      callCommand,
    };
  },
};
</script>

<style lang="scss">
.elevator-container {
  position: relative;
  display: grid;
  margin: auto;
}

.elevator-content {
  margin: 0 auto;
  text-align: center;
  width: 100%;
  display: flex;
  grid-template-columns: 1fr auto 1fr;
  grid-auto-rows: auto;
}

.elevator-config {
  height: 200px;
}
</style>
