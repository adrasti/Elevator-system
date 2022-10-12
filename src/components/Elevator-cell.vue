<template>
  <div class="cell">
    <div class="elevator-button"></div>
  </div>
</template>

<script>
export default {
  props: ["floor"],
  name: "Cell",
  setup(props) {
    console.log(props.floor);
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
  cursor: pointer;
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
    border: solid rgb(2, 2, 121) 1px;
  }
}
</style>
