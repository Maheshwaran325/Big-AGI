import * as React from 'react';

import type { SxProps } from '@mui/joy/styles/types';
import { SvgIcon } from '@mui/joy';


// missing from MUI, using Tabler for Discord
export function InstagramIcon(props: { sx?: SxProps }) {
  return <SvgIcon viewBox='0 0 24 24' width='24' height='24' stroke='currentColor' fill='none' strokeLinecap='round' strokeLinejoin='round' {...props}>
    <path d="M4 4h16v16H4z M12 7.5a4.5 4.5 0 1 0 4.5 4.5A4.5 4.5 0 0 0 12 7.5zM12 14a2 2 0 1 1 2-2 2 2 0 0 1-2 2zm7.5-11h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3z" fill="none"/>  
    </SvgIcon>;
}