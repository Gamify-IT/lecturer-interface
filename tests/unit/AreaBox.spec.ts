import { flushPromises, mount } from "@vue/test-utils";
import AreaBox from "@/components/WorldComponents/AreaBox.vue";
import { Dungeon, IArea, Minigame, Task } from "@/ts/models/overworld-models";
import BootstrapVue3, {
  BButton,
  BFormCheckbox,
  BFormInput,
} from "bootstrap-vue-3";
import WrapperLike from "@vue/test-utils/dist/interfaces/wrapperLike";
import config from "@/config";
import mockAxios from "jest-mock-axios";

jest.mock("axios");

describe("AreaBox.vue", () => {
  let wrapper: WrapperLike;
  const courseId = 1;
  const worldIndex = 1;
  const dungeonIndex = 1;
  let dungeon: IArea;

  beforeEach(() => {
    jest.clearAllMocks();
    const tasks = [
      new Task("1", 1, "Learn to code", Minigame.BUGFINDER, "random uuid"),
      new Task(
        "2",
        2,
        "Hit the chicken",
        Minigame.CHICKENSHOCK,
        "random uuid 2"
      ),
    ];
    dungeon = new Dungeon(
      "random uuid",
      dungeonIndex,
      "Dungeon 1",
      "Kapitel 1: UML",
      true,
      tasks,
      []
    );
    wrapper = mount(AreaBox, {
      props: {
        area: dungeon,
        courseId: courseId,
        worldIndex: worldIndex,
        dungeonIndex: dungeonIndex,
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
  });
  test("Topic-Name is editable on button click and saveable", async () => {
    const initialDungeonTopicName = dungeon.topicName;

    const updatedDungeonTopicName = "New Chapter XY";

    let areaNameColumn = wrapper.find("#area-name-column");
    let topicNameInput = areaNameColumn.findComponent(BFormInput);
    expect(areaNameColumn.exists()).toBe(true);
    expect(areaNameColumn.html()).toContain(initialDungeonTopicName);

    expect(topicNameInput.exists()).toBe(false);

    const editButton = areaNameColumn.findComponent(BButton);
    await editButton.trigger("keydown.enter");

    areaNameColumn = wrapper.find("#area-name-column");
    console.log(areaNameColumn.html());
    topicNameInput = areaNameColumn.findComponent(BFormInput);
    console.log(topicNameInput);
    expect(topicNameInput.exists()).toBe(true);
    await topicNameInput.setValue(updatedDungeonTopicName);

    // click save button
    const submitButton = areaNameColumn.find(".btn-success");
    expect(submitButton.exists()).toBe(true);
    await submitButton.trigger("click");

    areaNameColumn = wrapper.find("#area-name-column");
    topicNameInput = areaNameColumn.findComponent(BFormInput);
    expect(topicNameInput.exists()).toBe(false);
    expect(areaNameColumn.html()).toContain(updatedDungeonTopicName);

    expect(mockAxios.put).toHaveBeenCalledWith(
      `${config.overworldApiUrl}/courses/${courseId}/worlds/${worldIndex}/dungeons/${dungeonIndex}`,
      dungeon
    );
  });
  test("Topic-Name is editable on button click and cancelable", async () => {
    const initialDungeonTopicName = dungeon.topicName;

    const updatedDungeonTopicName = "New Chapter XY";

    let areaNameColumn = wrapper.find("#area-name-column");
    let topicNameInput = areaNameColumn.findComponent(BFormInput);
    expect(areaNameColumn.exists()).toBe(true);
    expect(areaNameColumn.html()).toContain(initialDungeonTopicName);

    expect(topicNameInput.exists()).toBe(false);

    const editButton = areaNameColumn.findComponent(BButton);
    await editButton.trigger("keydown.enter");

    areaNameColumn = wrapper.find("#area-name-column");
    topicNameInput = areaNameColumn.findComponent(BFormInput);
    expect(topicNameInput.exists()).toBe(true);
    await topicNameInput.setValue(updatedDungeonTopicName);

    // click save button
    const cancelButton = areaNameColumn.find(".btn-danger");
    expect(cancelButton.exists()).toBe(true);
    await cancelButton.trigger("click");

    areaNameColumn = wrapper.find("#area-name-column");
    topicNameInput = areaNameColumn.findComponent(BFormInput);
    expect(topicNameInput.exists()).toBe(false);
    expect(areaNameColumn.html()).toContain(initialDungeonTopicName);

    expect(mockAxios.put).toHaveBeenCalledTimes(0);
  });
  test("Active status is toggable on switch button", async () => {
    const clonedDungeon = { ...dungeon };
    clonedDungeon.active = !clonedDungeon.active;
    const updateActiveStatusResponse = {
      data: [clonedDungeon],
    };
    mockAxios.put.mockResolvedValueOnce(updateActiveStatusResponse);

    // the input is hiding under the form checkbox component
    const activeSwitch = wrapper.findComponent(BFormCheckbox);
    const activeSwitchInput = activeSwitch.find("input");
    expect(activeSwitch.exists()).toBe(true);
    expect(activeSwitchInput.exists()).toBe(true);

    await activeSwitchInput.trigger("change");

    expect(mockAxios.put).toHaveBeenCalledWith(
      `${config.overworldApiUrl}/courses/${courseId}/worlds/${worldIndex}/dungeons/${dungeonIndex}`,
      dungeon
    );
  });
});
