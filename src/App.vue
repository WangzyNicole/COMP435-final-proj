<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  height: 100vh;
  width: 100vw;
}
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #000;
}
::-webkit-scrollbar-thumb:hover {
  cursor: pointer;
  background-color: #aaa;
}
</style>
