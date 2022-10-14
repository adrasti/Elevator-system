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
import { useStore } from "vuex";

export default {
  props: ["floor", "elevatorStyle", "elevator", "call"],
  emits: ["callElevator"],
  name: "Cell",
  setup(props, { emit }) {
    const store = useStore();
    const el = ref(null);
    const elevatorStyle = props.elevatorStyle;
    const currentFloor = ref(props.floor);

    const activeButton = ref(false);

    const handleClick = () => {
      if (!store.state.active_buttons.has(props.floor))
        emit("callElevator", props.floor);
    };

    watch(store.state.active_buttons, () => {
      if (store.state.active_buttons.has(props.floor)) {
        activeButton.value = true;
      } else activeButton.value = false;
    });

    watch(props, () => {
      let delay;
      if (props.call && props.call[0] == props.elevator) {
        const call1 = props.call[1];
        const elevator = props.elevator;
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
        setTimeout(() => {
          store.commit("removeActiveButton", call1);
          store.commit("addElevator", elevator);
        }, delay);
      }
    });

    return { elevatorStyle, handleClick, el, activeButton };
  },
};
</script>
