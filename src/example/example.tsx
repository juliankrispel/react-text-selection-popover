import React from 'react'
import { css } from '@emotion/css'
import { Popover } from "..";

export function Example() {
  return <div>
    <h1><pre>react-text-selection-popover</pre></h1>
    <p>This is an example using react-text-selection-popover</p>
    <p>Select any text here and you'll see what I mean</p>
    <p><pre>
    {`<Popover
  render={
    ({ clientRect, isCollapsed, textContent }) => {
      if (clientRect == null || isCollapsed) return null

      const style = css\`
        position: absolute;
        left: \${clientRect.left + clientRect.width / 2}px;
        top: \${clientRect.top - 40}px;
        margin-left: -75px;
        width: 150px;
        background: blue;
        font-size: 0.7em;
        pointer-events: none;
        text-align: center;
        color: white;
        border-radius: 3px;
      \`

      return <div className={style}>
        Selecting {(textContent || '').length} characters
      </div>
    }
  }
/>`}</pre></p>
    <Popover
      render={
        ({ clientRect, isCollapsed, textContent }) => {
          if (clientRect == null || isCollapsed) return null

          const style = css`
            position: absolute;
            left: ${clientRect.left + clientRect.width / 2}px;
            top: ${clientRect.top - 40}px;
            margin-left: -75px;
            width: 150px;
            background: blue;
            font-size: 0.7em;
            pointer-events: none;
            text-align: center;
            color: white;
            border-radius: 3px;
          `

          return <div className={style}>
           Selecting {(textContent || '').length} characters
          </div>
        }
      }
    />
  </div>
}
