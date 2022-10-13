<template>
  <div class="elevator-screen"></div>
  <div class="elevator-content">
    <div class="elevator-container" :style="elevatorContainerStyle">
      <template v-for="floor in floors" :key="floor">
        <Cell
          v-for="elevator in elevators"
          :key="elevator"
          :floor="floor"
          :elevator="elevator"
          v-on:callElevator="callElevator"
        ></Cell>
      </template>
      <ElevatorCell
        v-for="elevator in elevators"
        :key="elevator"
        :elevatorStyle="elevatorStyle"
        :floor="floors + 1"
        :elevator="elevator"
        :call="callCommand"
        v-on:callElevator="callElevator"
      ></ElevatorCell>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, computed } from "vue";
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

    const floors = ref(4);
    const elevators = ref(2);

    const floorHeight = ref(160);
    const elevatorShaftWidth = ref(200);

    const callCommand = ref(null);

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
      for (let i = 0; i < elevators.value; i++) {
        columns = columns + " " + shaftWidth;
      }
      for (let i = 0; i < floors.value + 1; i++) {
        rows = rows + " " + height;
      }
      console.log(columns);
      return `grid-template-columns:${columns}; grid-template-rows:${rows}`;
    });

    const callElevator = (floor) => {
      callCommand.value = [1, floor];
    };

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

.elevator-screen {
  height: 200px;
}
</style>
