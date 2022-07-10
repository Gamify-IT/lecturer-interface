import { mount } from "@vue/test-utils";
import router from "@/router/index";
import WorldView from "@/views/WorldView.vue";
import AreaBox from "@/components/AreaBox.vue";
import EditMinigameConfiguration from "@/components/EditMinigameConfigurationModal.vue";
import { exampleWorlds, IWorld } from "@/ts/models";
import BootstrapVue3 from "bootstrap-vue-3";
import WrapperLike from "@vue/test-utils/dist/interfaces/wrapperLike";

describe("WorldView.vue", () => {
  let currentWorld: IWorld;
  let wrapper: WrapperLike;
  beforeEach(async () => {
    const id = 1;

    // on testing the example worlds gets used
    const worlds = exampleWorlds();
    const findWorld = worlds.find((world) => world.id == id);
    if (findWorld == null) {
      throw Error("Could not find World " + id + "!");
    }
    currentWorld = findWorld;
    router.push("/worlds/1");
    await router.isReady();
    wrapper = mount(WorldView, {
      global: {
        plugins: [router, BootstrapVue3],
      },
    });
  });
  test("WordView has for every Dungeon an AreaBox", async () => {
    expect(wrapper.findComponent(EditMinigameConfiguration).exists()).toBe(
      true
    );
    expect(wrapper.findComponent(AreaBox).exists()).toBe(true);
    expect(wrapper.html()).toContain("Configure " + currentWorld.name);
    expect(wrapper.findAllComponents(AreaBox).length).toBe(
      currentWorld.dungeons.length + 1
    );
    currentWorld.dungeons.forEach((dungeon) => {
      const areaBox = wrapper
        .findAllComponents(AreaBox)
        .find(
          (box) =>
            box.html().includes(dungeon.lectureName) &&
            box.html().includes(dungeon.name)
        );
      expect(areaBox != null).toBe(true);
    });
  });
});
