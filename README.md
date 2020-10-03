# change-notifier

[![Actions Status](https://github.com/mbullington/change-notifier/workflows/CI/badge.svg)](https://github.com/mbullington/change-notifier/actions)

[![npm version](https://badge.fury.io/js/change-notifier.svg)](https://badge.fury.io/js/change-notifier)

Dead-simple state notifier for React. Under 1kb. Inspired by (meaning ported from!) Flutter.

```sh
yarn add change-notifier
```

## Inspiration

Made this to scratch a personal itch where I wanted to use `EventEmitter` as a lightweight state tool for React,
to which `tiny-emitter` is an awesome package for React Native! However, hooks weren't built in.

While considering building a `useTinyEmitter` hook, I remembered that Flutter had a similar pattern that I really liked.

## Example

```ts
import React from 'react';
import {
  ChangeNotifier,
  useChangeNotifier,
  ValueNotifier,
  useValueNotifier,
} from 'change-notifier';

class Timer extends ChangeNotifier {
  constructor() {
    setInterval(() => {
      this.notifyListeners();
    }, 1000);
  }
}

class TimerAlt extends ValueNotifier<number> {
  constructor() {
    super(Date.now());

    setInterval(() => {
      this.value = Date.now();
    }, 1000);
  }
}

const TIMER = new Timer();
const TIMER_ALT = new TimerAlt();

function App() {
  useChangeNotifier(TIMER);

  return (
    <>
      <div>The timestamp is:</div>
      <div>{Date.now()}</div>
    </>
  );
}

function AppAlt() {
  const now = useValueNotifier(TIMER_ALT);

  return (
    <>
      <div>The timestamp is:</div>
      <div>{now}</div>
    </>
  );
}
```
