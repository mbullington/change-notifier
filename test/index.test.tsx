import { renderHook, act } from '@testing-library/react-hooks';

import {
  ChangeNotifier,
  ValueNotifier,
  useChangeNotifier,
  useValueNotifier,
} from '../src';

describe('ChangeNotifier', () => {
  it('can add callback multiple times', () => {
    const fn = jest.fn();
    const notifier = new ChangeNotifier();

    notifier.addListener(fn);
    notifier.addListener(fn);

    // @ts-ignore
    notifier.notifyListeners();
    // @ts-ignore
    notifier.notifyListeners();

    expect(fn).toBeCalledTimes(4);
  });

  it('can remove callback', () => {
    const fn = jest.fn();
    const notifier = new ChangeNotifier();

    notifier.addListener(fn);
    notifier.addListener(fn);

    // @ts-ignore
    notifier.notifyListeners();
    expect(fn).toBeCalledTimes(2);

    notifier.removeListener(fn);

    // @ts-ignore
    notifier.notifyListeners();
    expect(fn).toBeCalledTimes(3);

    notifier.removeListener(fn);

    // @ts-ignore
    notifier.notifyListeners();
    expect(fn).toBeCalledTimes(3);
  });
});

describe('ValueNotifier', () => {
  it('can add callback multiple times', () => {
    const fn = jest.fn();
    const notifier = new ValueNotifier<number>(0);

    notifier.addListener(fn);
    notifier.addListener(fn);

    notifier.value++;
    notifier.value++;

    expect(fn).toBeCalledTimes(4);
  });

  it('can remove callback', () => {
    const fn = jest.fn();
    const notifier = new ValueNotifier<number>(0);

    notifier.addListener(fn);
    notifier.addListener(fn);

    notifier.value++;
    expect(notifier.value).toBe(1);
    expect(fn).toBeCalledTimes(2);

    notifier.removeListener(fn);

    notifier.value++;
    expect(notifier.value).toBe(2);
    expect(fn).toBeCalledTimes(3);

    notifier.removeListener(fn);

    notifier.value++;
    expect(notifier.value).toBe(3);
    expect(fn).toBeCalledTimes(3);
  });
});

test('useChangeNotifier', () => {
  const notifier = new ChangeNotifier();
  const { result } = renderHook(() => useChangeNotifier(notifier));

  expect(result.current).toBe(false);

  act(() => {
    // @ts-ignore
    notifier.notifyListeners();
  });

  expect(result.current).toBe(true);

  act(() => {
    // @ts-ignore
    notifier.notifyListeners();
  });

  expect(result.current).toBe(false);
});

test('useValueNotifier', () => {
  const notifier = new ValueNotifier<number>(10);
  const { result } = renderHook(() => useValueNotifier(notifier));

  expect(result.current).toBe(10);

  act(() => {
    notifier.value++;
  });

  expect(result.current).toBe(11);
});
