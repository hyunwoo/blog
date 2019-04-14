<template>
  <v-container class="section">
    <v-layout>
      <v-flex xs12>
        <v-list three-line subheader>
          <v-subheader inset>Posts</v-subheader>

          <v-list-tile v-for="(boardItem,i) in boardItems" :key="i">
            <v-list-tile-content>
              <v-list-tile-title>
                <v-layout justify-center align-center>
                  <v-flex class="font-weight-medium">{{boardItem.data.title}}</v-flex>
                  <span class="badge red white--text">MAIN</span>
                  <v-flex xs12></v-flex>
                  <v-spacer></v-spacer>
                </v-layout>
              </v-list-tile-title>
              <v-list-tile-sub-title>{{boardItem.data.description}}</v-list-tile-sub-title>
              <v-list-tile-sub-title>{{boardItem.data.createdAt}} {{boardItem.id}}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon ripple :to="`/editor/${boardItem.id}`">
                <v-icon color="grey lighten-1">settings</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script src="./my.ts"></script>
<style scoped lang='scss'>
@import './my.scss';
</style>