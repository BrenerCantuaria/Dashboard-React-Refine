import { Popover } from 'antd'
import React from 'react'

export default function CurrentUser() {
  return (
    <>
        <Popover
        placement='bottomRight'
        trigger="click"
        overlayInnerStyle={{ padding: 0}}
        overlayStyle={{ zIndex: 999}}
        >
            Teste
        </Popover>
    </>
  )
}
