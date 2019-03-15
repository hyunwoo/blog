<template>
  <v-snackbar v-model="appear"
              class="font-sans"
              bottom
              :multi-line="multiline">
    {{ text }}
    <v-btn color="pink"
           flat
           @click="close">
      {{ actionName }}
    </v-btn>
  </v-snackbar>
</template>
<script src='./snackbar.ts'/>

<style lang='scss' scoped>
.font-sans {
  font-family: 'Roboto', sans-serif;
}
</style>

