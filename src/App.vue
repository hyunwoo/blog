<template>
  <v-app>
    <v-navigation-drawer mini-variant clipped app v-model="useDrawer">
      <template v-for="(writer,i) in writers">
        <v-tooltip right :key="i">
          <template v-slot:activator="{ on }">
            <!-- <v-btn flat @on="on">BTNBTN</v-btn> -->
            <!-- <v-icon color="primary" dark v-on="on">home</v-icon> -->
            <div v-on="on" class="d-block cursor--pointer">
              <v-list-tile avatar class="py-2" v-on="on">
                <v-list-tile-avatar width="24">
                  <v-img :src="writer.data.photoURL"></v-img>
                </v-list-tile-avatar>
              </v-list-tile>
            </div>
          </template>
          <span class="font-weight-medium">{{writer.data.displayName}}</span>
        </v-tooltip>
      </template>
    </v-navigation-drawer>
    <v-toolbar app class="elevation-0 bb" clipped-left>
      <v-btn icon class="ml-0" @click="useDrawer = !useDrawer">
        <div class="font--cursive font-weight-bold title">A</div>
      </v-btn>

      <v-spacer></v-spacer>
      <v-toolbar-title
        @click="$router.push('/')"
        class="cursor--pointer headline font--cursive"
      >H.hyunwoo</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!$store.getters.isAuth" flat icon @click="signIn">
        <v-icon>account_circle</v-icon>
      </v-btn>
      <v-menu v-else offset-y class="sign-window-outer elevation-0">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-avatar size="36px">
              <img :src="$store.getters.user.data.photoURL" alt="Avatar">
            </v-avatar>
          </v-btn>
        </template>
        <v-card class="sign-window elevation-0">
          <v-list-tile avatar class="py-2">
            <v-list-tile-avatar>
              <img :src="$store.getters.user.data.photoURL" alt="Avatar">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="font-weight-medium">{{$store.getters.user.data.displayName}}</v-list-tile-title>
              <v-list-tile-sub-title class="caption">{{$store.getters.user.data.email}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider class="pt-1"></v-divider>
          <v-list-tile @click="signOut" class="mb-1">
            <v-list-tile-avatar>
              <v-icon>account_box</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-sub-title class="font-weight-medium">Profile Settings</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="signOut" class="mb-1">
            <v-list-tile-avatar>
              <v-icon>pin_drop</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-sub-title class="font-weight-medium">Pins</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile avatar to="/my">
            <v-list-tile-avatar>
              <v-icon>folder</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-sub-title
                class="font-weight-medium"
                style="color:#333 !important;"
              >My Posts</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile avatar :to="`/editor/${uuid()}`">
            <v-list-tile-avatar>
              <v-icon>edit</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-sub-title class="font-weight-medium">Create Post</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <!-- SignOut -->
          <v-divider class="pt-1"></v-divider>
          <v-list-tile @click="signOut" class="mb-1">
            <v-list-tile-avatar>
              <v-icon>exit_to_app</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-sub-title class="font-weight-medium">Sign Out</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-card>
      </v-menu>
    </v-toolbar>

    <v-content class="section-outer">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Dancing+Script:700');
@import url('https://fonts.googleapis.com/css?family=Nanum+Myeongjo:400,700|Noto+Sans+KR:400,700&subset=korean');
@import './style/_common.scss';
.font--cursive {
  font-family: 'Dancing Script', cursive !important;
}
.v-menu__content {
  background: #fff;
  margin-top: 8px;
}
.sign-window-outer {
  box-shadow: 0;
}
.sign-window {
  width: 240px;
  background: #fff;
}
.search-area {
  width: 300px;
  height: 52px;
}
section {
  max-width: 960px;
  margin: auto;
  height: 100%;
}
.theme--light.application,
.theme--light.v-toolbar {
  background: #fff;
}
.section-outer {
}
</style>

<script src='./app.ts'/>

