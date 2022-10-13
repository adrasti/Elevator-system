<template>
  <div class="cell">
    <div @click="handleClick" class="elevator-button"></div>
  </div>
</template>

<script>
import { watch } from "vue";
export default {
  props: ["floor", "elevator"],
  emits: ["callElevator"],
  name: "Cell",
  setup(props, { emit }) {
    const handleClick = () => {
      emit("callElevator", props.floor);
    };

    return { handleClick };
  },
};
</script>

<style lang="scss">
.cell {
  position: relative;
  border: solid black 1px;
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
  }
  &:after {
    content: "";
    position: absolute;
    border-radius: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 35%;
    height: 35%;
    background-color: blue;
  }
  &:before {
    content: "";
    position: absolute;
    border-radius: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    height: 70%;
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
