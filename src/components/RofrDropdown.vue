<template>
  <div class="filter-container">
    <o-dropdown aria-role="list" position="bottom-left" :mobile-modal="false" :inline="false">
      <template #trigger>
        <o-button icon-left="filter" size="small">
          Filter by Status, Resort, and UY ({{ totalSelected }}/{{ totalOptions }})
        </o-button>
      </template>

      <o-dropdown-item aria-role="listitem" custom class="filter-dropdown" @click.stop>
        <div class="filter-tabs">
          <div class="tabs">
            <a
              :class="{ 'is-active': activeTab === 'status' }"
              @click.stop="activeTab = 'status'"
            >
              Status
            </a>
            <a
              :class="{ 'is-active': activeTab === 'resort' }"
              @click.stop="activeTab = 'resort'"
            >
              Resort
            </a>
            <a
              :class="{ 'is-active': activeTab === 'useYear' }"
              @click.stop="activeTab = 'useYear'"
            >
              Use Year
            </a>
          </div>
        </div>

        <div class="filter-content">
          <div v-show="activeTab === 'status'" class="filter-section">
            <div class="filter-header">
              <div class="filter-actions">
                <a @click.prevent.stop="selectAllStatus">Select All</a> |
                <a @click.prevent.stop="deselectAllStatus">Clear</a>
              </div>
            </div>
            <div class="filter-options">
              <div v-for="option in statusOptions" :key="option.value" @click.stop>
                <o-field>
                  <o-checkbox v-model="statusValues" :native-value="option.value">
                    {{ option.label }}
                  </o-checkbox>
                </o-field>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'resort'" class="filter-section">
            <div class="filter-header">
              <div class="filter-actions">
                <a @click.prevent.stop="selectAllResorts">Select All</a> |
                <a @click.prevent.stop="deselectAllResorts">Clear</a>
              </div>
            </div>
            <div class="filter-options">
              <div v-for="option in resortOptions" :key="option.value" @click.stop>
                <o-field>
                  <o-checkbox v-model="resortValues" :native-value="option.value">
                    {{ option.label }}
                  </o-checkbox>
                </o-field>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'useYear'" class="filter-section">
            <div class="filter-header">
              <div class="filter-actions">
                <a @click.prevent.stop="selectAllUseYears">Select All</a> |
                <a @click.prevent.stop="deselectAllUseYears">Clear</a>
              </div>
            </div>
            <div class="filter-options">
              <div v-for="option in useYearOptions" :key="option.value" @click.stop>
                <o-field>
                  <o-checkbox v-model="useYearValues" :native-value="option.value">
                    {{ option.label }}
                  </o-checkbox>
                </o-field>
              </div>
            </div>
          </div>
        </div>
      </o-dropdown-item>
    </o-dropdown>
  </div>
</template>

<script>
export default {
  props: {
    resorts: { required: true },
    statusEventName: { type: String, default: "statusFilterChanged" },
    resortEventName: { type: String, default: "resortFilterChanged" },
    useYearEventName: { type: String, default: "useYearFilterChanged" },
  },
  data() {
    const statusOptions = [
      { label: "Passed", value: "Passed" },
      { label: "Waiting", value: "Waiting" },
      { label: "Taken", value: "Taken" },
    ];

    const resortOptions = this.resorts.map((r) => ({
      label: r.name,
      value: r.value,
    }));

    const useYearOptions = [
      { label: "January", value: "Jan" },
      { label: "February", value: "Feb" },
      { label: "March", value: "Mar" },
      { label: "April", value: "Apr" },
      { label: "May", value: "May" },
      { label: "June", value: "Jun" },
      { label: "July", value: "Jul" },
      { label: "August", value: "Aug" },
      { label: "September", value: "Sep" },
      { label: "October", value: "Oct" },
      { label: "November", value: "Nov" },
      { label: "December", value: "Dec" },
    ];

    return {
      activeTab: 'status',
      statusOptions,
      resortOptions,
      useYearOptions,
      statusValues: statusOptions.map(o => o.value),
      resortValues: resortOptions.map(o => o.value),
      useYearValues: useYearOptions.map(o => o.value),
    };
  },
  computed: {
    totalSelected() {
      return this.statusValues.length + this.resortValues.length + this.useYearValues.length;
    },
    totalOptions() {
      return this.statusOptions.length + this.resortOptions.length + this.useYearOptions.length;
    },
  },
  watch: {
    statusValues: {
      handler(newValues) {
        this.$emit(this.statusEventName, newValues);
      },
      immediate: true,
    },
    resortValues: {
      handler(newValues) {
        this.$emit(this.resortEventName, newValues);
      },
      immediate: true,
    },
    useYearValues: {
      handler(newValues) {
        this.$emit(this.useYearEventName, newValues);
      },
      immediate: true,
    },
  },
  methods: {
    selectAllStatus() {
      this.statusValues = this.statusOptions.map(o => o.value);
    },
    deselectAllStatus() {
      this.statusValues = [];
    },
    selectAllResorts() {
      this.resortValues = this.resortOptions.map(o => o.value);
    },
    deselectAllResorts() {
      this.resortValues = [];
    },
    selectAllUseYears() {
      this.useYearValues = this.useYearOptions.map(o => o.value);
    },
    deselectAllUseYears() {
      this.useYearValues = [];
    },
  },
};
</script>

<style scoped lang="scss">
.filter-container {
  display: inline-block;
  position: relative;
}

.filter-dropdown {
  padding: 0 !important;
  min-width: 280px;
  max-width: 320px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  background: white;
}

.filter-container :deep(.o-drop__menu) {
  position: absolute;
  z-index: 1000;
}

.filter-tabs {
  border-bottom: 1px solid #e0e0e0;
  background-color: #f5f5f5;

  .tabs {
    display: flex;
    margin: 0;
    padding: 0;

    a {
      flex: 1;
      padding: 10px;
      text-align: center;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      color: #4a4a4a;
      font-size: 13px;
      transition: all 0.2s;

      &:hover {
        background-color: #ececec;
        text-decoration: none;
      }

      &.is-active {
        color: #61c661;
        border-bottom-color: #61c661;
        background-color: white;
        font-weight: 600;
      }
    }
  }
}

.filter-content {
  max-height: 350px;
  overflow-y: auto;
}

.filter-section {
  padding: 15px;
}

.filter-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 12px;
}

.filter-actions {
  font-size: 12px;

  a {
    cursor: pointer;
    color: #61c661;
    padding: 0 4px;

    &:hover {
      text-decoration: underline;
    }
  }
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;

  :deep(.o-field) {
    margin-bottom: 0;
  }

  :deep(.o-chk) {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  :deep(.o-chk__label) {
    padding-left: 0px;
  }
}
</style>
