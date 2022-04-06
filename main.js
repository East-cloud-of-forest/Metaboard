const EventBus = new Vue();

new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
    formopen: false,
    btnopen: false,
    subbtn: [{ icon: 'mdi-plus-box-outline' }, { icon: 'mdi-grease-pencil' }],
    rules: [(v) => !!v || '제목을 입력해야 합니다.'],
    memolist: [],
    id: 0,
    moveon: false,
    targetdiv: '',
    targetshiftx: 0,
    targetshifty: 0,
    targetlist: 0,
    editon: false,
    edit: {},
  },
  methods: {
    // 메인버튼 열기
    btnOpenToggle() {
      this.btnopen = !this.btnopen
    },

    // 메모 입력창 여닫기
    openMemoForm(i) {
      if (i == 0) {
        this.formopen = !this.formopen
      }
    },
    closeMemoForm() {
      this.formopen = !this.formopen
      setTimeout(()=>{
        this.editon = false
      },300)
    },

    // 메모 추가
    addMemo(comp) {
      // 유효성 검사
      const validate = comp.$refs.form.validate()
      // 메모 리스트에 추가 함수
      async function creatememofn() {
        this.memolist.push({
          title : comp.memotitle,
          content : comp.memocontent,
          left : 0,
          top : 0,
          id : this.id,
          colortogle : false,
          color : 'yellow',
          index : this.memolist.length,
        })
      }
      let creatememo = creatememofn.bind(this)

      if (validate) {
        creatememo().then(() => {
          // 리스트 추가 후 추가된 메모장 가운데 위치
          let t = document.getElementById('card' + this.id)
          t.style.left = `calc(50% - ${t.getBoundingClientRect().width / 2}px)`
          t.style.top = `calc(50% - ${t.getBoundingClientRect().height / 2}px)`

          this.id++
          this.formopen = false
        })
      }
    },
    // 메모 삭제 및 순서 재정립
    deleteMemo(id ,i) {
      let remove = this.memolist[i].index
      this.memolist.forEach((e, j) => {
        if(e.id == id) {
          this.memolist.splice(j, 1)
        }
        if (this.memolist.length > 0) {
          if (i == this.memolist.length && j == i) {
            return
          }
          if(remove <= this.memolist[j].index) {
            this.memolist[j].index--
          }
        }
      })
    },
    // 메모 수정
    editMemoFormOpen(i) {
      this.editon = true
      this.edit.title = this.memolist[i].title
      this.edit.content = this.memolist[i].content
      this.edit.id = i
      this.formopen = true
    },
    editMemo(comp) {
      let i = this.edit.id
      this.memolist[i].title = comp.memotitle
      this.memolist[i].content = comp.memocontent
      this.formopen = false
      setTimeout(()=>{
        this.editon = false
      },300)
    },
    // 메모 색 변경
    colorPickOpen(i) {
      this.memolist[i].colortogle = true
    },
    colorPickClose(i) {
      this.memolist[i].colortogle = false
    },
    pickColor(color, i) {
      this.memolist[i].color = color
      this.memolist[i].colortogle = false
    },

    // 메모 드래그 엔 드랍 이벤트
    // 참고 https://ko.javascript.info/mouse-drag-and-drop
    onCardDown(i, e) {
      this.targetlist = i
      if (e.target.toString() == '[object HTMLDivElement]') {
        this.targetdiv = e.path[2]
      } else {
        this.targetdiv = e.path[1]
      }

      if (this.memolist.length > 1) {
        this.memolist.forEach((e, j)=>{
          if (this.memolist[i].index < this.memolist[j].index) {
            this.memolist[j].index--
          }
        })
        this.memolist[i].index = this.memolist.length - 1
      }

      this.targetdiv.classList.add(`clickmemo`)
      this.targetshiftx =
        e.clientX - this.targetdiv.getBoundingClientRect().left
      this.targetshifty = e.clientY - this.targetdiv.getBoundingClientRect().top

      this.moveon = true
    },
    onCardMove(e) {
      if (this.moveon) {
        let target = this.memolist[this.targetlist]
        this.targetdiv.style.left = e.pageX - this.targetshiftx + 'px'
        this.targetdiv.style.top = e.pageY - this.targetshifty + 'px'
        target.left = e.pageX - this.targetshiftx
        target.top = e.pageY - this.targetshifty
      }
    },
    onCardUp(e) {
      if (this.targetdiv) {
        this.targetdiv.classList.remove(`clickmemo`)
      }
      e.onCardMove = null
      e.onCardUp = null
      this.moveon = false
    },
  },

  // 메모장에서 마우스 벗어났을때 이벤트 중지 방지
  mounted() {
    this.$nextTick(function () {
      window.addEventListener('mouseup', this.onCardUp)
      window.addEventListener('mousemove', this.onCardMove)
    })
  },
})