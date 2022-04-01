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
    id: 0,
    moveon: false,
    targetdiv: '',
    targetshiftx: 0,
    targetshifty: 0,
    targetlist: 0,
    targetsize: { left: 50, top: 50 },
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
      // 유효성 검사
      const validate = this.$refs.form.validate()
      if (validate) {
        creatememo(
          this.memolist,
          this.memotitle,
          this.memocontent,
          this.id,
          this.formopen,
          // 리스트 추가 후 발동
        ).then(() => {
          let t = document.getElementById(this.id)
          t.style.left = `calc(50% - ${t.getBoundingClientRect().width / 2}px)`
          t.style.top = `calc(50% - ${t.getBoundingClientRect().height / 2}px)`

          this.id++
          this.formopen = false
          this.memotitle = ''
          this.memocontent = ''
        })
      }

      // 메모 리스트에 추가 함수
      async function creatememo(
        memolist,
        memotitle,
        memocontent,
        id,
      ) {
        memolist.push({
          title: memotitle,
          content: memocontent,
          left: 0,
          top: 0,
          id: id,
        })
      }
    },
  },

  // 마우스 벗어났을때 이벤트 중지 방지
  mounted() {
    this.$nextTick(function () {
      window.addEventListener('mouseup', this.onCardUp)
      window.addEventListener('mousemove', this.onCardMove)
    })
  },
})
