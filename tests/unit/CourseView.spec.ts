import { mount, VueWrapper, flushPromises } from "@vue/test-utils";
import mockAxios from "jest-mock-axios";
import router from "@/router/index";
import CourseView from "@/views/CourseView.vue";
import { Course, ICourse } from "@/ts/models";
import BootstrapVue3 from "bootstrap-vue-3";
import config from "@/config";

jest.mock("axios");

describe("CourseView.vue", () => {
  let wrapper: VueWrapper;
  let course: ICourse;
  beforeEach(async () => {
    jest.clearAllMocks();
    const courseResponse = {
      data: new Course(
        1,
        "PSE",
        "WS-22",
        "Course to teach students basics",
        true,
        []
      ),
    };
    course = courseResponse.data;
    // response for GET /courses
    mockAxios.get.mockResolvedValueOnce(courseResponse);
    router.push(`/courses/${course.id}`);
    await router.isReady();
    wrapper = mount(CourseView, {
      global: {
        plugins: [router, BootstrapVue3],
      },
    });
  });
  test("CourseView displays course details", async () => {
    expect(mockAxios.get).toHaveBeenCalledWith(
      `${config.apiBaseUrl}/courses/${course.id}`
    );

    await flushPromises();
    expect(wrapper.html()).toContain(course.courseName);
    expect(wrapper.html()).toContain(course.description);
    expect(wrapper.html()).toContain(course.semester);
  });
  test("Course-Name is editable on button click and saveable", async () => {
    const initialCourseName = course.courseName;

    const updatedCourseName = "New Course XY";

    let editCourseNameButton = wrapper.find("#course-name-edit");
    let editCourseNameInput = wrapper.find("#course-name-input");
    expect(editCourseNameButton.exists()).toBe(true);
    expect(editCourseNameInput.exists()).toBe(false);
    expect(wrapper.html()).toContain(initialCourseName);

    editCourseNameButton.trigger("click");

    // wait that component re-renders
    await flushPromises();

    editCourseNameInput = wrapper.find("#course-name-input");
    expect(editCourseNameInput.exists()).toBe(true);
    editCourseNameInput.setValue(updatedCourseName);

    // click save button
    const submitButton = wrapper.find(".btn-success");
    expect(submitButton.exists()).toBe(true);
    submitButton.trigger("click");

    // wait that component re-renders
    await flushPromises();

    editCourseNameButton = wrapper.find("#course-name-edit");
    editCourseNameInput = wrapper.find("#course-name-input");
    expect(editCourseNameInput.exists()).toBe(false);
    expect(wrapper.html()).toContain(updatedCourseName);

    expect(mockAxios.put).toHaveBeenCalledWith(
      `${config.apiBaseUrl}/courses/${course.id}`,
      course
    );
  });
  test("Course-Description is editable on button click and saveable", async () => {
    const initialCourseDescription = course.description;

    const updatedCourseDescription = "New Course XY";

    let editCourseDescriptionButton = wrapper.find("#course-description-edit");
    let editCourseDescriptionInput = wrapper.find("#course-description-input");
    expect(editCourseDescriptionButton.exists()).toBe(true);
    expect(editCourseDescriptionInput.exists()).toBe(false);
    expect(wrapper.html()).toContain(initialCourseDescription);

    editCourseDescriptionButton.trigger("click");

    // wait that component re-renders
    await flushPromises();

    editCourseDescriptionInput = wrapper.find("#course-description-input");
    expect(editCourseDescriptionInput.exists()).toBe(true);
    editCourseDescriptionInput.setValue(updatedCourseDescription);

    // click save button
    const submitButton = wrapper.find(".btn-success");
    expect(submitButton.exists()).toBe(true);
    submitButton.trigger("click");

    // wait that component re-renders
    await flushPromises();

    editCourseDescriptionButton = wrapper.find("#course-description-edit");
    editCourseDescriptionInput = wrapper.find("#course-description-input");
    expect(editCourseDescriptionInput.exists()).toBe(false);
    expect(wrapper.html()).toContain(updatedCourseDescription);

    expect(mockAxios.put).toHaveBeenCalledWith(
      `${config.apiBaseUrl}/courses/${course.id}`,
      course
    );
  });
});
