<template>
  <a @click="showFeedbackDialog"><slot /></a>
</template>

<script>
export default {
  methods: {
    showFeedbackDialog() {
      this.$modal.open({
        parent: this,
        content:
          '<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfQCt28Gxr5VfS_bi0vjN1FSRk2Q4XLOXkKU7vWOasFF3bE3Q/viewform?embedded=true" width="100%" height="1200" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>'
      });
    }
  },
  props: {
    text: String
  }
};
</script>

<style lang="scss" >
.modal-card-body {
  padding: 0;
}
</style>
