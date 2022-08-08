import { useCallback, useRef, useState } from "react";

/**
 * 
 * @param onLongPress 长按事件
 * @param onClick 点击事件
 * @param stopLongPress 长按事件结束状态
 * @param param2 
 * @returns 
 */

const useLongPress = (
    onLongPress: (arg0: any) => void,
    stopLongPress: () => any,
    { shouldPreventDefault = true, delay = 300 } = {}
) => {
    const [longPressTriggered, setLongPressTriggered] = useState(false);
    const timeout: any = useRef();
    const target: any = useRef();

    const start = useCallback(
        event => {
            if (shouldPreventDefault && event.target) {
                event.target.addEventListener("touchend", preventDefault, {
                    passive: false
                });
                target.current = event.target;
            }
            timeout.current = setTimeout(() => {
                onLongPress(event);
                setLongPressTriggered(true);
            }, delay);
        },
        [onLongPress, delay, shouldPreventDefault]
    );

    const clear = useCallback(
        (event, shouldTriggerClick = true) => {
            timeout.current && clearTimeout(timeout.current);
            shouldTriggerClick && !longPressTriggered ;
            if (longPressTriggered) {
                stopLongPress()
            }
            setLongPressTriggered(false);

            if (shouldPreventDefault && target.current) {
                target.current.removeEventListener("touchend", preventDefault);
            }
        },
        [shouldPreventDefault, longPressTriggered, stopLongPress]
    );

    return {
        onTouchStart: (e: any) => start(e),
        onTouchEnd: (e: any) => clear(e)
    };
};

const isTouchEvent = (event: any) => {
    return "touches" in event;
};

const preventDefault = (event: { touches: string | any[]; preventDefault: () => void; }) => {
    if (!isTouchEvent(event)) return;
};

export default useLongPress;