<script setup lang="ts">
import {
  BugfinderConfiguration,
  BugfinderViewModel,
  CodeViewModel,
  ErrorType,
  WordViewModel,
} from "@/ts/models/bugfinder-model";
import { ITask } from "@/ts/models/overworld-models";
import { remove } from "@vue/shared";
import { getDefaultSettings } from "http2";
import { defineEmits, defineProps, ref, watch } from "vue";
import { useRoute } from "vue-router";

const props = defineProps<{
  minigame: ITask;
  showModal: boolean;
}>();

const route = useRoute();
const courseId = ref(route.params.courseId as string);
const worldIndex = ref(route.params.worldIndex as string);
const dungeonIndex = ref(route.params.dungeonIndex as string);
const minigame = ref(props.minigame);
const showModal = ref(props.showModal);
let configuration = ref(new BugfinderConfiguration());
const oldMinigame = ref();
const showBugModalRef = ref(false);
const bugForm = ref<WordViewModel>({ correctValue: "" });

watch(
  () => props.minigame,
  (newMinigame) => {
    minigame.value = newMinigame;
  },
  { deep: true }
);

watch(
  () => props.showModal,
  (newBoolean) => {
    showModal.value = newBoolean;
  },
  { deep: true }
);

watch(
  () => [
    route.params.courseId,
    route.params.worldIndex,
    route.params.dungeonIndex,
  ],
  (newVal) => {
    courseId.value = newVal[0] as string;
    worldIndex.value = newVal[1] as string;
    dungeonIndex.value = newVal[2] as string;
  },
  { deep: true }
);

const emit = defineEmits<{
  (e: "updateMinigameConfiguration", minigame: ITask): void;
  (e: "closedModal"): void;
}>();

function resetModal() {
  if (minigame.value.configurationId != undefined) {
    // getChickenshockConfig(minigame.value.configurationId)
    //   .then((response) => {
    //     configuration.value = response.data;
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     if (error.response.status == 404) {
    //       minigame.value.configurationId = undefined;
    //       configuration.value = new BugfinderConfiguration();
    //     }
    //   });
    oldMinigame.value = minigame.value;
  } else {
    configuration.value = new BugfinderConfiguration();
    oldMinigame.value = minigame.value;
  }
  console.log("Reset Modal");
}

function handleOk() {
  // TODO: post results
}

function hiddenModal() {
  emit("closedModal");
}

function loadModal() {
  if (oldMinigame.value != null) {
    if (oldMinigame.value.id != minigame.value.id) {
      resetModal();
    }
  } else {
    resetModal();
  }
}

const codes = ref<BugfinderViewModel>(getDefaultViewModel());

function getDefaultViewModel(): BugfinderViewModel {
  return { codes: [{ words: getDefaultWordViewModel() }] };
}
function getDefaultWordViewModel(): WordViewModel[][] {
  return [[{ correctValue: "" }]];
}

function getCode(code: number) {
  if (codes.value.codes[code] === undefined) {
    throw new Error(`cannot find code with index ${code}`);
  }
  return codes.value.codes[code];
}

function getRow(code: number, row: number) {
  if (getCode(code).words[row] === undefined) {
    throw new Error(`cannot find row with index ${row}`);
  }
  return getCode(code).words[row];
}

function getWord(code: number, row: number, col: number): WordViewModel {
  if (getRow(code, row)[col] === undefined) {
    throw new Error(`cannot find column with index ${col}`);
  }
  return getRow(code, row)[col];
}

function newCode() {
  codes.value.codes.push({ words: getDefaultWordViewModel() });
}

function removeCode(code: number) {
  codes.value.codes.splice(code, 1);
}

function inputChanged(
  codeI: number,
  row: number,
  col: number,
  newString: string
) {
  const code = getCode(codeI);
  const word = getWord(codeI, row, col);
  word.correctValue = newString;
  // remove empty columns
  for (let rowIndex = 0; rowIndex < code.words.length; rowIndex++) {
    code.words[rowIndex] = code.words[rowIndex].filter(
      (col) => col.correctValue.trim().length !== 0
    );
  }
  // remove empty rows
  code.words = code.words.filter((row) => row.length !== 0);
  // add missing columns
  for (let rowIndex = 0; rowIndex < code.words.length; rowIndex++) {
    const currentRow = code.words[rowIndex];
    if (currentRow.length === 0) {
      continue;
    }
    if (currentRow[currentRow.length - 1].correctValue.trim().length !== 0) {
      currentRow.push({ correctValue: "" });
    }
  }
  // add missing rows
  if (codes.value.codes.length !== 0) {
    const lastRow = code.words[code.words.length - 1];
    if (lastRow.length !== 0) {
      code.words.push([{ correctValue: "" }]);
    }
  }
  // reset to default
  if (code.words.length === 0) {
    code.words = getDefaultWordViewModel();
  }
}

function addTab(codeId: number, rowId: number) {
  const code = getCode(codeId);
  code.words[rowId] = [{ correctValue: "<<tab>>" }, ...code.words[rowId]];
}

function removeTab(codeId: number, rowId: number) {
  const code = getCode(codeId);
  code.words[rowId] = code.words[rowId].slice(1);
}

function showBugModal(codeId: number, rowId: number, colId: number) {
  const word = getWord(codeId, rowId, colId);
  bugForm.value = word;
  showBugModalRef.value = true;
}
</script>
<template>
  <b-modal
    size="xl"
    title="Edit Bugfinder configuration"
    id="edit-modal"
    v-model="showModal"
    @hidden="hiddenModal"
    @ok="handleOk"
    @cancel="resetModal"
    @show="loadModal"
    @abort="resetModal"
  >
    <div class="alert alert-info">
      <em class="bi bi-info-circle"></em>
      Enter the correct code and put each selectable segment into one field.
      Spaces will be added automatically for each field.
    </div>

    <b-card no-body>
      <b-tabs card>
        <b-tab v-for="(code, codeId) in codes.codes" :key="codeId">
          <template #title>
            <div class="tab-title">
              <span>{{ "Tab " + (codeId + 1) }}</span>
              <b-button variant="none" size="sm"
                ><em
                  class="bi bi-x text-primary"
                  @click="removeCode(codeId)"
                ></em
              ></b-button>
            </div>
          </template>
          <div class="row">
            <table>
              <tbody>
                <tr v-for="(row, rowId) in code.words" :key="rowId">
                  <b-button size="sm" v-on:click="addTab(codeId, rowId)">
                    <em class="bi bi-arrow-bar-right"></em>
                  </b-button>
                  <td v-for="(col, colId) in row" :key="colId">
                    <b-button
                      v-if="col.correctValue === '<<tab>>'"
                      variant="outline-secondary"
                      size="sm"
                      style="width: 100%"
                      v-on:click="removeTab(codeId, rowId)"
                    >
                      <em class="bi bi-arrow-bar-left"></em>
                    </b-button>
                    <b-input-group v-if="col.correctValue !== '<<tab>>'">
                      <b-form-input
                        size="sm"
                        v-model="col.correctValue"
                        v-on:input="inputChanged(codeId, rowId, colId, $event)"
                      ></b-form-input>
                      <b-button
                        v-if="col.errorType === undefined"
                        size="sm"
                        v-on:click="showBugModal(codeId, rowId, colId)"
                      >
                        <em class="bi bi-bug"></em>
                      </b-button>
                      <b-button
                        v-if="col.errorType !== undefined"
                        variant="info"
                        size="sm"
                        v-on:click="showBugModal(codeId, rowId, colId)"
                      >
                        <em class="bi bi-bug"></em>
                      </b-button>
                    </b-input-group>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-tab>
        <template #tabs-end>
          <b-nav-item role="presentation" @click.prevent="newCode()" href="#">
            <em class="bi bi-plus"></em>
            Add Code
          </b-nav-item>
        </template>
      </b-tabs>
    </b-card>
  </b-modal>
  <b-modal v-model="showBugModalRef" title="Edit bug">
    <b-form>
      <b-form-group label="Correct value">
        <b-form-input
          v-model="bugForm.correctValue"
          :disabled="true"
          type="text"
        ></b-form-input>
      </b-form-group>
      <b-form-group label="Error type">
        <b-form-select
          :options="['', ...Object.values(ErrorType)]"
          v-model="bugForm.errorType"
        ></b-form-select>
      </b-form-group>
      <b-form-group label="Display value">
        <b-form-input v-model="bugForm.displayValue" type="text"></b-form-input>
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<style scoped>
.tab-title {
  display: flex;
}

.tab-title button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  margin-left: 8px;
}

/* .tab-title em {
  margin-left: 8px;
} */
</style>
