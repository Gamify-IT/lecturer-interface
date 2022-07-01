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
  <b-td><input type="checkbox" checked data-toggle="toggle" /></b-td>
  <b-td>
    <span>{{ area.name }}</span>
  </b-td>
  <b-td>
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
          <button type="button" class="btn btn-info btn-sm">
            <i class="bi bi-pencil-square"></i>
            Edit
          </button>
        </div>
      </div>
    </div>
  </b-td>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style scoped></style>
