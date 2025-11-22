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
      &copy; {{ new Date().getFullYear() }} David Kassa. Made with
      <o-icon pack="fab" icon="fort-awesome" size="small" /> in Madison,
      WI<br />
      <a href="https://github.com/davidkassa/dvc-rofr-stats" target="_blank"
        ><o-icon pack="fab" icon="github" size="small" /> View on GitHub</a
      >
    </footer>
  </div>
</template>

<style lang="scss">
* {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}

a {
  color: var(--color-passed);
  &:hover {
    text-decoration: underline;
  }
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-text-primary);
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: var(--color-passed);
    &:hover {
      text-decoration: underline;
    }
    &.router-link-exact-active {
      color: var(--color-text-primary);
      text-decoration: none;
    }
  }
}
.footer {
  margin-top: 50px;
  a {
    color: var(--color-text-primary);
    font-weight: normal;
    text-decoration: none;
    &:hover {
      color: var(--color-passed);
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
