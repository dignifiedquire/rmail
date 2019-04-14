// Based on https://github.com/sebslomski/react-stats/blob/master/src/index.js
import React, { Component } from 'react'

const graphHeight = 29
const graphWidth = 70

const style = {
  zIndex: 999999,
  position: 'fixed',
  height: '46px',
  width: graphWidth + 6 + 'px',
  padding: '3px',
  backgroundColor: '#000',
  color: '#00ffff',
  fontSize: '9px',
  lineHeight: '10px',
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontWeight: 'bold',
  MozBoxSizing: 'border-box',
  boxSizing: 'border-box',
  pointerEvents: 'none',
}

const graphStyle = {
  position: 'absolute',
  left: '3px',
  right: '3px',
  bottom: '3px',
  height: graphHeight + 'px',
  backgroundColor: '#282844',
  MozBoxSizing: 'border-box',
  boxSizing: 'border-box',
}

class FPSStats extends Component {
  constructor(props) {
    super(props)
    const currentTime = +new Date()
    this.state = {
      frames: 0,
      startTime: currentTime,
      prevTime: currentTime,
      fps: [],
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.fps !== nextState.fps
  }

  componentWillMount() {
    style.top = this.props.top
    style.right = this.props.right
    style.bottom = this.props.bottom
    style.left = this.props.left
  }

  componentDidMount() {
    if (!this.props.isActive) {
      return
    }

    const that = this

    const onRequestAnimationFrame = function() {
      that.calcFPS()

      window.requestAnimationFrame(onRequestAnimationFrame)
    }

    window.requestAnimationFrame(onRequestAnimationFrame)
  }

  calcFPS() {
    const currentTime = +new Date()

    this.setState({
      frames: this.state.frames + 1,
    })

    if (currentTime > this.state.prevTime + 1000) {
      let fps = Math.round(
        (this.state.frames * 1000) / (currentTime - this.state.prevTime)
      )

      fps = this.state.fps.concat(fps)
      let sliceStart = fps.length - graphWidth

      if (sliceStart < 0) {
        sliceStart = 0
      }

      fps = fps.slice(sliceStart, fps.length)

      this.setState({
        fps: fps,
        frames: 0,
        prevTime: currentTime,
      })
    }
  }

  render() {
    if (!this.props.isActive) {
      return null
    }

    const maxFps = Math.max.apply(Math.max, this.state.fps)

    const graphItems = this.state.fps.map((fps, i) => {
      const height = (graphHeight * fps) / maxFps

      const graphItemStyle = {
        position: 'absolute',
        bottom: '0',
        right: this.state.fps.length - 1 - i + 'px',
        height: height + 'px',
        width: '1px',
        backgroundColor: '#00ffff',
        MozBoxSizing: 'border-box',
        boxSizing: 'border-box',
      }

      return React.createElement('div', {
        key: 'fps-' + i,
        style: graphItemStyle,
      })
    })

    return React.createElement(
      'div',
      { style: style },
      this.state.fps[this.state.fps.length - 1],
      ' FPS',

      React.createElement('div', { style: graphStyle }, graphItems)
    )
  }
}

FPSStats.defaultProp = {
  isActive: true,
  top: 'auto',
  bottom: '5px',
  right: '5px',
  left: 'auto',
}

export default FPSStats
