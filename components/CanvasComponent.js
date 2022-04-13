Vue.component('canvas-component', {
  template : `<div style="line-height:0;" :style="mouse">
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

    <div v-if="canvason" id="corsur"
    :style="cursorposition" style="position:absolute; opacity:0; transition: opacity 0.4s;">
      <v-icon samll
      :color="this.canvasmode == 'draw'?'rgba('
        +drawStyle.color.r+ ','
        +drawStyle.color.g+ ','
        +drawStyle.color.b+ ','
        +drawStyle.color.a+ ')':''">{{cursor}}</v-icon>
    </div>
  </div>`,
  data() {
    return {
      canvas : "",
      ctx : "",
      base : "",
      stageWidth : 0,
      stageHeight : 0,
      pixelRatio : 0,
      canvason : false,
      panuse : false,
      clickOn : false,
      canvasmode : '',
      settingform : false,
      drawoption: {
        type : ["round", "square"],
        size : [2,3,5,7,10,15,20,30],
      },
      drawStyle: {
        color: { r: 0, g: 0, b: 0, a: 1 },
        lineWidth: 5,
        lineCap: "round"
      },
      imageData: "",
      img: "",
      cpositionx: 0,
      cpositiony: 0,
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

      document.addEventListener('mousedown', this.drawInit.bind(this), false)
      document.addEventListener('mousemove', this.draw.bind(this), false)
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

    drawInit() {
      if (this.canvason && this.panuse) {
        this.clickOn = true
        this.$emit('no-drag')
      }
      this.ctx.beginPath()
      this.ctx.moveTo(this.cpositionx, this.cpositiony)
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
      if(this.clickOn) {
        this.ctx.lineTo(this.cpositionx, this.cpositiony)
        this.ctx.stroke()
        this.ctx.beginPath()
        this.ctx.moveTo(this.cpositionx, this.cpositiony)
      }
      this.cpositionx=e.clientX
      this.cpositiony=e.clientY
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
    mouse() {
      let mouse = ``
      if (this.canvason) {
        mouse = `cursor:none;`
      } else {
        mouse = `cursor:auto`
      }
      return mouse
    },
    cursor() {
      let pointer
      if(this.canvasmode == 'draw') {
        pointer = 'mdi-grease-pencil'
      }else if(this.canvasmode == 'eraser') {
        pointer = 'mdi-eraser'
      }
      return pointer
    },
    cursorposition() {
      if(this.canvasmode == 'draw') {
        return `transform: translateX(${this.cpositionx-1}px) translateY(${this.cpositiony-21}px) translateZ(0) translate3d(0, 0, 0);`
      }else if(this.canvasmode == 'eraser') {
        return `transform: translateX(${this.cpositionx-5}px) translateY(${this.cpositiony-20}px) translateZ(0) translate3d(0, 0, 0);`
      }
    }
  },
  mounted() {
    this.constructor()
  },
  created() {
    EventBus.$on('canvason',(canvason)=>{
      // 캔버스 사용 가능 여부
      this.canvason = canvason
      // 팬 사용 가능 여부
      this.panuse = canvason
    }),
    EventBus.$on('btnhover',(hover)=>{
      // 버튼 위에 있을때 캔버스 사용 가능이어도 못 그리도록
      this.panuse = hover
    }),
    EventBus.$on('canvasmode',(canvasmode)=>{
      this.canvasmode = canvasmode
    }),
    EventBus.$on('drawsetting',(drawsetting)=>{
      this.settingform = drawsetting
      // 폼이 켜졌을때 팬 사용 가능이어도 못 그리도록
      this.canvason = !drawsetting
    })
  },
})