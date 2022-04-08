Vue.component('canvas-component', {
  props: ["canvasmode"],
  template : `<div style="position:absloute;">
  </div>`,
  data() {
    return {
      canvas : "",
      ctx : "",
      base : "",
      stageWidth : 0,
      stageHeight : 0,
      pixelRatio : 0,
      drawOn : false,
    }
  },
  methods: {
    constructor() {
      this.canvas = document.createElement('canvas')
      this.ctx = this.canvas.getContext('2d')
      this.$el.appendChild(this.canvas)
      this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1

      window.addEventListener('resize', this.resize, false)
      this.resize()

      this.canvas.addEventListener('mousedown', this.drawInit.bind(this), false)
      this.canvas.addEventListener('mousemove', this.draw.bind(this), false)
      window.addEventListener('mouseup', this.drawOver.bind(this), false)
    },

    resize() {
      this.stageWidth = document.body.clientWidth
      this.stageHeight = document.body.clientHeight

      this.canvas.width = this.stageWidth * this.pixelRatio
      this.canvas.height = this.stageHeight * this.pixelRatio

      this.ctx.scale(this.pixelRatio, this.pixelRatio)
    },

    drawInit(e) {
      if (this.canvasmode) {
        this.drawOn = true
      }
      this.$emit('no-drag')
      const x = e.offsetX
      const y = e.offsetY
      this.ctx.beginPath()
      this.ctx.moveTo(x, y)
      this.ctx.lineWidth = 5
      this.ctx.lineCap = "round"
      this.ctx.strokeStyle = "black"
    },

    draw(e) {
      const x = e.offsetX
      const y = e.offsetY
      if(this.drawOn) {
        this.ctx.lineTo(x, y)
        this.ctx.stroke()
      }
    },

    drawOver() {
      this.drawOn = false
      this.$emit('no-drag-stop')
      this.ctx.closePath()
    },
  },
  mounted() {
    this.constructor()
  },
})