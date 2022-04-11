Vue.component("memo-component", {
  props : ["memolist",],
  template : `<div>
    <v-card v-for="(n, i) in memolist" :key="n.id" :id="'card' + n.id" class="memo" :class="n.color+' lighten-4'" max-width="400" min-width="200" ref="card" :style="{zIndex:n.index}"
    @mouseover="memoover" @mouseout="memoout"
    elevation="1">

    <!-- 카드 탑 바 -->
    <v-app-bar flat :class="n.color+' lighten-3'" @mousedown.left="onCardDown(i, $event)" height="30px">

      <!-- 컬러버튼 -->
      <v-btn @mousedown.stop="" @click="colorPickOpen(i)" small depressed class="pa-0 memoinbtn" :class="n.color+' lighten-3'"><v-icon :color="n.color+' darken-2'" dense>
        mdi-palette</v-icon></v-btn>
      <v-spacer></v-spacer>
      <!-- 삭제버튼 -->
      <v-btn @mousedown.stop="" @click="deleteMemo(n.id, i)" small depressed class="pa-0 memoinbtn" :class="n.color+' lighten-3'"><v-icon color="grey darken-1" dense>
        mdi-close-thick</v-icon></v-btn>
        
    </v-app-bar>

    <!-- 컬러 팔레트 -->
    <v-expand-transition>
      <v-app-bar flat class="white" @mousedown.stop="" style="overflow:hidden" absolute rounded v-if="n.colortogle">
        <v-row no-gutters height="100%">
          <v-col cols="2" v-for="n in color" :key="n.name">
            <v-btn depressed tile block :color="n.name" @click="pickColor(n.name, i)"></v-btn>
          </v-col>
          <v-col cols="2" height="28px">
            <v-btn depressed tile block color="white" @click="colorPickClose(i)" class="pa-0"><v-icon color="grey darken-1">
            mdi-chevron-up</v-icon></v-btn>
          </v-col>
        </v-row>
      </v-app-bar>
    </v-expand-transition>

    <!-- 카드 내용 -->
    <div class="pa-5 pb-1 text-center">
      <h3 class="mb-2">{{n.title}}</h3>
      <p class="mb-0">{{n.content}}</p>
    </div>
    <!-- 수정 버튼 -->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @mousedown.stop="" @click="editMemoFormOpen(i)" small depressed class="pa-0 memoinbtn" :color="n.color+' lighten-4'"><v-icon :color="n.color+' darken-2'" dense>
        mdi-note-edit-outline</v-icon></v-btn>
      </v-card-actions>
    </v-card>
  </div>`,
  data() {
    return {
      color : [
        {name : "pink"},
        {name : "red"},
        {name : "orange"},
        {name : "yellow"},
        {name : "green"},
        {name : "teal"},
        {name : "cyan"},
        {name : "indigo"},
        {name : "deep-purple"},
        {name : "blue-grey"},
        {name : "brown"},
      ],
    }
  },
  methods: {
    onCardDown(i, e) {
      this.$emit('oncarddown', i , e)
    },
    deleteMemo(id , i) {
      this.$emit('deletememo',id , i)
    },
    colorPickOpen(i) {
      this.$emit('colorpickopen', i)
    },
    colorPickClose(i) {
      this.$emit('colorpickclose', i)
    },
    pickColor(color, i) {
      this.$emit('pickcolor',color , i)
    },
    editMemoFormOpen(i) {
      this.$emit('editmemoformopen', i)
      EventBus.$emit('memoformedit')
    },
    memoover() {
      EventBus.$emit('btnhover', false)
    },
    memoout() {
      EventBus.$emit('btnhover', true)
    },
  },
})