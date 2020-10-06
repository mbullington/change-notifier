/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useCallback, useEffect, useMemo } from 'react';

type VoidCallback = () => unknown;

/**
 * A class that can be extended or mixed in that provides a change notification API.
 *
 * It is O(1) for adding listeners and O(N) for removing listeners and dispatching
 * notifications (where N is the number of listeners).
 *
 * See also:
 *  * `ValueNotifier`, which is a `ChangeNotifier` that wraps a single value.
 *
 * Ported from: https://api.flutter.dev/flutter/foundation/ChangeNotifier-class.html
 */
export class ChangeNotifier {
  private _listeners: VoidCallback[] = [];

  /**
   * Whether any listeners are currently registered.
   *
   * Clients should not depend on this value for their behavior, because having
   * one listener's logic change when another listener happens to start or stop
   * listening will lead to extremely hard-to-track bugs. Subclasses might use
   * this information to determine whether to do any work when there are no
   * listeners, however.
   */
  get hasListeners() {
    return !!this._listeners.length;
  }

  /**
   * Register a listener to be called when the object notifies its listeners.
   */
  addListener(listener: VoidCallback) {
    this._listeners.push(listener);
  }

  /**
   * Remove a previously registered listener from the list of listeners that the
   * object notifies.
   */
  removeListener(listener: VoidCallback) {
    this._listeners.splice(this._listeners.indexOf(listener), 1);
  }

  /**
   * Call all the registered listeners.
   *
   * Call this method whenever the object changes, to notify any clients the
   * object may have changed. Listeners that are added during this iteration
   * will not be visited. Listeners that are removed during this iteration **will**
   * be visited after they are removed.
   */
  protected notifyListeners() {
    for (const listener of [...this._listeners]) {
      listener();
    }
  }
}

/**
 * A `ChangeNotifier` that holds a single value.
 *
 * When `value` is replaced with something that is not equal to the old
 * value as evaluated by the strict equality operator ===, this class notifies its
 * listeners.
 *
 * Ported from: https://api.flutter.dev/flutter/foundation/ValueNotifier-class.html
 */
export class ValueNotifier<T> extends ChangeNotifier {
  private _value: T;

  get value() {
    return this._value;
  }

  set value(val: T) {
    if (this._value !== val) this._value = val;
    this.notifyListeners();
  }

  constructor(initialValue: T) {
    super();
    this._value = initialValue;
  }
}

/**
 * Registers a listener for the given notifier that responds to the React hook's
 * lifecycle.
 *
 * Returns a 'tick' as a return value, which is either true or false. This value is
 * guaranteed to change compared to a previous value.
 */
export function useChangeNotifier(notifier: ChangeNotifier): boolean {
  const [tick, setTick] = useState<boolean>(false);
  const update = useCallback(() => {
    setTick(tick => !tick);
  }, []);

  useEffect(() => {
    let cancelled: boolean = false;
    const listener = () => {
      if (!cancelled) {
        update();
      }
    };
    notifier.addListener(listener);

    return () => {
      cancelled = true;
      notifier.removeListener(listener);
    };
  }, [notifier, update]);

  return tick;
}

/**
 * Registers a listener for the given `ValueNotifier` that responds to the React hook's
 * lifecycle.
 *
 * Returns the value of the notifier.
 */
export function useValueNotifier<T>(notifier: ValueNotifier<T>): T {
  const tick = useChangeNotifier(notifier);

  return useMemo(() => notifier.value, [notifier, tick]);
}
