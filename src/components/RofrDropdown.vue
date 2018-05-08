<template>
<div>
    <vueMultiSelect
      @selectionChanged="updateValues"
      :options="options"
      :filters="filters"
      :selectOptions="data" />
</div>
</template>

<script>
  import vueMultiSelect from 'vue-multi-select';
import 'vue-multi-select/dist/lib/vue-multi-select.min.css'
export default {
  data() {
    return {
      name: 'first group',
      values: [],
      data: [{
        name: 'first group',
        list: [
          { name: '0' },
          { name: '2' },
          { name: '3' },
          { name: '8' },
          { name: '9' },
          { name: '11' },
          { name: '13' },
          { name: '14' },
          { name: '15' },
          { name: '18' },
        ],
      }, {
        name: 'second group',
        list: [
          { name: '21' },
          { name: '22' },
          { name: '24' },
          { name: '27' },
          { name: '28' },
          { name: '29' },
          { name: '31' },
          { name: '33' },
          { name: '35' },
          { name: '39' },
        ],
      }],
      filters: [{
        nameAll: 'select <= 10',
        nameNotAll: 'Deselect <= 10',
        func: (elem) => {
          if (elem.name <= 10) {
            return true;
          }
          return false;
        },
      }, {
        nameAll: 'Select contains 2',
        nameNotAll: 'Deselect contains 2',
        func: (elem) => {
          if (elem.name.indexOf('2') !== -1) {
            return true;
          }
          return false;
        },
      }],
      options: {
        multi: true,
        groups: true,
        btnLabel: 'Filter by Status, Resort, and UY',
      },
    };
  },
  methods: {
    updateValues(values) {
      this.values = values;
    },
  },  components: {vueMultiSelect}
};
</script>

<style scoped lang="scss">
.select:not(.is-multiple)::after{content: none;}
</style>