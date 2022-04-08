Vue.component('mainbtn-component', {
  props: ['btnopen', 'canvasbtn'],
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
        <v-icon v-show="!canvasbtn">mdi-grease-pencil</v-icon>
      </v-btn>

      <v-slide-y-reverse-transition>
        <v-btn style="position:absolute; top:-40px; margin-right:8px"
          fab color="white primary--text" v-if="canvasbtn" small>
            <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-slide-y-reverse-transition>

      <v-slide-x-reverse-transition group class="flex2">
        <v-btn class="mt-3 mr-3"
        v-for="(btn, i) in subbtn" :key="i"
        fab color="white primary--text"
        v-if="canvasbtn" small @click="canvasSubBtn(i)">
          <v-icon>{{btn.icon}}</v-icon>
        </v-btn>
      </v-slide-x-reverse-transition>
    </div>
  </div>`,
  data() {
    return {
      canvasmode: false,
      subbtn: [
        { icon: 'mdi-plus-box-outline' }, 
        { icon: 'mdi-grease-pencil' }
      ],
      canvssubbtn: [
        { icon: 'mdi-plus-box-outline' }, 
        { icon: 'mdi-grease-pencil' }
      ],
    }
  },
  methods: {
    mainBtnToggle() {
      this.$emit('btnopentoggle')
    },
    mainSubBtn(i) {
      if (i == 0) {
        this.$emit('openmemoform')
      } else if (i == 1) {
        // canvas 사용 모드
        this.$emit('btnopentoggle')
        setTimeout(()=> {
          this.canvasmode = true
          this.$emit('canvasbtntoggle')
          this.$emit('canvasmode')
        },300)
      }
    },
    canvasBtnToggle() {
      this.$emit('canvasbtntoggle')
    },
    canvasSubBtn(i) {
      this.$emit('')
    }
  },
})
