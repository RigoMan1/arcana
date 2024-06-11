<script setup lang="ts">
const user = useSupabaseUser();

const supabase = useSupabaseClient();

const logout = async () => {
  await supabase.auth.signOut();
  navigateTo('/auth/login');
};

const menuItems = [
  // {
  //   label: 'Settings',
  //   icon: 'fluent:settings-20-filled',
  //   action: () => navigateTo('/settings'),
  // },
  {
    label: 'Logout',
    icon: 'fluent:sign-out-20-filled',
    action: logout,
  },
];
</script>

<template>
  <div>
    <arcana-button
      size="small"
      variant="text"
      icon
      class="relative"
    >
      <Icon
        name="fluent:settings-20-filled"
        size="2em"
      />

      <v-overlay
        class="v-menu"
        absolute
        activator="parent"
        :open-delay="300"
        :close-delay="250"
        :close-on-content-click="false"
        location-strategy="connected"
        :scrim="false"
        scroll-strategy="reposition"
        transition="scale-transition"
        width="200"
      >
        <div class="arcana-card-alt">
          <!-- your signed in as anon user id -->
          <div v-if="user?.is_anonymous">
            <p class="text-xs">Signed in as anonymous user</p>
            <p class="text-xs opacity-75 mt-1">{{ user?.id }}</p>
          </div>

          <h6
            v-else
            class="text-lg font-medium capitalize"
          >
            {{ user?.email?.split('@')[0] }}
          </h6>

          <hr class="mt-2 mb-4 opacity-20 -mx-4" />

          <!-- <button
            class="w-full flex items-center justify-between p-2 text-lg hover:bg-secondary-500
              hover:bg-opacity-25 rounded transition-colors duration-100 ease-in-out"
            @click="logout"
          >
            <span> Logout </span>
            <Icon
              name="fluent:sign-out-20-filled"
              size="28px"
            />
          </button> -->

          <div class="space-y-2">
            <button
              v-for="item in menuItems"
              :key="item.label"
              class="w-full flex items-center p-2 text-lg hover:bg-secondary-500 hover:bg-opacity-25
                rounded transition-colors duration-100 ease-in-out"
              @click="item.action"
            >
              <Icon
                :name="item.icon"
                size="1.5rem"
              />
              <span class="ml-4"> {{ item.label }} </span>
            </button>
          </div>
        </div>
      </v-overlay>
    </arcana-button>
  </div>
</template>

<style></style>
