<template>
  <v-dialog v-model="use" fullscreen hide-overlay class="font-sans" transition="fade-transition">
    <div class="dialog-cover text-xs-center" :style="{background: backgroundColor}">
      <v-progress-circular :size="60" :color="color" indeterminate></v-progress-circular>
    </div>
  </v-dialog>
</template>
<script src='./loadingDialog.ts'/>

<style lang='scss' scoped>
.dialog-cover {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.font-sans {
  font-family: 'Roboto', sans-serif;
}
</style>
