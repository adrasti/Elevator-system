<template>
  <div class="elevator-screen"></div>
  <div class="elevator-content">
    <div class="elevator-container" :style="elevatorContainerStyle">
      <template v-for="floor in floors" :key="floor">
        <Cell
          v-for="elevator in elevators"
          :key="elevator"
          :floor="floor"
        ></Cell>
      </template>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, computed } from "vue";
import Cell from "./components/Elevator-cell.vue";

export default {
  name: "App",
  components: {
    Cell: Cell,
  },
  setup() {
    const store = useStore();

    const floors = ref(5);
    const elevators = ref(2);

    const floorHeight = ref("150px");
    const elevatorWidth = ref("150px");

    const elevatorContainerStyle = computed(() => {
      let columns = "";
      let rows = "";
      for (let i = 0; i < elevators.value; i++) {
        columns = columns + " " + floorHeight.value;
      }
      for (let i = 0; i < floors.value; i++) {
        rows = rows + " " + elevatorWidth.value;
      }
      console.log(columns);
      return `grid-template-columns:${columns}; grid-template-rows:${rows}`;
    });

    return { elevatorContainerStyle, floors, elevators };
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
