<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

select,
a,
button,
input {
  outline: none;
}

.pages a.span-in-a {
  width: auto;
  height: auto;
}
.pages a.span-in-a:hover {
  border-radius: unset;
  background-color: unset;
  color: #171719;
}

.alive_on2 {
  text-align: left;
}
.alive {
  align-content: start;
}
</style>
