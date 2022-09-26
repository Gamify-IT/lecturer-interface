<script setup lang="ts">
import { IBook, IWorld, MapType } from "@/ts/models/overworld-models";
import { putBook } from "@/ts/rest-clients/book-rest-client";
import { defineEmits, Ref, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import EditableStringAttribute from "@/components/EditableStringAttribute.vue";
import EditBookModal from "@/components/EditBookModal.vue";
import { getArea } from "@/ts/rest-clients/area-rest-client";
import MapImageModal from "@/components/MapImageModal.vue";

const toast = useToast();
const route = useRoute();
const loading = ref(false);
const courseId = ref(route.params.courseId);
const worldIndex = ref(route.params.worldIndex);
const dungeonIndex = ref(route.params.dungeonIndex);

const showMapModal = ref(false);

const editedBook = ref() as Ref<IBook>;
const showEditModal = ref(false);
const currentNPCId = ref(1);
const editDescription = ref(false);
const firstFocus = ref(false);
const inFocus = ref(false);

watch(
  () => [
    route.params.courseId,
    route.params.worldIndex,
    route.params.dungeonIndex,
  ],
  (newVal) => {
    courseId.value = newVal[0];
    worldIndex.value = newVal[1];
    dungeonIndex.value = newVal[2];
    loadBooks(courseId.value, worldIndex.value, dungeonIndex.value);
  },
  { deep: true }
);

const books = ref(Array<IBook>());

const emit = defineEmits<{
  (e: "return"): void;
}>();

const props = defineProps({
  upClicked: Boolean,
  downClicked: Boolean,
  inFocus: Boolean,
  leftClicked: Boolean,
  rightClicked: Boolean,
});

watch(
  () => props.inFocus,
  (newBoolean) => {
    inFocus.value = newBoolean;
  },
  { deep: true }
);

watch(
  () => props.upClicked,
  (newBoolean) => {
    if (newBoolean) {
      clickUp();
    }
  },
  { deep: true }
);

watch(
  () => props.downClicked,
  (newBoolean) => {
    if (newBoolean) {
      clickDown();
    }
  },
  { deep: true }
);

watch(
  () => props.leftClicked,
  (newBoolean) => {
    if (newBoolean) {
      clickLeft();
    }
  },
  { deep: true }
);

watch(
  () => props.rightClicked,
  (newBoolean) => {
    if (newBoolean) {
      clickRight();
    }
  },
  { deep: true }
);

function clickLeft() {
  if (inFocus.value) {
    if (editDescription.value) {
      editDescription.value = false;
      firstFocus.value = false;
      emit("return");
      console.log("left");
    } else {
      editDescription.value = true;
      document
        .getElementsByClassName("btn-light")
        .item(currentNPCId.value - 1)
        ?.focus();
    }
  }
}

function clickRight() {
  if (inFocus.value) {
    console.log("right");
    if (editDescription.value) {
      console.log("Zwei");
      editDescription.value = false;
      document.getElementById("editButton" + currentNPCId.value)?.focus();
    } else if (!firstFocus.value) {
      firstFocus.value = true;
      console.log("Eins");
      editDescription.value = true;
      document
        .getElementsByClassName("btn-light")
        .item(currentNPCId.value - 1)
        ?.focus();
    }
  }
}

function clickUp() {
  if (inFocus.value) {
    console.log("up");
    if (currentNPCId.value > 1) {
      currentNPCId.value--;
      if (editDescription.value) {
        document
          .getElementsByClassName("btn-light")
          .item(currentNPCId.value - 1)
          ?.focus();
      } else {
        document.getElementById("editButton" + currentNPCId.value)?.focus();
      }
    } else {
      currentNPCId.value = books.value.length;
      if (editDescription.value) {
        document
          .getElementsByClassName("btn-light")
          .item(currentNPCId.value - 1)
          ?.focus();
      } else {
        document.getElementById("editButton" + currentNPCId.value)?.focus();
      }
    }
  }
}

function clickDown() {
  if (inFocus.value) {
    console.log("down");
    if (currentNPCId.value < books.value.length) {
      currentNPCId.value++;
      if (editDescription.value) {
        document
          .getElementsByClassName("btn-light")
          .item(currentNPCId.value - 1)
          ?.focus();
      } else {
        document.getElementById("editButton" + currentNPCId.value)?.focus();
      }
    } else {
      currentNPCId.value = 1;
      if (editDescription.value) {
        document
          .getElementsByClassName("btn-light")
          .item(currentNPCId.value - 1)
          ?.focus();
      } else {
        document.getElementById("editButton" + currentNPCId.value)?.focus();
      }
    }
  }
}

async function loadBooks(courseId: any, worldIndex: any, dungeonIndex: any) {
  loading.value = true;
  console.log("load books");
  if (
    isNaN(courseId) ||
    isNaN(worldIndex) ||
    (dungeonIndex != undefined && isNaN(dungeonIndex))
  ) {
    console.log("one of the ids is NaN");
    loading.value = false;
    return;
  }
  getArea(courseId, worldIndex, dungeonIndex)
    .then((response) => {
      const result: IWorld = response.data;
      books.value = result.books.sort(
        (book1, book2) => book1.index - book2.index
      );
      console.log(books.value);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => (loading.value = false));
}

loadBooks(courseId.value, worldIndex.value, dungeonIndex.value);

function editBook(book: IBook) {
  editedBook.value = book;
  console.log("Want to edit Book " + book.id);
  showEditModal.value = true;
}

function updateBook(book: IBook) {
  console.log("Pressed submit button in book configuration modal");
  putBook(
    courseId.value,
    worldIndex.value,
    dungeonIndex.value,
    book.index,
    book
  )
    .then(() => {
      toast.success(`Book with index ${book.index} was updated!`);
    })
    .catch(() => {
      toast.error(`Book with index ${book.index} could not be updated!`);
    });
}

function saveDescription(book: IBook, description: string) {
  book.description = description;
  putBook(
    courseId.value,
    worldIndex.value,
    dungeonIndex.value,
    book.index,
    book
  )
    .then(() => {
      toast.success(
        `Description of book with index ${book.index} was updated!`
      );
    })
    .catch(() => {
      toast.error(
        `Description of book with index ${book.index} could not be updated!`
      );
    });
}

function cancelEditDescription() {
  toast.warning(`Description in book was not updated!`);
}

function closedEditModal() {
  console.log("Parent got info that modal was closed");
  showEditModal.value = false;
}
</script>

<template>
  <b-overlay :show="loading" rounded="sm">
    <div class="container mt-4">
      <h1 v-if="dungeonIndex === undefined">
        Books from World {{ worldIndex }}
      </h1>
      <h1 v-else>
        Books from World World {{ worldIndex }}, Dungeon {{ dungeonIndex }}
      </h1>
      <b-alert show dismissible>
        Here, you can see all books present in this area.<br />
        Books can give the player a more detailed text about the course.<br />
        To give a book some text to display, click on 'Edit'.
        <br />
        To find out where which book is, click on 'Show map'.</b-alert
      >
      <b-button @click="showMapModal = true">Show Map</b-button>
      <b-card v-for="book in books" :key="book.id" class="mt-1">
        <b-row>
          <b-col sm="2">{{ book.index }}</b-col>
          <b-col>
            <EditableStringAttribute
              prefix="Description"
              :value="book.description"
              @submit="
                (newDescription) => saveDescription(book, newDescription)
              "
              @cancel="cancelEditDescription"
            />
          </b-col>
          <b-col sm="2">
            <b-button
              variant="info"
              size="small"
              :id="`editButton` + book.index"
              @click="editBook(book)"
            >
              <em class="bi bi-pencil-square"></em>
              Edit
            </b-button>
          </b-col>
        </b-row>
      </b-card>
    </div>
  </b-overlay>
  <MapImageModal
    :worldIndex="worldIndex"
    :dungeonIndex="dungeonIndex"
    :showModal="showMapModal"
    modalTitle="Book spots"
    :mapType="MapType.BOOK"
    @closedModal="showMapModal = false"
  />
  <EditBookModal
    :showModal="showEditModal"
    :book="editedBook"
    @updateBook="updateBook"
    @closedModal="closedEditModal"
  />
</template>
