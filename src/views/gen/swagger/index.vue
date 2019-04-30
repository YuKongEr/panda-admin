<template>
  <elFrame :src="url" />
</template>
<script>
import elFrame from '@/components/IFrame/index'
export default {
  components: { elFrame },
  computed: {
    url() {
      return this.$route.meta.url
    }
  }
}
</script>