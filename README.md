# react-text-selection-popover

A react component that lets you render a popover in relation to the current text selection. 

[![NPM](https://img.shields.io/npm/v/react-text-selection-popover.svg)](https://www.npmjs.com/package/react-text-selection-popover) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Install

```bash
npm install --save react-text-selection-popover
```

## Usage

```tsx
import css from '@emotion/css'

<Popover
  render={
    ({ clientRect, isCollapsed, textContent }) => {
      if (clientRect == null || isCollapsed) return null

      // I'm using emotion for this example but you can use anything really
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
```

### Props

| name | type | description |
| --- | ---- | --- |
| `render`    | `({ clientRect, isCollapsed, textContent }) => {}` | Render prop for rendering your popover, see above for usage |
| `mount`     | `HTMLElement` | Dom Element that Popover will be rendered into (This component uses [React Portals](https://reactjs.org/docs/portals.html) |
| `target`    | `HTMLElement` | Dom Element which the popover is constrained to |

# Shoutouts

This was originally written during some freelance work for [Spectrum](https://spectrum.chat/). Shoutout to their awesomeness for letting me do all my work for them in the open!

## Work with me?

I build editors for companies, or help their teams do so. Hit me up on [my website](http://jkrsp.com) to get in touch about a project.
