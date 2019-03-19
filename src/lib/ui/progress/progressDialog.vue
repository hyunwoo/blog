<template>
  <v-dialog v-model="use" persistent width="360" class="font-sans">
    <v-card color="white">
      <v-card-text class="pa-3">
        {{message}}
        <v-progress-linear indeterminate color="blue" class="mb-0"></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script src='./progressDialog.ts'/>

<style lang='scss' scoped>
.font-sans {
  font-family: 'Roboto', sans-serif;
}
</style>
