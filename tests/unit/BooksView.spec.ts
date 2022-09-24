import { mount, VueWrapper, flushPromises } from "@vue/test-utils";
import mockAxios from "jest-mock-axios";
import router from "@/router/index";
import { Book, Dungeon, IBook, World } from "@/ts/models/overworld-models";
import BootstrapVue3 from "bootstrap-vue-3";
import config from "@/config";
import BooksView from "@/views/BooksView.vue";

jest.mock("axios");

describe("BooksView.vue", () => {
  let wrapper: VueWrapper;
  const courseId = 1;
  const worldIndex = 1;
  let books: IBook[];
  beforeEach(async () => {
    jest.clearAllMocks();
    const worldResponse = {
      data: new World(
        "random uuid",
        1,
        "Static Name",
        "Topic Name",
        true,
        [
          new Dungeon(
            "random dungeon uuid",
            1,
            "Dungeon Static Name",
            "Dungeon Topic Name",
            false,
            [],
            [],
            []
          ),
        ],
        [],
        [],
        [
          new Book("random uuid", 1, "Welcome book", "I am a book",),
          new Book("random uuid 2", 2, "Second book", "I hope you met my ohter book friend before",),
        ]
      ),
    };
    books = worldResponse.data.books;

    // response for GET /courses
    mockAxios.get.mockResolvedValueOnce(worldResponse);
    router.push(`/courses/${courseId}/worlds/${worldIndex}/books`);
    await router.isReady();
    wrapper = mount(BooksView, {
      global: {
        plugins: [router, BootstrapVue3],
      },
    });
  });
  test("BooksView displays all books", async () => {
    expect(mockAxios.get).toHaveBeenCalledWith(
      `${config.overworldApiUrl}/courses/${courseId}/worlds/${worldIndex}`
    );

    await flushPromises();
    for (const book of books) {
      expect(wrapper.html()).toContain(book.index.toString());
    }
  });
});
