<template>
  <div class="v-center">
    <div class="statbox">
      <div class="box-title">
        {{ title }}<br /><span v-show="!total.includes('NaN')">{{
          total
        }}</span>
      </div>
      <div class="columns is-mobile">
        <div class="column">
          <div class="box-record">
            <b-icon pack="fas" icon="circle" size="is-small" type="is-passed" />
            Passed:
          </div>
          <div class="box-record">
            <b-icon
              pack="fas"
              icon="circle"
              size="is-small"
              type="is-waiting"
            />
            Waiting:
          </div>
          <div class="box-record">
            <b-icon pack="fas" icon="circle" size="is-small" type="is-taken" />
            Taken:
          </div>
        </div>
        <div class="column">
          <div
            :style="{
              visibility: passed.includes('NaN') ? 'hidden' : 'visible'
            }"
            class="box-record"
          >
            {{ passed }}
          </div>
          <div
            :style="{
              visibility: waiting.includes('NaN') ? 'hidden' : 'visible'
            }"
            class="box-record"
          >
            {{ waiting }}
          </div>
          <div
            :style="{
              visibility: taken.includes('NaN') ? 'hidden' : 'visible'
            }"
            class="box-record"
          >
            {{ taken }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "total", "passed", "waiting", "taken"]
};
</script>

<style scoped lang="scss">
.v-center {
  display: inline-flex;
  align-items: center;
  justify-content: left;
  height: 100%;
}
.statbox {
  border: 1px solid black;
  border-radius: 25px;
  width: 200px;
  height: 200px;
  padding: 5px;
  text-align: left;
  .box-title {
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
  }
}
</style>
