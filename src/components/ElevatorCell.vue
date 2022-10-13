<template>
  <div class="cell">
    <div
      @click="handleClick"
      :class="{ active: activeButton }"
      class="elevator-button"
    ></div>
    <div :style="elevatorStyle" class="elevator" ref="el"></div>
  </div>
</template>

<script>
import { computed, ref, onMounted, watch } from "vue";
export default {
  props: ["floor", "elevatorStyle", "elevator", "call"],
  emits: ["callElevator"],
  name: "Cell",
  setup(props, { emit }) {
    const el = ref(null);
    const elevatorStyle = props.elevatorStyle;
    const currentFloor = ref(props.floor);

    const activeButton = ref(false);

    const handleClick = () => {
      emit("callElevator", props.floor);
    };

    watch(props, () => {
      let delay;
      if (props.call && props.call[0] == props.elevator) {
        delay = Math.abs(Number(props.call[1]) - currentFloor.value) * 1000;
        el.value.animate(
          [
            { top: `-${(props.floor - currentFloor.value) * 160}px` },
            { top: `-${(props.floor - props.call[1]) * 160}px` },
          ],
          {
            duration: delay,
            easing: "linear",
            fill: "forwards",
          }
        );
        currentFloor.value = Number(props.call[1]);
      }
    });

    return { elevatorStyle, handleClick, el, activeButton };
  },
};
</script>
