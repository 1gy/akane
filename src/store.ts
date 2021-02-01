import {Draft, createDraft, finishDraft} from 'immer';

export type ActionContext<State> = {
  draft: Draft<State>;
};

export type Action<State> = {
  (context: ActionContext<State>, ...args: any[]): void | Promise<void>;
};

export type Actions<State> = {
  [name: string]: Action<State>;
};

export type Store<State, ActionsType extends Actions<State>> = {
  state: State;
  actions: ActionsType;
};

export const createStore = <State, ActionsType extends Actions<State>>(
  store: Store<State, ActionsType>
) => store;

export type InstanceActionArgs<
  State,
  ActionType extends Action<State>
> = ActionType extends (_: any, ...args: infer Args) => any ? Args : never;

export type InstanceAction<
  State,
  ActionType extends Action<State>
> = ReturnType<ActionType> extends void
  ? (...args: InstanceActionArgs<State, ActionType>) => void
  : ReturnType<ActionType> extends Promise<void>
  ? (...args: InstanceActionArgs<State, ActionType>) => Promise<void>
  : never;

export type InstanceActions<State, ActionsType extends Actions<State>> = {
  [name in keyof ActionsType]: InstanceAction<State, ActionsType[name]>;
};

export type InstanceState<State> = {
  current: State;
};

export type Instance<State, ActionsType extends Actions<State>> = {
  state: InstanceState<State>;
  actions: InstanceActions<State, ActionsType>;
  observe: (listener: Listener) => void;
  unobserve: (listener: Listener) => void;
};

export const instantiateStore = <State, ActionsType extends Actions<State>>(
  store: Store<State, ActionsType>
): Instance<State, ActionsType> => {
  const state: InstanceState<State> = {
    current: store.state,
  };

  const listeners = new Set<Listener>();

  const observe = (listener: Listener) => {
    listeners.add(listener);
  };

  const unobserve = (listener: Listener) => {
    listeners.delete(listener);
  };

  const actions = new Proxy(
    {},
    {
      get: (_, p) => {
        if (
          typeof p !== 'string' ||
          !(p in store.actions) ||
          typeof store.actions[p] !== 'function'
        ) {
          throw Error('action error');
        }
        return async (...args: any[]) => {
          const draft = createDraft(state.current);
          const result = store.actions[p]({draft}, ...args);
          if (result instanceof Promise) {
            await result;
          }
          const next = finishDraft(draft);
          state.current = next;
          listeners.forEach(listener => listener());
        };
      },
    }
  ) as InstanceActions<State, ActionsType>;

  return {
    state,
    actions,
    observe,
    unobserve,
  };
};

export type Listener = () => void;

export class Stores {
  private stores = new Map<Store<any, any>, Instance<any, any>>();

  public get<State, ActionsType extends Actions<State>>(
    store: Store<State, ActionsType>
  ) {
    const value = this.stores.get(store);
    if (!value) {
      const instance = instantiateStore(store);
      this.stores.set(store, instance);
    }
    return this.stores.get(store)! as Instance<State, ActionsType>;
  }

  public observe(store: Store<any, any>, listener: Listener) {
    const {observe} = this.get(store);
    observe(listener);
  }

  public unobserve(store: Store<any, any>, listener: Listener) {
    const {unobserve} = this.get(store);
    unobserve(listener);
  }
}
