Vue.component('mainbtn-component', {
  props : ["btnopen", "subbtn"],
  template : `<div class="fixed flex btn_index">
    <v-btn fab dark class="mt-3" @click="btnOpenToggle" color="primary">
        <v-icon v-show="btnopen">mdi-checkbox-blank-circle-outline</v-icon>
        <v-icon v-show="!btnopen">mdi-dots-vertical</v-icon>
    </v-btn>

    <v-slide-y-reverse-transition group class="flex">
      <v-btn class="mt-3" v-for="(btn, i) in subbtn" :key="i" fab dark color="primary" v-if="btnopen" small
         @click="openMemoForm(i)">
        <v-icon>{{btn.icon}}</v-icon>
      </v-btn>
    </v-slide-y-reverse-transition>
  </div>`,
  methods: {
    btnOpenToggle() {
      this.$emit('btnopentoggle')
    },
    openMemoForm(i) {
      this.$emit('openmemoform', i)
    }
  },
})