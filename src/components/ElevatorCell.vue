<template>
  <div class="cell">
    <div
      @click="handleClick"
      :class="{ active: activeButton }"
      class="elevator-button"
    >
      <div class="floornum">{{ floor }}</div>
    </div>
    <div :style="elevatorStyle" class="elevator" ref="el">
      <div class="elevator-screen">
        <div class="elevator-direction">{{ currentDirection }}</div>
        <div class="elevator-destination">{{ currentDestination }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, ref, onMounted, watch } from "vue";
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

    const floor = store.state.floors_number - props.floor + 1;

    const activeButton = ref(false);

    const currentDirection = ref("-");
    const currentDestination = ref(" ");

    const offset = ref(160);
    const delayMultiplier = ref(1000);

    const handleClick = () => {
      if (!store.state.active_calls.has(props.floor))
        emit("callElevator", props.floor);
    };

    watch(store.state.active_calls, () => {
      if (store.state.active_calls.has(props.floor)) {
        activeButton.value = true;
      } else activeButton.value = false;
    });

    watch(props, () => {
      let delay;
      if (props.call && props.call[0] == props.elevator) {
        if (props.call[1] !== currentFloor.value) {
          const call1 = props.call[1]; //floor
          const elevator = props.elevator;
          store.commit("addActiveButton", [call1, elevator]);
          if (call1 > currentFloor.value) {
            currentDirection.value = "⇩";
          } else if (call1 < currentFloor.value) currentDirection.value = "⇧";
          currentDestination.value = String(
            store.state.floors_number - call1 + 1
          );
          delay =
            Math.abs(Number(props.call[1]) - currentFloor.value) *
            delayMultiplier.value;
          el.value.animate(
            [
              {
                top: `-${(props.floor - currentFloor.value) * offset.value}px`,
              },
              { top: `-${(props.floor - props.call[1]) * offset.value}px` },
            ],
            {
              duration: delay,
              easing: "linear",
              fill: "forwards",
            }
          );
          currentFloor.value = Number(call1);
          setTimeout(() => {
            currentDestination.value = " ";
            currentDirection.value = "-";
            store.commit("removeActiveButton", call1);
            store.commit("addElevator", elevator);
            store.commit("changeElevatorState", [elevator, call1]);
          }, delay);
        } else {
          store.commit("removeActiveButton", props.call[1]);
          store.commit("addElevator", props.elevator);
        }
      }
    });

    onMounted(() => {
      if (store.state.active_calls.has(props.floor)) {
        activeButton.value = true;
      } else activeButton.value = false;
      offset.value = store.state.elevator_floor_height;
      delayMultiplier.value = store.state.elevator_speed_per_floor;
      currentFloor.value = store.state.elevator_states.get(props.elevator);
      el.value.animate(
        [
          { top: `-${(props.floor - currentFloor.value) * 160}px` },
          { top: `-${(props.floor - currentFloor.value) * 160}px` },
        ],
        {
          duration: 0,
          easing: "linear",
          fill: "forwards",
        }
      );
    });

    return {
      elevatorStyle,
      handleClick,
      el,
      activeButton,
      currentFloor,
      floor,
      currentDirection,
      currentDestination,
    };
  },
};
</script>

<style lang="scss">
@font-face {
  font-family: "Silkscreen";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/silkscreen/v1/m8JXjfVPf62XiF7kO-i9YL1la1OD.woff2)
    format("woff2");
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
    U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
@font-face {
  font-family: "Silkscreen";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/silkscreen/v1/m8JXjfVPf62XiF7kO-i9YLNlaw.woff2)
    format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215,
    U+FEFF, U+FFFD;
}

.elevator-screen {
  position: absolute;
  width: 40%;
  height: 15%;
  background: black;
  top: 5%;
  left: 50%;
  transform: translate(-50%);
  margin: auto;
  background: #080001;
  border-radius: 5px;
  font-family: "Silkscreen";
  font-style: normal;
  font-weight: 400;
  color: red;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.elevator-destination {
  margin-bottom: 2px;
}

.elevator-direction {
  font-weight: 1000;
}
</style>
