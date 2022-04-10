Vue.component('canvas-component', {
  props: ["canvasmode", "settingform"],
  template : `<div style="line-height:0;">
    <v-dialog v-model="formtoggle" max-width="450">
      <v-card>
        <v-system-bar :style="{backgroundColor:
          'rgba('
          +drawStyle.color.r+ ','
          +drawStyle.color.g+ ','
          +drawStyle.color.b+ ','
          +drawStyle.color.a+ ')'
        }">
        </v-system-bar>
        
        <v-card-actions class="align-start">
          <div>
            <v-card-title><v-icon>Color</v-icon></v-card-title>
            <v-color-picker
              dot-size="10"
              mode="rgba"
              v-model="drawStyle.color"
            ></v-color-picker>
          </div>
          <div>
            <v-card-title><v-icon>Type</v-icon></v-card-title>
            <v-btn-toggle v-model="drawStyle.lineCap" group mandatory
            class="flex-column">
              <v-btn width="100" height="100"
              v-for="type in drawoption.type"
              :key="type" :value="type">
                <div
                style="width:50px; height:50px;"
                :style="{backgroundColor:
                  'rgba('
                  +drawStyle.color.r+ ','
                  +drawStyle.color.g+ ','
                  +drawStyle.color.b+ ','
                  +drawStyle.color.a+ ')',
                  borderRadius:type=='round'?'50%':''}"></div>
              </v-btn>
            </v-btn-toggle>
          </div>
        </v-card-actions>
          
        <v-card-actions class="flex-column align-start">
          <v-card-title><v-icon>Size</v-icon></v-card-title>
          <v-btn-toggle v-model="drawStyle.lineWidth" group mandatory>
            <v-btn v-for="size in drawoption.size" :key="size"
            class="ma-0"
            :value="size"
            :width="418/drawoption.size.length"
            :height="418/drawoption.size.length">
              <div :style="{backgroundColor:
              'rgba('
              +drawStyle.color.r+ ','
              +drawStyle.color.g+ ','
              +drawStyle.color.b+ ','
              +drawStyle.color.a+ ')',
              borderRadius:drawStyle.lineCap=='round'?'50%':'',
              width:size+'px', height:size+'px'}"></div>
            </v-btn>
          </v-btn-toggle>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>`,
  data() {
    return {
      canvas : "",
      ctx : "",
      base : "",
      stageWidth : 0,
      stageHeight : 0,
      pixelRatio : 0,
      clickOn : false,
      drawoption: {
        type : ["round", "butt"],
        size : [2,3,5,7,10,15,20,30],
      },
      drawStyle: {
        color: { r: 0, g: 0, b: 0, a: 1 },
        lineWidth: 5,
        lineCap: "round"
      },
      imageData: "",
      img: "",
      cursor: [
        {pointer:'mdi-grease-pencil', style:''}
      ],
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

      let draw = ()=>this.ctx.drawImage(this.img, 0, 0)
      this.img = new Image()
      this.img.onload = draw
      this.img.src = this.imageData
    },

    drawInit(e) {
      if (this.canvasmode) {
        this.clickOn = true
        this.$emit('no-drag')
      }
      const x = e.offsetX
      const y = e.offsetY
      this.history = {x, y}
      this.ctx.beginPath()
      this.ctx.moveTo(x, y)
      this.ctx.lineWidth = this.drawStyle.lineWidth
      this.ctx.lineCap = this.drawStyle.lineCap
      if (this.canvasmode == 'draw') {
        this.ctx.strokeStyle = `rgba(
          ${this.drawStyle.color.r},
          ${this.drawStyle.color.g},
          ${this.drawStyle.color.b},
          ${this.drawStyle.color.a}
        )`
      }
      if (this.canvasmode == 'eraser') {
        this.ctx.strokeStyle = "white"
      }
    },

    draw(e) {
      const x = e.offsetX
      const y = e.offsetY
      if(this.clickOn) {
        this.ctx.lineTo(x, y)
        this.ctx.stroke()
        this.ctx.beginPath()
        this.ctx.moveTo(x, y)
      }
    },

    drawOver() {
      this.clickOn = false
      this.$emit('no-drag-stop')
      this.ctx.closePath()
      this.imageData = this.canvas.toDataURL();
    },
  },
  computed : {
    formtoggle : {
      get() {
        return this.settingform
      },
      set() {
        EventBus.$emit('canvassubbtn', 2)
      }
    },
  },
  mounted() {
    this.constructor()
  },
})