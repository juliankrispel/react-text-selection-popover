import React from 'react'
import { render } from 'react-dom'
import './index.css'
// @ts-ignore
import Typography from 'typography'
import { Example } from './example'

const typography = new Typography({
  baseFontSize: '18px',
  baseLineHeight: 1.666,
  headerFontFamily: ['sans-serif'],
  bodyFontFamily: ['sans-serif'],
  // See below for the full list of options.
})

typography.injectStyles()


render(<Example/>, document.getElementById('root'))
