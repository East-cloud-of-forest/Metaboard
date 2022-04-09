Vue.component('mainbtn-component', {
  template: `<div class="btn_index">
    <div class="fixed flex" v-show="!canvasmode">
      <v-btn fab dark
      class="mt-3"
      color="primary"
      @click="mainBtnToggle">
        <v-icon v-show="btnopen">mdi-checkbox-blank-circle-outline</v-icon>
        <v-icon v-show="!btnopen">mdi-dots-vertical</v-icon>
      </v-btn>

      <v-slide-y-reverse-transition group class="flex">
        <v-btn class="mt-3" v-for="(btn, i) in subbtn" :key="i" fab dark color="primary" v-if="btnopen" small @click="mainSubBtn(i)">
          <v-icon>{{btn.icon}}</v-icon>
        </v-btn>
      </v-slide-y-reverse-transition>
    </div>

    <div class="fixed flex2" v-show="canvasmode">
      <v-btn fab
      class="mt-3"
      color="white primary--text"
      @click="canvasBtnToggle">
        <v-icon v-show="canvasbtn">mdi-checkbox-blank-circle-outline</v-icon>
        <v-icon v-show="!canvasbtn">mdi-dots-vertical</v-icon>
      </v-btn>

      <v-slide-y-reverse-transition>
        <v-btn style="position:absolute; top:-40px; margin-right:8px" @click="canvasModeOver"
          fab color="white primary--text" v-if="canvasbtn" small>
            <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-slide-y-reverse-transition>

      <v-slide-x-reverse-transition group class="flex2">
        <v-btn class="mt-3 mr-3"
        v-for="(btn, i) in canvssubbtn" :key="i"
        fab :color="btn.activate? 'primary white-text':'white primary--text'"
        v-if="canvasbtn" small @click="canvasSubBtn(i)">
          <v-icon>{{btn.icon}}</v-icon>
        </v-btn>
      </v-slide-x-reverse-transition>
    </div>
  </div>`,
  data() {
    return {
      btnopen: false,
      canvasbtn: false,
      canvasmode: false,
      subbtn: [
        { icon: 'mdi-plus-box-outline' }, 
        { icon: 'mdi-grease-pencil' }
      ],
      canvssubbtn: [
        { icon: 'mdi-eraser', activate: false }, 
        { icon: 'mdi-grease-pencil', activate: true },
        { icon: 'mdi-water-circle', activate: false }
      ],
    }
  },
  methods: {
    mainBtnToggle() {
      this.btnopen = !this.btnopen
    },
    mainSubBtn(i) {
      if (i == 0) {
        this.$emit('openmemoform')
      } else if (i == 1) {
        // canvas 사용 모드
        this.mainBtnToggle()
        setTimeout(()=> {
          this.canvasmode = 'draw'
          this.canvasBtnToggle()
          this.$emit('canvasmode', this.canvasmode)
        },300)
      }
    },
    canvasBtnToggle() {
      this.canvasbtn = !this.canvasbtn
    },
    canvasSubBtn(i) {
      switch (i) {
        case 0:
          this.canvssubbtn[0].activate = true
          this.canvssubbtn[1].activate = false
          this.canvasmode = 'eraser'
          this.$emit('canvasmode', this.canvasmode)
          return
        case 1:
          this.canvssubbtn[1].activate = true
          this.canvssubbtn[0].activate = false
          this.canvasmode = 'draw'
          this.$emit('canvasmode', this.canvasmode)
          return
        case 2:
          this.canvssubbtn[2].activate = !this.canvssubbtn[2].activate
          this.$emit('drawsetting', this.canvssubbtn[2].activate)
      }
      this.$emit('')
    },
    canvasModeOver() {
      this.canvasBtnToggle()
      setTimeout(()=> {
        this.canvssubbtn[1].activate = true
        this.canvssubbtn[0].activate = false
        this.canvasmode = false
        this.$emit('canvasmode', this.canvasmode)
      },300)
    }
  },
  created() {
    EventBus.$on('canvassubbtn', (i) => {
      this.canvasSubBtn(i)
    })
  },
})
