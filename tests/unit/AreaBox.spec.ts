import { mount } from "@vue/test-utils";
import AreaBox from "@/components/AreaBox.vue";
import { Dungeon, IArea, Minigame, Task } from "@/ts/models";
import BootstrapVue3 from "bootstrap-vue-3";
import WrapperLike from "@vue/test-utils/dist/interfaces/wrapperLike";

describe("AreaBox.vue", () => {
  let wrapper: WrapperLike;
  let dungeon: IArea;

  beforeEach(() => {
    const tasks = [
      new Task("1", Minigame.BUGFINDER, "asdsaas"),
      new Task("2", Minigame.MOORHUHN, "asdasdsa"),
    ];
    dungeon = new Dungeon("1", "Dungeon 1", "Kapitel 1: UML", true, tasks);
    const availableMinigames = Object.values(Minigame);
    wrapper = mount(AreaBox, {
      props: {
        area: dungeon,
        availableMinigames: availableMinigames,
      },
      global: {
        plugins: [BootstrapVue3],
      },
    });
  });
  test("AreaBox shows in a coloumn lecturer name and given name", () => {
    const areaNameColumn = wrapper.find("#area-name-column");
    expect(areaNameColumn.exists()).toBe(true);
    expect(areaNameColumn.html()).toContain(dungeon.topicName);
    expect(areaNameColumn.html()).toContain(dungeon.staticName);
  });
  test("Lecturer-Name is editable on button click and saveable", async () => {
    const initialDungeonName = dungeon.staticName;
    const initialDungeonLectureName = dungeon.topicName;

    const updatedDungeonLectureName = "New Chapter XY";

    let areaNameColumn = wrapper.find("#area-name-column");
    let lecturerNameInput = areaNameColumn.find("input");
    expect(areaNameColumn.exists()).toBe(true);
    expect(areaNameColumn.html()).toContain(initialDungeonLectureName);
    expect(areaNameColumn.html()).toContain(initialDungeonName);

    expect(lecturerNameInput.exists()).toBe(false);

    const editAreaLecutererNameButton = areaNameColumn.find("button");
    editAreaLecutererNameButton.trigger("click");

    // wait that component re-renders
    await Promise.resolve();

    areaNameColumn = wrapper.find("#area-name-column");
    lecturerNameInput = areaNameColumn.find("input");
    expect(lecturerNameInput.exists()).toBe(true);
    lecturerNameInput.setValue(updatedDungeonLectureName);

    // click save button
    const submitButton = areaNameColumn.find(".btn-success");
    expect(submitButton.exists()).toBe(true);
    submitButton.trigger("click");

    // wait that component re-renders
    await Promise.resolve();

    areaNameColumn = wrapper.find("#area-name-column");
    lecturerNameInput = areaNameColumn.find("input");
    expect(lecturerNameInput.exists()).toBe(false);
    expect(areaNameColumn.html()).toContain(updatedDungeonLectureName);
    expect(areaNameColumn.html()).toContain(initialDungeonName);
  });
  test("Lecturer-Name is editable on button click and cancelable", async () => {
    const initialDungeonName = dungeon.staticName;
    const initialDungeonLectureName = dungeon.topicName;

    let areaNameColumn = wrapper.find("#area-name-column");
    let lecturerNameInput = areaNameColumn.find("input");
    expect(areaNameColumn.exists()).toBe(true);
    expect(areaNameColumn.html()).toContain(initialDungeonLectureName);
    expect(areaNameColumn.html()).toContain(initialDungeonName);

    expect(lecturerNameInput.exists()).toBe(false);

    const editAreaLecutererNameButton = areaNameColumn.find("button");
    editAreaLecutererNameButton.trigger("click");

    // wait that component re-renders
    await Promise.resolve();

    areaNameColumn = wrapper.find("#area-name-column");
    lecturerNameInput = areaNameColumn.find("input");
    expect(lecturerNameInput.exists()).toBe(true);
    lecturerNameInput.setValue("New Dungeon Name");

    // click cancel button
    const submitButton = areaNameColumn.find(".btn-danger");
    expect(submitButton.exists()).toBe(true);
    submitButton.trigger("click");

    // wait that component re-renders
    await Promise.resolve();

    areaNameColumn = wrapper.find("#area-name-column");
    lecturerNameInput = areaNameColumn.find("input");
    expect(lecturerNameInput.exists()).toBe(false);
    expect(areaNameColumn.html()).toContain(initialDungeonLectureName);
    expect(areaNameColumn.html()).toContain(initialDungeonName);
  });
});
