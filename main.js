new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
    formopen: false,
    btnopen: false,
    subbtn: [{ icon: 'mdi-plus-box-outline' }, { icon: 'mdi-grease-pencil' }],
    rules: [(v) => !!v || '제목을 입력해야 합니다.'],
    memotitle: '',
    memocontent: '',
    memolist: [],
    moveon: false,
    targetdiv: '',
    targetshiftx: 0,
    targetshifty: 0,
    targetlist : 0,
    targetsize : {left : 0, top : 0}
  },
  methods: {
    // 휠 감지
    wheel(e) {
      if (e.deltaY > 0) {
        console.log('down' + e.deltaY)
      } else {
        console.log('Up' + e.deltaY)
      }
    },


    // 카드 드래그 엔 드랍 이벤트
    // 참고 https://ko.javascript.info/mouse-drag-and-drop
    onCardDown(i, e) {
      this.targetlist = i
      function pushTarget() {
        if (e.target.toString() == '[object HTMLDivElement]') {
          this.targetdiv = e.path[0]
        } else {
          this.targetdiv = e.path[1]
        }
        this.targetshiftx =
          e.clientX - this.targetdiv.getBoundingClientRect().left
        this.targetshifty =
          e.clientY - this.targetdiv.getBoundingClientRect().top
      }
      pushTarget()

      this.moveon = true
    },
    onCardMove(e) {
      if (this.moveon) {
        let target = this.memolist[this.targetlist]
        function moveAt(pageX, pageY) {
          this.targetdiv.style.left = pageX - this.targetshiftx + 'px'
          this.targetdiv.style.top = pageY - this.targetshifty + 'px'
          target.left = pageX - this.targetshiftx
          target.top = pageY - this.targetshifty
        }
        moveAt(e.pageX, e.pageY)
      }
    },
    onCardUp(e) {
      e.onCardMove = null
      e.onCardUp = null
      this.moveon = false
    },

    // 버튼 열기
    btnOpenToggle() {
      this.btnopen = !this.btnopen
    },

    // 메모 입력창 열기
    openMemoForm(i) {
      if (i == 0) {
        this.formopen = !this.formopen
      }
    },
    addMemo() {
      const validate = this.$refs.form.validate()
      if (validate) {
        this.memolist.push({
          title: this.memotitle,
          content: this.memocontent,
          left : 0,
          top : 0,
        })
        this.formopen = false
        this.memotitle = ''
        this.memocontent = ''
      }
    },
  },

  // 마우스 벗어났을때 이벤트 중지 방지
  mounted() {
    window.addEventListener('mouseup', this.onCardUp)
    window.addEventListener('mousemove', this.onCardMove)
  },
})
