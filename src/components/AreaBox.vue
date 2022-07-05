<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from "vue";
import { IArea, ITask, Minigame } from "@/ts/worlds";
import VueMultiselect from "vue-multiselect";
import { useToast } from "vue-toastification";

const props = defineProps<{
  area: IArea;
  availableMinigames: [];
}>();

const toast = useToast();

const area = ref(props.area);
const collapse = ref(Array<boolean>());

const editingAreaLecturerName = ref();

watch(
  () => props.area,
  (newArea) => {
    area.value = newArea;
  },
  { deep: true }
);

const emit = defineEmits<{
  (e: "editMinigameConfiguration", minigame: ITask): void;
}>();

function startEditMinigame(task: ITask) {
  emit("editMinigameConfiguration", task);
}

function startEditAreaLecturerName(area: IArea) {
  editingAreaLecturerName.value = area.lectureName;
}

function saveEditAreaLecturerName(area: IArea) {
  area.lectureName = editingAreaLecturerName.value;
  toast.success(
    "Lecturename of " + area.name + " was updated to " + area.lectureName + "!"
  );
  editingAreaLecturerName.value = null;
}

function cancelEditAreaLecturerName(area: IArea) {
  toast.warning("Lecturename of " + area.name + " was not updated!");
  editingAreaLecturerName.value = null;
}

function toggledAreaSwitch(area: IArea) {
  console.log("Toggled switch of " + area.name);
  console.log(area.active);
  if (area.active) {
    toast.success("Area " + area.name + " was activated!");
  } else {
    toast.error("Area " + area.name + " was deactivated!");
  }
}

function changedMinigame(task: ITask) {
  if (task.game == null) {
    task.game = Minigame.NONE;
  }
  toast.success(
    "Minigame in Task " +
      task.lectureName +
      " was updated to " +
      task.game +
      "!"
  );
  console.log("Changed minigame to " + task.game);
}
</script>

<template>
  <b-row>
    <b-col>
      <button
        type="button"
        class="btn btn-secondary btn-sm"
        @click="collapse[area.id] = !collapse[area.id]"
      >
        <i v-if="!collapse[area.id]" class="bi bi-box-arrow-in-down"></i>
        <i v-else class="bi bi-box-arrow-in-up"></i>
        Collapse
      </button>
    </b-col>
    <b-col>
      <div v-if="editingAreaLecturerName == null">
        <h4>
          {{ area.lectureName }}
          <button
            type="button"
            class="btn btn-light btn-sm"
            @click="startEditAreaLecturerName(area)"
          >
            <i class="bi bi-pencil-square"></i>
          </button>
        </h4>
      </div>
      <div v-else>
        <b-row>
          <b-col>
            <b-form-input v-model="editingAreaLecturerName"></b-form-input>
          </b-col>
          <b-col>
            <b-button-group>
              <b-button
                variant="success"
                size="sm"
                @click="saveEditAreaLecturerName(area)"
              >
                <i class="bi bi-journal-check"></i>
              </b-button>
              <b-button
                variant="danger"
                size="sm"
                @click="cancelEditAreaLecturerName(area)"
              >
                <i class="bi bi-x-lg"></i>
              </b-button>
            </b-button-group>
          </b-col>
        </b-row>
      </div>
      {{ area.name }}
    </b-col>
    <b-col>
      <b-form-checkbox
        v-model="area.active"
        @change="toggledAreaSwitch(area)"
        name="check-button"
        switch
      >
      </b-form-checkbox>
    </b-col>
  </b-row>
  <b-row>
    <b-collapse id="collapse-4" v-model="collapse[area.id]">
      <b-card v-for="task in area.tasks" :key="task.id" class="mt-1">
        <b-row>
          <b-col>{{ task.lectureName }}</b-col>
          <b-col>
            <VueMultiselect
              v-model="task.game"
              :options="availableMinigames"
              @update:model-value="changedMinigame(task)"
            ></VueMultiselect>
          </b-col>
          <b-col>
            <button
              type="button"
              class="btn btn-info btn-sm"
              @click="startEditMinigame(task)"
            >
              <i class="bi bi-pencil-square"></i>
              Edit
            </button>
          </b-col>
        </b-row>
      </b-card>
    </b-collapse>
  </b-row>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style scoped></style>
