import * as React from 'react';

import { Avatar, Box, Divider, IconButton, ListItem, ListItemButton, ListItemDecorator, Sheet, styled, Tooltip, Typography } from '@mui/joy';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';

import { SystemPurposeId, SystemPurposes } from '../../../data';

import { conversationAutoTitle } from '~/modules/aifn/autotitle/autoTitle';

import type { DFolder } from '~/common/state/store-folders';
import { DConversationId, useChatStore } from '~/common/state/store-chats';
import { InlineTextarea } from '~/common/components/InlineTextarea';
import { isDeepEqual } from '~/common/util/jsUtils';


// set to true to display the conversation IDs
// const DEBUG_CONVERSATION_IDS = false;


export const FadeInButton = styled(IconButton)({
  opacity: 0.667,
  transition: 'opacity 0.2s',
  '&:hover': { opacity: 1 },
});


export const ChatDrawerItemMemo = React.memo(ChatDrawerItem, (prev, next) =>
  // usign a custom function because `ChatNavigationItemData` is a complex object and memo won't work
  isDeepEqual(prev.item, next.item) &&
  prev.showSymbols === next.showSymbols &&
  prev.bottomBarBasis === next.bottomBarBasis &&
  prev.onConversationActivate === next.onConversationActivate &&
  prev.onConversationDelete === next.onConversationDelete &&
  prev.onConversationExport === next.onConversationExport &&
  prev.onConversationFolderChange === next.onConversationFolderChange,
);

export interface ChatNavigationItemData {
  conversationId: DConversationId;
  isActive: boolean;
  isAlsoOpen: string | false;
  isEmpty: boolean;
  title: string;
  folder: DFolder | null | undefined; // null: 'All', undefined: do not show folder select
  messageCount: number;
  assistantTyping: boolean;
  systemPurposeId: SystemPurposeId;
  searchFrequency?: number;
}

export interface FolderChangeRequest {
  conversationId: DConversationId;
  anchorEl: HTMLButtonElement;
  currentFolder: DFolder | null;
}

function ChatDrawerItem(props: {
  // NOTE: always update the Memo comparison if you add or remove props
  item: ChatNavigationItemData,
  showSymbols: boolean,
  bottomBarBasis: number,
  onConversationActivate: (conversationId: DConversationId, closeMenu: boolean) => void,
  onConversationDelete: (conversationId: DConversationId) => void,
  onConversationExport: (conversationId: DConversationId, exportAll: boolean) => void,
  onConversationFolderChange: (folderChangeRequest: FolderChangeRequest) => void,
}) {

  // state
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [deleteArmed, setDeleteArmed] = React.useState(false);

  // derived state
  const { onConversationExport, onConversationFolderChange } = props;
  const { conversationId, isActive, isAlsoOpen, title, folder, messageCount, assistantTyping, systemPurposeId, searchFrequency } = props.item;
  const isNew = messageCount === 0;


  // [effect] auto-disarm when inactive
  const shallClose = deleteArmed && !isActive;
  React.useEffect(() => {
    if (shallClose)
      setDeleteArmed(false);
  }, [shallClose]);


  // Activate

  const handleConversationActivate = () => props.onConversationActivate(conversationId, true);


  // export

  const handleConversationExport = React.useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    conversationId && onConversationExport(conversationId, false);
  }, [conversationId, onConversationExport]);


  // Folder change

  const handleFolderChangeBegin = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onConversationFolderChange({
      conversationId,
      anchorEl: event.currentTarget,
      currentFolder: folder ?? null,
    });
  }, [conversationId, folder, onConversationFolderChange]);


  // Title Edit

  const handleTitleEditBegin = React.useCallback(() => setIsEditingTitle(true), []);

  const handleTitleEditCancel = React.useCallback(() => {
    setIsEditingTitle(false);
  }, []);

  const handleTitleEditChange = React.useCallback((text: string) => {
    setIsEditingTitle(false);
    useChatStore.getState().setUserTitle(conversationId, text.trim());
  }, [conversationId]);

  const handleTitleEditAuto = React.useCallback(() => {
    conversationAutoTitle(conversationId, true);
  }, [conversationId]);


  // Delete

  const handleDeleteButtonShow = React.useCallback(() => setDeleteArmed(true), []);

  const handleDeleteButtonHide = React.useCallback(() => setDeleteArmed(false), []);

  const handleConversationDelete = React.useCallback((event: React.MouseEvent) => {
    if (deleteArmed) {
      setDeleteArmed(false);
      event.stopPropagation();
      props.onConversationDelete(conversationId);
    }
  }, [conversationId, deleteArmed, props]);


  const textSymbol = SystemPurposes[systemPurposeId]?.symbol || '❓';

  const progress = props.bottomBarBasis ? 100 * (searchFrequency ?? messageCount) / props.bottomBarBasis : 0;


  const titleRowComponent = React.useMemo(() => <>

    {/* Symbol, if globally enabled */}
    {props.showSymbols && <ListItemDecorator>
      {assistantTyping
        ? (
          <Avatar
            alt='typing' variant='plain'
            src='https://i.giphy.com/media/jJxaUysjzO9ri/giphy.webp'
            sx={{
              width: '1.5rem',
              height: '1.5rem',
              borderRadius: 'var(--joy-radius-sm)',
            }}
          />
        ) : (
          <Typography sx={isNew ? { opacity: 0.4, filter: 'grayscale(0.75)' } : undefined}>
            {/*{isNew ? '' : textSymbol}*/}
            {textSymbol}
          </Typography>
        )}
    </ListItemDecorator>}

    {/* Title */}
    {!isEditingTitle ? (
      <Typography
        // level={isActive ? 'title-md' : 'body-md'}
        onDoubleClick={handleTitleEditBegin}
        sx={{
          color: isActive ? 'text.primary' : 'text.secondary',
          flex: 1,
        }}
      >
        {/*{DEBUG_CONVERSATION_IDS && `${conversationId} - `}*/}
        {title.trim() ? title : 'Chat'}{assistantTyping && '...'}
      </Typography>
    ) : (
      <InlineTextarea
        invertedColors
        initialText={title}
        onEdit={handleTitleEditChange}
        onCancel={handleTitleEditCancel}
        sx={{
          flexGrow: 1,
          ml: -1.5, mr: -0.5,
        }}
      />
    )}

    {/* Display search frequency if it exists and is greater than 0 */}
    {searchFrequency && searchFrequency > 0 && (
      <Box sx={{ ml: 1 }}>
        <Typography level='body-sm'>
          {searchFrequency}
        </Typography>
      </Box>
    )}

  </>, [assistantTyping, handleTitleEditBegin, handleTitleEditCancel, handleTitleEditChange, isActive, isEditingTitle, isNew, props.showSymbols, searchFrequency, textSymbol, title]);

  const progressBarFixedComponent = React.useMemo(() =>
    progress > 0 && (
      <Box sx={{
        backgroundColor: 'neutral.softBg',
        position: 'absolute', left: 0, bottom: 0, width: progress + '%', height: 4,
      }} />
    ), [progress]);

  return (isActive || isAlsoOpen) ? (

    // Active or Also Open
    <Sheet
      variant={isActive ? 'solid' : 'outlined'}
      invertedColors={isActive}
      onClick={!isActive ? handleConversationActivate : undefined}
      sx={{
        // common
        // position: 'relative', // for the progress bar (now disabled)
        '--ListItem-minHeight': '2.75rem',

        // differences between primary and secondary variants
        ...(isActive ? {
          border: 'none', // there's a default border of 1px and invisible.. hmm
        } : {
          // '--variant-borderWidth': '0.125rem',
          cursor: 'pointer',
        }),

        // style
        backgroundColor: isActive ? 'neutral.solidActiveBg' : 'neutral.softBg',
        borderRadius: 'md',
        mx: '0.25rem',
        '&:hover > button': {
          opacity: 1, // fade in buttons when hovering, but by default wash them out a bit
        },
      }}
    >

      <ListItem sx={{ border: 'none', display: 'grid', gap: 0, px: 'calc(var(--ListItem-paddingX) - 0.25rem)' }}>

        {/* Title row */}
        <Box sx={{ display: 'flex', gap: 'var(--ListItem-gap)', minHeight: '2.25rem', alignItems: 'center' }}>
          {titleRowComponent}
        </Box>

        {/* buttons row */}
        {isActive && (
          <Box sx={{ display: 'flex', gap: 1, minHeight: '2.25rem', alignItems: 'center' }}>
            <ListItemDecorator />

            {/* Current Folder color, and change initiator */}
            {(folder !== undefined) && <>
              <Tooltip disableInteractive title={folder ? `Change Folder (${folder.title})` : 'Add to Folder'}>
                {folder ? (
                  <IconButton size='sm' onClick={handleFolderChangeBegin}>
                    <FolderIcon style={{ color: folder.color || 'inherit' }} />
                  </IconButton>
                ) : (
                  <FadeInButton size='sm' onClick={handleFolderChangeBegin}>
                    <FolderOutlinedIcon />
                  </FadeInButton>
                )}
              </Tooltip>

              <Divider orientation='vertical' sx={{ my: 1, opacity: 0.5 }} />
            </>}

            <Tooltip disableInteractive title='Rename'>
              <FadeInButton size='sm' disabled={isEditingTitle} onClick={handleTitleEditBegin}>
                <EditIcon />
              </FadeInButton>
            </Tooltip>

            {!isNew && <>
              <Tooltip disableInteractive title='Auto-Title'>
                <FadeInButton size='sm' disabled={isEditingTitle} onClick={handleTitleEditAuto}>
                  <AutoFixHighIcon />
                </FadeInButton>
              </Tooltip>

              <Divider orientation='vertical' sx={{ my: 1, opacity: 0.5 }} />

              <Tooltip disableInteractive title='Export Chat'>
                <FadeInButton size='sm' onClick={handleConversationExport}>
                  <FileDownloadOutlinedIcon />
                </FadeInButton>
              </Tooltip>
            </>}

            {/* --> */}
            <Box sx={{ flex: 1 }} />

            {/* Delete [armed, arming] buttons */}
            {!searchFrequency && <>
              {deleteArmed && (
                <Tooltip disableInteractive title='Confirm Deletion'>
                  <FadeInButton key='btn-del' variant='solid' color='success' size='sm' onClick={handleConversationDelete} sx={{ opacity: 1 }}>
                    <DeleteForeverIcon sx={{ color: 'danger.solidBg' }} />
                  </FadeInButton>
                </Tooltip>
              )}

              <Tooltip disableInteractive title={deleteArmed ? 'Cancel Delete' : 'Delete'}>
                <FadeInButton key='btn-arm' size='sm' onClick={deleteArmed ? handleDeleteButtonHide : handleDeleteButtonShow} sx={deleteArmed ? { opacity: 1 } : {}}>
                  {deleteArmed ? <CloseIcon /> : <DeleteOutlineIcon />}
                </FadeInButton>
              </Tooltip>
            </>}
          </Box>
        )}

        {/* View places row */}
        {isAlsoOpen && (
          <Typography level='body-xs' sx={{ mx: 'auto' }}>
            <em>In view {isAlsoOpen}</em>
          </Typography>
        )}

      </ListItem>

      {/* Optional progress bar, underlay */}
      {/* NOTE: disabled on 20240204: quite distracting on the active chat sheet */}
      {/*{progressBarFixedComponent}*/}

    </Sheet>

  ) : (

    // Inactive Conversation - click to activate
    <ListItem sx={{ '--ListItem-minHeight': '2.75rem' }}>

      <ListItemButton
        onClick={handleConversationActivate}
        sx={{
          border: 'none', // there's a default border of 1px and invisible.. hmm
          position: 'relative', // for the progress bar
        }}
      >

        {titleRowComponent}

        {/* Optional progress bar, underlay */}
        {progressBarFixedComponent}

      </ListItemButton>

    </ListItem>
  );
}