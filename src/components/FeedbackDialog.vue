<template>
  <a @click="showFeedbackDialog"><slot /></a>
</template>

<script>
import { h } from "vue";
import { useOruga } from "@oruga-ui/oruga-next";

const FeedbackIframe = {
  template: `
    <div class="feedback-iframe-container">
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSfQCt28Gxr5VfS_bi0vjN1FSRk2Q4XLOXkKU7vWOasFF3bE3Q/viewform?embedded=true"
        frameborder="0"
        marginheight="0"
        marginwidth="0">
        Loading...
      </iframe>
    </div>
  `,
};

export default {
  props: {
    text: String,
  },
  setup() {
    const oruga = useOruga();

    const showFeedbackDialog = () => {
      oruga.modal.open({
        component: FeedbackIframe,
        width: "90vw",
        rootClass: "feedback-modal",
      });
    };

    return {
      showFeedbackDialog,
    };
  },
};
</script>

<style lang="scss">
.feedback-modal {
  .o-modal__content {
    width: 90vw !important;
    max-width: 1200px !important;
    height: 85vh !important;
  }

  .feedback-iframe-container {
    width: 100%;
    height: 85vh;
    min-height: 600px;
    background: white;

    iframe {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }
  }
}
</style>
