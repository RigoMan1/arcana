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
    <v-overlay
      class="v-menu"
      absolute
      :open-delay="300"
      :close-delay="250"
      :close-on-content-click="false"
      location-strategy="connected"
      :scrim="false"
      scroll-strategy="reposition"
      transition="scale-transition"
      width="200"
    >
      <template #activator="{ props: activatorProps }">
        <arcana-button
          v-bind="activatorProps"
          size="small"
          variant="text"
          icon
          class="relative"
        >
          <Icon
            name="fluent:settings-20-filled"
            size="2em"
          />
        </arcana-button>
      </template>
      <template #default>
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
            <template
              v-for="item in menuItems"
              :key="item.label"
            >
              <button
                v-if="!user?.is_anonymous || item.label !== 'Logout'"
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

              <div class="flex justify-end">
                <nuxt-link
                  class="text-xs text-zinc-200"
                  to="/privacy-policy"
                >
                  Privacy Policy
                </nuxt-link>
              </div>
            </template>
          </div>
        </div>
      </template>
    </v-overlay>
  </div>
</template>

<style></style>
