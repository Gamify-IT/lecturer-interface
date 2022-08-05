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
});
