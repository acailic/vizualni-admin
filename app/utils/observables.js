import { ascending, bisect } from "d3-array";
import { scaleLinear } from "d3-scale";
export class Observable {
    constructor() {
        this.subscribe = (fn) => {
            this.observers.push(fn);
            return () => this.unsubscribe(fn);
        };
        this.unsubscribe = (fn) => {
            this.observers = this.observers.filter((d) => d !== fn);
        };
        this.notify = () => {
            this.observers.forEach((d) => d());
        };
        this.observers = [];
    }
}
/** Observable timeline which encloses animation state and logic. */
export class Timeline extends Observable {
    constructor(props) {
        super();
        // Animation state.
        this.playing = false;
        /** Animation progress (0-1). */
        this.animationProgress = 1;
        /** msValueScale(min value) = 0, msValueScale(max value) = 1 */
        this.msValueScale = scaleLinear();
        this.getUpdateKey = () => {
            return `${this.playing}_${this.progress}`;
        };
        this.start = () => {
            if (!this.playing) {
                if (this.animationProgress === 1) {
                    this.setProgress(0, true);
                }
                this.playing = true;
                this.requestAnimationFrameId = requestAnimationFrame(this.animate.bind(this));
            }
        };
        this.animate = (t) => {
            if (this.t === undefined) {
                this.t = t - this.animationProgress * this.animationDuration;
            }
            if (t - this.t > this.animationDuration) {
                this.stop(false);
                this.setProgress(1);
            }
            else {
                const progress = (t - this.t) / this.animationDuration;
                this.setProgress(progress, true);
                this.requestAnimationFrameId = requestAnimationFrame(this.animate.bind(this));
            }
        };
        this.stop = (notify = true) => {
            if (this.playing) {
                this.playing = false;
                this.t = undefined;
                if (this.requestAnimationFrameId) {
                    cancelAnimationFrame(this.requestAnimationFrameId);
                    this.requestAnimationFrameId = undefined;
                }
                if (notify) {
                    this.notify();
                }
            }
        };
        /** Sets the animation progress and timeline value.
         *
         * For stepped type during the animation, the progress is calculated based on the
         * artificial division (equal time segments to jump between values) and does not
         * correspond to the actual progress of the slider.
         */
        this.setProgress = (progress, triggeredByAnimation = false) => {
            let value;
            switch (this.animationType) {
                case "continuous":
                    this.animationProgress = progress;
                    value = progress;
                    break;
                case "stepped":
                    let i;
                    if (triggeredByAnimation) {
                        i = Math.floor(progress * this.msValues.length);
                    }
                    else {
                        const msValue = Math.round(this.msValueScale(progress));
                        i = bisect(this.msValues, msValue) - 1;
                    }
                    const msRelativeValue = this.msRelativeValues[i];
                    this.animationProgress = i / (this.msValues.length - 1);
                    value = msRelativeValue;
                    break;
            }
            this.setValue(value);
            this.notify();
        };
        this.setValue = (progress) => {
            const ms = Math.round(this.msValueScale(progress));
            const i = bisect(this.msValues, ms) - 1;
            this.msValue = this.msValues[i];
        };
        const { type, animationType, msDuration } = props;
        this.type = type;
        let formatValue;
        switch (props.type) {
            case "interval":
                formatValue = props.formatValue;
                this.msValues = props.msValues.sort(ascending);
                this.values = this.msValues;
                break;
            case "ordinal":
                formatValue = (d) => {
                    return props.sortedData[Math.round(d / 1000)];
                };
                this.msValues = props.sortedData.map((_, i) => i * 1000);
                this.values = props.sortedData;
                break;
        }
        this.animationType = animationType;
        this.animationDuration = msDuration;
        const [min, max] = [
            this.msValues[0],
            this.msValues[this.msValues.length - 1],
        ];
        this.msValue = max;
        this.minMsValue = min;
        this.maxMsValue = max;
        this.msValueScale = this.msValueScale.range([min, max]);
        this.msRelativeValues = this.msValues.map(this.msValueScale.invert);
        this.formatValue = formatValue;
        this.formattedMsExtent = [min, max].map(formatValue);
    }
    get domain() {
        return this.msRelativeValues;
    }
    get value() {
        return this.type === "interval"
            ? this.msValue
            : this.values[Math.round(this.msValue / 1000)];
    }
    get formattedValue() {
        return this.formatValue(this.msValue);
    }
    get formattedExtent() {
        return this.formattedMsExtent;
    }
    /** Timeline progress (0-1) (mapped to track background color of Slider). */
    get progress() {
        switch (this.animationType) {
            case "continuous":
                return this.animationProgress;
            case "stepped":
                return ((this.msValue - this.minMsValue) / (this.maxMsValue - this.minMsValue));
        }
    }
}
