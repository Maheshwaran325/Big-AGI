import * as React from 'react';

import { AppCall } from '../src/apps/call/AppCall';

import { withLayout } from '~/common/layout/withLayout';

import NotFound from '../pages/404';

export default function CallPage() {
  // return withLayout({ type: 'optima' }, <AppCall />);
  return <NotFound />;
}
