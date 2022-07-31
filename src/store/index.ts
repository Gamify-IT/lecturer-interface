import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";
import { ICourse } from "@/ts/models";

export interface State {
  course: ICourse;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  mutations: {
    setCourse(state, payload: ICourse) {
      state.course = payload;
    },
  },
});
