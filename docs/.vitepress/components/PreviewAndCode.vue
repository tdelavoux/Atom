<template>
  <slot />

  <code>
    <pre v-html="slot"></pre>
  </code>
</template>
