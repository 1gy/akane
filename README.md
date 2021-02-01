# Akane
Akane is a simple state manager for React.

## Features
- Simple API
- Type safe
- Minimal re-rendering

## Usage
```tsx
import React, {useCallback, VFC} from 'react';
import {createStore, useStore} from '@1gy/akane';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const store = createStore({
  state: {
    count1: 0,
    count2: 0,
  },
  actions: {
    increment: ({draft}) => {
      draft.count1 += 1;
    },
    async incrementAsync({draft}) {
      await delay(1000);
      draft.count2 += 1;
    },
  },
});

const Increment: VFC = () => {
  const [count, actions] = useStore(store, state => state.count1);

  const handleClick = useCallback(() => {
    actions.increment();
  }, [actions]);

  return (
    <div>
      <span>{count}</span>
      <button onClick={handleClick}>increment</button>
    </div>
  );
};

const IncrementAsync: VFC = () => {
  const [count, actions] = useStore(store, state => state.count2);

  const handleClick = useCallback(() => {
    actions.incrementAsync();
  }, [actions]);

  return (
    <div>
      <span>{count}</span>
      <button onClick={handleClick}>increment</button>
    </div>
  );
};

export const App: VFC = () => {
  return (
    <>
      <Increment />
      <IncrementAsync />
    </>
  );
};
```

## License
MIT
