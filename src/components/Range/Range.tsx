import * as React from 'react';
import { styled } from '@fluentui/react';

import { IRangeProps, IRangeStyleProps, IRangeStyles } from './Range.types';

import { RangeBase } from './Range.base';
import { getStyles } from './Range.styles';

export const Range: React.StatelessComponent<IRangeProps> = styled<IRangeProps, IRangeStyleProps, IRangeStyles>(
  RangeBase,
  getStyles,
  undefined,
  {
    scope: 'Range'
  }
);