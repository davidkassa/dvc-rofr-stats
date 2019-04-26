<template>
  <div id="app">
    <div class="content">
      <div id="nav">
        <router-link to="/">Home</router-link>
        <!-- | <router-link to="/about">About</router-link> -->
        | <router-link to="/resale-costs">Resale Costs</router-link> |
        <router-link to="/wait-times">Wait Times</router-link> |
        <router-link to="/compare-contracts">Compare</router-link>
      </div>
      <router-view />
    </div>
    <footer class="footer">
      &copy; {{{ <script>document.write(new Date().getFullYear())</script> }}} David Kassa. Made with
      <b-icon pack="fab" icon="fort-awesome" size="is-small" /> in Madison,
      WI<br />
      <a href="https://github.com/davidkassa/dvc-rofr-stats" target="_blnk"
        ><b-icon pack="fab" icon="github" size="is-small" /> View on GitHub</a
      >
    </footer>
  </div>
</template>

<style lang="scss">
a {
  color: #61c661;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #61c661;
    &:hover {
      text-decoration: underline;
    }
    &.router-link-exact-active {
      color: #2c3e50;
      text-decoration: none;
    }
  }
}
.footer {
  margin-top: 50px;
  a {
    color: #2c3e50;
    &:hover {
      color: #61c661;
    }
  }
}

// for sticky footer - https://css-tricks.com/couple-takes-sticky-footer/
html,
body,
#app {
  height: 100%;
}
#app {
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1 0 auto;
}
.footer {
  flex-shrink: 0;
}
</style>
