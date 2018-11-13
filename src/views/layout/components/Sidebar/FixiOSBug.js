export default {
  computed: {
    device() {
      return this.$store.state.app.device
    }
  },
  mounted() {
    this.fixBugIniOS()
  },
  methods: {
    fixBugIniOS() {
      const $submenu = this.$refs.submenu
      if ($submenu) {
        const handleMouseleave = $submenu.handleMouseleave
        $submenu.handleMouseleave = (e) => {
          if (this.device === 'mobile') {
            return
          }
          handleMouseleave(e)
        }
      }
    }
  }
}
