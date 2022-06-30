<script setup lang="ts">
import { defineProps } from "vue";
import { IArea } from "@/ts/worlds";
import VueMultiselect from "vue-multiselect";

defineProps<{
  area: IArea;
  availableMinigames: [];
}>();
</script>

<template>
  <h1>
    {{ area.name }}
    <input type="checkbox" checked data-toggle="toggle" />
  </h1>
  <div v-for="task in area.tasks" :key="task.id">
    <div class="row">
      <div class="col-sm-4">Minigame</div>
      <div class="col-sm-4">
        <VueMultiselect
          v-model="task.game"
          :options="availableMinigames"
        ></VueMultiselect>
      </div>
      <div class="col-sm-4">
        <button type="button" class="btn btn-info btn-sm">Edit</button>
      </div>
    </div>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style scoped></style>
