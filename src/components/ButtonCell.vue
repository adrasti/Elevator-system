<template>
  <div class="cell-padding" @click="handleClick">
    <div :class="{ active: activeButton }" class="elevator-button">
      <div class="floornum">{{ floor }}</div>
    </div>
  </div>
</template>

<script>
import { watch, ref, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  props: ["floor"],
  emits: ["callElevator"],
  setup(props, { emit }) {
    const store = useStore();

    const activeButton = ref(false);

    const floor = store.state.floors_number - props.floor + 1;

    const handleClick = () => {
      if (!store.state.active_calls.has(props.floor)) {
        emit("callElevator", props.floor);
      }
    };

    watch(store.state.active_calls, () => {
      if (
        store.state.active_calls.has(props.floor) &&
        !store.state.blinking_elevators.has(props.floor)
      ) {
        activeButton.value = true;
      } else activeButton.value = false;
    });

    watch(store.state.blinking_elevators, () => {
      if (store.state.blinking_elevators.has(props.floor)) {
        activeButton.value = false;
      }
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
