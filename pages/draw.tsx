import * as React from 'react';

import { AppDraw } from '../src/apps/draw/AppDraw';

import { withLayout } from '~/common/layout/withLayout';

import NotFound from '../pages/404';


export default function DrawPage() {
  //return withLayout({ type: 'optima' }, <AppDraw />);
  return <NotFound />;
}