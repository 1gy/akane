import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import {shallowEquals} from './equals';
import {Stores, Store, Actions} from './store';

export type ContextType = {
  stores: Stores;
};

export const Context = createContext<ContextType>({
  stores: new Stores(),
});

export const useRerender = () => {
  return useReducer(c => c + 1, 0)[1];
};

export const useStore = <State, ActionsType extends Actions<State>, Selected>(
  store: Store<State, ActionsType>,
  selector: (state: State) => Selected
) => {
  const rerender = useRerender();
  const context = useContext(Context);
  const instance = useMemo(() => {
    return context.stores.get(store);
  }, [store]);
  const prevStateRef = useRef<State>(instance.state.current);

  useEffect(() => {
    const listener = () => {
      if (
        prevStateRef.current &&
        shallowEquals(
          selector(prevStateRef.current),
          selector(instance.state.current)
        )
      ) {
        return;
      }
      prevStateRef.current = instance.state.current;
      rerender();
    };
    context.stores.observe(store, listener);
    return () => {
      context.stores.unobserve(store, listener);
    };
  }, [store]);

  return [selector(instance.state.current), instance.actions] as const;
};
