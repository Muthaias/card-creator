import * as React from 'react';
import { BaseComponent, KeyCodes, css, getId, getRTL, getRTLSafeKeyCode } from '@fluentui/react';
import { IRangeProps, IRange, IRangeStyleProps, IRangeStyles, RangeValue } from './Range.types';
import { classNamesFunction, getNativeProps, divProperties } from '@fluentui/react';
import { Label } from '@fluentui/react';

export interface IRangeState {
  value?: RangeValue;
  renderedValue?: RangeValue;
}

const getClassNames = classNamesFunction<IRangeStyleProps, IRangeStyles>();
export const RANGE_ONKEYDOWN_TIMEOUT_DURATION = 1000;

export class RangeBase extends BaseComponent<IRangeProps, IRangeState> implements IRange {
  public static defaultProps: IRangeProps = {
    step: 1,
    min: 0,
    max: 10,
    showValue: true,
    disabled: false,
    vertical: false,
    buttonProps: {}
  };

  private _rangeLine = React.createRef<HTMLDivElement>();
  private _startThumb = React.createRef<HTMLSpanElement>();
  private _stopThumb = React.createRef<HTMLSpanElement>();
  private _id: string;
  private _onKeyDownTimer = -1;

  constructor(props: IRangeProps) {
    super(props);

    this._warnMutuallyExclusive({
      value: 'defaultValue'
    });

    this._id = getId('Range');

    const value =
      props.value !== undefined
        ? props.value
        : props.defaultValue !== undefined
        ? props.defaultValue
        : ([props.min, props.max] as RangeValue);

    this.state = {
      value: value,
      renderedValue: undefined
    };
  }

  public render(): React.ReactElement<{}> {
    const { ariaLabel, className, disabled, label, max, min, showValue, buttonProps, vertical, valueFormat, styles, theme } = this.props;
    const value = this.value;
    const [start, stop] = value!;
    const [renderStart, renderStop] = this.renderedValue!;
    const [startOffsetPercent, stopOffsetPercent] = value!.map(v => (min === max ? 0 : ((v - min!) / (max! - min!)) * 100));
    const lengthString = vertical ? 'height' : 'width';
    const onMouseDownProp: {} = disabled ? {} : { onMouseDown: this._onMouseDownOrTouchStart };
    const onTouchStartProp: {} = disabled ? {} : { onTouchStart: this._onMouseDownOrTouchStart };
    const onKeyDownProp: {} = disabled ? {} : { onKeyDown: this._onKeyDown };
    const classNames = getClassNames(styles, {
      className,
      disabled,
      vertical,
      showTransitions: renderStart === start && renderStop === stop,
      showValue,
      theme: theme!
    });
    const divButtonProps = buttonProps ? getNativeProps<React.HTMLAttributes<HTMLDivElement>>(buttonProps, divProperties) : undefined;
    const formatValue = (v: number) => (valueFormat ? valueFormat(v) : v);
    return (
      <div className={classNames.root}>
        {label && (
          <Label className={classNames.titleLabel} {...(ariaLabel ? {} : { htmlFor: this._id })} disabled={disabled}>
            {label}
          </Label>
        )}
        <div className={classNames.container}>
          {showValue && (
            <Label className={classNames.valueLabel} disabled={disabled}>
              {formatValue(vertical ? stop : start)}
            </Label>
          )}
          <div
            aria-valuenow={start}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuetext={this._getAriaValueText(value)}
            aria-label={ariaLabel || label}
            aria-disabled={disabled}
            {...onMouseDownProp}
            {...onTouchStartProp}
            {...onKeyDownProp}
            {...divButtonProps}
            className={css(classNames.slideBox, buttonProps!.className)}
            id={this._id}
            role="slider"
            tabIndex={disabled ? undefined : 0}
            data-is-focusable={!disabled}
          >
            <div ref={this._rangeLine} className={classNames.line}>
              <span
                ref={this._startThumb}
                className={classNames.thumb}
                style={this._getStyleUsingOffsetPercent(vertical, startOffsetPercent)}
              />
              <span
                ref={this._stopThumb}
                className={classNames.thumb}
                style={this._getStyleUsingOffsetPercent(vertical, stopOffsetPercent)}
              />
              <span
                className={css(classNames.lineContainer, classNames.inactiveSection)}
                style={{ [lengthString]: startOffsetPercent + '%' }}
              />
              <span
                className={css(classNames.lineContainer, classNames.activeSection)}
                style={{ [lengthString]: Math.abs(stopOffsetPercent - startOffsetPercent) + '%' }}
              />
              <span
                className={css(classNames.lineContainer, classNames.inactiveSection)}
                style={{ [lengthString]: 100 - stopOffsetPercent + '%' }}
              />
            </div>
          </div>
          {showValue && (
            <Label className={classNames.valueLabel} disabled={disabled}>
              {formatValue(vertical ? start : stop)}
            </Label>
          )}
        </div>
      </div>
    ) as React.ReactElement<{}>;
  }

  public focus(): void {
    if (this._startThumb.current) {
      this._startThumb.current.focus();
    }
  }

  public get value(): RangeValue | undefined {
    const { value = this.state.value } = this.props;
    const { min, max } = this.props;
    if (min === undefined || max === undefined || value === undefined) {
      return undefined;
    } else {
      return value.map(v => this._capValue(v, min, max)) as RangeValue;
    }
  }

  private get renderedValue(): RangeValue | undefined {
    // renderedValue is expected to be defined while user is interacting with control, otherwise `undefined`. Fall back to `value`.
    const { renderedValue = this.value } = this.state;
    return renderedValue;
  }

  private _getAriaValueText = (value: RangeValue | undefined): string | undefined => {
    const { ariaValueText } = this.props;
    if (value !== undefined) {
      return ariaValueText ? ariaValueText(value) : value.toString();
    }
    return undefined;
  };

  private _getStyleUsingOffsetPercent(vertical: boolean | undefined, thumbOffsetPercent: number): any {
    const direction: string = vertical ? 'bottom' : getRTL(this.props.theme) ? 'right' : 'left';
    return {
      [direction]: thumbOffsetPercent + '%'
    };
  }

  private _onMouseDownOrTouchStart = (event: MouseEvent | TouchEvent): void => {
    if (!this._rangeLine.current) {
      return;
    }
    const value = this.state.value!;
    const [start, stop] = value;
    const { currentValue, renderedValue } = this._newRangePosition(this._rangeLine.current.getBoundingClientRect(), event);
    const startDistance = Math.abs(start - currentValue);
    const stopDistance = Math.abs(stop - currentValue);
    const onMouseMoveOrTouchMove =
      startDistance > stopDistance || (startDistance === stopDistance && renderedValue > stop)
        ? this._onMouseMoveOrTouchMoveStop
        : this._onMouseMoveOrTouchMoveStart;
    if (event.type === 'mousedown') {
      this._events.on(window, 'mousemove', onMouseMoveOrTouchMove, true);
      this._events.on(window, 'mouseup', this._onMouseUpOrTouchEnd, true);
    } else if (event.type === 'touchstart') {
      this._events.on(window, 'touchmove', onMouseMoveOrTouchMove, true);
      this._events.on(window, 'touchend', this._onMouseUpOrTouchEnd, true);
    }
    onMouseMoveOrTouchMove(event, true);
  };

  private _onMouseMoveOrTouchMoveStart = (event: MouseEvent | TouchEvent, suppressEventCancelation?: boolean): void => {
    this._onMouseMoveOrTouchMove(event, 'start', suppressEventCancelation);
  };

  private _onMouseMoveOrTouchMoveStop = (event: MouseEvent | TouchEvent, suppressEventCancelation?: boolean): void => {
    this._onMouseMoveOrTouchMove(event, 'stop', suppressEventCancelation);
  };

  private _onMouseMoveOrTouchMove = (
    event: MouseEvent | TouchEvent,
    rangeSection: 'start' | 'stop',
    suppressEventCancelation?: boolean
  ): void => {
    if (!this._rangeLine.current) {
      return;
    }
    const isStart = rangeSection === 'start';
    const value = this.state.value!;
    const [start, stop] = value;
    const { renderedValue, currentValue } = this._newRangePosition(this._rangeLine.current.getBoundingClientRect(), event);
    this._updateValue(
      isStart ? [Math.min(currentValue, stop), stop] : [start, Math.max(start, currentValue)],
      isStart ? [Math.min(renderedValue, stop), stop] : [start, Math.max(start, renderedValue)]
    );

    if (!suppressEventCancelation) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  private _newRangePosition = (
    rangePositionRect: ClientRect,
    event: MouseEvent | TouchEvent
  ): { renderedValue: number; currentValue: number } => {
    const { max, min, step } = this.props;
    const steps: number = (max! - min!) / step!;
    const rangeLength: number = !this.props.vertical ? rangePositionRect.width : rangePositionRect.height;
    const stepLength: number = rangeLength / steps;
    let currentSteps: number | undefined;
    let distance: number | undefined;

    if (!this.props.vertical) {
      const left: number | undefined = this._getPosition(event, this.props.vertical);
      distance = getRTL(this.props.theme) ? rangePositionRect.right - left! : left! - rangePositionRect.left;
    } else {
      const bottom: number | undefined = this._getPosition(event, this.props.vertical);
      distance = rangePositionRect.bottom - bottom!;
    }
    currentSteps = distance / stepLength;

    let currentValue: number | undefined;
    let renderedValue: number | undefined;

    // The value shouldn't be bigger than max or be smaller than min.
    if (currentSteps! > Math.floor(steps)) {
      renderedValue = currentValue = max as number;
    } else if (currentSteps! < 0) {
      renderedValue = currentValue = min as number;
    } else {
      renderedValue = min! + step! * currentSteps!;
      currentValue = min! + step! * Math.round(currentSteps!);
    }

    return {
      renderedValue,
      currentValue
    };
  };

  private _getPosition(event: MouseEvent | TouchEvent, vertical: boolean | undefined): number | undefined {
    let currentPosition: number | undefined;
    switch (event.type) {
      case 'mousedown':
      case 'mousemove':
        currentPosition = !vertical ? (event as MouseEvent).clientX : (event as MouseEvent).clientY;
        break;
      case 'touchstart':
      case 'touchmove':
        currentPosition = !vertical ? (event as TouchEvent).touches[0].clientX : (event as TouchEvent).touches[0].clientY;
        break;
    }
    return currentPosition;
  }
  private _updateValue(value: RangeValue, renderedValue: RangeValue): void {
    const { step, snapToStep } = this.props;
    let numDec = 0;
    if (isFinite(step!)) {
      while (Math.round(step! * Math.pow(10, numDec)) / Math.pow(10, numDec) !== step!) {
        numDec++;
      }
    }

    // Make sure value has correct number of decimal places based on number of decimals in step
    const [start, stop] = this.state.value ? this.state.value : [undefined, undefined];
    const roundedValue = value.map(v => parseFloat(v.toFixed(numDec))) as RangeValue;
    const [roundedStart, roundedStop] = roundedValue;
    const valueChanged = roundedStart !== start || roundedStop !== stop;

    if (snapToStep) {
      renderedValue = roundedValue;
    }

    this.setState(
      {
        value: roundedValue,
        renderedValue
      },
      () => {
        if (valueChanged && this.props.onChange) {
          this.props.onChange(this.state.value as RangeValue);
        }
      }
    );
  }

  private _onMouseUpOrTouchEnd = (event: MouseEvent | TouchEvent): void => {
    // Disable renderedValue override.
    this.setState({
      renderedValue: undefined
    });

    if (this.props.onChanged) {
      this.props.onChanged(event, this.state.value as RangeValue);
    }

    this._events.off();
  };

  private _onKeyDown = (event: KeyboardEvent): void => {
    let [start, stop]: RangeValue = this.state.value!;
    const { max, min, step } = this.props;

    let diff: number | undefined = 0;

    switch (event.which) {
      case getRTLSafeKeyCode(KeyCodes.left, this.props.theme):
      case KeyCodes.down:
        diff = -(step as number);

        this._clearOnKeyDownTimer();
        this._setOnKeyDownTimer(event);

        break;
      case getRTLSafeKeyCode(KeyCodes.right, this.props.theme):
      case KeyCodes.up:
        diff = step;

        this._clearOnKeyDownTimer();
        this._setOnKeyDownTimer(event);

        break;

      case KeyCodes.home:
        start = min!;
        break;

      case KeyCodes.end:
        stop = max!;
        break;

      default:
        return;
    }

    const newValue: RangeValue = [this._capValue(start + diff!, min!, max!), this._capValue(stop + diff!, min!, max!)];

    this._updateValue(newValue, newValue);

    event.preventDefault();
    event.stopPropagation();
  };

  private _capValue(value: number, min: number, max: number) {
    return Math.min(max as number, Math.max(min as number, value));
  }

  private _clearOnKeyDownTimer = (): void => {
    this._async.clearTimeout(this._onKeyDownTimer);
  };

  private _setOnKeyDownTimer = (event: KeyboardEvent): void => {
    this._onKeyDownTimer = this._async.setTimeout(() => {
      if (this.props.onChanged) {
        this.props.onChanged(event, this.state.value as RangeValue);
      }
    }, RANGE_ONKEYDOWN_TIMEOUT_DURATION);
  };
}
