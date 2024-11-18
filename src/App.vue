<script setup lang="ts">
import CourseSidebarMenu from "@/components/Sidebar/CourseSidebarMenu.vue";
import { ref } from "vue";

const upClicked = ref();
const downClicked = ref();
const navigationFocus = ref(true);
const routerFocus = ref(false);
const leftClicked = ref();
const rightClicked = ref();
function clickRight() {
  rightClicked.value = true;
  if (navigationFocus.value) {
    navigationFocus.value = false;
    routerFocus.value = true;
  }
}
function returnFocus() {
  console.log("returnFocus");
  if (routerFocus.value) {
    routerFocus.value = false;
    navigationFocus.value = true;
  }
}
</script>

<template>
  <div
    class="app-wrapper"
    tabindex="-1"
    @keydown.up="upClicked = true"
    @keydown.down="downClicked = true"
    @keydown.left="leftClicked = true"
    @keydown.right="clickRight"
    @keyup.up="upClicked = false"
    @keyup.down="downClicked = false"
    @keyup.left="leftClicked = false"
    @keyup.right="rightClicked = false"
  >
    <CourseSidebarMenu
      :downClicked="downClicked"
      :up-clicked="upClicked"
      :inFocus="navigationFocus"
    />
    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <div class="router-view-wrapper">
      <router-view
        :upClicked="upClicked"
        :downClicked="downClicked"
        :inFocus="routerFocus"
        :rightClicked="rightClicked"
        :leftClicked="leftClicked"
        @return="returnFocus"
      ></router-view>
      <br /><br />
      <footer class="py-2 footer">
        <div class="notice-right">
          <a href="/third-party-license-notice">License notice</a>
        </div>
      </footer>
    </div>
  </div>
</template>
<style scoped>
.footer {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  color: maroon;
  text-align: center;
  background-color: #1e1e21;
}
.notice-right {
  text-align: right;
  margin-right: 25px;
}
a {
  color: rgb(118, 66, 177);
  text-decoration: none;
}
</style>
