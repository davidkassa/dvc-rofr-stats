<template>
<b-dropdown>
    <button class="button" aria-haspopup="true" aria-controls="dropdown-menu2" slot="trigger">
        <span>Resorts</span>
        <b-icon icon="angle-down" size="is-small"></b-icon>
    </button>
      <b-dropdown-item custom>
        <p>You can insert <strong>any type of content</strong> within the dropdown menu.</p>
      </b-dropdown-item>
      <b-dropdown-item>Item</b-dropdown-item>
      <b-dropdown-item separator />
      <b-dropdown-item custom>
        <p>You simply need to use a <code>&lt;div&gt;</code> instead.</p>
      </b-dropdown-item>
      <b-dropdown-item separator />
      <b-dropdown-item has-link>
        <a href="#">This is a link</a>
      </b-dropdown-item>
</b-dropdown>
</template>

<script>
export default {
  components: {}
};
</script>
