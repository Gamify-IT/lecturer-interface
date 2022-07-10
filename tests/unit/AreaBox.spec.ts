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
      new Task(1, "Aufgabe 1", Minigame.BUGFINDER, "w1-d1-t1"),
      new Task(2, "Aufgabe 2", Minigame.MOORHUHN, "w1-d1-t2"),
    ];
    dungeon = new Dungeon(1, "Dungeon 1", "Kapitel 1: UML", true, tasks);
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
    expect(areaNameColumn.html()).toContain(dungeon.lectureName);
    expect(areaNameColumn.html()).toContain(dungeon.name);
  });
  test("Lecturer-Name is editable on button click and saveable", async () => {
    let areaNameColumn = wrapper.find("#area-name-column");
    let lectuererNameInput = areaNameColumn.find("input");
    expect(areaNameColumn.exists()).toBe(true);
    expect(areaNameColumn.html()).toContain("Kapitel 1: UML");
    expect(areaNameColumn.html()).toContain("Dungeon 1");

    expect(lectuererNameInput.exists()).toBe(false);

    const editAreaLecutererNameButton = areaNameColumn.find("button");
    editAreaLecutererNameButton.trigger("click");

    // wait that component re-renders
    await Promise.resolve();

    areaNameColumn = wrapper.find("#area-name-column");
    lectuererNameInput = areaNameColumn.find("input");
    expect(lectuererNameInput.exists()).toBe(true);
    lectuererNameInput.setValue("New Chapter XY");

    const submitButton = areaNameColumn.find(".btn-success");
    expect(submitButton.exists()).toBe(true);
    submitButton.trigger("click");

    // wait that component re-renders
    await Promise.resolve();

    areaNameColumn = wrapper.find("#area-name-column");
    lectuererNameInput = areaNameColumn.find("input");
    expect(lectuererNameInput.exists()).toBe(false);
    expect(areaNameColumn.html()).toContain("New Chapter XY");
    expect(areaNameColumn.html()).toContain("Dungeon 1");
  });
  test("Lecturer-Name is editable on button click and cancelable", async () => {
    let areaNameColumn = wrapper.find("#area-name-column");
    let lectuererNameInput = areaNameColumn.find("input");
    expect(areaNameColumn.exists()).toBe(true);
    expect(areaNameColumn.html()).toContain("Kapitel 1: UML");
    expect(areaNameColumn.html()).toContain("Dungeon 1");

    expect(lectuererNameInput.exists()).toBe(false);

    const editAreaLecutererNameButton = areaNameColumn.find("button");
    editAreaLecutererNameButton.trigger("click");

    // wait that component re-renders
    await Promise.resolve();

    areaNameColumn = wrapper.find("#area-name-column");
    lectuererNameInput = areaNameColumn.find("input");
    expect(lectuererNameInput.exists()).toBe(true);
    lectuererNameInput.setValue("New Dungeon Name");

    const submitButton = areaNameColumn.find(".btn-danger");
    expect(submitButton.exists()).toBe(true);
    submitButton.trigger("click");

    // wait that component re-renders
    await Promise.resolve();

    areaNameColumn = wrapper.find("#area-name-column");
    lectuererNameInput = areaNameColumn.find("input");
    expect(lectuererNameInput.exists()).toBe(false);
    expect(areaNameColumn.html()).toContain("Kapitel 1: UML");
    expect(areaNameColumn.html()).toContain("Dungeon 1");
  });
});
