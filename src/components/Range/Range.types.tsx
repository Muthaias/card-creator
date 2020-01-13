import * as React from 'react';
import { RangeBase } from './Range.base';
import { IStyle, ITheme } from 'office-ui-fabric-react';
import { IStyleFunctionOrObject, IRefObject } from 'office-ui-fabric-react';

/**
 * {@docCategory Range}
 */
export interface IRange {
  value: RangeValue | undefined;

  focus: () => void;
}

/**
 * {@docCategory Range}
 */
export type RangeValue = [number, number];

/**
 * {@docCategory Range}
 */
export interface IRangeProps extends React.ClassAttributes<RangeBase> {
  /**
   * Optional callback to access the IRange interface. Use this instead of ref for accessing
   * the public methods and properties of the component.
   */
  componentRef?: IRefObject<IRange>;

  /**
   * Call to provide customized styling that will layer on top of the variant rules.
   */
  styles?: IStyleFunctionOrObject<IRangeStyleProps, IRangeStyles>;

  /**
   * Theme provided by High-Order Component.
   */
  theme?: ITheme;

  /**
   * Description label of the Range
   */
  label?: string;

  /**
   * The initial value of the Range. Use this if you intend for the Range to be an uncontrolled component.
   * This value is mutually exclusive to value. Use one or the other.
   */
  defaultValue?: RangeValue;

  /**
   * The initial value of the Range. Use this if you intend to pass in a new value as a result of onChange events.
   * This value is mutually exclusive to defaultValue. Use one or the other.
   */
  value?: RangeValue;

  /**
   * The min value of the Range
   * @defaultvalue 0
   */
  min?: number;

  /**
   * The max value of the Range
   * @defaultvalue 10
   */
  max?: number;

  /**
   * The difference between the two adjacent values of the Range
   * @defaultvalue 1
   */
  step?: number;

  /**
   * Whether to show the value on the right of the Range.
   * @defaultvalue true
   */
  showValue?: boolean;

  /**
   * Callback when the value has been changed
   */
  onChange?: (value: RangeValue) => void;

  /**
   * Callback on mouse up or touch end
   */
  onChanged?: (event: MouseEvent | TouchEvent | KeyboardEvent, value: RangeValue) => void;

  /**
   * A description of the Range for the benefit of screen readers.
   */
  ariaLabel?: string;

  /**
   * A text description of the Range number value for the benefit of screen readers.
   * This should be used when the Range number value is not accurately represented by a number.
   */
  ariaValueText?: (value: RangeValue) => string;
  /**
   * Optional flag to render the range vertically. Defaults to rendering horizontal.
   */
  vertical?: boolean;

  /**
   * Optional flag to render the Range as disabled.
   * @defaultvalue false
   */
  disabled?: boolean;

  /**
   * Optional flag to decide that thumb will snap to closest value while moving the range
   * @defaultvalue false
   */
  snapToStep?: boolean;

  /**
   * Optional className to attach to the range root element.
   */
  className?: string;

  /**
   * Optional mixin for additional props on the thumb button within the range.
   */
  buttonProps?: React.HTMLAttributes<HTMLButtonElement>;

  /**
   * Optional function to format the range value.
   */
  valueFormat?: (edgeValue: number) => string;
}

/**
 * {@docCategory Range}
 */
export type IRangeStyleProps = Required<Pick<IRangeProps, 'theme'>> &
  Pick<IRangeProps, 'className' | 'disabled' | 'vertical'> & {
    showTransitions?: boolean;
    showValue?: boolean;
    titleLabelClassName?: string;
  };

/**
 * {@docCategory Range}
 */
export interface IRangeStyles {
  /**
   * Style set for the root element.
   */
  root: IStyle;

  /**
   * Style set for the title label above the range.
   */
  titleLabel: IStyle;

  /**
   * Style set for the container of the range.
   */
  container: IStyle;

  /**
   * Style set for the actual box containting interactive elements of the range.
   */
  slideBox: IStyle;

  /**
   * Style set for element that contains all the lines.
   */
  line: IStyle;

  /**
   * Style set for thumb of the range.
   */
  thumb: IStyle;

  /**
   * Style set for both active and inactive sections of the line.
   */
  lineContainer: IStyle;

  /**
   * Style set for active portion of the line.
   */
  activeSection: IStyle;

  /**
   * Style set for inactive portion of the line.
   */
  inactiveSection: IStyle;

  /**
   * Style set for value label on right/below of the range.
   */
  valueLabel: IStyle;

  /**
   * Style set for tick on 0 on number line. This element only shows up when originFromZero prop is true.
   */
  zeroTick: IStyle;
}
