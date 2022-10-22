<template>
  <div class="config-container">
    <div class="config-buttons">
      <button class="reset-button" @click="reset">Сбросить</button>
      <button class="config-button" @click="showConfig">Конфигурация</button>
    </div>
    <teleport v-if="configVisib" to="body">
      <form class="config" @submit.prevent="SubmitForm">
        <div class="config-content">
          <div class="input-groups">
            <div class="input-box">
              <label for="width">Ширина: </label>
              <input
                type="number"
                class="input"
                id="width"
                v-model="width"
                required
                min="50"
                max="1000"
              />
            </div>
            <div class="input-box">
              <label for="height">Высота: </label>
              <input
                type="number"
                class="input"
                id="height"
                v-model="height"
                required
                min="50"
                max="1000"
              />
            </div>
            <div class="input-box">
              <label for="speed">Скорость (мсек./этаж): </label>
              <input
                type="number"
                class="input"
                id="speed"
                v-model="speed"
                required
                min="100"
                max="10000"
              />
            </div>
          </div>
          <div class="input-groups">
            <div class="input-box">
              <label for="floors">Кол-во этажей: </label>
              <input
                type="number"
                class="input"
                id="floors"
                v-model="floors"
                required
                min="2"
                max="50"
              />
            </div>
            <div class="input-box">
              <label for="elevators">Кол-во лифтов: </label>
              <input
                type="number"
                class="input"
                id="elevators"
                v-model="elevators"
                required
                min="1"
                max="50"
              />
            </div>
            <div class="input-box">
              <label for="rest">Длительность отдыха: </label>
              <input
                type="number"
                class="input"
                id="rest"
                v-model="rest"
                required
                min="100"
                max="5000"
              />
            </div>
          </div>
        </div>
        <button class="save-config">Сохранить</button>
      </form>
    </teleport>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref } from "vue";
export default {
  setup() {
    const store = useStore();

    const width = ref(store.state.elevator_shaft_width);
    const height = ref(store.state.elevator_floor_height);
    const speed = ref(store.state.elevator_speed_per_floor);
    const floors = ref(store.state.floors_number);
    const elevators = ref(store.state.elevators_number);
    const rest = ref(store.state.elevator_rest_duration);

    const configVisib = ref(false);

    const showConfig = () => {
      width.value = store.state.elevator_shaft_width;
      height.value = store.state.elevator_floor_height;
      speed.value = store.state.elevator_speed_per_floor;
      floors.value = store.state.floors_number;
      elevators.value = store.state.elevators_number;
      rest.value = store.state.elevator_rest_duration;
      configVisib.value = !configVisib.value;
    };

    const reset = () => {
      store.commit("reset");
    };

    const SubmitForm = () => {
      const obj = {
        elevator_speed_per_floor: speed.value,
        elevator_shaft_width: width.value,
        elevator_floor_height: height.value,
        elevator_rest_duration: rest.value,
        floors_number: floors.value,
        elevators_number: elevators.value,
      };
      localStorage.setItem("staticConfig", JSON.stringify(obj));
      store.commit("reset");
      configVisib.value = false;
    };
    return {
      reset,
      width,
      height,
      speed,
      floors,
      elevators,
      rest,
      SubmitForm,
      showConfig,
      configVisib,
    };
  },
};
</script>

<style lang="scss">
.config-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 40px;
  button {
    display: inline-block;
    padding: 15px 20px;
    font-weight: 600;
    letter-spacing: button;
    cursor: pointer;
  }
  .reset-button {
    color: #daf4f2;
    text-shadow: 0px 1px 0px rgba(255, 255, 255, 0.3);
    background: red;
    box-shadow: 0 0 1px 0 black, 1px 2px 1px 0 rgb(255 255 255 / 30%) inset,
      3px 5px 2px -2px rgb(255 255 255 / 10%) inset,
      1px 3px 0 1px rgb(0 0 0 / 30%), 3px 6px 2px -2px rgb(0 0 0 / 20%);

    border-radius: 10px;
    &:hover {
      background: rgba(255, 0, 0, 0.624);
    }
  }
  .config-button {
    color: #daf4f2;
    margin-left: 100px;
    text-shadow: 0px 1px 0px rgba(255, 255, 255, 0.3);
    background: blue;
    border-radius: 10px;
    box-shadow: 0 0 1px 0 black, 1px 2px 1px 0 rgb(255 255 255 / 30%) inset,
      3px 5px 2px -2px rgb(255 255 255 / 10%) inset,
      1px 3px 0 1px rgb(0 0 0 / 30%), 3px 6px 2px -2px rgb(0 0 0 / 20%);
    &:hover {
      background: rgba(0, 0, 255, 0.62);
    }
  }
}
.config {
  position: fixed;
  font-size: 2vh;
  top: 15%;
  left: 25%;
  width: 50%;
  height: 70%;
  padding: 16px;
  z-index: 1002;
  overflow: auto;
  background: radial-gradient(
      ellipse 150% 150% at 80% 80%,
      transparent 40%,
      rgba(255, 255, 255, 0.25) 60%,
      transparent 100%
    ),
    radial-gradient(
      ellipse 150% 150% at 20% 20%,
      transparent 40%,
      rgba(0, 0, 0, 0.25) 60%,
      transparent 100%
    ),
    radial-gradient(
      ellipse 100% 100% at 50% 50%,
      transparent 25%,
      rgba(0, 0, 0, 0.5) 75%
    ),
    linear-gradient(
      100deg,
      hsla(0, 50%, 25%, 0.25) 0%,
      hsla(5, 75%, 35%, 0.25) 15%,
      hsla(10, 75%, 40%, 0.25) 25%,
      hsla(15, 75%, 55%, 0.25) 35%,
      hsla(20, 65%, 45%, 0.25) 40%,
      hsla(10, 55%, 40%, 0.25) 50%,
      hsla(5, 55%, 35%, 0.25) 65%,
      hsla(5, 55%, 35%, 0.25) 70%,
      hsla(0, 65%, 30%, 0.25) 85%,
      hsla(0, 75%, 25%, 0.25) 100%
    ),
    linear-gradient(
      180deg,
      hsla(210, 15%, 20%, 0.5) 0,
      hsla(220, 25%, 10%, 0.5) 35%,
      hsla(235, 25%, 5%, 0.5) 65%,
      hsla(0, 0%, 0%, 0.5) 100%
    ),
    linear-gradient(
      180deg,
      hsl(200, 80%, 30%) 0%,
      hsl(195, 70%, 45%) 7%,
      hsl(180, 80%, 70%) 25%,
      hsl(180, 100%, 60%) 35%,
      hsl(190, 70%, 55%) 55%,
      hsl(195, 100%, 35%) 75%,
      hsl(200, 85%, 25%) 100%
    );
  box-shadow: 1px 2px 1px 1px rgb(255 255 255 / 30%) inset,
    1px -2px 1px 1px rgb(0 0 0 / 30%) inset,
    2px 4px 1px 2px rgb(255 255 255 / 30%) inset,
    2px -4px 1px 2px rgb(0 0 0 / 30%) inset, 0 4px 3px -2px rgb(0 0 0 / 40%),
    2px 7px 2px -2px rgb(17 17 17 / 40%), 4px 8px 2px -2px rgb(17 17 17 / 40%),
    5px 10px 8px -6px rgb(17 51 85 / 40%), 7px 16px 16px -16px black;
  .save-config {
    position: absolute;
    background: white;
    padding: 15px 25px;
    bottom: 10%;
    left: 50%;
    font-size: 2vh;
    transform: translate(-50%);
    border: solid rgb(91, 233, 91) 3px;
    box-shadow: 0 0 1px 0 rgb(221, 217, 217),
      1px 2px 1px 0 rgb(255 255 255 / 30%) inset,
      3px 5px 2px -2px rgb(255 255 255 / 10%) inset,
      2px 3px 0 1px rgb(165 247 165 / 40%), 3px 6px 2px -2px rgb(0 0 0 / 20%);
    cursor: pointer;
  }
  .config-content {
    position: absolute;
    width: 80%;
    height: 80%;
    top: 5%;
    left: 50%;
    transform: translate(-50%);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    .input-groups {
      flex-basis: 50%;
      width: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
.config:target {
  visibility: visible;
  display: block;
}

.config-content {
  position: relative;
  margin: 0 auto;
  top: 25%;
}

.config-buttons {
  padding: 20px 40px;
}

body {
  background: radial-gradient(
    ellipse farthest-side at center,
    #ccc,
    rgb(215, 210, 210)
  );
}
label {
  color: white;
  display: block;
}

input {
  margin-top: 5px;
  width: 90%;
  font-size: 2vh;
}

.input-box {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  width: 100%;
}

@media (max-width: 820px) {
  .config .config-content .input-groups {
    width: 100%;
  }

  .config .config-content {
    display: block;
  }
}
</style>
