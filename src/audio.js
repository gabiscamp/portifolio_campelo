let ctx = null
const getCtx = () => {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

function play(fn) {
  try {
    const c = getCtx()
    if (c.state === 'suspended') c.resume()
    fn(c)
  } catch {}
}

function noise(c, dur, vol = 0.06) {
  const n = c.createBufferSource()
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * vol
  n.buffer = buf
  return n
}

export function sfxHop() {
  play((c) => {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(220, c.currentTime)
    o.frequency.exponentialRampToValueAtTime(120, c.currentTime + 0.08)
    g.gain.setValueAtTime(0.12, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.1)
    o.connect(g).connect(c.destination)
    o.start(); o.stop(c.currentTime + 0.1)
  })
}

export function sfxFlicker() {
  play((c) => {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sawtooth'
    o.frequency.value = 3200
    g.gain.setValueAtTime(0.04, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06)
    o.connect(g).connect(c.destination)
    o.start(); o.stop(c.currentTime + 0.06)
  })
}

export function sfxLightOn() {
  play((c) => {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(800, c.currentTime)
    o.frequency.exponentialRampToValueAtTime(2400, c.currentTime + 0.15)
    g.gain.setValueAtTime(0.08, c.currentTime)
    g.gain.linearRampToValueAtTime(0.03, c.currentTime + 0.15)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4)
    o.connect(g).connect(c.destination)
    o.start(); o.stop(c.currentTime + 0.4)
  })
}

export function sfxKnock() {
  play((c) => {
    for (let i = 0; i < 3; i++) {
      const t = c.currentTime + i * 0.18
      const n = noise(c, 0.06, 0.25)
      const g = c.createGain()
      const f = c.createBiquadFilter()
      f.type = 'bandpass'
      f.frequency.value = 600
      f.Q.value = 2
      g.gain.setValueAtTime(0.3, t)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.06)
      n.connect(f).connect(g).connect(c.destination)
      n.start(t); n.stop(t + 0.06)
    }
  })
}

export function sfxDoorCreak() {
  play((c) => {
    const t = c.currentTime

    const nk = noise(c, 0.08, 0.3)
    const fk = c.createBiquadFilter()
    fk.type = 'lowpass'; fk.frequency.value = 500
    const gk = c.createGain()
    gk.gain.setValueAtTime(0.2, t)
    gk.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
    nk.connect(fk).connect(gk).connect(c.destination)
    nk.start(t); nk.stop(t + 0.08)

    const o = c.createOscillator()
    o.type = 'sine'
    o.frequency.setValueAtTime(200, t + 0.15)
    o.frequency.linearRampToValueAtTime(320, t + 0.8)
    o.frequency.linearRampToValueAtTime(180, t + 1.6)
    const f = c.createBiquadFilter()
    f.type = 'bandpass'; f.frequency.value = 500; f.Q.value = 6
    const g = c.createGain()
    g.gain.setValueAtTime(0, t + 0.15)
    g.gain.linearRampToValueAtTime(0.03, t + 0.4)
    g.gain.linearRampToValueAtTime(0.02, t + 1.0)
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.6)
    o.connect(f).connect(g).connect(c.destination)
    o.start(t + 0.15); o.stop(t + 1.6)

    const n = noise(c, 1.2, 0.06)
    const fn = c.createBiquadFilter()
    fn.type = 'highpass'; fn.frequency.value = 800
    const gn = c.createGain()
    gn.gain.setValueAtTime(0, t + 0.3)
    gn.gain.linearRampToValueAtTime(0.04, t + 0.6)
    gn.gain.exponentialRampToValueAtTime(0.001, t + 1.5)
    n.connect(fn).connect(gn).connect(c.destination)
    n.start(t + 0.3); n.stop(t + 1.5)
  })
}

export function sfxClick() {
  play((c) => {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sine'
    o.frequency.value = 1800
    g.gain.setValueAtTime(0.08, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.04)
    o.connect(g).connect(c.destination)
    o.start(); o.stop(c.currentTime + 0.04)
  })
}

export function sfxWhoosh() {
  play((c) => {
    const n = noise(c, 0.5, 0.15)
    const g = c.createGain()
    const f = c.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.setValueAtTime(300, c.currentTime)
    f.frequency.exponentialRampToValueAtTime(1200, c.currentTime + 0.2)
    f.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.5)
    f.Q.value = 1
    g.gain.setValueAtTime(0.15, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5)
    n.connect(f).connect(g).connect(c.destination)
    n.start(); n.stop(c.currentTime + 0.5)
  })
}
