import { useState, useEffect, useCallback } from 'react';

let listeners = [];
let state = { updateCount: 0 };

export function useGlobalState() {
    const [updateCount, setUpdateCount] = useState(state.updateCount);

    const triggerUpdate = useCallback(() => {
        state.updateCount += 1;
        listeners.forEach(listener => listener(state.updateCount));
    }, []);

    useEffect(() => {
        const listener = (newCount) => {
            setUpdateCount(newCount);
        };
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    }, []);

    return [updateCount, triggerUpdate];
}
