import React, { ComponentProps, ComponentPropsWithoutRef, FunctionComponent, PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import { useTextSelection } from 'use-text-selection'

type Props = {
  target?: HTMLElement
  mount?: HTMLElement
  render: FunctionComponent<ReturnType<typeof useTextSelection>>
}

function Portal(props: PropsWithChildren<{mount?: HTMLElement}>) {
  return createPortal(
    props.children,
    props.mount || document.body
  )
}

export function Popover(props: PropsWithChildren<Props>) {
  const { render: Render } = props
  const textSelectionProps = useTextSelection(props.target)

  return <Portal mount={props.mount}>
    <Render {...textSelectionProps} />
  </Portal>
}
