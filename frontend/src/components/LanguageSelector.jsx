import { Box, Button, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import React from 'react'
import { LANGUAGE_VERSIONS } from '../constant.js'
import { Code } from 'lucide-react';

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({ Language, onSelect }) => {
  return (
    <Box className='flex gap-2 items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700'>
      <Code size={18} className='text-blue-400' />
      <Text className='text-slate-200 font-semibold'>Language:</Text>
      <Menu isLazy>
        <MenuButton
          as={Button}
          bg='slate.700'
          _hover={{ bg: 'slate.600' }}
          className='!bg-slate-700 !text-slate-100 !border !border-slate-600 hover:!bg-slate-600 transition'
        >
          {Language}
        </MenuButton>
        <MenuList bg='#1e293b' borderColor='#475569' className='!bg-slate-800 !border !border-slate-700'>
          {languages.map(([lang, version]) => (
            <MenuItem
              key={lang}
              bg={lang === Language ? "#334155" : "transparent"}
              color={lang === Language ? "#3b82f6" : "#e2e8f0"}
              _hover={{
                bg: "#334155",
                color: "#60a5fa"
              }}
              onClick={() => onSelect(lang)}
              className='hover:!bg-slate-700'
            >
              <span className='font-semibold'>{lang}</span>
              <Text as='span' color='#94a3b8' fontSize='sm' ml={2}>
                ({version})
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  )
}

export default LanguageSelector
