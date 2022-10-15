<template>
  <div class="cell">
    <div
      @click="handleClick"
      :class="{ active: activeButton }"
      class="elevator-button"
    >
      <div class="floornum">{{ floor }}</div>
    </div>
  </div>
</template>

<script>
import { watch, ref, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  props: ["floor", "elevator"],
  emits: ["callElevator"],
  name: "Cell",
  setup(props, { emit }) {
    const store = useStore();

    const activeButton = ref(false);

    const floor = store.state.floors_number - props.floor + 1;

    const handleClick = () => {
      if (!store.state.active_calls.has(props.floor))
        emit("callElevator", props.floor);
    };

    watch(store.state.active_calls, () => {
      if (store.state.active_calls.has(props.floor)) {
        activeButton.value = true;
      } else activeButton.value = false;
    });

    onMounted(() => {
      if (store.state.active_calls.has(props.floor)) {
        activeButton.value = true;
      } else activeButton.value = false;
    });

    return { handleClick, activeButton, floor };
  },
};
</script>

<style lang="scss">
.cell {
  position: relative;
  border: solid black 1px;
  color: rgb(2, 2, 121);
  .floornum {
    font-size: 12px;
    left: 45%;
    top: 50%;
    transform: translate(-45%, -50%);
    position: relative;
  }
}
.elevator-button {
  height: 20px;
  width: 20px;
  position: absolute;
  right: 10px;
  top: 50%;
  bottom: 50%;
  margin: auto;
  border: solid rgb(2, 2, 121) 1px;
  z-index: 10;
  cursor: pointer;
  &.active {
    border-color: orange;
    &::after {
      background-color: orange;
    }
    .floornum {
      color: orange;
    }
  }
  &:before {
    content: "";
    position: absolute;
    border-radius: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    height: 90%;
    border: solid 1px;
    border-color: inherit;
  }
}
.elevator {
  position: absolute;
  background: lightblue;
  left: 50%;
  transform: translate(-50%);
  z-index: -10;
}
</style>
